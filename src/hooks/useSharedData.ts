import { useEffect } from 'react';
import type { FinancialProfile, Allocation } from '../types/finance';
import { decodeShareableData } from '../utils/sharing/urlEncoder';

interface UseSharedDataProps {
  onLoadSharedData: (profile: FinancialProfile, allocation: Allocation) => void;
}

export function useSharedData({ onLoadSharedData }: UseSharedDataProps) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('share');

    if (sharedData) {
      const decoded = decodeShareableData(sharedData);
      if (decoded) {
        onLoadSharedData(decoded.profile, decoded.allocation);
        // Clean up URL after loading
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [onLoadSharedData]);
}