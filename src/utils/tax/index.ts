import { calculateFederalTax } from './federalTax';
import { calculateStateTax } from './stateTax';

export function calculateTotalTax(income: number, state: string): number {
  const federalTax = calculateFederalTax(income);
  const stateTax = calculateStateTax(income, state);
  
  return federalTax + stateTax;
}

export { calculateFederalTax, calculateStateTax };