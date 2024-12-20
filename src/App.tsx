import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FinancialProfileForm } from './components/FinancialProfileForm';
import { SimulationResults } from './components/SimulationResults';
import { AdvancedSettings } from './components/advanced/AdvancedSettings';
import { AllocationControls } from './components/AllocationControls';
import { ShareButton } from './components/ShareButton';
import { useSharedData } from './hooks/useSharedData';
import type { FinancialProfile, SimulationResult, Milestone } from './types/finance';
import { runFinancialSimulation } from './utils/simulationRunner';
import { initialProfile } from './config/initialData';

export default function App() {
  const [profile, setProfile] = useState<FinancialProfile>(initialProfile);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [allocation, setAllocation] = useState({
    investments: 50,
    debtPayment: 20,
    savings: 20,
    discretionary: 10
  });

  const handleLoadSharedData = useCallback((sharedProfile: FinancialProfile, sharedAllocation: typeof allocation) => {
    setProfile(sharedProfile);
    setAllocation(sharedAllocation);
    const results = runFinancialSimulation(sharedProfile, sharedAllocation, []);
    setResults(results);
  }, []);

  useSharedData({ onLoadSharedData: handleLoadSharedData });

  const handleRunSimulation = () => {
    const results = runFinancialSimulation(profile, allocation, milestones);
    setResults(results);
  };

  const monthlySavings = (profile.annualIncome / 12) - profile.monthlyExpenses;
  const monthlyContributions = {
    investments: monthlySavings * (allocation.investments / 100),
    debtPayment: monthlySavings * (allocation.debtPayment / 100),
    savings: monthlySavings * (allocation.savings / 100)
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <FinancialProfileForm profile={profile} onUpdate={setProfile} />
        
        <AllocationControls
          allocation={allocation}
          annualIncome={profile.annualIncome}
          monthlyExpenses={profile.monthlyExpenses}
          state={profile.state}
          onChange={setAllocation}
          profile={profile}
        />
        
        <AdvancedSettings
          milestones={milestones}
          onAddMilestone={(milestone) => setMilestones(prev => [...prev, milestone])}
          onDeleteMilestone={(id) => setMilestones(prev => prev.filter(m => m.id !== id))}
        />

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={handleRunSimulation}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Run Simulation
          </button>

          {results.length > 0 && (
            <ShareButton profile={profile} allocation={allocation} />
          )}
        </div>

        {results.length > 0 && (
          <SimulationResults 
            results={results} 
            monthlyContributions={monthlyContributions}
          />
        )}
      </main>
    </div>
  );
}