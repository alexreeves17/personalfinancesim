import React from 'react';
import { HelpCircle } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/spreadsheet/formatting';

interface Props {
  data: Record<string, {
    label: string;
    help?: string;
    format: 'currency' | 'percentage';
    values: number[];
  }>;
  years: number[];
}

export function SpreadsheetSection({ data, years }: Props) {
  const renderCell = (value: number, format: 'currency' | 'percentage') => {
    const formattedValue = format === 'currency' 
      ? formatCurrency(value)
      : formatPercentage(value);

    return (
      <div className="text-right">
        {formattedValue}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2 text-left"></th>
            {years.map(year => (
              <th key={year} className="p-2 text-right">
                {year}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([field, { label, help, format, values }]) => (
            <tr key={field} className="border-t border-gray-100">
              <td className="p-2 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span>{label}</span>
                  {help && (
                    <div className="relative group">
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 text-white text-sm rounded-lg p-2 max-w-xs">
                          {help}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              {values.map((value, i) => (
                <td key={i} className="p-2">
                  {renderCell(value, format)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}