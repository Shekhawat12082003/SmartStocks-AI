import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Controls from './components/Controls';
import KPICard from './components/KPICard';
import PredictionChart from './components/PredictionChart';
import BeginnerDashboard from './components/BeginnerDashboard';
import usePredictionStore from './store/usePredictionStore';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, DollarSign, Target } from 'lucide-react';

export default function App() {
  const { prediction, isLoading, error, predict } = usePredictionStore();
  const [activeTab, setActiveTab] = useState('recommendations');

  // Handle stock selection from recommendations
  const handleStockSelect = (stock) => {
    setActiveTab('advanced');
    // Wait a bit for tab transition, then trigger the prediction
    setTimeout(() => {
      predict({
        ticker: stock.ticker,
        start: '',
        end: '',
        interval: '1d',
        lookback: 60,
        useIndicators: true
      });
    }, 300);
  };

  const getRecommendationIcon = (action) => {
    switch (action) {
      case 'BUY': return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'SELL': return <TrendingDown className="w-6 h-6 text-red-500" />;
      case 'HOLD': return <Minus className="w-6 h-6 text-yellow-500" />;
      default: return <Minus className="w-6 h-6 text-gray-500" />;
    }
  };

  const getRecommendationColor = (action) => {
    switch (action) {
      case 'BUY': return 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200';
      case 'SELL': return 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200';
      case 'HOLD': return 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200';
      default: return 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Smart Stock Advisor
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI-powered stock predictions and beginner-friendly investment guidance
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-2 rounded-2xl max-w-md mx-auto shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'recommendations'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              🎓 For Beginners
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'advanced'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
              }`}
            >
              📊 Stock Analyzer
            </button>
          </div>
        </div>

        {activeTab === 'recommendations' && (
          <BeginnerDashboard onStockSelect={handleStockSelect} />
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-8">
            <Controls />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Error: {error}
              </div>
            )}

            {isLoading && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">AI Analysis in Progress</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Our neural network is analyzing market data...</p>
                <div className="flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}

            {prediction && !isLoading && (
              <div className="space-y-6">
                {/* Company Information */}
                {prediction.company_info && (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {prediction.company_info.name} ({prediction.ticker})
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">{prediction.company_info.sector}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.company_info.risk_level)}`}>
                        {prediction.company_info.risk_level} Risk
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
                        <p className="text-2xl font-bold">${prediction.company_info.current_price}</p>
                      </div>
                      <div className="text-center">
                        <Target className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Predicted Price</p>
                        <p className="text-2xl font-bold">${prediction.company_info.predicted_price}</p>
                      </div>
                      <div className="text-center">
                        <div className={`w-8 h-8 mx-auto mb-2 flex items-center justify-center rounded-full ${
                          prediction.company_info.price_change >= 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {prediction.company_info.price_change >= 0 ? 
                            <TrendingUp className="w-5 h-5 text-green-600" /> : 
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          }
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expected Change</p>
                        <p className={`text-2xl font-bold ${prediction.company_info.price_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {prediction.company_info.price_change >= 0 ? '+' : ''}
                          {prediction.company_info.price_change_percent.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendation for Beginners */}
                {prediction.recommendation && (
                  <div className={`p-6 rounded-lg border-2 ${getRecommendationColor(prediction.recommendation.action)}`}>
                    <div className="flex items-start space-x-4">
                      {getRecommendationIcon(prediction.recommendation.action)}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">
                          Recommendation: {prediction.recommendation.action}
                        </h3>
                        <p className="text-sm mb-2">
                          <span className="font-semibold">Confidence:</span> {prediction.recommendation.confidence}
                        </p>
                        <p className="mb-4">{prediction.recommendation.explanation}</p>
                        
                        {/* Beginner Guide Section */}
                        {prediction.beginner_guide && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-800">
                            <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
                              💡 What does this mean for beginners?
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                                <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                                  {prediction.recommendation.action === 'BUY' && prediction.beginner_guide.what_is_buy}
                                  {prediction.recommendation.action === 'SELL' && prediction.beginner_guide.what_is_sell}
                                  {prediction.recommendation.action === 'HOLD' && prediction.beginner_guide.what_is_hold}
                                </p>
                              </div>
                              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Risk Level: {prediction.company_info.risk_level}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                  {prediction.beginner_guide.risk_levels[prediction.company_info.risk_level]}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Risk Warning */}
                        <div className="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-orange-400">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {prediction.recommendation.risk_warning}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <KPICard 
                    title="RMSE" 
                    value={prediction.metrics.rmse} 
                    subtitle="Root Mean Square Error"
                  />
                  <KPICard 
                    title="MAE" 
                    value={prediction.metrics.mae} 
                    subtitle="Mean Absolute Error"
                  />
                  <KPICard 
                    title="MAPE" 
                    value={`${prediction.metrics.mape}%`} 
                    subtitle="Mean Absolute Percentage Error"
                  />
                </div>

                {/* Chart */}
                <PredictionChart history={prediction.history} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
