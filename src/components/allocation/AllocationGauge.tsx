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

  const calculatePercentage = useCallback((e: MouseEvent): number => {
    if (!svgRef.current) return 0;
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const center = {
      x: rect.width / 2,
      y: rect.height / 2
    };
    
    // Get mouse position relative to SVG center
    const mouseX = e.clientX - rect.left - center.x;
    const mouseY = e.clientY - rect.top - center.y;
    
    // Calculate angle in radians (-π to π)
    let angle = Math.atan2(mouseY, mouseX);
    
    // Convert to degrees (0 to 360)
    let degrees = ((angle * 180 / Math.PI) + 450) % 360;
    
    // Convert to percentage (0-100)
    return Math.min(100, Math.max(0, Math.round((degrees / 360) * 100)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGElement>) => {
    isDragging.current = true;
    onChange(calculatePercentage(e.nativeEvent));
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        onChange(calculatePercentage(e));
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onChange, calculatePercentage]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(100, Math.max(0, newValue)));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[140px] h-[140px]">
        <svg 
          ref={svgRef}
          className="w-full h-full transform -rotate-90 cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-all duration-150"
          />
          {/* Invisible larger circle for better hover/drag area */}
          <circle
            cx="70"
            cy="70"
            r={radius + 10}
            fill="transparent"
            className="cursor-pointer"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center">
            <input
              type="number"
              value={Math.round(value)}
              onChange={handleInput}
              className="w-16 text-2xl font-bold text-center bg-transparent pointer-events-auto"
              min="0"
              max="100"
            />
            <span className="text-lg">%</span>
          </div>
          {monthlyAmount && (
            <div className="text-sm text-gray-500 mt-1">
              ${monthlyAmount.toLocaleString()}/mo
            </div>
          )}
        </div>
      </div>
      <span className="mt-2 font-medium text-gray-700">{label}</span>
    </div>
  );
}