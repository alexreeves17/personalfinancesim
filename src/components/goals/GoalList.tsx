import React, { useState } from 'react';
import { Home, Car, GraduationCap, Wallet, Target, CheckCircle2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { Goal, GoalProgress } from '../../types/goals';
import { GoalRecommendations } from './GoalRecommendations';

interface Props {
  goals: Goal[];
  progress: Record<string, GoalProgress>;
  monthlyDisposable: number;
  onDelete: (id: string) => void;
}

export function GoalList({ goals, progress, monthlyDisposable, onDelete }: Props) {
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const getIcon = (type: Goal['type']) => {
    switch (type) {
      case 'house': return Home;
      case 'car': return Car;
      case 'education': return GraduationCap;
      case 'debt': return Wallet;
      default: return Target;
    }
  };

  return (
    <div className="space-y-4">
      {goals.map(goal => {
        const Icon = getIcon(goal.type);
        const goalProgress = progress[goal.id];
        const isExpanded = expandedGoal === goal.id;

        return (
          <div
            key={goal.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{goal.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>${goal.targetAmount.toLocaleString()}</span>
                    <span>•</span>
                    <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {goalProgress?.onTrack ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="text-sm font-medium">
                      {goalProgress?.percentageComplete}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    ${goalProgress?.currentAmount.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100">
                <GoalRecommendations
                  goal={goal}
                  progress={goalProgress}
                  monthlyDisposable={monthlyDisposable}
                />
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => onDelete(goal.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete Goal
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}