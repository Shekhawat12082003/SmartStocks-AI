import yfinance as yf
import pandas as pd
from datetime import datetime

# Test data fetching
print("Testing yfinance data fetch...")

ticker = "AAPL"
start = (datetime.now() - pd.DateOffset(years=2)).strftime("%Y-%m-%d")  # 2 years ago
end = (datetime.now() - pd.DateOffset(days=1)).strftime("%Y-%m-%d")     # Yesterday

print(f"Fetching {ticker} from {start} to {end}")

try:
    df = yf.download(ticker, start=start, end=end, interval="1d", auto_adjust=True, progress=False)
    print(f"Data shape: {df.shape}")
    print("Columns:", df.columns.tolist())
    print("First 5 rows:")
    print(df.head())
    print("Last 5 rows:")
    print(df.tail())
    
    if 'Close' in df.columns:
        print("✓ Close column found")
    else:
        print("✗ Close column missing!")
        print("Available columns:", df.columns.tolist())
        
except Exception as e:
    print(f"Error: {e}")
    print(f"Error type: {type(e)}")
