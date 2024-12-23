export type GoalType = 'house' | 'car' | 'debt' | 'education' | 'retirement' | 'custom';

export interface Goal {
  id: string;
  type: GoalType;
  name: string;
  targetAmount: number;
  targetDate: string;
  monthlyContribution: number;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface GoalProgress {
  currentAmount: number;
  percentageComplete: number;
  monthsRemaining: number;
  onTrack: boolean;
}

export interface GoalFormProps {
  profile: {
    annualIncome: number;
    debt: {
      studentLoans: number;
      creditCards: number;
      otherLoans: number;
    };
  };
  onSubmit: (data: {
    name: string;
    targetAmount: number;
    targetDate: string;
    priority: 'low' | 'medium' | 'high';
  }) => void;
  onCancel: () => void;
}