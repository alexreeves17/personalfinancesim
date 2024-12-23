// Housing constants
export const HOUSING_CONSTANTS = {
  FRONT_END_RATIO: 0.28,  // 28% of monthly income for housing
  BACK_END_RATIO: 0.36,   // 36% of monthly income for total debt
  SAFETY_MARGIN: 0.9,     // 90% of maximum for recommended price
  MIN_DOWN_PAYMENT: 0.03, // 3% minimum down payment
  PROPERTY_TAX_RATE: 0.012, // 1.2% annual property tax rate
  INSURANCE_RATE: 0.005,   // 0.5% annual insurance rate
  MONTHS_PER_YEAR: 12,
  DEFAULT_TERM_YEARS: 30
} as const;