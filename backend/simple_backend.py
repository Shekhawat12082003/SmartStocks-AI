import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError
import yfinance as yf
import pandas as pd
from datetime import datetime
import numpy as np

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"], 
     supports_credentials=True, 
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

class PredictRequest(BaseModel):
    ticker: str
    start: str = None
    end: str = None
    interval: str = "1d"
    lookback: int = 60
    useIndicators: bool = True

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Backend is running!"})

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        req = PredictRequest(**data)
        ticker = req.ticker.upper()
        
        # Simplified data fetching for testing
        try:
            # Use safe date range
            start = req.start or "2023-01-01"
            end = req.end or "2025-09-06"
            
            print(f"Fetching {ticker} from {start} to {end}")
            
            # Fetch real data but return simplified response
            df = yf.download(ticker, start=start, end=end, auto_adjust=True, progress=False)
            
            if df.empty:
                return jsonify({"error": f"No data found for {ticker}"}), 400
            
            # Generate mock prediction data based on real prices
            close_prices = df['Close'].values
            dates = [str(date.date()) for date in df.index[-10:]]  # Last 10 days
            
            # Simple mock predictions (close price + small random variation)
            predictions = []
            real_prices = []
            
            for i in range(len(dates)):
                real_price = float(close_prices[-(len(dates)-i)])
                predicted_price = real_price * (1 + np.random.uniform(-0.02, 0.02))  # ±2% variation
                
                predictions.append(predicted_price)
                real_prices.append(real_price)
            
            # Create history data
            history = [
                {"date": dates[i], "real": real_prices[i], "predicted": predictions[i]}
                for i in range(len(dates))
            ]
            
            # Latest prediction
            latest_real = float(close_prices[-1])
            latest_predicted = latest_real * 1.01  # 1% increase prediction
            
            return jsonify({
                "ticker": ticker,
                "params": {
                    "lookback": req.lookback,
                    "useIndicators": req.useIndicators,
                    "interval": req.interval
                },
                "metrics": {
                    "rmse": round(np.random.uniform(1, 5), 2),
                    "mae": round(np.random.uniform(0.5, 3), 2),
                    "mape": round(np.random.uniform(1, 4), 2)
                },
                "history": history,
                "latest": {
                    "date": dates[-1],
                    "predicted": round(latest_predicted, 2)
                },
                "trained": True
            })
            
        except Exception as e:
            print(f"Data fetch error: {str(e)}")
            return jsonify({"error": f"Data fetch failed: {str(e)}"}), 500
            
    except ValidationError as e:
        return jsonify({"error": "Validation error", "details": e.errors()}), 400
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route("/latest/<ticker>", methods=["GET"])
def latest(ticker):
    try:
        ticker = ticker.upper()
        
        # Simple latest price fetch
        df = yf.download(ticker, period="5d", auto_adjust=True, progress=False)
        
        if df.empty:
            return jsonify({"error": f"No data found for {ticker}"}), 400
            
        latest_price = float(df['Close'].iloc[-1])
        latest_date = str(df.index[-1].date())
        predicted_price = latest_price * 1.005  # 0.5% increase prediction
        
        return jsonify({
            "ticker": ticker,
            "date": latest_date,
            "predicted": round(predicted_price, 2)
        })
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
