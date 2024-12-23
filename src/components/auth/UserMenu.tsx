import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  email: string;
  onSignOut: () => void;
}

export function UserMenu({ email, onSignOut }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/10 py-2 px-4 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors"
      >
        <User className="w-5 h-5 text-blue-200" />
        <span className="font-medium truncate max-w-[150px]">{email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}