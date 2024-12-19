import React from 'react';
import type { FinancialProfile } from '../types/finance';

interface Props {
  profile: FinancialProfile;
  onUpdate: (profile: FinancialProfile) => void;
}

export function FinancialProfileForm({ profile, onUpdate }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (name.startsWith('debt.')) {
      const debtType = name.split('.')[1];
      onUpdate({
        ...profile,
        debt: {
          ...profile.debt,
          [debtType]: numValue || 0
        }
      });
    } else {
      onUpdate({
        ...profile,
        [name]: numValue || 0
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Financial Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Income</label>
          <input
            type="number"
            name="annualIncome"
            value={profile.annualIncome}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Expenses</label>
          <input
            type="number"
            name="monthlyExpenses"
            value={profile.monthlyExpenses}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Savings</label>
          <input
            type="number"
            name="currentSavings"
            value={profile.currentSavings}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Investments</label>
          <input
            type="number"
            name="currentInvestments"
            value={profile.currentInvestments}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <h3 className="text-lg font-medium mt-6 mb-4">Current Debt</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Student Loans</label>
          <input
            type="number"
            name="debt.studentLoans"
            value={profile.debt.studentLoans}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Credit Cards</label>
          <input
            type="number"
            name="debt.creditCards"
            value={profile.debt.creditCards}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Other Loans</label>
          <input
            type="number"
            name="debt.otherLoans"
            value={profile.debt.otherLoans}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}