import React from 'react';
import { HousingCalculator } from '../calculators/HousingCalculator';
import type { GoalType } from '../../types/goals';

interface Props {
  type: GoalType;
  calculatorResult?: {
    targetAmount: number;
    monthlyPayment: number;
    totalPrice: number;
  };
  profile: {
    annualIncome: number;
    debt: {
      studentLoans: number;
      creditCards: number;
      otherLoans: number;
    };
  };
  onSubmit: (data: {
    name: string;
    targetAmount: number;
    targetDate: string;
    priority: 'low' | 'medium' | 'high';
  }) => void;
  onCancel: () => void;
}

export function GoalForm({ type, calculatorResult, profile, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = React.useState({
    name: calculatorResult ? 
      `Down Payment for $${calculatorResult.totalPrice.toLocaleString()} House` :
      getDefaultName(type),
    targetAmount: calculatorResult?.targetAmount.toString() || '',
    targetDate: '',
    priority: 'medium' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetAmount: Number(formData.targetAmount)
    });
  };

  function getDefaultName(type: GoalType) {
    switch (type) {
      case 'house': return 'Down Payment for House';
      case 'car': return 'New Car Purchase';
      case 'debt': return 'Debt Payoff';
      case 'education': return 'Education Fund';
      default: return '';
    }
  }

  const monthlyDebts = 
    (profile.debt.studentLoans + profile.debt.creditCards + profile.debt.otherLoans) / 12;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'house' && !calculatorResult && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-4">House Affordability Calculator</h4>
          <HousingCalculator
            annualIncome={profile.annualIncome}
            monthlyDebts={monthlyDebts}
            onCalculate={({ targetAmount, monthlyPayment, totalHomePrice }) => {
              setFormData(prev => ({
                ...prev,
                name: `Down Payment for $${totalHomePrice.toLocaleString()} House`,
                targetAmount: targetAmount.toString()
              }));
            }}
          />
        </div>
      )}

      {calculatorResult && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Home Price:</span>
            <span className="font-medium">${calculatorResult.totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Monthly Payment:</span>
            <span className="font-medium">${calculatorResult.monthlyPayment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Down Payment:</span>
            <span className="font-medium">${calculatorResult.targetAmount.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Goal Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Amount
        </label>
        <input
          type="number"
          value={formData.targetAmount}
          onChange={e => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Date
        </label>
        <input
          type="date"
          value={formData.targetDate}
          onChange={e => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <div className="flex gap-4">
          {(['low', 'medium', 'high'] as const).map(priority => (
            <label key={priority} className="flex items-center">
              <input
                type="radio"
                name="priority"
                value={priority}
                checked={formData.priority === priority}
                onChange={() => setFormData(prev => ({ ...prev, priority }))}
                className="mr-2"
              />
              <span className="capitalize">{priority}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Goal
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}