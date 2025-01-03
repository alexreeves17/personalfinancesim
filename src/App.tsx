import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { FinancialProfileForm } from './components/FinancialProfileForm';
import { SimulationResults } from './components/SimulationResults';
import { AllocationControls } from './components/AllocationControls';
import { GoalsSection } from './components/goals/GoalsSection';
import { AuthModal } from './components/auth/AuthModal';
import { SpreadsheetPage } from './pages/SpreadsheetPage';
import { useAuth } from './hooks/useAuth';
import type { FinancialProfile, SimulationResult } from './types/finance';
import { runFinancialSimulation } from './utils/simulationRunner';
import { initialProfile } from './config/initialData';

const initialAllocation = {
  investments: 50,
  debtPayment: 20,
  savings: 20,
  discretionary: 10
};

function MainPage() {
  const { user, loading, saveProfile, loadProfile } = useAuth();
  const [profile, setProfile] = useState<FinancialProfile>(initialProfile);
  const [allocation, setAllocation] = useState(initialAllocation);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [shouldSaveOnAuth, setShouldSaveOnAuth] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile().then(data => {
        if (data) {
          setProfile(data.financial_profile);
          setAllocation(data.allocation);
        }
      }).catch(console.error);
    }
  }, [user, loadProfile]);

  const handleRunSimulation = useCallback(() => {
    const newResults = runFinancialSimulation(profile, allocation, []);
    setResults(newResults);
  }, [profile, allocation]);

  useEffect(() => {
    if (user && results.length > 0) {
      saveProfile(profile, allocation).catch(console.error);
    }
  }, [user, results, profile, allocation, saveProfile]);

  const handleAuthClick = useCallback(() => {
    setShowAuthModal(true);
    setShouldSaveOnAuth(true);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    if (shouldSaveOnAuth) {
      saveProfile(profile, allocation).catch(console.error);
    }
  }, [shouldSaveOnAuth, profile, allocation, saveProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const monthlyDisposable = profile.annualIncome / 12 - profile.monthlyExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50">
      <Header user={user} onAuthClick={handleAuthClick} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <FinancialProfileForm 
          profile={profile} 
          onUpdate={setProfile}
          onSimulate={handleRunSimulation}
        />
        
        <AllocationControls
          allocation={allocation}
          annualIncome={profile.annualIncome}
          monthlyExpenses={profile.monthlyExpenses}
          state={profile.state}
          onChange={setAllocation}
          onSimulate={handleRunSimulation}
          profile={profile}
        />

        {results.length > 0 && (
          <SimulationResults 
            results={results}
            monthlyContributions={{
              investments: monthlyDisposable * (allocation.investments / 100),
              debtPayment: monthlyDisposable * (allocation.debtPayment / 100),
              savings: monthlyDisposable * (allocation.savings / 100)
            }}
            profile={profile}
          />
        )}

        <GoalsSection
          monthlyDisposable={monthlyDisposable * (allocation.savings + allocation.investments) / 100}
          profile={{
            annualIncome: profile.annualIncome,
            debt: profile.debt
          }}
          onGoalsUpdate={handleRunSimulation}
        />
      </main>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setShouldSaveOnAuth(false);
        }}
        onSuccess={handleAuthSuccess}
        profile={profile}
        allocation={allocation}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/spreadsheet" element={<SpreadsheetPage />} />
      </Routes>
    </BrowserRouter>
  );
}