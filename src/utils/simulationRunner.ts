import type { FinancialProfile, SimulationResult, Milestone } from '../types/finance';
import { calculateFutureValue, calculateDebtPaydown } from './simulation';
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
  // Discretionary spending reduces available money for other allocations
  const discretionarySpending = monthlySavings * (allocation.discretionary / 100);

  const totalDebt = profile.debt.studentLoans + profile.debt.creditCards + profile.debt.otherLoans;
  
  const baseResults: SimulationResult[] = [];
  
  for (let year = 1; year <= 5; year++) {
    const futureInvestments = calculateFutureValue(
      profile.currentInvestments,
      monthlyInvestment,
      0.07,
      year
    );

    const futureSavings = calculateFutureValue(
      profile.currentSavings,
      emergencySavings,
      0.02,
      year
    );

    const remainingDebt = calculateDebtPaydown(
      totalDebt,
      monthlyDebtPayment,
      0.05,
      year
    );

    baseResults.push({
      year: new Date().getFullYear() + year,
      savings: futureSavings,
      investments: futureInvestments,
      netWorth: futureInvestments + futureSavings - remainingDebt,
      debtRemaining: remainingDebt,
      goalProgress: {}
    });
  }

  return applyMilestonesToSimulation(baseResults, milestones);
}