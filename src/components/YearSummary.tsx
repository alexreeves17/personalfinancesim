import React, { useState } from 'react';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { SimulationResult, FinancialProfile } from '../types/finance';
import { MonthlyDetails } from './MonthlyDetails';
import { calculateGrowth } from '../utils/finance';

interface Props {
  result: SimulationResult;
  previousResult?: SimulationResult;
  monthlyContributions: {
    savings: number;
    investments: number;
    debtPayment: number;
  };
  profile: FinancialProfile;
}

export function YearSummary({ result, previousResult, monthlyContributions, profile }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const MetricCard = ({ 
    label, 
    current, 
    previous 
  }: { 
    label: string; 
    current: number; 
    previous?: number; 
  }) => {
    const { growth, percentage } = calculateGrowth(current, previous);
    const isPositive = growth >= 0;

    return (
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-medium text-base sm:text-lg whitespace-nowrap">
          ${current.toLocaleString()}
        </span>
        {previous !== undefined && (
          <div className={`flex items-center gap-1 text-xs sm:text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? 
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" /> : 
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
            }
            <span className="whitespace-nowrap">
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
        className="w-full text-left hover:bg-white/50 transition-colors"
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              {isExpanded ? 
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" /> : 
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
              }
            </div>
            <span className="font-semibold text-base sm:text-lg">Year {result.year}</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <MetricCard 
              label="Savings" 
              current={result.savings} 
              previous={previousResult?.savings} 
            />
            <MetricCard 
              label="Investments" 
              current={result.investments} 
              previous={previousResult?.investments} 
            />
            <MetricCard 
              label="Net Worth" 
              current={result.netWorth} 
              previous={previousResult?.netWorth} 
            />
            <MetricCard 
              label="Debt" 
              current={result.debtRemaining} 
              previous={previousResult?.debtRemaining} 
            />
          </div>
        </div>
      </button>
      {isExpanded && (
        <MonthlyDetails 
          result={result} 
          monthlyContributions={monthlyContributions}
          profile={profile}
        />
      )}
    </div>
  );
}