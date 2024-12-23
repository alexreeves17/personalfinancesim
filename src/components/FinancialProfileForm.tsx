import React from 'react';
import { Calendar, DollarSign, Building, GraduationCap, CreditCard } from 'lucide-react';
import { StateSelect } from './StateSelect';
import type { FinancialProfile } from '../types/finance';

interface Props {
  profile: FinancialProfile;
  onUpdate: (profile: FinancialProfile) => void;
  onSimulate: () => void;
}

export function FinancialProfileForm({ profile, onUpdate, onSimulate }: Props) {
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
    <div className="glass-card p-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
        Your Financial Profile
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="form-group">
          <label className="form-label">Age</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Annual Income</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="annualIncome"
              value={profile.annualIncome}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Monthly Expenses</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="monthlyExpenses"
              value={profile.monthlyExpenses}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Current Savings</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="currentSavings"
              value={profile.currentSavings}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Current Investments</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="currentInvestments"
              value={profile.currentInvestments}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <StateSelect 
          value={profile.state} 
          onChange={(state) => onUpdate({ ...profile, state })} 
        />

        <div className="form-group">
          <label className="form-label">Student Loans</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="debt.studentLoans"
              value={profile.debt.studentLoans}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Credit Cards</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="debt.creditCards"
              value={profile.debt.creditCards}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Other Loans</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="debt.otherLoans"
              value={profile.debt.otherLoans}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}