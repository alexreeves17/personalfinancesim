import React from 'react';

interface Props {
  x: number;
  y: number;
  visible: boolean;
  children: React.ReactNode;
}

export function Tooltip({ x, y, visible, children }: Props) {
  if (!visible) return null;

  return (
    <div
      className="absolute pointer-events-none bg-gray-900/90 text-white px-3 py-2 rounded-lg shadow-xl backdrop-blur-sm text-sm"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  );
}