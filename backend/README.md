# Stock Price Prediction Backend

## Setup & Run

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env
python app.py
```

## Endpoints
- `POST /predict` — Train or reuse LSTM model, return predictions & metrics
- `GET /latest/<ticker>` — Latest predicted price
- `GET /health` — Health check

## Environment Variables
- `MODEL_DIR` — Where models are saved
- `DEFAULT_LOOKBACK` — Window size for LSTM
- `TEST_SIZE` — Fraction for test split
- `TZ` — Timezone for timestamps

## Notes
- Models are cached per ticker/params
- Uses yfinance for data, ta for indicators
- All timestamps in Asia/Kolkata
