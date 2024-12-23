import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { FinancialProfile, Allocation } from '../types/finance';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const saveProfile = async (profile: FinancialProfile, allocation: Allocation) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        financial_profile: profile as Json,
        allocation: allocation as Json,
      });

    if (error) throw error;
  };

  const loadProfile = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('financial_profile, allocation')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    
    return data ? {
      financial_profile: data.financial_profile as FinancialProfile,
      allocation: data.allocation as Allocation
    } : null;
  };

  return {
    user,
    loading,
    saveProfile,
    loadProfile,
  };
}