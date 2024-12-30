import type { FinancialProfile } from '../types/finance';

export const initialProfile: FinancialProfile = {
  age: 25,
  annualIncome: 60000,
  monthlyExpenses: 3000,
  currentSavings: 10000,
  currentInvestments: 15000,
  state: 'CA',
  debt: {
    studentLoans: 30000,
    creditCards: 5000,
    otherLoans: 0
  },
  rates: {
    inflation: 2.5,
    investmentReturn: 7.0,
    savingsInterest: 2.0,
    studentLoanInterest: 5.0,
    creditCardInterest: 18.0,
    otherLoanInterest: 8.0
  }
};