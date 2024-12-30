import type { SimulationResult } from '../types/finance';
import { calculateMonthlyDebtPaydown } from './finance/debtCalculator';
import { calculateMonthlyInvestmentGrowth } from './finance/investmentCalculator';
import { calculateMonthlySavingsGrowth } from './finance/savingsCalculator';
import { getAnnualRates, MONTHS_IN_YEAR } from './finance/constants';

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
  },
  rates: {
    inflation: number;
    investmentReturn: number;
    savingsInterest: number;
    studentLoanInterest: number;
    creditCardInterest: number;
    otherLoanInterest: number;
  }
): MonthlyValue[] {
  const monthlyValues: MonthlyValue[] = [];
  const annualRates = getAnnualRates(rates);

  // Calculate monthly progression for each component
  const savingsProgression = calculateMonthlySavingsGrowth(
    yearResult.savings,
    monthlyContributions.savings,
    MONTHS_IN_YEAR,
    annualRates.SAVINGS_RETURN
  );

  const investmentProgression = calculateMonthlyInvestmentGrowth(
    yearResult.investments,
    monthlyContributions.investments,
    MONTHS_IN_YEAR,
    annualRates.INVESTMENT_RETURN
  );

  const debtProgression = calculateMonthlyDebtPaydown(
    yearResult.debtRemaining,
    monthlyContributions.debtPayment,
    annualRates.DEBT_INTEREST.STUDENT_LOANS, // Using student loan rate as default
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