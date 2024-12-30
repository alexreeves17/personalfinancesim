import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  help?: string;
}

export function RateInput({ label, value, onChange, help }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(Math.max(0, Math.min(100, newValue)));
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {help && (
          <div 
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <HelpCircle className="w-4 h-4 text-gray-400" />
            {showTooltip && (
              <div className="absolute left-0 bottom-full mb-2 z-10">
                <div className="bg-gray-900 text-white text-sm rounded-lg p-2 max-w-xs">
                  {help}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          step="0.1"
          min="0"
          max="100"
          className="block w-full pl-3 pr-8 py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500">%</span>
        </div>
      </div>
    </div>
  );
}