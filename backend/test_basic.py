import os
print("Testing basic Flask setup...")

# Test environment
from dotenv import load_dotenv
load_dotenv()
print("✓ dotenv loaded")

# Test Flask
from flask import Flask
app = Flask(__name__)
print("✓ Flask imported")

# Test basic dependencies
import pandas as pd
import numpy as np
import yfinance as yf
print("✓ Basic dependencies working")

# Test ML dependencies
try:
    import tensorflow as tf
    print("✓ TensorFlow imported:", tf.__version__)
except Exception as e:
    print("✗ TensorFlow error:", e)

try:
    import ta
    print("✓ Technical Analysis library imported")
except Exception as e:
    print("✗ TA library error:", e)

print("Basic test completed!")
