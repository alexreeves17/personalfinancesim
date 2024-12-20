import type { FinancialProfile, SimulationResult, Milestone } from '../types/finance';
import { calculateMonthlyDebtPaydown } from './finance/debtCalculator';
import { calculateMonthlyInvestmentGrowth } from './finance/investmentCalculator';
import { calculateMonthlySavingsGrowth } from './finance/savingsCalculator';
import { ANNUAL_RATES } from './finance/constants';
import { applyMilestonesToSimulation } from './milestones';

interface Allocation {
  investments: number;
  debtPayment: number;
  savings: number;
  discretionary: number;
}

export function runFinancialSimulation(
  profile: FinancialProfile,
  allocation: Allocation,
  milestones: Milestone[]
): SimulationResult[] {
  const monthlySavings = (profile.annualIncome / 12) - profile.monthlyExpenses;
  const monthlyInvestment = monthlySavings * (allocation.investments / 100);
  const monthlyDebtPayment = monthlySavings * (allocation.debtPayment / 100);
  const emergencySavings = monthlySavings * (allocation.savings / 100);
  
  const totalDebt = profile.debt.studentLoans + profile.debt.creditCards + profile.debt.otherLoans;
  const baseResults: SimulationResult[] = [];
  
  for (let year = 1; year <= 5; year++) {
    const months = year * 12;
    
    const investmentProgression = calculateMonthlyInvestmentGrowth(
      profile.currentInvestments,
      monthlyInvestment,
      months
    );

    const savingsProgression = calculateMonthlySavingsGrowth(
      profile.currentSavings,
      emergencySavings,
      months
    );

    const debtProgression = calculateMonthlyDebtPaydown(
      totalDebt,
      monthlyDebtPayment,
      ANNUAL_RATES.DEBT_INTEREST.STUDENT_LOANS,
      months
    );

    baseResults.push({
      year: new Date().getFullYear() + year,
      savings: savingsProgression[months - 1],
      investments: investmentProgression[months - 1],
      debtRemaining: debtProgression[months - 1],
      netWorth: savingsProgression[months - 1] + investmentProgression[months - 1] - debtProgression[months - 1],
      goalProgress: {}
    });
  }

  return applyMilestonesToSimulation(baseResults, milestones);
}