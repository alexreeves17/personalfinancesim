import React from 'react';
import { states } from '../data/states';
import { MapPin } from 'lucide-react';

interface Props {
  value: string;
  onChange: (state: string) => void;
}

export function StateSelect({ value, onChange }: Props) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-10 pr-4 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg bg-white/80 backdrop-blur-sm shadow-inner transition-all duration-200 hover:bg-white"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}