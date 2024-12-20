import React from 'react';
import type { SimulationResult } from '../types/finance';
import { YearSummary } from './YearSummary';
import { ProjectionGraph } from './ProjectionGraph';

interface Props {
  results: SimulationResult[];
  monthlyContributions: {
    savings: number;
    investments: number;
    debtPayment: number;
  };
}

export function SimulationResults({ results, monthlyContributions }: Props) {
  if (!results || results.length === 0) return null;
  
  return (
    <div className="space-y-6">
      <ProjectionGraph results={results} />
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">5-Year Financial Projection</h2>
        <div className="space-y-4">
          {results.map((result, index) => (
            <YearSummary 
              key={result.year} 
              result={result}
              previousResult={index > 0 ? results[index - 1] : undefined}
              monthlyContributions={monthlyContributions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}