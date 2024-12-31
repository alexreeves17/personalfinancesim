import type { FinancialProfile, SimulationResult, Milestone } from '../types/finance';
import { calculateMonthlyDebtPaydown } from './finance/debtCalculator';
import { calculateMonthlyInvestmentGrowth } from './finance/investmentCalculator';
import { calculateMonthlySavingsGrowth } from './finance/savingsCalculator';
import { calculateMonthlyDisposable, calculateMonthlyPayments } from './finance/monthlyPayments';
import { distributeDebtPayments } from './finance/debtDistribution';
import { getAnnualRates } from './finance/constants';
import { applyMilestonesToSimulation } from './milestones/applyMilestones';
import { calculateMonthlyTaxes } from './tax/monthlyTax';

export function runFinancialSimulation(
  profile: FinancialProfile,
  allocation: {
    investments: number;
    debtPayment: number;
    savings: number;
    discretionary: number;
  },
  milestones: Milestone[]
): SimulationResult[] {
  const monthlyDisposable = calculateMonthlyDisposable(profile);
  const monthlyPayments = calculateMonthlyPayments(monthlyDisposable, allocation);
  const rates = getAnnualRates(profile.rates);
  const debtPayments = distributeDebtPayments(monthlyPayments.debtPayment, profile.debt);
  const baseResults: SimulationResult[] = [];

  // Initialize first year with starting balances
  baseResults.push({
    year: new Date().getFullYear() + 1,
    savings: profile.currentSavings,
    investments: profile.currentInvestments,
    debtRemaining: profile.debt.studentLoans + profile.debt.creditCards + profile.debt.otherLoans,
    netWorth: profile.currentSavings + profile.currentInvestments - 
      (profile.debt.studentLoans + profile.debt.creditCards + profile.debt.otherLoans),
    goalProgress: {}
  });

  // Calculate future years
  for (let year = 2; year <= 5; year++) {
    const months = (year - 1) * 12;
    
    const investmentProgression = calculateMonthlyInvestmentGrowth(
      profile.currentInvestments,
      monthlyPayments.investments,
      months,
      rates.INVESTMENT_RETURN
    );

    const savingsProgression = calculateMonthlySavingsGrowth(
      profile.currentSavings,
      monthlyPayments.savings,
      months,
      rates.SAVINGS_RETURN
    );

    const studentLoanProgression = calculateMonthlyDebtPaydown(
      profile.debt.studentLoans,
      debtPayments.studentLoans,
      rates.DEBT_INTEREST.STUDENT_LOANS,
      months
    );

    const creditCardProgression = calculateMonthlyDebtPaydown(
      profile.debt.creditCards,
      debtPayments.creditCards,
      rates.DEBT_INTEREST.CREDIT_CARDS,
      months
    );

    const otherLoanProgression = calculateMonthlyDebtPaydown(
      profile.debt.otherLoans,
      debtPayments.otherLoans,
      rates.DEBT_INTEREST.OTHER_LOANS,
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