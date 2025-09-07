# Stock Price Prediction App

A full-stack web application for predicting stock prices using LSTM neural networks, built with Python Flask backend and React frontend.

## 🚀 Features

- **LSTM-powered predictions** using historical stock data from Yahoo Finance
- **Professional dashboard** with dark/light mode toggle
- **Interactive charts** with real vs predicted prices
- **Technical indicators** (SMA, EMA, RSI, MACD)
- **Model caching** to avoid retraining for same parameters
- **Responsive design** with Tailwind CSS
- **Docker support** for easy deployment

## 🛠️ Tech Stack

### Backend
- Python 3.10+
- Flask + Flask-CORS
- TensorFlow/Keras (LSTM)
- yfinance, pandas, numpy
- scikit-learn
- Technical Analysis Library (ta)

### Frontend
- React 18 + Vite
- Tailwind CSS
- Recharts for data visualization
- Zustand for state management
- Axios for API calls

## 📦 Quick Start

### Option 1: Development Mode

1. **Setup both backend and frontend:**
   ```bash
   make setup
   ```

2. **Start development servers:**
   ```bash
   make dev
   ```
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173

### Option 2: Docker (Recommended)

1. **Start with Docker Compose:**
   ```bash
   make up
   ```
   - Application: http://localhost:3000
   - API: http://localhost:5000

2. **Stop containers:**
   ```bash
   make down
   ```

## 🔧 Manual Setup

### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📋 Available Commands

```bash
make help          # Show all available commands
make dev           # Start both backend and frontend
make backend       # Start only backend
make frontend      # Start only frontend
make up            # Start with Docker
make down          # Stop Docker containers
make setup         # Setup development environment
make clean         # Clean build artifacts
make build         # Build Docker images
make test          # Run tests
make health        # Check application health
```

## 🔗 API Endpoints

- `POST /predict` - Train/predict stock prices
- `GET /latest/<ticker>` - Get latest prediction for ticker
- `GET /health` - Health check

## 🎯 Usage

1. **Enter a stock ticker** (e.g., AAPL, TSLA, MSFT)
2. **Select date range** and interval
3. **Toggle technical indicators** if desired
4. **Click Predict** to train LSTM model and view results
5. **Analyze the interactive chart** showing real vs predicted prices

## 📁 Project Structure

```
stock-app/
├── backend/              # Flask API
│   ├── app.py           # Main application
│   ├── ml/              # ML utilities
│   │   └── model_utils.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── store/       # Zustand store
│   │   └── lib/         # API client
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml   # Docker orchestration
├── Makefile            # Development commands
└── README.md
```

## 🔒 Environment Variables

### Backend (.env)
```
MODEL_DIR=./models
DEFAULT_LOOKBACK=60
TEST_SIZE=0.2
TZ=Asia/Kolkata
```

### Frontend (.env)
```
VITE_API_URL=http://127.0.0.1:5000
```

## 🧪 Testing

Run tests with:
```bash
make test
```

## 📈 Model Details

- **Architecture**: 2-layer LSTM with dropout
- **Features**: Close prices + optional technical indicators
- **Training**: 80/20 train-test split with early stopping
- **Metrics**: RMSE, MAE, MAPE
- **Caching**: Models saved per ticker/parameters

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details.
