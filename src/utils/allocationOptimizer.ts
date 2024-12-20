import type { FinancialProfile } from '../types/finance';
import { runFinancialSimulation } from './simulationRunner';

interface Allocation {
  investments: number;
  debtPayment: number;
  savings: number;
  discretionary: number;
}

function evaluateAllocation(
  profile: FinancialProfile,
  allocation: Allocation
): number {
  const results = runFinancialSimulation(profile, allocation, []);
  return results[results.length - 1].netWorth;
}

// Particle Swarm Optimization (PSO) for finding optimal allocation
export function findOptimalAllocation(profile: FinancialProfile): Allocation {
  const numParticles = 30;
  const iterations = 50;
  
  // Initialize particles with random allocations
  const particles = Array.from({ length: numParticles }, () => {
    const investments = Math.random() * 70 + 20; // 20-90%
    const debtPayment = Math.random() * (90 - investments); // Up to remaining
    const savings = Math.random() * (90 - investments - debtPayment);
    const discretionary = 100 - investments - debtPayment - savings;
    return {
      position: { investments, debtPayment, savings, discretionary },
      velocity: { investments: 0, debtPayment: 0, savings: 0, discretionary: 0 },
      bestPosition: null as Allocation | null,
      bestScore: -Infinity
    };
  });

  let globalBestPosition: Allocation | null = null;
  let globalBestScore = -Infinity;

  // PSO parameters
  const inertia = 0.7;
  const cognitive = 1.5;
  const social = 1.5;

  for (let i = 0; i < iterations; i++) {
    for (const particle of particles) {
      // Evaluate current position
      const score = evaluateAllocation(profile, particle.position);

      // Update particle's best position
      if (score > particle.bestScore) {
        particle.bestScore = score;
        particle.bestPosition = { ...particle.position };
      }

      // Update global best position
      if (score > globalBestScore) {
        globalBestScore = score;
        globalBestPosition = { ...particle.position };
      }

      // Update velocity and position
      if (particle.bestPosition && globalBestPosition) {
        for (const key of ['investments', 'debtPayment', 'savings', 'discretionary'] as const) {
          // Update velocity
          particle.velocity[key] = 
            inertia * particle.velocity[key] +
            cognitive * Math.random() * (particle.bestPosition[key] - particle.position[key]) +
            social * Math.random() * (globalBestPosition[key] - particle.position[key]);

          // Update position
          particle.position[key] += particle.velocity[key];
        }

        // Normalize to ensure sum is 100%
        const sum = Object.values(particle.position).reduce((a, b) => a + b, 0);
        for (const key of ['investments', 'debtPayment', 'savings', 'discretionary'] as const) {
          particle.position[key] = (particle.position[key] / sum) * 100;
        }
      }
    }
  }

  // Round the final values
  const optimal = globalBestPosition || {
    investments: 60,
    debtPayment: 20,
    savings: 15,
    discretionary: 5
  };

  return {
    investments: Math.round(optimal.investments),
    debtPayment: Math.round(optimal.debtPayment),
    savings: Math.round(optimal.savings),
    discretionary: Math.round(optimal.discretionary)
  };
}