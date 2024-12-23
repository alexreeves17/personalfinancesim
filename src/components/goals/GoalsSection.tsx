import React, { useState } from 'react';
import { GoalSelector } from './GoalSelector';
import { GoalForm } from './GoalForm';
import { GoalList } from './GoalList';
import { CalculatorModal } from '../calculators/CalculatorModal';
import type { Goal, GoalType } from '../../types/goals';
import { calculateGoalProgress } from '../../utils/goals/progressCalculator';

interface Props {
  monthlyDisposable: number;
  onGoalsUpdate: (goals: Goal[]) => void;
  profile: {
    annualIncome: number;
    debt: {
      studentLoans: number;
      creditCards: number;
      otherLoans: number;
    };
  };
}

export function GoalsSection({ monthlyDisposable, onGoalsUpdate, profile }: Props) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedType, setSelectedType] = useState<GoalType | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorResult, setCalculatorResult] = useState<{
    targetAmount: number;
    monthlyPayment: number;
    totalPrice: number;
  } | null>(null);

  const handleGoalSubmit = (data: {
    name: string;
    targetAmount: number;
    targetDate: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    if (!selectedType) return;

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      type: selectedType,
      completed: false,
      monthlyContribution: monthlyDisposable,
      ...data
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    onGoalsUpdate(updatedGoals);
    setSelectedType(null);
    setCalculatorResult(null);
  };

  const handleDelete = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    onGoalsUpdate(updatedGoals);
  };

  const handleTypeSelect = (type: GoalType) => {
    setSelectedType(type);
    if (type === 'house') {
      setShowCalculator(true);
    }
  };

  const progress = calculateGoalProgress(goals, monthlyDisposable);

  return (
    <div className="space-y-8">
      {goals.length === 0 ? (
        <>
          <p className="text-center text-gray-500">
            Add your financial goals to see how they fit into your plan
          </p>
          <GoalSelector onSelect={handleTypeSelect} />
        </>
      ) : (
        <div className="space-y-6">
          <GoalList
            goals={goals}
            progress={progress}
            monthlyDisposable={monthlyDisposable}
            onDelete={handleDelete}
          />
          {!selectedType && (
            <button
              onClick={() => setSelectedType('custom')}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              Add Another Goal
            </button>
          )}
        </div>
      )}

      {selectedType && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">Add New Goal</h3>
          <GoalForm
            type={selectedType}
            calculatorResult={calculatorResult}
            profile={profile}
            onSubmit={handleGoalSubmit}
            onCancel={() => {
              setSelectedType(null);
              setCalculatorResult(null);
            }}
          />
        </div>
      )}

      <CalculatorModal
        type="house"
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onCalculate={(result) => {
          setCalculatorResult(result);
          setShowCalculator(false);
        }}
        profile={profile}
      />
    </div>
  );
}