import React from 'react';

interface Props {
  x: number;
  y: number;
  visible: boolean;
  children: React.ReactNode;
}

export function Tooltip({ x, y, visible, children }: Props) {
  if (!visible) return null;

  // Calculate position to keep tooltip within viewport
  const tooltipOffset = { x: 20, y: -120 }; // Offset from cursor
  const position = {
    left: `${x + tooltipOffset.x}px`,
    top: `${y + tooltipOffset.y}px`
  };

  return (
    <div
      className="absolute pointer-events-none bg-gray-900/90 text-white px-3 py-2 rounded-lg shadow-xl backdrop-blur-sm text-sm z-50"
      style={position}
    >
      {children}
    </div>
  );
}