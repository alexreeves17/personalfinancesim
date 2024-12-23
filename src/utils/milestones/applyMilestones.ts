import type { SimulationResult, Milestone } from '../../types/finance';

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
      switch (milestone.type) {
        case 'promotion':
          if (milestone.impact.annualIncome) {
            // Increase in income affects savings potential
            const monthlyIncrease = (milestone.impact.annualIncome / 12);
            modifiedResult.savings += monthlyIncrease * 6; // Assuming milestone occurs mid-year
          }
          break;

        case 'expense':
          if (milestone.impact.oneTimeCost) {
            modifiedResult.savings = Math.max(0, modifiedResult.savings - milestone.impact.oneTimeCost);
            modifiedResult.netWorth = modifiedResult.investments + modifiedResult.savings - modifiedResult.debtRemaining;
          }
          break;

        case 'savings':
          if (milestone.impact.monthlyExpenses) {
            const annualSavingsChange = milestone.impact.monthlyExpenses * 12;
            modifiedResult.savings = Math.max(0, modifiedResult.savings - annualSavingsChange);
            modifiedResult.netWorth = modifiedResult.investments + modifiedResult.savings - modifiedResult.debtRemaining;
          }
          break;
      }
    });

    return modifiedResult;
  });
}