export function calculateLoanAmount(
  monthlyPayment: number,
  annualInterestRate: number,
  propertyValue: number
): number {
  console.log('Calculate Loan Amount Inputs:', {
    monthlyPayment,
    annualInterestRate,
    propertyValue
  });

  const monthlyRate = annualInterestRate / 100 / 12;
  const numPayments = 30 * 12;

  // Calculate monthly tax and insurance
  const monthlyTax = (propertyValue * 0.012) / 12;
  const monthlyInsurance = (propertyValue * 0.005) / 12;

  console.log('Monthly Components:', {
    tax: monthlyTax,
    insurance: monthlyInsurance
  });

  // Available for principal and interest
  const availableForPI = monthlyPayment - monthlyTax - monthlyInsurance;

  console.log('Available for P&I:', availableForPI);

  // If available amount is negative, return 0 to prevent invalid calculations
  if (availableForPI <= 0) {
    console.log('Available amount for P&I is negative or zero, returning 0');
    return 0;
  }

  if (monthlyRate === 0) {
    const result = availableForPI * numPayments;
    console.log('Loan Amount (0% rate):', result);
    return result;
  }

  // Calculate loan amount using mortgage payment formula
  const loanAmount = availableForPI * 
    (1 - Math.pow(1 + monthlyRate, -numPayments)) / 
    monthlyRate;

  console.log('Calculated Loan Amount:', loanAmount);
  return loanAmount;
}