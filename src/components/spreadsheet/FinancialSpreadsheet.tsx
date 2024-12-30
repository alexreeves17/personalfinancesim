import React, { useState, useCallback } from 'react';
import { useSimulationSpreadsheet } from '../../hooks/useSimulationSpreadsheet';
import { SpreadsheetSection } from './SpreadsheetSection';
import { ProjectionChart } from './ProjectionChart';
import { MonthlyBreakdown } from './MonthlyBreakdown';
import type { SimulationResult, FinancialProfile } from '../../types/finance';

interface Props {
  results: SimulationResult[];
  monthlyContributions: {
    investments: number;
    debtPayment: number;
    savings: number;
  };
  profile: FinancialProfile;
}

export function FinancialSpreadsheet({ results, monthlyContributions, profile }: Props) {
  const [activeSection, setActiveSection] = useState('investments');
  const [currentProfile, setCurrentProfile] = useState(profile);
  const spreadsheetData = useSimulationSpreadsheet(results, monthlyContributions);
  const years = results.map(r => r.year);

  const handleProfileUpdate = useCallback((updatedProfile: FinancialProfile) => {
    setCurrentProfile(updatedProfile);
    // Here you could trigger a re-simulation if needed
  }, []);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">5-Year Financial Projection Model</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.keys(spreadsheetData).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
                    activeSection === section
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            <SpreadsheetSection
              data={spreadsheetData[activeSection]}
              years={years}
            />
          </div>

          <div>
            <ProjectionChart
              data={spreadsheetData[activeSection]}
              type={activeSection}
            />
          </div>
        </div>
      </div>

      <MonthlyBreakdown
        results={results}
        monthlyContributions={monthlyContributions}
        profile={currentProfile}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}