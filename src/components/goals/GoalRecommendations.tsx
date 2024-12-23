import React from 'react';
import { Goal, GoalProgress } from '../../types/goals';
import { Calculator, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  goal: Goal;
  progress: GoalProgress;
  monthlyDisposable: number;
}

export function GoalRecommendations({ goal, progress, monthlyDisposable }: Props) {
  const getRecommendedSteps = () => {
    const requiredMonthly = goal.targetAmount / progress.monthsRemaining;
    const currentSavingsRate = monthlyDisposable;
    
    const steps = [];
    
    // Add goal-specific recommendations
    switch (goal.type) {
      case 'house':
        steps.push(
          'Research mortgage pre-qualification requirements',
          'Check your credit score and work on improvements',
          'Save for additional costs (closing, moving, furniture)',
          'Research first-time homebuyer programs'
        );
        break;
      case 'car':
        steps.push(
          'Research vehicle insurance costs',
          'Compare financing options',
          'Consider maintenance and fuel costs',
          'Look into certified pre-owned options'
        );
        break;
      case 'debt':
        steps.push(
          'List all debts with interest rates',
          'Consider debt consolidation',
          'Look into balance transfer options',
          'Set up automatic payments'
        );
        break;
      case 'education':
        steps.push(
          'Research education program costs',
          'Look into scholarship opportunities',
          'Consider tax advantages of education savings',
          'Explore employer tuition reimbursement'
        );
        break;
    }

    return steps;
  };

  const getFinancialAdjustments = () => {
    const requiredMonthly = goal.targetAmount / progress.monthsRemaining;
    const deficit = requiredMonthly - monthlyDisposable;
    
    if (deficit > 0) {
      return [
        `Increase monthly savings by $${Math.round(deficit).toLocaleString()}`,
        'Look for additional income sources',
        'Review and reduce monthly expenses',
        'Consider adjusting target date'
      ];
    }
    
    return [
      'Current savings rate is on track',
      'Consider increasing emergency fund',
      'Look into investment options for excess funds',
      'Review insurance coverage'
    ];
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium">Financial Overview</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Required Monthly:</p>
              <p className="font-medium">${Math.round(goal.targetAmount / progress.monthsRemaining).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Current Monthly Available:</p>
              <p className="font-medium">${Math.round(monthlyDisposable).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Time Remaining:</p>
              <p className="font-medium">{progress.monthsRemaining} months</p>
            </div>
            <div>
              <p className="text-gray-600">Progress:</p>
              <p className="font-medium">{progress.percentageComplete}%</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-medium">Recommended Steps</h4>
          </div>
          <ul className="space-y-2 text-sm">
            {getRecommendedSteps().map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h4 className="font-medium">Financial Adjustments</h4>
          </div>
          <ul className="space-y-2 text-sm">
            {getFinancialAdjustments().map((adjustment, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-amber-600">•</span>
                <span>{adjustment}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}