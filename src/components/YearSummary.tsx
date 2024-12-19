import React, { useState } from 'react';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { SimulationResult } from '../types/finance';
import { MonthlyDetails } from './MonthlyDetails';
import { calculateGrowth } from '../utils/finance';

interface Props {
  result: SimulationResult;
  previousResult?: SimulationResult;
}

export function YearSummary({ result, previousResult }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderValue = (current: number, previous?: number, label: string) => {
    const { growth, percentage } = calculateGrowth(current, previous);
    const isPositive = growth >= 0;

    return (
      <div className="metric-card">
        <div className="text-sm text-gray-500 mb-1">{label}</div>
        <div className="font-medium text-lg">${current.toLocaleString()}</div>
        {previous !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>
              {isPositive ? '+' : ''}{growth.toLocaleString()} ({percentage}%)
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            {isExpanded ? <ChevronDown className="h-5 w-5 text-blue-700" /> : <ChevronRight className="h-5 w-5 text-blue-700" />}
          </div>
          <span className="font-semibold text-lg">Year {result.year}</span>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {renderValue(result.savings, previousResult?.savings, "Savings")}
          {renderValue(result.investments, previousResult?.investments, "Investments")}
          {renderValue(result.netWorth, previousResult?.netWorth, "Net Worth")}
          {renderValue(result.debtRemaining, previousResult?.debtRemaining, "Debt")}
        </div>
      </button>
      {isExpanded && <MonthlyDetails result={result} />}
    </div>
  );
}