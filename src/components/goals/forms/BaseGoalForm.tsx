import React, { useState, ReactNode } from 'react';

interface Props {
  defaultName: string;
  calculator?: ReactNode;
  onSubmit: (data: {
    name: string;
    targetAmount: number;
    targetDate: string;
    priority: 'low' | 'medium' | 'high';
  }) => void;
  onCancel: () => void;
}

export function BaseGoalForm({ defaultName, calculator, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState({
    name: defaultName,
    targetAmount: '',
    targetDate: '',
    priority: 'medium' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetAmount: Number(formData.targetAmount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {calculator}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Goal Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Amount
        </label>
        <input
          type="number"
          value={formData.targetAmount}
          onChange={e => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Date
        </label>
        <input
          type="date"
          value={formData.targetDate}
          onChange={e => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <div className="flex gap-4">
          {(['low', 'medium', 'high'] as const).map(priority => (
            <label key={priority} className="flex items-center">
              <input
                type="radio"
                name="priority"
                value={priority}
                checked={formData.priority === priority}
                onChange={() => setFormData(prev => ({ ...prev, priority }))}
                className="mr-2"
              />
              <span className="capitalize">{priority}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Goal
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}