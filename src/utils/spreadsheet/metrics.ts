import type { SpreadsheetData } from '../../types/spreadsheet';
import { formatCurrency, formatPercentage } from './formatting';

export function calculateMetrics(data: SpreadsheetData) {
  const lastYear = 4; // Index of the last year (year 5)
  const previousYear = 3; // Index of the previous year (year 4)

  return {
    revenue: {
      label: 'Total Revenue',
      value: formatCurrency(
        data.revenue.sales.values[lastYear] + data.revenue.otherRevenue.values[lastYear]
      ),
      change: calculateYearOverYearChange(
        data.revenue.sales.values[lastYear] + data.revenue.otherRevenue.values[lastYear],
        data.revenue.sales.values[previousYear] + data.revenue.otherRevenue.values[previousYear]
      )
    },
    grossProfit: {
      label: 'Gross Profit',
      value: formatCurrency(
        data.revenue.sales.values[lastYear] - data.expenses.cogs.values[lastYear]
      ),
      change: calculateYearOverYearChange(
        data.revenue.sales.values[lastYear] - data.expenses.cogs.values[lastYear],
        data.revenue.sales.values[previousYear] - data.expenses.cogs.values[previousYear]
      )
    },
    operatingIncome: {
      label: 'Operating Income',
      value: formatCurrency(
        data.revenue.sales.values[lastYear] -
        data.expenses.cogs.values[lastYear] -
        data.expenses.operatingExpenses.values[lastYear]
      ),
      change: calculateYearOverYearChange(
        data.revenue.sales.values[lastYear] -
        data.expenses.cogs.values[lastYear] -
        data.expenses.operatingExpenses.values[lastYear],
        data.revenue.sales.values[previousYear] -
        data.expenses.cogs.values[previousYear] -
        data.expenses.operatingExpenses.values[previousYear]
      )
    },
    netCashFlow: {
      label: 'Net Cash Flow',
      value: formatCurrency(
        data.cashflow.operatingCashFlow.values[lastYear] +
        data.cashflow.investingCashFlow.values[lastYear] +
        data.cashflow.financingCashFlow.values[lastYear]
      ),
      change: calculateYearOverYearChange(
        data.cashflow.operatingCashFlow.values[lastYear] +
        data.cashflow.investingCashFlow.values[lastYear] +
        data.cashflow.financingCashFlow.values[lastYear],
        data.cashflow.operatingCashFlow.values[previousYear] +
        data.cashflow.investingCashFlow.values[previousYear] +
        data.cashflow.financingCashFlow.values[previousYear]
      )
    }
  };
}

function calculateYearOverYearChange(current: number, previous: number): number {
  return previous === 0 ? 0 : Math.round(((current - previous) / previous) * 100);
}