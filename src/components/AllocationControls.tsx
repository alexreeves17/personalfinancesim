import React, { useMemo } from 'react';
import { AllocationGauge } from './allocation/AllocationGauge';
import { Info } from 'lucide-react';
import { calculateStateTax } from '../utils/tax';

interface Allocation {
  investments: number;
  debtPayment: number;
  savings: number;
  discretionary: number;
}

interface Props {
  allocation: Allocation;
  annualIncome: number;
  monthlyExpenses: number;
  state: string;
  onChange: (allocation: Allocation) => void;
}

export function AllocationControls({ allocation, annualIncome, monthlyExpenses, state, onChange }: Props) {
  const { monthlyDisposable, distributions } = useMemo(() => {
    // Example tax brackets for demonstration - you'd want to load these from a config
    const stateTaxBrackets = [
      { rate: 5, threshold: 0 },
      { rate: 7, threshold: 50000 },
      { rate: 9, threshold: 100000 }
    ];

    const stateTax = calculateStateTax(annualIncome, stateTaxBrackets);
    // Simplified federal tax calculation - you'd want to make this more accurate
    const federalTax = annualIncome * 0.22; 
    
    const monthlyAfterTax = (annualIncome - stateTax - federalTax) / 12;
    const monthlyDisposable = monthlyAfterTax - monthlyExpenses;

    const distributions = {
      investments: (monthlyDisposable * allocation.investments) / 100,
      debtPayment: (monthlyDisposable * allocation.debtPayment) / 100,
      savings: (monthlyDisposable * allocation.savings) / 100,
      discretionary: (monthlyDisposable * allocation.discretionary) / 100
    };

    return { monthlyDisposable, distributions };
  }, [annualIncome, monthlyExpenses, state, allocation]);

  const handleChange = (key: keyof Allocation, value: number) => {
    const total = Object.entries(allocation)
      .reduce((sum, [k, v]) => sum + (k === key ? value : v), 0);

    if (total > 100) {
      const remaining = 100 - value;
      const currentTotal = Object.entries(allocation)
        .reduce((sum, [k, v]) => sum + (k === key ? 0 : v), 0);
      
      const newAllocation = Object.entries(allocation).reduce((acc, [k, v]) => ({
        ...acc,
        [k]: k === key ? value : Math.round(v * (remaining / currentTotal))
      }), {} as Allocation);

      onChange(newAllocation);
    } else {
      onChange({
        ...allocation,
        [key]: value
      });
    }
  };

  const remaining = 100 - Object.values(allocation).reduce((sum, v) => sum + v, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium">Disposable Income Allocation</h3>
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
      {remaining > 0 && (
        <p className="mt-4 text-center text-sm text-gray-500">
          {remaining}% remaining to allocate
        </p>
      )}
    </div>
  );
}