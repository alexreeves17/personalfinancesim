import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HousingCalculator } from './HousingCalculator';

interface Props {
  type: 'house';
  isOpen: boolean;
  onClose: () => void;
  onCalculate: (result: {
    targetAmount: number;
    monthlyPayment: number;
    totalPrice: number;
  }) => void;
  profile: {
    annualIncome: number;
    debt: {
      studentLoans: number;
      creditCards: number;
      otherLoans: number;
    };
  };
}

export function CalculatorModal({ type, isOpen, onClose, onCalculate, profile }: Props) {
  const [currentResult, setCurrentResult] = useState<{
    targetAmount: number;
    monthlyPayment: number;
    totalHomePrice: number;
  } | null>(null);

  if (!isOpen) return null;

  const monthlyDebts = 
    (profile.debt.studentLoans + profile.debt.creditCards + profile.debt.otherLoans) / 12;

  const handleCalculate = (result: {
    targetAmount: number;
    monthlyPayment: number;
    totalHomePrice: number;
  }) => {
    setCurrentResult(result);
  };

  const handleUseValues = () => {
    if (currentResult) {
      onCalculate({
        targetAmount: currentResult.targetAmount,
        monthlyPayment: currentResult.monthlyPayment,
        totalPrice: currentResult.totalHomePrice
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {type === 'house' ? 'House Affordability Calculator' : 'Calculator'}
        </h2>

        {type === 'house' && (
          <div className="space-y-6">
            <HousingCalculator
              annualIncome={profile.annualIncome}
              monthlyDebts={monthlyDebts}
              onCalculate={handleCalculate}
            />
            
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUseValues();
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!currentResult}
              >
                Use These Values
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}