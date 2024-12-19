import React, { useState } from 'react';
import type { SimulationResult } from '../types/finance';
import { Tooltip } from './Tooltip';

interface Props {
  results: SimulationResult[];
}

interface TooltipData {
  x: number;
  y: number;
  data: {
    year: number;
    savings: number;
    investments: number;
    netWorth: number;
  };
}

export function ProjectionGraph({ results }: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  
  const maxValue = Math.max(...results.map(r => Math.max(r.investments, r.savings, r.netWorth)));
  const height = 400;
  const width = 800;
  const padding = 60;

  const getY = (value: number) => {
    return height - (value / maxValue) * (height - padding * 2) - padding;
  };

  const getX = (index: number) => {
    return (index / (results.length - 1)) * (width - padding * 2) + padding;
  };

  const createPath = (values: number[]) => {
    return values.map((value, i) => 
      `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(value)}`
    ).join(' ');
  };

  const handleMouseMove = (event: React.MouseEvent<SVGElement>, index: number) => {
    const svgRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;
    
    setTooltip({
      x: x + 20, // Offset to not cover the point
      y: y - 100, // Position above the cursor
      data: {
        year: results[index].year,
        savings: results[index].savings,
        investments: results[index].investments,
        netWorth: results[index].netWorth
      }
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="glass-card p-6 rounded-xl relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Growth Projection</h2>
      <svg 
        width={width} 
        height={height} 
        className="w-full h-auto"
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`grid-${i}`}
            x1={padding}
            y1={getY(maxValue * (i + 1) / 5)}
            x2={width - padding}
            y2={getY(maxValue * (i + 1) / 5)}
            stroke="#e5e7eb"
            strokeDasharray="4"
          />
        ))}

        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height-padding} 
          stroke="#94a3b8" strokeWidth="2" />
        <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} 
          stroke="#94a3b8" strokeWidth="2" />

        {/* Area under net worth line */}
        <path
          d={`${createPath(results.map(r => r.netWorth))} L ${getX(results.length - 1)} ${height-padding} L ${padding} ${height-padding} Z`}
          fill="url(#netWorthGradient)"
        />
        
        {/* Lines */}
        <path
          d={createPath(results.map(r => r.netWorth))}
          className="graph-line"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
        />
        <path
          d={createPath(results.map(r => r.investments))}
          className="graph-line"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
        />
        <path
          d={createPath(results.map(r => r.savings))}
          className="graph-line"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
        />

        {/* Interactive areas */}
        {results.map((result, i) => (
          <g key={`points-${i}`}>
            {/* Invisible larger circle for better hover */}
            <circle
              cx={getX(i)}
              cy={getY(result.netWorth)}
              r="12"
              fill="transparent"
              onMouseMove={(e) => handleMouseMove(e, i)}
              className="cursor-pointer"
            />
            {/* Visible data points */}
            <circle cx={getX(i)} cy={getY(result.netWorth)} r="4" fill="#3b82f6" />
            <circle cx={getX(i)} cy={getY(result.investments)} r="4" fill="#10b981" />
            <circle cx={getX(i)} cy={getY(result.savings)} r="4" fill="#f59e0b" />
          </g>
        ))}

        {/* Labels and ticks */}
        {Array.from({ length: 5 }).map((_, i) => {
          const value = maxValue * (i + 1) / 5;
          return (
            <text
              key={`label-${i}`}
              x={padding - 10}
              y={getY(value)}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-sm text-gray-600"
            >
              ${Math.round(value).toLocaleString()}
            </text>
          );
        })}
        
        {results.map((result, i) => (
          <text
            key={`year-${i}`}
            x={getX(i)}
            y={height - padding + 20}
            textAnchor="middle"
            className="text-sm text-gray-600"
          >
            {result.year}
          </text>
        ))}

        {/* Legend */}
        <g transform={`translate(${padding}, ${padding/2})`} className="text-sm">
          {[
            { label: "Net Worth", color: "#3b82f6" },
            { label: "Investments", color: "#10b981" },
            { label: "Savings", color: "#f59e0b" }
          ].map((item, i) => (
            <g key={item.label} transform={`translate(${i * 120}, 0)`}>
              <circle cx="0" cy="0" r="4" fill={item.color} />
              <text x="10" y="4" className="text-gray-700">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>

      <Tooltip
        x={tooltip?.x ?? 0}
        y={tooltip?.y ?? 0}
        visible={tooltip !== null}
      >
        {tooltip && (
          <div className="space-y-1">
            <div className="font-medium">{tooltip.data.year}</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-blue-200">Net Worth:</span>
              <span>${tooltip.data.netWorth.toLocaleString()}</span>
              <span className="text-emerald-200">Investments:</span>
              <span>${tooltip.data.investments.toLocaleString()}</span>
              <span className="text-amber-200">Savings:</span>
              <span>${tooltip.data.savings.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Tooltip>
    </div>
  );
}