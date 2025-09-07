import os
import json
import joblib
from datetime import datetime
import pytz

def save_model_metadata(model_dir, ticker, lookback, use_indicators, interval, train_dates):
    """Save model metadata to JSON"""
    tz = pytz.timezone(os.getenv("TZ", "Asia/Kolkata"))
    meta = {
        "ticker": ticker,
        "lookback": lookback,
        "use_indicators": use_indicators,
        "interval": interval,
        "train_dates": train_dates,
        "created_at": datetime.now(tz).isoformat()
    }
    
    meta_path = os.path.join(model_dir, "meta.json")
    with open(meta_path, 'w') as f:
        json.dump(meta, f, indent=2)
    
    return meta

def load_model_metadata(model_dir):
    """Load model metadata from JSON"""
    meta_path = os.path.join(model_dir, "meta.json")
    if os.path.exists(meta_path):
        with open(meta_path, 'r') as f:
            return json.load(f)
    return None

def save_scalers(model_dir, scaler_x, scaler_y):
    """Save scalers"""
    scaler_x_path = os.path.join(model_dir, "scaler_x.pkl")
    scaler_y_path = os.path.join(model_dir, "scaler_y.pkl")
    
    joblib.dump(scaler_x, scaler_x_path)
    joblib.dump(scaler_y, scaler_y_path)

def load_scalers(model_dir):
    """Load scalers"""
    scaler_x_path = os.path.join(model_dir, "scaler_x.pkl")
    scaler_y_path = os.path.join(model_dir, "scaler_y.pkl")
    
    if os.path.exists(scaler_x_path) and os.path.exists(scaler_y_path):
        scaler_x = joblib.load(scaler_x_path)
        scaler_y = joblib.load(scaler_y_path)
        return scaler_x, scaler_y
    
    return None, None
