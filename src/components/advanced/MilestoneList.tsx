import React from 'react';
import type { Milestone } from '../../types/milestones';
import { Trash2 } from 'lucide-react';

interface Props {
  milestones: Milestone[];
  onDelete: (id: string) => void;
}

export function MilestoneList({ milestones, onDelete }: Props) {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No milestones added yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {milestones.map(milestone => (
        <div
          key={milestone.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
        >
          <div>
            <h3 className="font-medium">{milestone.name}</h3>
            <p className="text-sm text-gray-500">
              {new Date(milestone.date).toLocaleDateString()}
              {milestone.impact.annualIncome && 
                ` • New Income: $${milestone.impact.annualIncome.toLocaleString()}`}
              {milestone.impact.oneTimeCost && 
                ` • Cost: $${milestone.impact.oneTimeCost.toLocaleString()}`}
              {milestone.impact.monthlyExpenses && 
                ` • Monthly: $${milestone.impact.monthlyExpenses.toLocaleString()}`}
            </p>
          </div>
          <button
            onClick={() => onDelete(milestone.id)}
            className="p-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}