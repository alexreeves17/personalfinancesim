import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FinancialSpreadsheet } from '../components/spreadsheet/FinancialSpreadsheet';

export function SpreadsheetPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, monthlyContributions, profile } = location.state || {};

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!results || !monthlyContributions || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card p-8 text-center">
          <p className="text-gray-600 mb-4">
            No simulation data available. Please run a simulation from the main page first.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Main Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Main Page
        </button>
      </div>
      
      <FinancialSpreadsheet 
        results={results}
        monthlyContributions={monthlyContributions}
        profile={profile}
      />
    </div>
  );
}