import React from 'react';
import type { SimulationResult } from '../types/finance';
import { calculateMonthlyValues } from '../utils/simulation';

interface Props {
  result: SimulationResult;
}

export function MonthlyDetails({ result }: Props) {
  const monthlyValues = calculateMonthlyValues(result);

  return (
    <div className="border-t border-gray-100 p-6 overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Investments</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Worth</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debt</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {monthlyValues.map((month, index) => (
            <tr key={index} className="hover:bg-white/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {new Date(0, index).toLocaleString('default', { month: 'long' })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                ${month.savings.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
                ${month.investments.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                ${month.netWorth.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                ${month.debt.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}