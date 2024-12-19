import React from 'react';

interface Props {
  value: number;
  label: string;
  color: string;
  onChange: (value: number) => void;
}

export function AllocationGauge({ value, label, color, onChange }: Props) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  
  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
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
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Math.min(100, Math.max(0, parseInt(e.target.value, 10))));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[140px] h-[140px]">
        <svg 
          className="w-full h-full transform -rotate-90 cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseMove}
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
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <input
              type="number"
              value={value}
              onChange={handleInput}
              className="w-16 text-2xl font-bold text-center bg-transparent"
              min="0"
              max="100"
            />
            <span className="text-lg">%</span>
          </div>
        </div>
      </div>
      <span className="mt-2 font-medium text-gray-700">{label}</span>
    </div>
  );
}