import React from 'react';

interface Props {
  value: number;
  label: string;
  color: string;
  monthlyAmount?: number;
  onChange: (value: number) => void;
}

export function AllocationGauge({ value, label, color, monthlyAmount, onChange }: Props) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  
  const handleMouseDown = (e: React.MouseEvent<SVGElement>) => {
    const updateValue = (moveEvent: MouseEvent) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const center = { x: rect.width / 2, y: rect.height / 2 };
      const mousePos = { 
        x: moveEvent.clientX - rect.left, 
        y: moveEvent.clientY - rect.top 
      };
      
      const angle = Math.atan2(mousePos.y - center.y, mousePos.x - center.x);
      let degrees = (angle * 180 / Math.PI + 90) % 360;
      if (degrees < 0) degrees += 360;
      
      const percentage = Math.round((degrees / 360) * 100);
      onChange(percentage);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', updateValue);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', updateValue);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Math.min(100, Math.max(0, parseInt(e.target.value, 10))));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[140px] h-[140px]">
        <svg 
          className="w-full h-full transform -rotate-90 cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
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