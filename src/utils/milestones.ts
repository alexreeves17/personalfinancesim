import type { Milestone, SimulationResult } from '../types';

export function applyMilestonesToSimulation(
  baseResults: SimulationResult[],
  milestones: Milestone[]
): SimulationResult[] {
  if (milestones.length === 0) return baseResults;

  return baseResults.map(result => {
    const yearMilestones = milestones.filter(
      m => new Date(m.date).getFullYear() === result.year
    );

    if (yearMilestones.length === 0) return result;

    let modifiedResult = { ...result };

    yearMilestones.forEach(milestone => {
      if (milestone.impact.oneTimeCost) {
        modifiedResult.savings -= milestone.impact.oneTimeCost;
        modifiedResult.netWorth -= milestone.impact.oneTimeCost;
      }

      if (milestone.impact.monthlyExpenses) {
        const annualExpenseChange = milestone.impact.monthlyExpenses * 12;
        modifiedResult.savings -= annualExpenseChange;
        modifiedResult.netWorth -= annualExpenseChange;
      }
    });

    return modifiedResult;
  });
}