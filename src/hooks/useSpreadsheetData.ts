import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { initialSpreadsheetData } from '../utils/spreadsheet/initialData';
import type { SpreadsheetData } from '../types/spreadsheet';
import { useAuth } from './useAuth';

export function useSpreadsheetData() {
  const [data, setData] = useState<SpreadsheetData>(initialSpreadsheetData);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setData(initialSpreadsheetData);
        setLoading(false);
        return;
      }

      try {
        const { data: spreadsheetData, error } = await supabase
          .from('spreadsheets')
          .select('data')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (spreadsheetData) {
          setData(spreadsheetData.data as SpreadsheetData);
        }
      } catch (error) {
        console.error('Error loading spreadsheet data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const updateData = useCallback((newData: SpreadsheetData) => {
    setData(newData);
  }, []);

  const saveData = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('spreadsheets')
        .upsert({
          user_id: user.id,
          data
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving spreadsheet data:', error);
    }
  }, [user, data]);

  return { data, updateData, saveData, loading };
}