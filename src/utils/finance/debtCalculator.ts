import { ANNUAL_RATES, MONTHS_IN_YEAR } from './constants';

export function calculateMonthlyDebtPaydown(
  principal: number,
  monthlyPayment: number,
  annualInterestRate: number,
  months: number
): number[] {
  const monthlyRate = annualInterestRate / MONTHS_IN_YEAR;
  let remainingDebt = principal;
  const monthlyBalances: number[] = [];

  for (let i = 0; i < months; i++) {
    // Add monthly interest
    remainingDebt *= (1 + monthlyRate);
    // Subtract payment
    remainingDebt = Math.max(0, remainingDebt - monthlyPayment);
    monthlyBalances.push(Math.round(remainingDebt));
  }

  return monthlyBalances;
}