export const MONTHS_IN_YEAR = 12;

export function getAnnualRates(rates: {
  inflation: number;
  investmentReturn: number;
  savingsInterest: number;
  studentLoanInterest: number;
  creditCardInterest: number;
  otherLoanInterest: number;
}) {
  return {
    INVESTMENT_RETURN: rates.investmentReturn / 100,
    SAVINGS_RETURN: rates.savingsInterest / 100,
    INFLATION: rates.inflation / 100,
    DEBT_INTEREST: {
      STUDENT_LOANS: rates.studentLoanInterest / 100,
      CREDIT_CARDS: rates.creditCardInterest / 100,
      OTHER_LOANS: rates.otherLoanInterest / 100
    }
  };
}