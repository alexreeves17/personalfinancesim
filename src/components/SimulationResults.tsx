import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, TrendingUp, BarChart } from 'lucide-react';
import { SectionCard } from './common/SectionCard';
import { ProjectionGraph } from './ProjectionGraph';
import { YearSummary } from './YearSummary';
import type { SimulationResult, FinancialProfile } from '../types/finance';

interface Props {
  results: SimulationResult[];
  monthlyContributions: {
    investments: number;
    debtPayment: number;
    savings: number;
  };
  profile: FinancialProfile;
}

export function SimulationResults({ results, monthlyContributions, profile }: Props) {
  const navigate = useNavigate();

  const openSpreadsheet = () => {
    navigate('/spreadsheet', { 
      state: { results, monthlyContributions, profile } 
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        icon={TrendingUp}
        title="Financial Growth Projection"
        subtitle="Visualize your wealth growth over time"
        action={
          <button onClick={openSpreadsheet} className="btn-secondary">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Open Detailed Spreadsheet
          </button>
        }
      >
        <ProjectionGraph results={results} />
      </SectionCard>

      <SectionCard
        icon={BarChart}
        title="5-Year Financial Projection"
        subtitle="Detailed breakdown of your financial journey"
      >
        <div className="space-y-4">
          {results.map((result, index) => (
            <YearSummary 
              key={result.year} 
              result={result}
              previousResult={index > 0 ? results[index - 1] : undefined}
              monthlyContributions={monthlyContributions}
              profile={profile}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}