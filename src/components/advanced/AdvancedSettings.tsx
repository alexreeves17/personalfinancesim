import React from 'react';
import type { Milestone } from '../../types/milestones';
import { MilestoneForm } from './MilestoneForm';
import { MilestoneList } from './MilestoneList';

interface Props {
  milestones: Milestone[];
  onAddMilestone: (milestone: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export function AdvancedSettings({ milestones, onAddMilestone, onDeleteMilestone }: Props) {
  return (
    <div className="mt-6" data-advanced-settings>
      <div className="p-6 bg-gray-50 rounded-xl space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Financial Milestones</h3>
          <MilestoneForm onSubmit={onAddMilestone} />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Your Milestones</h3>
          <MilestoneList 
            milestones={milestones} 
            onDelete={onDeleteMilestone} 
          />
        </div>
      </div>
    </div>
  );
}