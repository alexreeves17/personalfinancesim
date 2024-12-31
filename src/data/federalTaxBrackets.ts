// 2024 Federal Tax Brackets (Single Filer)
export const federalTaxBrackets = [
  { threshold: 0, rate: 10 },
  { threshold: 11600, rate: 12 },
  { threshold: 47150, rate: 22 },
  { threshold: 100525, rate: 24 },
  { threshold: 191950, rate: 32 },
  { threshold: 243725, rate: 35 },
  { threshold: 609350, rate: 37 }
] as const;

// Standard deduction for 2024
export const standardDeduction = 14600;