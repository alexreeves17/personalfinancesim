export function calculateFutureValue(
  principal: number,
  monthlyContribution: number,
  annualInterestRate: number,
  years: number
): number {
  const monthlyRate = annualInterestRate / 12;
  const months = years * 12;
  let futureValue = principal;

  for (let i = 0; i < months; i++) {
    futureValue = (futureValue + monthlyContribution) * (1 + monthlyRate);
  }

  return Math.round(futureValue);
}

export function calculateDebtPaydown(
  principal: number,
  monthlyPayment: number,
  annualInterestRate: number,
  years: number
): number {
  const monthlyRate = annualInterestRate / 12;
  const months = years * 12;
  let remainingDebt = principal;

  for (let i = 0; i < months; i++) {
    remainingDebt = (remainingDebt * (1 + monthlyRate)) - monthlyPayment;
    if (remainingDebt < 0) remainingDebt = 0;
  }

  return Math.round(remainingDebt);
}

interface MonthlyValue {
  savings: number;
  investments: number;
  netWorth: number;
  debt: number;
}

export function calculateMonthlyValues(yearResult: SimulationResult): MonthlyValue[] {
  const monthlyValues: MonthlyValue[] = [];
  const monthlyInvestmentReturn = 0.07 / 12;
  const monthlySavingsReturn = 0.02 / 12;
  const monthlyDebtRate = 0.05 / 12;
  
  let currentSavings = yearResult.savings / (1 + 0.02);
  let currentInvestments = yearResult.investments / (1 + 0.07);
  let currentDebt = yearResult.debtRemaining * (1 + 0.05);
  
  const monthlySavingsContribution = (yearResult.savings - currentSavings) / 12;
  const monthlyInvestmentContribution = (yearResult.investments - currentInvestments) / 12;
  const monthlyDebtPayment = (currentDebt - yearResult.debtRemaining) / 12;

  for (let month = 0; month < 12; month++) {
    currentSavings = (currentSavings + monthlySavingsContribution) * (1 + monthlySavingsReturn);
    currentInvestments = (currentInvestments + monthlyInvestmentContribution) * (1 + monthlyInvestmentReturn);
    currentDebt = (currentDebt * (1 + monthlyDebtRate)) - monthlyDebtPayment;
    
    monthlyValues.push({
      savings: Math.round(currentSavings),
      investments: Math.round(currentInvestments),
      netWorth: Math.round(currentSavings + currentInvestments - currentDebt),
      debt: Math.round(currentDebt)
    });
  }

  return monthlyValues;
}