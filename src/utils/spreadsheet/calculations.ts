import type { SimulationResult, FinancialProfile } from '../../types/finance';

interface MonthlyBalance {
  monthYear: string;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  debt: number;
  netWorth: number;
}

export function calculateMonthlyBalances(
  results: SimulationResult[],
  profile: FinancialProfile
): MonthlyBalance[] {
  return results.flatMap((yearResult, yearIndex) => {
    const year = yearResult.year;
    return Array.from({ length: 12 }, (_, month) => {
      const monthName = new Date(2000, month).toLocaleString('default', { month: 'long' });
      const monthlyIncome = profile.annualIncome / 12;
      const monthlyExpenses = profile.monthlyExpenses;
      
      // Calculate running balances
      const monthProgress = month / 12;
      const prevYearResult = yearIndex > 0 ? results[yearIndex - 1] : null;
      
      const savings = interpolateValue(
        prevYearResult?.savings ?? profile.currentSavings,
        yearResult.savings,
        monthProgress
      );
      
      const investments = interpolateValue(
        prevYearResult?.investments ?? profile.currentInvestments,
        yearResult.investments,
        monthProgress
      );
      
      const debt = interpolateValue(
        prevYearResult?.debtRemaining ?? (
          profile.debt.studentLoans + 
          profile.debt.creditCards + 
          profile.debt.otherLoans
        ),
        yearResult.debtRemaining,
        monthProgress
      );
      
      const netWorth = investments + savings - debt;

      return {
        monthYear: `${monthName} ${year}`,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        savings,
        investments,
        debt,
        netWorth
      };
    });
  });
}

export function recalculateFromMonth(
  data: MonthlyBalance[],
  startIndex: number,
  profile: FinancialProfile,
  monthlyContributions: {
    investments: number;
    debtPayment: number;
    savings: number;
  }
): MonthlyBalance[] {
  // Keep data before the changed month unchanged
  const unchangedData = data.slice(0, startIndex);
  const remainingMonths = data.length - startIndex;

  // Get the last unchanged values as starting point
  const lastUnchanged = unchangedData[startIndex - 1] || {
    savings: profile.currentSavings,
    investments: profile.currentInvestments,
    debt: profile.debt.studentLoans + profile.debt.creditCards + profile.debt.otherLoans
  };

  // Calculate new values for remaining months
  const updatedData = Array.from({ length: remainingMonths }, (_, index) => {
    const monthIndex = startIndex + index;
    const monthName = data[monthIndex].monthYear;
    const monthlyIncome = profile.annualIncome / 12;
    const monthlyExpenses = profile.monthlyExpenses;

    // Apply monthly contributions and growth rates
    const savings = calculateNewBalance(
      index === 0 ? lastUnchanged.savings : data[monthIndex - 1].savings,
      monthlyContributions.savings,
      0.02 / 12 // 2% annual savings rate
    );

    const investments = calculateNewBalance(
      index === 0 ? lastUnchanged.investments : data[monthIndex - 1].investments,
      monthlyContributions.investments,
      0.07 / 12 // 7% annual investment return
    );

    const debt = calculateNewDebtBalance(
      index === 0 ? lastUnchanged.debt : data[monthIndex - 1].debt,
      monthlyContributions.debtPayment
    );

    const netWorth = investments + savings - debt;

    return {
      monthYear: monthName,
      income: monthlyIncome,
      expenses: monthlyExpenses,
      savings,
      investments,
      debt,
      netWorth
    };
  });

  return [...unchangedData, ...updatedData];
}

function interpolateValue(start: number, end: number, progress: number): number {
  return Math.round(start + (end - start) * progress);
}

function calculateNewBalance(
  currentBalance: number,
  monthlyContribution: number,
  monthlyRate: number
): number {
  return Math.round((currentBalance + monthlyContribution) * (1 + monthlyRate));
}

function calculateNewDebtBalance(
  currentDebt: number,
  monthlyPayment: number
): number {
  const monthlyRate = 0.05 / 12; // 5% annual interest rate
  return Math.max(0, Math.round((currentDebt * (1 + monthlyRate)) - monthlyPayment));
}