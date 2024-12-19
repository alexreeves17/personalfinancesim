import { useCallback } from 'react';

export function useGaugeInteraction(onChange: (value: number) => void) {
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGElement>) => {
    if (e.buttons !== 1) return; // Only process when mouse button is pressed
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const center = { x: rect.width / 2, y: rect.height / 2 };
    const mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    // Calculate angle from center to mouse position
    const angle = Math.atan2(mousePos.y - center.y, mousePos.x - center.x);
    // Convert to degrees and adjust for starting position
    let degrees = (angle * 180 / Math.PI + 90) % 360;
    if (degrees < 0) degrees += 360;
    
    // Convert to percentage (0-100)
    const percentage = Math.round((degrees / 360) * 100);
    onChange(percentage);
  }, [onChange]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Math.min(100, Math.max(0, parseInt(e.target.value, 10))));
  }, [onChange]);

  return {
    handleMouseMove,
    handleInput
  };
}