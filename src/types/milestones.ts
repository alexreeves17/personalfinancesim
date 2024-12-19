export type MilestoneType = 'promotion' | 'expense' | 'savings';

export interface Milestone {
  id: string;
  type: MilestoneType;
  name: string;
  date: Date;
  impact: {
    annualIncome?: number;
    monthlyExpenses?: number;
    oneTimeCost?: number;
  };
}

export interface MilestoneFormData {
  type: MilestoneType;
  name: string;
  date: string;
  annualIncome?: number;
  monthlyExpenses?: number;
  oneTimeCost?: number;
}