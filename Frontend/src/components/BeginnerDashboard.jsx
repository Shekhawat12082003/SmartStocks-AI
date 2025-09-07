import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, BookOpen, MousePointer, ArrowRight } from 'lucide-react';
import usePredictionStore from '../store/usePredictionStore';

const BeginnerDashboard = ({ onStockSelect }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [education, setEducation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommendations');
  const { predict } = usePredictionStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recRes, eduRes] = await Promise.all([
        fetch('http://127.0.0.1:5000/recommendations'),
        fetch('http://127.0.0.1:5000/stock-education')
      ]);
      
      const recData = await recRes.json();
      const eduData = await eduRes.json();
      
      setRecommendations(recData);
      setEducation(eduData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationIcon = (action) => {
    switch (action) {
      case 'BUY': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'SELL': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'HOLD': return <Minus className="w-5 h-5 text-yellow-500" />;
      default: return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleStockClick = async (stock) => {
    // Switch to Stock Analyzer tab
    if (onStockSelect) {
      onStockSelect('advanced');
    }
    
    // Automatically analyze the selected stock
    try {
      await predict({
        ticker: stock.ticker,
        lookback: 60,
        useIndicators: true,
        interval: '1d'
      });
    } catch (error) {
      console.error('Error analyzing stock:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading smart recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-2 rounded-2xl max-w-lg mx-auto shadow-lg border border-white/20">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeTab === 'recommendations'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50'
          }`}
        >
          💎 Stock Picks
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
            activeTab === 'education'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4 inline-block mr-2" />
          📚 Learn Basics
        </button>
      </div>

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && recommendations && (
        <div className="space-y-8">
          {/* Beginner Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 text-white p-2 rounded-xl mr-3">
                💡
              </div>
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                Smart Tips for New Investors
              </h3>
            </div>
            <div className="grid gap-3">
              {recommendations.beginner_tips.map((tip, index) => (
                <div key={index} className="flex items-start bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-blue-800 dark:text-blue-200 font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Recommendations */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                🌟 Recommended Stocks for You
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Handpicked by our AI for beginners</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.recommendations.map((stock) => (
                <div
                  key={stock.ticker}
                  onClick={() => handleStockClick(stock)}
                  className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer group ${
                    stock.beginner_friendly 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700'
                      : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700'
                  }`}
                >
                  {/* Click Indicator */}
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <MousePointer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-transparent"></div>
                  </div>
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                            <h4 className="font-bold text-2xl text-gray-900 dark:text-white">{stock.ticker}</h4>
                          </div>
                          {getRecommendationIcon(stock.recommendation)}
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getRiskColor(stock.risk_level)}`}>
                            {stock.risk_level} Risk
                          </span>
                          {!stock.beginner_friendly && (
                            <div className="bg-orange-100 dark:bg-orange-900 p-1 rounded-full">
                              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" title="Advanced investors only" />
                            </div>
                          )}
                        </div>
                        
                        <h5 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1">{stock.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{stock.sector}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-3 text-center">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">${stock.current_price}</p>
                          </div>
                          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-3 text-center">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Expected Return</p>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400">{stock.expected_return}</p>
                          </div>
                        </div>
                        
                        {/* Enhanced explanation section */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-white/30 mb-3">
                          <h6 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Why This Stock?</h6>
                          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-3">{stock.why_buy}</p>
                          
                          {/* Simple explanation for beginners */}
                          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
                            <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                              💡 <span className="font-semibold">Simple Explanation:</span> {
                                stock.beginner_friendly 
                                  ? "This is a safe choice for new investors. The company is stable and grows steadily over time."
                                  : "This stock can make big gains but also big losses. Only invest if you understand the risks."
                              }
                            </p>
                          </div>
                        </div>
                        
                        {/* Call to action */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                              Click to analyze with AI →
                            </span>
                            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 text-center">
                        <div className={`text-2xl font-black mb-1 ${
                          stock.recommendation === 'BUY' ? 'text-green-600' :
                          stock.recommendation === 'SELL' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {stock.recommendation}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-800/70 rounded-full px-2 py-1">
                          {stock.confidence}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Explanation */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Understanding Risk Levels</h3>
            <div className="grid gap-2">
              {Object.entries(recommendations.risk_explanation).map(([risk, explanation]) => (
                <div key={risk} className="flex items-start space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(risk)}`}>
                    {risk}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{explanation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && education && (
        <div className="space-y-6">
          {/* Basics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Stock Market Basics</h3>
            <div className="space-y-3">
              {Object.entries(education.basics).map(([key, value]) => (
                <div key={key} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Terms */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Key Terms You Need to Know</h3>
            <div className="grid gap-3">
              {Object.entries(education.key_terms).map(([term, definition]) => (
                <div key={term} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-bold text-blue-600 dark:text-blue-400 min-w-[60px]">{term}:</span>
                  <span className="text-sm">{definition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Your First Investment Strategy</h3>
            <div className="space-y-3">
              {Object.entries(education.beginner_strategy).map(([step, action], index) => (
                <div key={step} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
              🚨 Warning Signs to Avoid
            </h3>
            <ul className="space-y-2">
              {education.red_flags.map((flag, index) => (
                <li key={index} className="flex items-start space-x-2 text-red-800 dark:text-red-200">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeginnerDashboard;
