import { calculateTotalTax } from './index';

export function calculateMonthlyTaxes(annualIncome: number, state: string): number {
  const annualTaxes = calculateTotalTax(annualIncome, state);
  return annualTaxes / 12;
}