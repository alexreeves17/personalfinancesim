export interface FinancialRates {
  inflation: number;
  investmentReturn: number;
  savingsInterest: number;
  studentLoanInterest: number;
  creditCardInterest: number;
  otherLoanInterest: number;
}

export interface FinancialProfile {
  age: number;
  annualIncome: number;
  monthlyExpenses: number;
  currentSavings: number;
  currentInvestments: number;
  state: string;
  debt: {
    studentLoans: number;
    creditCards: number;
    otherLoans: number;
  };
  rates: FinancialRates;
}