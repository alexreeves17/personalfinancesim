export function calculateMaxMonthlyPayment(monthlyIncome: number, monthlyDebts: number): number {
  console.log('Monthly Income:', monthlyIncome);
  console.log('Monthly Debts:', monthlyDebts);
  
  const maxHousingPayment = monthlyIncome * 0.28;
  const maxTotalPayment = (monthlyIncome - monthlyDebts) * 0.36;
  
  console.log('Max Housing Payment (28%):', maxHousingPayment);
  console.log('Max Total Payment (36% of net monthly income):', maxTotalPayment);
  
  return Math.min(maxHousingPayment, maxTotalPayment);
}