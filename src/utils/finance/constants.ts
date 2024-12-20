export const ANNUAL_RATES = {
  INVESTMENT_RETURN: 0.07,  // 7% annual return
  SAVINGS_RETURN: 0.02,     // 2% annual return
  DEBT_INTEREST: {
    STUDENT_LOANS: 0.05,    // 5% APR
    CREDIT_CARDS: 0.18,     // 18% APR
    OTHER_LOANS: 0.08       // 8% APR
  }
} as const;

export const MONTHS_IN_YEAR = 12;