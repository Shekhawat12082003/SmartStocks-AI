#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("Testing imports...")

try:
    from ml.model_utils import get_health
    print("✓ model_utils imported successfully")
    print("Health check:", get_health())
except Exception as e:
    print("✗ Error importing model_utils:", str(e))

try:
    from ml.indicators import add_technical_indicators
    print("✓ indicators imported successfully")
except Exception as e:
    print("✗ Error importing indicators:", str(e))

try:
    from ml.storage import save_model_metadata
    print("✓ storage imported successfully")
except Exception as e:
    print("✗ Error importing storage:", str(e))

print("All tests completed.")
