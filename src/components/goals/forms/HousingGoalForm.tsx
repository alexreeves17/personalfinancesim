import React from 'react';
import { HousingCalculator } from '../../calculators';
import { BaseGoalForm } from './BaseGoalForm';
import type { GoalFormProps } from '../../../types/goals';

export function HousingGoalForm({ profile, onSubmit, onCancel }: GoalFormProps) {
  const monthlyDebts = 
    (profile.debt.studentLoans + profile.debt.creditCards + profile.debt.otherLoans) / 12;

  return (
    <BaseGoalForm
      defaultName="Down Payment for House"
      calculator={
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-4">House Affordability Calculator</h4>
          <HousingCalculator
            annualIncome={profile.annualIncome}
            monthlyDebts={monthlyDebts}
            onCalculate={({ targetAmount, monthlyPayment, totalHomePrice }) => {
              return {
                name: `Down Payment for $${totalHomePrice.toLocaleString()} House`,
                targetAmount: targetAmount.toString()
              };
            }}
          />
        </div>
      }
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}