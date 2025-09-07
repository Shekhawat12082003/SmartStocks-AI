import os
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import joblib
from datetime import datetime
import pytz
from .indicators import add_technical_indicators
from .storage import save_model_metadata, load_model_metadata, save_scalers, load_scalers

def get_model_dir(ticker):
    model_dir = os.getenv("MODEL_DIR", "./models")
    path = os.path.join(model_dir, ticker)
    os.makedirs(path, exist_ok=True)
    return path

def fetch_data(ticker, start=None, end=None, interval="1d"):
    if not start:
        start = (datetime.now() - pd.DateOffset(years=5)).strftime("%Y-%m-%d")
    if not end:
        end = (datetime.now() - pd.DateOffset(days=1)).strftime("%Y-%m-%d")  # Yesterday to ensure data exists
    
    print(f"Fetching data for {ticker} from {start} to {end}")
    df = yf.download(ticker, start=start, end=end, interval=interval, auto_adjust=True, progress=False)
    
    if df.empty:
        raise ValueError(f"No data found for ticker {ticker} in the specified date range")
    
    return df

def preprocess(df, lookback, use_indicators):
    df = df.copy()
    
    # Add technical indicators if requested
    if use_indicators:
        df = add_technical_indicators(df)
    
    # Use Close price as primary feature
    feature_cols = ['Close']
    if use_indicators:
        feature_cols.extend(['SMA_20', 'SMA_50', 'EMA_20', 'RSI', 'MACD', 'MACD_signal'])
    
    # Select and clean data
    df = df[feature_cols].ffill().bfill().dropna()
    
    # Scale features
    scaler_x = MinMaxScaler()
    scaler_y = MinMaxScaler()
    
    # Prepare sequences
    X = []
    y = []
    
    # Scale the data
    scaled_data = scaler_x.fit_transform(df)
    
    for i in range(lookback, len(scaled_data)):
        X.append(scaled_data[i-lookback:i])
        y.append(scaled_data[i, 0])  # Close price is first column
    
    X, y = np.array(X), np.array(y).reshape(-1, 1)
    
    # Fit y scaler
    scaler_y.fit(y)
    
    return X, y, scaler_x, scaler_y, df.index[-len(X):]

def build_lstm(input_shape):
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(32),
        Dropout(0.2),
        Dense(1)
    ])
    model.compile(loss="mse", optimizer="adam")
    return model

def train_model(X, y, model_path):
    model = build_lstm(X.shape[1:])
    es = EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)
    mc = ModelCheckpoint(model_path, save_best_only=True)
    model.fit(X, y, epochs=50, batch_size=32, validation_split=0.2, callbacks=[es, mc], verbose=0)
    return model

def predict_stock(req):
    ticker = req.ticker.upper()
    lookback = req.lookback
    use_indicators = req.useIndicators
    interval = req.interval
    start = req.start
    end = req.end
    
    model_dir = get_model_dir(ticker)
    model_path = os.path.join(model_dir, "model.keras")
    
    # Check if model exists and load metadata
    model_exists = os.path.exists(model_path)
    meta = load_model_metadata(model_dir) if model_exists else None
    
    # Check if we need to retrain
    need_retrain = not model_exists or (meta and (
        meta.get('lookback') != lookback or 
        meta.get('use_indicators') != use_indicators or
        meta.get('interval') != interval
    ))
    
    if need_retrain:
        # Fetch data and train new model
        df = fetch_data(ticker, start, end, interval)
        X, y, scaler_x, scaler_y, dates = preprocess(df, lookback, use_indicators)
        
        # Train/test split
        test_size = float(os.getenv("TEST_SIZE", 0.2))
        split_idx = int(len(X) * (1 - test_size))
        
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        # Train model
        model = train_model(X_train, y_train, model_path)
        
        # Save scalers and metadata
        save_scalers(model_dir, scaler_x, scaler_y)
        save_model_metadata(model_dir, ticker, lookback, use_indicators, interval, {
            'start': str(dates[0].date()),
            'end': str(dates[-1].date())
        })
        
        trained = True
    else:
        # Load existing model
        model = load_model(model_path)
        scaler_x, scaler_y = load_scalers(model_dir)
        
        # Get fresh data for prediction
        df = fetch_data(ticker, start, end, interval)
        X, y, _, _, dates = preprocess(df, lookback, use_indicators)
        
        # Use test split for evaluation
        test_size = float(os.getenv("TEST_SIZE", 0.2))
        split_idx = int(len(X) * (1 - test_size))
        X_test, y_test = X[split_idx:], y[split_idx:]
        dates = dates[split_idx:]
        
        trained = False
    
    # Make predictions
    preds = model.predict(X_test)
    preds_inv = scaler_y.inverse_transform(preds)
    y_test_inv = scaler_y.inverse_transform(y_test)
    
    # Create history
    history = [
        {
            "date": str(dates[i].date()), 
            "real": float(y_test_inv[i][0]), 
            "predicted": float(preds_inv[i][0])
        }
        for i in range(len(preds))
    ]
    
    # Latest prediction
    latest = {
        "date": str(dates[-1].date()), 
        "predicted": float(preds_inv[-1][0])
    }
    
    # Calculate metrics
    rmse = float(np.sqrt(mean_squared_error(y_test_inv, preds_inv)))
    mae = float(mean_absolute_error(y_test_inv, preds_inv))
    mape = float(np.mean(np.abs((y_test_inv - preds_inv) / y_test_inv))) * 100
    
    return {
        "ticker": ticker,
        "params": {
            "lookback": lookback, 
            "useIndicators": use_indicators, 
            "interval": interval
        },
        "metrics": {"rmse": rmse, "mae": mae, "mape": mape},
        "history": history,
        "latest": latest,
        "trained": trained
    }

def get_latest_prediction(ticker):
    ticker = ticker.upper()
    model_dir = get_model_dir(ticker)
    model_path = os.path.join(model_dir, "model.keras")
    
    # Check if model exists
    if not os.path.exists(model_path):
        # Quick train if not exists
        req = type("Req", (), {
            "ticker": ticker, 
            "lookback": int(os.getenv("DEFAULT_LOOKBACK", 60)), 
            "useIndicators": True, 
            "interval": "1d", 
            "start": None, 
            "end": None
        })
        result = predict_stock(req)
        return result["latest"]
    
    # Load existing model and scalers
    model = load_model(model_path)
    scaler_x, scaler_y = load_scalers(model_dir)
    
    if scaler_x is None or scaler_y is None:
        # Retrain if scalers missing
        req = type("Req", (), {
            "ticker": ticker, 
            "lookback": int(os.getenv("DEFAULT_LOOKBACK", 60)), 
            "useIndicators": True, 
            "interval": "1d", 
            "start": None, 
            "end": None
        })
        result = predict_stock(req)
        return result["latest"]
    
    # Get fresh data
    df = fetch_data(ticker)
    lookback = int(os.getenv("DEFAULT_LOOKBACK", 60))
    X, _, _, _, dates = preprocess(df, lookback, True)
    
    # Predict
    preds = model.predict(X[-1:])  # Only predict last sequence
    preds_inv = scaler_y.inverse_transform(preds)
    
    return {
        "ticker": ticker, 
        "date": str(dates[-1].date()), 
        "predicted": float(preds_inv[0][0])
    }

def get_health():
    """Simple health check function"""
    return {"status": "ok", "message": "Backend is running!"}
