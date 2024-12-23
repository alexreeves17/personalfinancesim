import type { FinancialProfile, SimulationResult, Milestone } from '../types/finance';
import { calculateMonthlyDebtPaydown } from './finance/debtCalculator';
import { calculateMonthlyInvestmentGrowth } from './finance/investmentCalculator';
import { calculateMonthlySavingsGrowth } from './finance/savingsCalculator';
import { calculateMonthlyDisposable, calculateMonthlyPayments } from './finance/monthlyPayments';
import { distributeDebtPayments } from './finance/debtDistribution';
import { ANNUAL_RATES } from './finance/constants';
import { applyMilestonesToSimulation } from './milestones/applyMilestones';

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
  const monthlyDisposable = calculateMonthlyDisposable(profile);
  const monthlyPayments = calculateMonthlyPayments(monthlyDisposable, allocation);
  
  const debtPayments = distributeDebtPayments(monthlyPayments.debtPayment, profile.debt);
  const baseResults: SimulationResult[] = [];
  
  for (let year = 1; year <= 5; year++) {
    const months = year * 12;
    
    const investmentProgression = calculateMonthlyInvestmentGrowth(
      profile.currentInvestments,
      monthlyPayments.investments,
      months
    );

    const savingsProgression = calculateMonthlySavingsGrowth(
      profile.currentSavings,
      monthlyPayments.savings,
      months
    );

    // Calculate each debt type separately with its own interest rate
    const studentLoanProgression = calculateMonthlyDebtPaydown(
      profile.debt.studentLoans,
      debtPayments.studentLoans,
      ANNUAL_RATES.DEBT_INTEREST.STUDENT_LOANS,
      months
    );

    const creditCardProgression = calculateMonthlyDebtPaydown(
      profile.debt.creditCards,
      debtPayments.creditCards,
      ANNUAL_RATES.DEBT_INTEREST.CREDIT_CARDS,
      months
    );

    const otherLoanProgression = calculateMonthlyDebtPaydown(
      profile.debt.otherLoans,
      debtPayments.otherLoans,
      ANNUAL_RATES.DEBT_INTEREST.OTHER_LOANS,
      months
    );

    const totalDebtRemaining = 
      studentLoanProgression[months - 1] +
      creditCardProgression[months - 1] +
      otherLoanProgression[months - 1];

    baseResults.push({
      year: new Date().getFullYear() + year,
      savings: savingsProgression[months - 1],
      investments: investmentProgression[months - 1],
      debtRemaining: totalDebtRemaining,
      netWorth: savingsProgression[months - 1] + investmentProgression[months - 1] - totalDebtRemaining,
      goalProgress: {}
    });
  }

  return applyMilestonesToSimulation(baseResults, milestones);
}