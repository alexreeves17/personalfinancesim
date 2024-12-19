import React, { useState } from 'react';
import { Header } from './components/Header';
import { FinancialProfileForm } from './components/FinancialProfileForm';
import { SimulationResults } from './components/SimulationResults';
import { AdvancedSettings } from './components/advanced/AdvancedSettings';
import { AllocationControls } from './components/AllocationControls';
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

  const handleRunSimulation = () => {
    const results = runFinancialSimulation(profile, allocation, milestones);
    setResults(results);
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
        />
        
        <AdvancedSettings
          milestones={milestones}
          onAddMilestone={(milestone) => setMilestones(prev => [...prev, milestone])}
          onDeleteMilestone={(id) => setMilestones(prev => prev.filter(m => m.id !== id))}
        />

        <button
          onClick={handleRunSimulation}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Run Simulation
        </button>

        {results.length > 0 && <SimulationResults results={results} />}
      </main>
    </div>
  );
}