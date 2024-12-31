import React, { useMemo } from 'react';
import { AllocationGauge } from './allocation/AllocationGauge';
import { Info, Wand2, PlayCircle, PieChart } from 'lucide-react';
import { SectionCard } from './common/SectionCard';
import { findOptimalAllocation } from '../utils/optimization/allocationOptimizer';
import { calculateMonthlyDisposable } from '../utils/finance/monthlyPayments';
import type { FinancialProfile, Allocation } from '../types/finance';

interface Props {
  allocation: Allocation;
  annualIncome: number;
  monthlyExpenses: number;
  state: string;
  onChange: (allocation: Allocation) => void;
  onSimulate: () => void;
  profile: FinancialProfile;
}

export function AllocationControls({ 
  allocation, 
  annualIncome, 
  monthlyExpenses, 
  state, 
  onChange,
  onSimulate,
  profile 
}: Props) {
  const monthlyDisposable = useMemo(() => {
    return Math.round(Math.max(0, calculateMonthlyDisposable(profile)));
  }, [profile]);

  const distributions = useMemo(() => ({
    investments: Math.round((monthlyDisposable * allocation.investments) / 100),
    debtPayment: Math.round((monthlyDisposable * allocation.debtPayment) / 100),
    savings: Math.round((monthlyDisposable * allocation.savings) / 100),
    discretionary: Math.round((monthlyDisposable * allocation.discretionary) / 100)
  }), [monthlyDisposable, allocation]);

  const handleOptimize = () => {
    const optimalAllocation = findOptimalAllocation(profile);
    onChange(optimalAllocation);
  };

  return (
    <SectionCard
      icon={PieChart}
      title="Income Allocation"
      subtitle={`Monthly Post-Tax Disposable Income: $${monthlyDisposable.toLocaleString()}`}
      action={
        <div className="flex items-center gap-4">
          <button
            onClick={handleOptimize}
            className="btn-secondary"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Optimize
          </button>
          <div className="flex items-center text-sm text-gray-500">
            <Info className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Drag to adjust</span>
            <span className="sm:hidden">Tap to adjust</span>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 justify-items-center">
        <AllocationGauge
          value={Math.round(allocation.investments)}
          label="Investments"
          color="#10b981"
          monthlyAmount={distributions.investments}
          onChange={(value) => onChange({ ...allocation, investments: Math.round(value) })}
        />
        <AllocationGauge
          value={Math.round(allocation.debtPayment)}
          label="Debt Payment"
          color="#ef4444"
          monthlyAmount={distributions.debtPayment}
          onChange={(value) => onChange({ ...allocation, debtPayment: Math.round(value) })}
        />
        <AllocationGauge
          value={Math.round(allocation.savings)}
          label="Savings"
          color="#f59e0b"
          monthlyAmount={distributions.savings}
          onChange={(value) => onChange({ ...allocation, savings: Math.round(value) })}
        />
        <AllocationGauge
          value={Math.round(allocation.discretionary)}
          label="Discretionary"
          color="#8b5cf6"
          monthlyAmount={distributions.discretionary}
          onChange={(value) => onChange({ ...allocation, discretionary: Math.round(value) })}
        />
      </div>

      <div className="flex justify-center mt-8">
        <button onClick={onSimulate} className="btn-primary">
          <PlayCircle className="w-5 h-5 mr-2" />
          Run Simulation
        </button>
      </div>
    </SectionCard>
  );
}