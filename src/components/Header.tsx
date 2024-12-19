import React from 'react';
import { LineChart, Wallet } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-8 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <LineChart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Personal Finance Simulator</h1>
              <p className="text-blue-100 mt-1">Plan your financial future with confidence</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 py-2 px-4 rounded-full backdrop-blur-sm">
            <Wallet className="h-5 w-5 text-blue-200" />
            <span className="font-medium">Smart Planning</span>
          </div>
        </div>
      </div>
    </header>
  );
}