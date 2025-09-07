import os
import numpy as np
import pandas as pd
import yfinance as yf
from datetime import datetime

def simple_fetch_test(ticker="AAPL"):
    """Simple test function to check data fetching"""
    try:
        print(f"Testing data fetch for {ticker}...")
        
        # Use a safe date range
        start = "2023-01-01"
        end = "2025-09-06"
        
        print(f"Date range: {start} to {end}")
        
        # Fetch data
        df = yf.download(ticker, start=start, end=end, auto_adjust=True, progress=False)
        
        if df.empty:
            return {"error": f"No data found for {ticker}"}
        
        print(f"Data shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        
        # Check for Close column
        if 'Close' not in df.columns:
            return {"error": f"Close column not found. Available columns: {df.columns.tolist()}"}
        
        # Get latest price
        latest_price = float(df['Close'].iloc[-1])
        latest_date = str(df.index[-1].date())
        
        return {
            "ticker": ticker,
            "latest_price": latest_price,
            "latest_date": latest_date,
            "data_points": len(df),
            "status": "success"
        }
        
    except Exception as e:
        return {"error": f"Error: {str(e)}"}

if __name__ == "__main__":
    result = simple_fetch_test()
    print("Result:", result)
