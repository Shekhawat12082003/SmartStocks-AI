import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <nav className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-2xl shadow-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h1 className="font-black text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SmartStock AI
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                LSTM-powered predictions & AI guidance
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Live AI</span>
            </div>
            
            <button
              className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-gray-200 dark:border-gray-600"
              onClick={() => setDark(d => !d)}
              aria-label="Toggle theme"
            >
              <span className="text-xl">{dark ? '🌙' : '☀️'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
    </nav>
  );
}
