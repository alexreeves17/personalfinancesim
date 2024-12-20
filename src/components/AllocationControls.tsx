import React, { useMemo } from 'react';
import { AllocationGauge } from './allocation/AllocationGauge';
import { Info, Wand2 } from 'lucide-react';
import { calculateStateTax } from '../utils/tax';
import { states } from '../data/states';
import { findOptimalAllocation } from '../utils/optimization/allocationOptimizer';
import { useAllocationControls } from './allocation/useAllocationControls';
import type { FinancialProfile, Allocation } from '../types/finance';

interface Props {
  allocation: Allocation;
  annualIncome: number;
  monthlyExpenses: number;
  state: string;
  onChange: (allocation: Allocation) => void;
  profile: FinancialProfile;
}

export function AllocationControls({ allocation, annualIncome, monthlyExpenses, state, onChange, profile }: Props) {
  const { monthlyDisposable, distributions } = useMemo(() => {
    const stateInfo = states.find(s => s.code === state);
    const stateTax = stateInfo ? calculateStateTax(annualIncome, stateInfo.brackets) : 0;
    const federalTax = annualIncome * 0.22;
    
    const monthlyAfterTax = (annualIncome - stateTax - federalTax) / 12;
    const monthlyDisposable = Math.max(0, monthlyAfterTax - monthlyExpenses);

    const distributions = {
      investments: (monthlyDisposable * allocation.investments) / 100,
      debtPayment: (monthlyDisposable * allocation.debtPayment) / 100,
      savings: (monthlyDisposable * allocation.savings) / 100,
      discretionary: (monthlyDisposable * allocation.discretionary) / 100
    };

    return { monthlyDisposable, distributions };
  }, [annualIncome, monthlyExpenses, state, allocation]);

  const { handleChange } = useAllocationControls(allocation, onChange);

  const handleOptimize = () => {
    const optimalAllocation = findOptimalAllocation(profile);
    onChange(optimalAllocation);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium">Disposable Income Allocation</h3>
            <button
              onClick={handleOptimize}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Wand2 className="w-4 h-4 mr-1.5" />
              Optimize
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Monthly Disposable Income: ${monthlyDisposable.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Info className="w-4 h-4 mr-1" />
          Drag the circles to adjust
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-8">
        <AllocationGauge
          value={allocation.investments}
          label="Investments"
          color="#10b981"
          monthlyAmount={distributions.investments}
          onChange={(value) => handleChange('investments', value)}
        />
        <AllocationGauge
          value={allocation.debtPayment}
          label="Debt Payment"
          color="#ef4444"
          monthlyAmount={distributions.debtPayment}
          onChange={(value) => handleChange('debtPayment', value)}
        />
        <AllocationGauge
          value={allocation.savings}
          label="Savings"
          color="#f59e0b"
          monthlyAmount={distributions.savings}
          onChange={(value) => handleChange('savings', value)}
        />
        <AllocationGauge
          value={allocation.discretionary}
          label="Discretionary"
          color="#8b5cf6"
          monthlyAmount={distributions.discretionary}
          onChange={(value) => handleChange('discretionary', value)}
        />
      </div>
    </div>
  );
}