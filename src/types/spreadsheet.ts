export interface SpreadsheetField {
  label: string;
  help?: string;
  format: 'currency' | 'percentage';
  values: number[];
}

export interface SpreadsheetCategory {
  [key: string]: SpreadsheetField;
}

export interface SpreadsheetData {
  revenue: SpreadsheetCategory;
  expenses: SpreadsheetCategory;
  cashflow: SpreadsheetCategory;
  ratios: SpreadsheetCategory;
}