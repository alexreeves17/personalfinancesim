import React from 'react';
import type { MilestoneFormData, MilestoneType } from '../../types/milestones';
import { PlusCircle } from 'lucide-react';

interface Props {
  onSubmit: (data: MilestoneFormData) => void;
}

export function MilestoneForm({ onSubmit }: Props) {
  const [formData, setFormData] = React.useState<MilestoneFormData>({
    type: 'promotion',
    name: '',
    date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ type: 'promotion', name: '', date: '' });
  };

  const handleTypeChange = (type: MilestoneType) => {
    setFormData(prev => ({ ...prev, type }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {(['promotion', 'expense', 'savings'] as MilestoneType[]).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => handleTypeChange(type)}
            className={`px-4 py-2 rounded-lg capitalize ${
              formData.type === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {formData.type === 'promotion' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              New Annual Income
            </label>
            <input
              type="number"
              value={formData.annualIncome || ''}
              onChange={e => setFormData(prev => ({ ...prev, annualIncome: +e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {formData.type === 'expense' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              One-time Cost
            </label>
            <input
              type="number"
              value={formData.oneTimeCost || ''}
              onChange={e => setFormData(prev => ({ ...prev, oneTimeCost: +e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {formData.type === 'savings' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Monthly Savings Goal
            </label>
            <input
              type="number"
              value={formData.monthlyExpenses || ''}
              onChange={e => setFormData(prev => ({ ...prev, monthlyExpenses: +e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add Milestone
      </button>
    </form>
  );
}