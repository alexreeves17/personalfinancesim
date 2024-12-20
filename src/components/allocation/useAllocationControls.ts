import { useCallback } from 'react';
import type { Allocation } from '../../types/finance';

export function useAllocationControls(allocation: Allocation, onChange: (allocation: Allocation) => void) {
  const handleChange = useCallback((key: keyof Allocation, value: number) => {
    // Ensure value is between 0-100
    value = Math.min(100, Math.max(0, value));
    
    // Calculate total without current key
    const otherTotal = Object.entries(allocation)
      .reduce((sum, [k, v]) => sum + (k === key ? 0 : v), 0);
    
    // If new total would exceed 100%, scale down other values proportionally
    if (otherTotal + value > 100) {
      const remaining = 100 - value;
      const scale = remaining / otherTotal;
      
      const newAllocation = Object.entries(allocation).reduce((acc, [k, v]) => ({
        ...acc,
        [k]: k === key ? value : Math.round(v * scale)
      }), {} as Allocation);

      onChange(newAllocation);
    } else {
      onChange({
        ...allocation,
        [key]: value
      });
    }
  }, [allocation, onChange]);

  return { handleChange };
}