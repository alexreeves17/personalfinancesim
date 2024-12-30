import React from 'react';
import { Calendar, DollarSign, Building, GraduationCap, CreditCard, Compass } from 'lucide-react';
import { StateSelect } from './StateSelect';
import { RateControls } from './rates/RateControls';
import { SectionCard } from './common/SectionCard';
import type { FinancialProfile, FinancialRates } from '../types/finance';

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

  const handleRatesChange = (rates: FinancialRates) => {
    onUpdate({
      ...profile,
      rates
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionCard
        icon={Compass}
        title="Your Financial Profile"
        subtitle="Let's start by understanding your current financial situation"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="form-label">Age</label>
            <div className="relative">
              <div className="form-icon">
                <Calendar className="h-5 w-5" />
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
              <div className="form-icon">
                <DollarSign className="h-5 w-5" />
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
              <div className="form-icon">
                <Building className="h-5 w-5" />
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
              <div className="form-icon">
                <DollarSign className="h-5 w-5" />
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
              <div className="form-icon">
                <DollarSign className="h-5 w-5" />
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
              <div className="form-icon">
                <GraduationCap className="h-5 w-5" />
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
              <div className="form-icon">
                <CreditCard className="h-5 w-5" />
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
              <div className="form-icon">
                <DollarSign className="h-5 w-5" />
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
      </SectionCard>

      <RateControls 
        rates={profile.rates}
        onChange={handleRatesChange}
      />
    </div>
  );
}