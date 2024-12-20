import React, { useState, useRef, useEffect } from 'react';
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
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const graphRef = useRef<HTMLDivElement>(null);
  
  const maxValue = Math.max(...results.map(r => Math.max(r.investments, r.savings, r.netWorth)));
  const padding = { top: 40, right: 40, bottom: 60, left: 80 };

  useEffect(() => {
    const updateDimensions = () => {
      if (graphRef.current) {
        const { width } = graphRef.current.getBoundingClientRect();
        setDimensions({
          width,
          height: Math.min(600, Math.max(400, width * 0.6))
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (graphRef.current) {
      observer.observe(graphRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getY = (value: number) => {
    const availableHeight = dimensions.height - padding.top - padding.bottom;
    return dimensions.height - ((value / maxValue) * availableHeight) - padding.bottom;
  };

  const getX = (index: number) => {
    const availableWidth = dimensions.width - padding.left - padding.right;
    return padding.left + (index / (results.length - 1)) * availableWidth;
  };

  const createPath = (values: number[]) => {
    return values.map((value, i) => 
      `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(value)}`
    ).join(' ');
  };

  const handleMouseMove = (event: React.MouseEvent<SVGElement>, index: number) => {
    if (!graphRef.current) return;

    const rect = graphRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setTooltip({
      x,
      y,
      data: {
        year: results[index].year,
        savings: results[index].savings,
        investments: results[index].investments,
        netWorth: results[index].netWorth
      }
    });
  };

  return (
    <div ref={graphRef} className="glass-card p-6 w-full min-h-[500px]">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Growth Projection</h2>
      <svg 
        width={dimensions.width} 
        height={dimensions.height}
        className="w-full h-auto"
        onMouseLeave={() => setTooltip(null)}
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
            x1={padding.left}
            y1={getY(maxValue * (i + 1) / 5)}
            x2={dimensions.width - padding.right}
            y2={getY(maxValue * (i + 1) / 5)}
            stroke="#e5e7eb"
            strokeDasharray="4"
          />
        ))}

        {/* Axes */}
        <line 
          x1={padding.left} 
          y1={padding.top} 
          x2={padding.left} 
          y2={dimensions.height - padding.bottom} 
          stroke="#94a3b8" 
          strokeWidth="2" 
        />
        <line 
          x1={padding.left} 
          y1={dimensions.height - padding.bottom} 
          x2={dimensions.width - padding.right} 
          y2={dimensions.height - padding.bottom} 
          stroke="#94a3b8" 
          strokeWidth="2" 
        />

        {/* Area under net worth line */}
        <path
          d={`${createPath(results.map(r => r.netWorth))} 
              L ${getX(results.length - 1)} ${dimensions.height - padding.bottom} 
              L ${padding.left} ${dimensions.height - padding.bottom} Z`}
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
            <circle
              cx={getX(i)}
              cy={getY(result.netWorth)}
              r="12"
              fill="transparent"
              onMouseMove={(e) => handleMouseMove(e, i)}
              className="cursor-pointer"
            />
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
              x={padding.left - 10}
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
            y={dimensions.height - padding.bottom + 20}
            textAnchor="middle"
            className="text-sm text-gray-600"
          >
            {result.year}
          </text>
        ))}

        {/* Legend */}
        <g transform={`translate(${padding.left}, ${padding.top/2})`} className="text-sm">
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

      {tooltip && (
        <Tooltip
          x={tooltip.x}
          y={tooltip.y}
          visible={true}
        >
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
        </Tooltip>
      )}
    </div>
  );
}