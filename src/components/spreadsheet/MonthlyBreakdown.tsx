import React, { useState, useCallback } from 'react';
import { EditableCell } from './EditableCell';
import { calculateMonthlyBalances, recalculateFromMonth } from '../../utils/spreadsheet/calculations';
import type { SimulationResult, FinancialProfile } from '../../types/finance';

interface Props {
  results: SimulationResult[];
  monthlyContributions: {
    investments: number;
    debtPayment: number;
    savings: number;
  };
  profile: FinancialProfile;
  onUpdate: (profile: FinancialProfile) => void;
}

export function MonthlyBreakdown({ results, monthlyContributions, profile, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState(() => 
    calculateMonthlyBalances(results, profile)
  );
  const [highlightedCells, setHighlightedCells] = useState<{
    row: number;
    columns: string[];
  } | null>(null);

  const handleCellChange = useCallback((rowIndex: number, field: keyof typeof monthlyData[0], value: number) => {
    setLoading(true);
    
    // Update the profile based on the changed field
    const updatedProfile = { ...profile };
    const monthlyDisposable = (profile.annualIncome / 12) - profile.monthlyExpenses;
    const newMonthlyDisposable = field === 'income' 
      ? (value * 12 / 12) - profile.monthlyExpenses
      : (profile.annualIncome / 12) - value;

    if (field === 'income') {
      updatedProfile.annualIncome = value * 12;
    } else if (field === 'expenses') {
      updatedProfile.monthlyExpenses = value;
    }

    // Calculate new monthly contributions based on allocation percentages
    const contributionRatio = newMonthlyDisposable / monthlyDisposable;
    const newMonthlyContributions = {
      investments: monthlyContributions.investments * contributionRatio,
      debtPayment: monthlyContributions.debtPayment * contributionRatio,
      savings: monthlyContributions.savings * contributionRatio
    };

    // Recalculate balances from the changed month forward
    const updatedData = recalculateFromMonth(
      monthlyData,
      rowIndex,
      updatedProfile,
      newMonthlyContributions
    );

    setMonthlyData(updatedData);
    onUpdate(updatedProfile);

    // Highlight affected cells
    setHighlightedCells({
      row: rowIndex,
      columns: ['savings', 'investments', 'debt', 'netWorth']
    });
    
    setTimeout(() => {
      setLoading(false);
      setHighlightedCells(null);
    }, 2000);
  }, [profile, monthlyData, monthlyContributions, onUpdate]);

  const isHighlighted = (rowIndex: number, column: string) => {
    return highlightedCells?.row === rowIndex && 
           highlightedCells.columns.includes(column);
  };

  return (
    <div className="glass-card p-6 mt-8 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4">Monthly Breakdown</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left font-medium text-gray-600">Month/Year</th>
              <th className="p-3 text-right font-medium text-gray-600">Monthly Income</th>
              <th className="p-3 text-right font-medium text-gray-600">Monthly Expenses</th>
              <th className="p-3 text-right font-medium text-gray-600">Savings Balance</th>
              <th className="p-3 text-right font-medium text-gray-600">Investment Balance</th>
              <th className="p-3 text-right font-medium text-gray-600">Debt Balance</th>
              <th className="p-3 text-right font-medium text-gray-600">Net Worth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {monthlyData.map((month, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3">{month.monthYear}</td>
                <td>
                  <EditableCell
                    value={month.income}
                    onChange={(value) => handleCellChange(index, 'income', value)}
                    type="currency"
                    isHighlighted={isHighlighted(index, 'income')}
                  />
                </td>
                <td>
                  <EditableCell
                    value={month.expenses}
                    onChange={(value) => handleCellChange(index, 'expenses', value)}
                    type="currency"
                    isHighlighted={isHighlighted(index, 'expenses')}
                  />
                </td>
                <td>
                  <EditableCell
                    value={month.savings}
                    onChange={(value) => handleCellChange(index, 'savings', value)}
                    type="currency"
                    isHighlighted={isHighlighted(index, 'savings')}
                  />
                </td>
                <td>
                  <EditableCell
                    value={month.investments}
                    onChange={(value) => handleCellChange(index, 'investments', value)}
                    type="currency"
                    isHighlighted={isHighlighted(index, 'investments')}
                  />
                </td>
                <td className="text-red-600">
                  <EditableCell
                    value={month.debt}
                    onChange={(value) => handleCellChange(index, 'debt', value)}
                    type="currency"
                    isHighlighted={isHighlighted(index, 'debt')}
                  />
                </td>
                <td className="font-medium">
                  <EditableCell
                    value={month.netWorth}
                    onChange={(value) => handleCellChange(index, 'netWorth', value)}
                    type="currency"
                    isHighlighted={isHighlighted(index, 'netWorth')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}