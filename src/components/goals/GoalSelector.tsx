import React from 'react';
import { Home, Car, GraduationCap, Wallet, PlusCircle } from 'lucide-react';
import type { GoalType } from '../../types/goals';

interface Props {
  onSelect: (type: GoalType) => void;
}

export function GoalSelector({ onSelect }: Props) {
  const goals = [
    { type: 'house', icon: Home, label: 'Buy a House', color: 'bg-blue-500' },
    { type: 'car', icon: Car, label: 'Buy a Car', color: 'bg-green-500' },
    { type: 'debt', icon: Wallet, label: 'Pay off Debt', color: 'bg-red-500' },
    { type: 'education', icon: GraduationCap, label: 'Education', color: 'bg-purple-500' },
  ] as const;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {goals.map(({ type, icon: Icon, label, color }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="flex flex-col items-center p-6 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-all hover:scale-105"
        >
          <div className={`p-3 rounded-full ${color} text-white mb-3`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </button>
      ))}
      <button
        onClick={() => onSelect('custom')}
        className="flex flex-col items-center p-6 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition-all hover:scale-105 col-span-2 sm:col-span-4"
      >
        <div className="p-3 rounded-full bg-gray-500 text-white mb-3">
          <PlusCircle className="w-6 h-6" />
        </div>
        <span className="text-sm font-medium text-gray-700">Custom Goal</span>
      </button>
    </div>
  );
}