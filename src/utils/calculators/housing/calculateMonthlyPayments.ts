import { HOUSING_CONSTANTS } from '../constants';

export function calculateMonthlyPayments(
  loanAmount: number,
  propertyValue: number,
  annualInterestRate: number
) {
  const monthlyRate = annualInterestRate / 100 / HOUSING_CONSTANTS.MONTHS_PER_YEAR;
  const numPayments = HOUSING_CONSTANTS.DEFAULT_TERM_YEARS * HOUSING_CONSTANTS.MONTHS_PER_YEAR;

  // Calculate principal and interest payment
  const monthlyMortgage = monthlyRate === 0 
    ? loanAmount / numPayments
    : loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);

  // Calculate tax and insurance
  const monthlyTax = propertyValue * HOUSING_CONSTANTS.PROPERTY_TAX_RATE / HOUSING_CONSTANTS.MONTHS_PER_YEAR;
  const monthlyInsurance = propertyValue * HOUSING_CONSTANTS.INSURANCE_RATE / HOUSING_CONSTANTS.MONTHS_PER_YEAR;

  return {
    mortgage: Math.round(monthlyMortgage),
    tax: Math.round(monthlyTax),
    insurance: Math.round(monthlyInsurance),
    total: Math.round(monthlyMortgage + monthlyTax + monthlyInsurance)
  };
}