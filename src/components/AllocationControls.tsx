import React, { useMemo } from 'react';
import { AllocationGauge } from './allocation/AllocationGauge';
import { Info, Wand2, PlayCircle } from 'lucide-react';
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

  const { handleChange } = useAllocationControls(allocation, (newAllocation) => {
    onChange(newAllocation);
  });

  const handleOptimize = () => {
    const optimalAllocation = findOptimalAllocation(profile);
    onChange(optimalAllocation);
  };

  return (
    <div className="glass-card p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
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
          <span className="hidden sm:inline">Drag the circles to adjust</span>
          <span className="sm:hidden">Tap to adjust values</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 justify-items-center">
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

      <div className="flex justify-center mt-8 sm:mt-12">
        <button
          onClick={onSimulate}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto justify-center"
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          Run Simulation
        </button>
      </div>
    </div>
  );
}