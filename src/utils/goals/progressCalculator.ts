import type { Goal, GoalProgress } from '../../types/goals';

export function calculateGoalProgress(
  goals: Goal[],
  monthlyDisposable: number
): Record<string, GoalProgress> {
  const progress: Record<string, GoalProgress> = {};

  goals.forEach(goal => {
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    
    // Calculate total months between start and target date
    const monthsRemaining = Math.max(0,
      (targetDate.getFullYear() - today.getFullYear()) * 12 +
      (targetDate.getMonth() - today.getMonth())
    );

    // Calculate required monthly contribution
    const requiredMonthly = monthsRemaining > 0 ? 
      goal.targetAmount / monthsRemaining : 
      goal.targetAmount;
    
    // Check if we're on track based on available monthly disposable income
    const onTrack = requiredMonthly <= monthlyDisposable;

    // Calculate current amount based on monthly contribution
    const monthlyContribution = Math.min(
      monthlyDisposable,
      requiredMonthly
    );

    // Simulate progress (in a real app this would come from a database)
    const startDate = new Date(targetDate);
    startDate.setMonth(startDate.getMonth() - monthsRemaining);
    const monthsPassed = Math.max(0,
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth())
    );

    const currentAmount = Math.min(
      goal.targetAmount,
      Math.max(0, monthlyContribution * monthsPassed)
    );

    progress[goal.id] = {
      currentAmount,
      percentageComplete: Math.round((currentAmount / goal.targetAmount) * 100),
      monthsRemaining,
      onTrack
    };
  });

  return progress;
}