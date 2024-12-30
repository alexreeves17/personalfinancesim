export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

export function parseCurrencyInput(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
}

export function parsePercentageInput(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
}