import type { SimulationResult } from '../types/finance';
import { calculateMonthlyDebtPaydown } from './finance/debtCalculator';
import { calculateMonthlyInvestmentGrowth } from './finance/investmentCalculator';
import { calculateMonthlySavingsGrowth } from './finance/savingsCalculator';
import { ANNUAL_RATES, MONTHS_IN_YEAR } from './finance/constants';

interface MonthlyValue {
  savings: number;
  investments: number;
  netWorth: number;
  debt: number;
}

export function calculateMonthlyValues(
  yearResult: SimulationResult,
  monthlyContributions: {
    savings: number;
    investments: number;
    debtPayment: number;
  }
): MonthlyValue[] {
  const monthlyValues: MonthlyValue[] = [];

  // Calculate monthly progression for each component
  const savingsProgression = calculateMonthlySavingsGrowth(
    yearResult.savings,
    monthlyContributions.savings,
    MONTHS_IN_YEAR
  );

  const investmentProgression = calculateMonthlyInvestmentGrowth(
    yearResult.investments,
    monthlyContributions.investments,
    MONTHS_IN_YEAR
  );

  const debtProgression = calculateMonthlyDebtPaydown(
    yearResult.debtRemaining,
    monthlyContributions.debtPayment,
    ANNUAL_RATES.DEBT_INTEREST.STUDENT_LOANS, // Using student loan rate as default
    MONTHS_IN_YEAR
  );

  // Combine monthly values
  for (let i = 0; i < MONTHS_IN_YEAR; i++) {
    monthlyValues.push({
      savings: savingsProgression[i],
      investments: investmentProgression[i],
      debt: debtProgression[i],
      netWorth: savingsProgression[i] + investmentProgression[i] - debtProgression[i]
    });
  }

  return monthlyValues;
}