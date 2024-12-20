import type { FinancialProfile, Allocation } from '../../types/finance';
import { runFinancialSimulation } from '../simulationRunner';

function evaluateAllocation(profile: FinancialProfile, allocation: Allocation): number {
  const results = runFinancialSimulation(profile, allocation, []);
  return results[results.length - 1].netWorth;
}

export function findOptimalAllocation(profile: FinancialProfile): Allocation {
  // Initial allocation based on debt level and income
  const totalDebt = profile.debt.studentLoans + profile.debt.creditCards + profile.debt.otherLoans;
  const monthlyIncome = profile.annualIncome / 12;
  const debtToIncomeRatio = totalDebt / profile.annualIncome;

  // Base allocations adjusted by debt ratio
  let debtPayment = Math.min(50, Math.round(debtToIncomeRatio * 100));
  let investments = Math.min(80, Math.round((1 - debtToIncomeRatio) * 60));
  let savings = Math.min(30, Math.round((1 - debtToIncomeRatio) * 30));
  
  // Ensure minimum allocations
  debtPayment = Math.max(20, debtPayment);
  investments = Math.max(30, investments);
  savings = Math.max(10, savings);

  // Calculate discretionary to make total 100%
  const total = debtPayment + investments + savings;
  const discretionary = Math.max(0, 100 - total);

  // Normalize to ensure exactly 100%
  const allocation: Allocation = {
    investments,
    debtPayment,
    savings,
    discretionary
  };

  const sum = Object.values(allocation).reduce((a, b) => a + b, 0);
  if (sum !== 100) {
    const scale = 100 / sum;
    for (const key in allocation) {
      allocation[key as keyof Allocation] = Math.round(allocation[key as keyof Allocation] * scale);
    }
  }

  return allocation;
}