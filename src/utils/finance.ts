interface GrowthResult {
  growth: number;
  percentage: number;
}

export function calculateGrowth(current: number, previous?: number): GrowthResult {
  if (previous === undefined) {
    return { growth: 0, percentage: 0 };
  }

  const growth = current - previous;
  const percentage = previous === 0 ? 100 : Math.round((growth / previous) * 100 * 10) / 10;

  return { growth, percentage };
}