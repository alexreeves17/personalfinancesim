export const initialSpreadsheetData = {
  revenue: {
    sales: {
      label: 'Sales Revenue',
      help: 'Total revenue from product/service sales',
      format: 'currency',
      values: [1000000, 1150000, 1322500, 1520875, 1749006]
    },
    otherRevenue: {
      label: 'Other Revenue',
      help: 'Revenue from other sources (licensing, royalties, etc.)',
      format: 'currency',
      values: [50000, 57500, 66125, 76044, 87450]
    },
    growthRate: {
      label: 'Growth Rate',
      help: 'Year-over-year revenue growth rate',
      format: 'percentage',
      values: [15, 15, 15, 15, 15]
    }
  },
  expenses: {
    cogs: {
      label: 'Cost of Goods Sold',
      help: 'Direct costs attributable to the production of goods/services',
      format: 'currency',
      values: [600000, 690000, 793500, 912525, 1049404]
    },
    operatingExpenses: {
      label: 'Operating Expenses',
      help: 'Day-to-day expenses (rent, utilities, salaries, etc.)',
      format: 'currency',
      values: [300000, 330000, 363000, 399300, 439230]
    },
    marketing: {
      label: 'Marketing Expenses',
      help: 'Advertising, promotions, and marketing costs',
      format: 'currency',
      values: [100000, 115000, 132250, 152088, 174901]
    }
  },
  cashflow: {
    operatingCashFlow: {
      label: 'Operating Cash Flow',
      help: 'Cash generated from core business operations',
      format: 'currency',
      values: [150000, 172500, 198375, 228131, 262351]
    },
    investingCashFlow: {
      label: 'Investing Cash Flow',
      help: 'Cash used in investing activities',
      format: 'currency',
      values: [-50000, -57500, -66125, -76044, -87450]
    },
    financingCashFlow: {
      label: 'Financing Cash Flow',
      help: 'Cash from financing activities',
      format: 'currency',
      values: [-25000, -28750, -33063, -38022, -43725]
    }
  },
  ratios: {
    grossMargin: {
      label: 'Gross Margin',
      help: 'Gross profit as a percentage of revenue',
      format: 'percentage',
      values: [40, 40, 40, 40, 40]
    },
    operatingMargin: {
      label: 'Operating Margin',
      help: 'Operating income as a percentage of revenue',
      format: 'percentage',
      values: [15, 15, 15, 15, 15]
    },
    netMargin: {
      label: 'Net Margin',
      help: 'Net income as a percentage of revenue',
      format: 'percentage',
      values: [10, 10, 10, 10, 10]
    }
  }
};