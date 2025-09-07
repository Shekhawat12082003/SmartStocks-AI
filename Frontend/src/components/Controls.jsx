import React, { useState } from 'react';
import usePredictionStore from '../store/usePredictionStore';

const popularTickers = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOG', 'BTC-USD'];
const intervals = ['1d', '1h', '1wk'];

export default function Controls() {
  const { predict, loading } = usePredictionStore();
  const [ticker, setTicker] = useState('AAPL');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [interval, setInterval] = useState('1d');
  const [useIndicators, setUseIndicators] = useState(true);
  const [lookback, setLookback] = useState(60);

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
          🎯 Stock Analysis Center
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Enter a stock ticker to get AI-powered predictions and recommendations</p>
      </div>

      {/* Quick Picks */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Popular Stocks:</p>
        <div className="flex flex-wrap gap-2">
          {popularTickers.map(symbol => (
            <button
              key={symbol}
              onClick={() => setTicker(symbol)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                ticker === symbol
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
              }`}
              disabled={loading}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Main Controls */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stock Ticker */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Stock Symbol
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 uppercase focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 font-bold text-lg transition-all duration-300"
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
            placeholder="e.g., AAPL"
            disabled={loading}
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-all duration-300"
            value={start}
            onChange={e => setStart(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-all duration-300"
            value={end}
            onChange={e => setEnd(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Advanced Options */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Interval
          </label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-all duration-300"
            value={interval}
            onChange={e => setInterval(e.target.value)}
            disabled={loading}
          >
            {intervals.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Lookback Days
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-all duration-300"
            value={lookback}
            min={10}
            max={120}
            onChange={e => setLookback(Number(e.target.value))}
            disabled={loading}
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-3 bg-white/80 dark:bg-gray-700/80 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              checked={useIndicators}
              onChange={e => setUseIndicators(e.target.checked)}
              disabled={loading}
            />
            <span className="font-semibold text-gray-700 dark:text-gray-300">Use Technical Indicators</span>
          </label>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 text-center">
        <button
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl transition-all duration-300 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100"
          onClick={() => predict({ ticker, start, end, interval, lookback, useIndicators })}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing with AI...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>🚀</span>
              <span>Get AI Prediction</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
