import { federalTaxBrackets, standardDeduction } from '../../data/federalTaxBrackets';
import { calculateTaxFromBrackets } from './taxCalculator';

export function calculateFederalTax(income: number): number {
  // Apply standard deduction
  const taxableIncome = Math.max(0, income - standardDeduction);
  return calculateTaxFromBrackets(taxableIncome, federalTaxBrackets);
}