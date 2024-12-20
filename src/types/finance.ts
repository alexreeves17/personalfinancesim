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
}

export interface SimulationResult {
  year: number;
  savings: number;
  investments: number;
  netWorth: number;
  debtRemaining: number;
  goalProgress: Record<string, number>;
}

export interface TaxBracket {
  rate: number;
  threshold: number;
}

export interface StateInfo {
  code: string;
  name: string;
  brackets: TaxBracket[];
}