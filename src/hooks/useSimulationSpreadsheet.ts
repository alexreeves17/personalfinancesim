import { useMemo } from 'react';
import type { SimulationResult } from '../types/finance';
import { formatCurrency } from '../utils/spreadsheet/formatting';

export function useSimulationSpreadsheet(results: SimulationResult[], monthlyContributions: {
  investments: number;
  debtPayment: number;
  savings: number;
}) {
  return useMemo(() => ({
    investments: {
      monthlyContribution: {
        label: 'Monthly Investment',
        help: 'Regular monthly contribution to investments',
        format: 'currency',
        values: results.map(() => monthlyContributions.investments)
      },
      balance: {
        label: 'Investment Balance',
        help: 'Total investment portfolio value',
        format: 'currency',
        values: results.map(r => r.investments)
      },
      return: {
        label: 'Investment Return',
        help: 'Annual return on investments',
        format: 'percentage',
        values: results.map((r, i) => 
          i === 0 ? 0 : ((r.investments - results[i-1].investments) / results[i-1].investments) * 100
        )
      }
    },
    savings: {
      monthlyContribution: {
        label: 'Monthly Savings',
        help: 'Regular monthly contribution to savings',
        format: 'currency',
        values: results.map(() => monthlyContributions.savings)
      },
      balance: {
        label: 'Savings Balance',
        help: 'Total savings account balance',
        format: 'currency',
        values: results.map(r => r.savings)
      },
      growth: {
        label: 'Savings Growth',
        help: 'Annual growth in savings',
        format: 'percentage',
        values: results.map((r, i) => 
          i === 0 ? 0 : ((r.savings - results[i-1].savings) / results[i-1].savings) * 100
        )
      }
    },
    debt: {
      monthlyPayment: {
        label: 'Monthly Debt Payment',
        help: 'Regular monthly debt payment',
        format: 'currency',
        values: results.map(() => monthlyContributions.debtPayment)
      },
      balance: {
        label: 'Remaining Debt',
        help: 'Total remaining debt balance',
        format: 'currency',
        values: results.map(r => r.debtRemaining)
      },
      reduction: {
        label: 'Debt Reduction',
        help: 'Annual reduction in debt',
        format: 'percentage',
        values: results.map((r, i) => 
          i === 0 ? 0 : ((results[i-1].debtRemaining - r.debtRemaining) / results[i-1].debtRemaining) * 100
        )
      }
    },
    netWorth: {
      total: {
        label: 'Net Worth',
        help: 'Total net worth (assets - liabilities)',
        format: 'currency',
        values: results.map(r => r.netWorth)
      },
      growth: {
        label: 'Net Worth Growth',
        help: 'Annual growth in net worth',
        format: 'percentage',
        values: results.map((r, i) => 
          i === 0 ? 0 : ((r.netWorth - results[i-1].netWorth) / results[i-1].netWorth) * 100
        )
      }
    }
  }), [results, monthlyContributions]);
}