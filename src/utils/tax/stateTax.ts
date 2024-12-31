import { states } from '../../data/states';
import { calculateTaxFromBrackets } from './taxCalculator';

export function calculateStateTax(income: number, state: string): number {
  const stateData = states.find(s => s.code === state);
  if (!stateData) return 0;
  
  return calculateTaxFromBrackets(income, stateData.brackets);
}