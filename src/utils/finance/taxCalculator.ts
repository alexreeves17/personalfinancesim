import { states } from '../data/states';

export function calculateTaxes(annualIncome: number, state: string) {
  // Find state tax brackets
  const stateData = states.find(s => s.code === state);
  if (!stateData) return 0;

  // Calculate state tax
  let stateTax = 0;
  let remainingIncome = annualIncome;
  
  stateData.brackets.forEach((bracket, index) => {
    const nextBracket = stateData.brackets[index + 1];
    const taxableAmount = nextBracket 
      ? Math.min(nextBracket.threshold - bracket.threshold, Math.max(0, remainingIncome - bracket.threshold))
      : Math.max(0, remainingIncome - bracket.threshold);
    
    stateTax += taxableAmount * (bracket.rate / 100);
    remainingIncome -= taxableAmount;
  });

  return stateTax;
}