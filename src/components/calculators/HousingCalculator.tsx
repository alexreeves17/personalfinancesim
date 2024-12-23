import React, { useState, useCallback } from 'react';
import { DollarSign, Percent, Calculator } from 'lucide-react';
import { calculateHousingAffordability } from '../../utils/calculators/housing/index';

interface Props {
  annualIncome: number;
  monthlyDebts: number;
  onCalculate: (result: {
    targetAmount: number;
    monthlyPayment: number;
    totalHomePrice: number;
  }) => void;
}

export function HousingCalculator({ annualIncome, monthlyDebts, onCalculate }: Props) {
  const [downPayment, setDownPayment] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(7.5);

  const calculateResults = useCallback(() => {
    if (annualIncome <= 0) return null;

    return calculateHousingAffordability({
      annualIncome,
      monthlyDebts,
      downPaymentPercent: downPayment,
      mortgageRate
    });
  }, [annualIncome, monthlyDebts, downPayment, mortgageRate]);

  const results = calculateResults();

  // Only notify parent when user explicitly updates values
  const handleInputChange = (type: 'downPayment' | 'mortgageRate', value: number) => {
    const newValue = type === 'downPayment' 
      ? Math.max(3, Math.min(100, value))
      : Math.max(0, Math.min(20, value));

    if (type === 'downPayment') {
      setDownPayment(newValue);
    } else {
      setMortgageRate(newValue);
    }

    const newResults = calculateHousingAffordability({
      annualIncome,
      monthlyDebts,
      downPaymentPercent: type === 'downPayment' ? newValue : downPayment,
      mortgageRate: type === 'mortgageRate' ? newValue : mortgageRate
    });

    onCalculate({
      targetAmount: newResults.downPayment,
      monthlyPayment: newResults.monthlyPayment,
      totalHomePrice: newResults.recommendedPrice
    });
  };

  if (!results) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Down Payment Percentage
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="3"
              max="100"
              step="1"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Minimum 3% required</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mortgage Interest Rate
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={mortgageRate}
              onChange={(e) => handleInputChange('mortgageRate', Number(e.target.value))}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              max="20"
              step="0.1"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Current average rate: 7.5%</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calculator className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Your Home Buying Power</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Recommended Home Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ${results.recommendedPrice.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Required Down Payment</p>
            <p className="text-2xl font-bold text-gray-900">
              ${results.downPayment.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-t border-blue-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Monthly Payment Breakdown</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Mortgage</p>
              <p className="text-lg font-semibold">${results.breakdown.mortgage.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Property Tax</p>
              <p className="text-lg font-semibold">${results.breakdown.tax.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Insurance</p>
              <p className="text-lg font-semibold">${results.breakdown.insurance.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-100">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Total Monthly Payment</p>
              <p className="text-xl font-bold text-gray-900">
                ${results.monthlyPayment.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            Based on your income of ${annualIncome.toLocaleString()}/year and monthly debts of ${monthlyDebts.toLocaleString()}, 
            this is your recommended maximum home price. Consider additional costs like maintenance, utilities, and moving expenses.
          </p>
        </div>
      </div>
    </div>
  );
}