import React, { useRef, useCallback } from 'react';

interface Props {
  value: number;
  label: string;
  color: string;
  monthlyAmount?: number;
  onChange: (value: number) => void;
}

export function AllocationGauge({ value, label, color, monthlyAmount, onChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.min(100, Math.max(0, value)) / 100) * circumference;

  const calculatePercentage = useCallback((e: MouseEvent | TouchEvent): number => {
    if (!svgRef.current) return 0;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const center = {
      x: rect.width / 2,
      y: rect.height / 2
    };
    
    // Get position relative to SVG center
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const mouseX = clientX - rect.left - center.x;
    const mouseY = clientY - rect.top - center.y;
    
    // Calculate angle in radians (-π to π)
    let angle = Math.atan2(mouseY, mouseX);
    
    // Convert to degrees (0 to 360)
    let degrees = ((angle * 180 / Math.PI) + 450) % 360;
    
    // Convert to percentage (0-100)
    return Math.min(100, Math.max(0, Math.round((degrees / 360) * 100)));
  }, []);

  const handleStart = useCallback((e: React.MouseEvent<SVGElement> | React.TouchEvent<SVGElement>) => {
    isDragging.current = true;
    onChange(calculatePercentage(e.nativeEvent));
    
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging.current) {
        e.preventDefault();
        onChange(calculatePercentage(e));
      }
    };

    const handleEnd = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  }, [onChange, calculatePercentage]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(100, Math.max(0, newValue)));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[120px] h-[120px] sm:w-[180px] sm:h-[180px]">
        <svg 
          ref={svgRef}
          className="w-full h-full transform -rotate-90 cursor-pointer touch-none"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-150"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center">
            <input
              type="number"
              value={Math.round(value)}
              onChange={handleInput}
              className="w-16 text-2xl sm:text-3xl font-bold text-center bg-transparent pointer-events-auto"
              min="0"
              max="100"
            />
            <span className="text-lg sm:text-xl">%</span>
          </div>
          {monthlyAmount && (
            <div className="text-sm sm:text-base text-gray-500 mt-1">
              ${monthlyAmount.toLocaleString()}/mo
            </div>
          )}
        </div>
      </div>
      <span className="mt-3 font-medium text-gray-700 text-base sm:text-lg">{label}</span>
    </div>
  );
}