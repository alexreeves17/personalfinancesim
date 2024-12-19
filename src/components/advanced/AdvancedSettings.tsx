import React from 'react';
import type { Milestone } from '../../types/milestones';
import { MilestoneForm } from './MilestoneForm';
import { MilestoneList } from './MilestoneList';
import { Settings } from 'lucide-react';

interface Props {
  milestones: Milestone[];
  onAddMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export function AdvancedSettings({ milestones, onAddMilestone, onDeleteMilestone }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (formData: any) => {
    onAddMilestone({
      id: crypto.randomUUID(),
      type: formData.type,
      name: formData.name,
      date: new Date(formData.date),
      impact: {
        annualIncome: formData.annualIncome,
        monthlyExpenses: formData.monthlyExpenses,
        oneTimeCost: formData.oneTimeCost,
      },
    });
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Settings className="w-4 h-4 mr-2" />
        Advanced Settings
      </button>

      {isOpen && (
        <div className="mt-4 p-6 bg-gray-50 rounded-xl space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Financial Milestones</h3>
            <MilestoneForm onSubmit={handleSubmit} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Your Milestones</h3>
            <MilestoneList 
              milestones={milestones} 
              onDelete={onDeleteMilestone} 
            />
          </div>
        </div>
      )}
    </div>
  );
}