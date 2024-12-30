import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { SpreadsheetData } from '../../types/spreadsheet';
import { calculateMetrics } from '../../utils/spreadsheet/metrics';

interface Props {
  data: SpreadsheetData;
}

export function FinancialMetrics({ data }: Props) {
  const metrics = calculateMetrics(data);

  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
      <div className="space-y-4">
        {Object.entries(metrics).map(([key, { value, change, label }]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="text-right">
              <div className="font-medium">{value}</div>
              <div className={`text-sm flex items-center gap-1 ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(change)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}