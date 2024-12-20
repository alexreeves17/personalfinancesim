import { ANNUAL_RATES, MONTHS_IN_YEAR } from './constants';

export function calculateMonthlyInvestmentGrowth(
  principal: number,
  monthlyContribution: number,
  months: number
): number[] {
  const monthlyRate = ANNUAL_RATES.INVESTMENT_RETURN / MONTHS_IN_YEAR;
  let balance = principal;
  const monthlyBalances: number[] = [];

  for (let i = 0; i < months; i++) {
    balance = (balance + monthlyContribution) * (1 + monthlyRate);
    monthlyBalances.push(Math.round(balance));
  }

  return monthlyBalances;
}