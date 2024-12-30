import React from 'react';
import { Compass, User as UserIcon } from 'lucide-react';
import { UserMenu } from './auth/UserMenu';
import type { User } from '@supabase/supabase-js';

interface Props {
  user: User | null;
  onAuthClick: () => void;
}

export function Header({ user, onAuthClick }: Props) {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white py-8 px-4 shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Compass className="h-8 w-8" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold font-display">WealthCompass</h1>
              <p className="text-indigo-100 mt-1">Navigate Your Financial Future</p>
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
              className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}