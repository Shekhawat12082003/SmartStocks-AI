import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Brush, ReferenceLine } from 'recharts';

export default function PredictionChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 flex flex-col items-center justify-center h-80">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Data Yet</h3>
        <p className="text-gray-500 dark:text-gray-500 text-center">Enter a stock ticker and click "Get AI Prediction" to see the chart</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
          📈 Price Prediction Analysis
        </h3>
        <p className="text-gray-600 dark:text-gray-400">Real vs AI-predicted stock prices over time</p>
      </div>
      
      <div className="relative">
        {/* Chart Container */}
        <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={history} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              {/* Grid */}
              <defs>
                <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              
              <Tooltip 
                formatter={(value, name) => [`$${value.toFixed(2)}`, name === 'real' ? 'Real Price' : 'AI Prediction']}
                labelFormatter={(date) => `Date: ${date}`}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              
              {/* Real Price Line */}
              <Line 
                type="monotone" 
                dataKey="real" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#ffffff' }}
                name="real"
                fill="url(#realGradient)"
              />
              
              {/* Predicted Price Line */}
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#10B981" 
                strokeWidth={3}
                strokeDasharray="8 8"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#ffffff' }}
                name="predicted"
                fill="url(#predictedGradient)"
              />
              
              {/* Reference line for latest data */}
              <ReferenceLine 
                x={history[history.length - 1]?.date} 
                stroke="#F59E0B" 
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{ value: "Latest", position: "topRight", fill: "#F59E0B", fontSize: 12, fontWeight: "bold" }}
              />
              
              {/* Interactive brush for zooming */}
              <Brush 
                dataKey="date" 
                height={40} 
                stroke="#8B5CF6"
                fill="rgba(139, 92, 246, 0.1)"
                tickFormatter={(date) => date}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Real Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(to right, #10B981 0, #10B981 4px, transparent 4px, transparent 8px)' }}></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Prediction</span>
          </div>
        </div>
      </div>
    </div>
  );
}
