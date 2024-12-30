import React from 'react';
import { Percent } from 'lucide-react';
import { RateInput } from './RateInput';
import { SectionCard } from '../common/SectionCard';
import type { FinancialRates } from '../../types/finance';

interface Props {
  rates: FinancialRates;
  onChange: (rates: FinancialRates) => void;
}

export function RateControls({ rates, onChange }: Props) {
  const handleRateChange = (key: keyof FinancialRates) => (value: number) => {
    onChange({
      ...rates,
      [key]: value
    });
  };

  return (
    <SectionCard
      icon={Percent}
      title="Rate Settings"
      subtitle="Configure financial rates for more accurate projections"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RateInput
          label="Inflation Rate"
          value={rates.inflation}
          onChange={handleRateChange('inflation')}
          help="Annual rate of inflation affecting purchasing power"
        />
        <RateInput
          label="Investment Return"
          value={rates.investmentReturn}
          onChange={handleRateChange('investmentReturn')}
          help="Expected annual return on investments"
        />
        <RateInput
          label="Savings Interest"
          value={rates.savingsInterest}
          onChange={handleRateChange('savingsInterest')}
          help="Annual interest rate on savings accounts"
        />
        <RateInput
          label="Student Loan Rate"
          value={rates.studentLoanInterest}
          onChange={handleRateChange('studentLoanInterest')}
          help="Annual interest rate on student loans"
        />
        <RateInput
          label="Credit Card APR"
          value={rates.creditCardInterest}
          onChange={handleRateChange('creditCardInterest')}
          help="Annual percentage rate on credit card debt"
        />
        <RateInput
          label="Other Loan Rate"
          value={rates.otherLoanInterest}
          onChange={handleRateChange('otherLoanInterest')}
          help="Annual interest rate on other loans"
        />
      </div>
    </SectionCard>
  );
}