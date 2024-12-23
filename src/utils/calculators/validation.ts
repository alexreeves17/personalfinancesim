export function validateNumericInput(value: number): number {
  // Ensure positive number and round to nearest integer
  return Math.max(0, Math.round(value));
}

export function validatePercentage(value: number): number {
  // Ensure percentage is between 0 and 100, rounded to 1 decimal
  return Math.min(100, Math.max(0, Math.round(value * 10) / 10));
}