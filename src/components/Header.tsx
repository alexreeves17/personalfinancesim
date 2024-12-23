import React from 'react';
import { LineChart, Wallet, User as UserIcon } from 'lucide-react';
import { UserMenu } from './auth/UserMenu';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User | null;
  onAuthClick: () => void;
}

export function Header({ user, onAuthClick }: Props) {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-6 sm:py-8 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <LineChart className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold">Personal Finance Simulator</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">Plan your financial future with confidence</p>
            </div>
          </div>
          
          {user ? (
            <UserMenu 
              email={user.email || ''} 
              onSignOut={() => window.location.reload()} 
            />
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center space-x-2 bg-white/10 py-2 px-4 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <UserIcon className="h-5 w-5 text-blue-200" />
              <span className="font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}