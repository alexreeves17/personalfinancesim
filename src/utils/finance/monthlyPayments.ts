import type { FinancialProfile } from '../../types/finance';

export function calculateMonthlyDisposable(profile: FinancialProfile): number {
  return (profile.annualIncome / 12) - profile.monthlyExpenses;
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