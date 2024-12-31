import type { FinancialProfile } from '../../types/finance';
import { calculateTotalTax } from '../tax/index';

export function calculateMonthlyDisposable(profile: FinancialProfile): number {
  const annualTaxes = calculateTotalTax(profile.annualIncome, profile.state);
  const monthlyIncome = profile.annualIncome / 12;
  const monthlyTaxes = annualTaxes / 12;
  
  return monthlyIncome - monthlyTaxes - profile.monthlyExpenses;
}

export function calculateMonthlyPayments(disposableIncome: number, allocation: {
  investments: number;
  debtPayment: number;
  savings: number;
  discretionary: number;
}) {
  return {
    investments: disposableIncome * (allocation.investments / 100),
    debtPayment: disposableIncome * (allocation.debtPayment / 100),
    savings: disposableIncome * (allocation.savings / 100),
    discretionary: disposableIncome * (allocation.discretionary / 100)
  };
}