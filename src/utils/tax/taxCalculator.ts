import type { TaxBracket } from '../../types/finance';

export function calculateTaxFromBrackets(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  let remainingIncome = income;
  
  // Sort brackets by threshold ascending
  const sortedBrackets = [...brackets].sort((a, b) => a.threshold - b.threshold);
  
  for (let i = 0; i < sortedBrackets.length; i++) {
    const bracket = sortedBrackets[i];
    const nextBracket = sortedBrackets[i + 1];
    
    const taxableAmount = nextBracket
      ? Math.min(nextBracket.threshold - bracket.threshold, Math.max(0, remainingIncome - bracket.threshold))
      : Math.max(0, remainingIncome - bracket.threshold);
    
    tax += taxableAmount * (bracket.rate / 100);
    remainingIncome -= taxableAmount;
    
    if (remainingIncome <= 0) break;
  }
  
  return tax;
}