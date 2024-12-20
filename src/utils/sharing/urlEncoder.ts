import type { FinancialProfile, Allocation } from '../../types/finance';

interface ShareableData {
  profile: FinancialProfile;
  allocation: Allocation;
}

export function encodeShareableData(data: ShareableData): string {
  const compressed = JSON.stringify(data);
  return btoa(encodeURIComponent(compressed));
}

export function decodeShareableData(encoded: string): ShareableData | null {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode shared data:', error);
    return null;
  }
}