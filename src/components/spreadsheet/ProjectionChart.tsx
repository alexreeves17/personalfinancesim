import React from 'react';
import type { SpreadsheetData } from '../../types/spreadsheet';

interface Props {
  data: SpreadsheetData;
  type: string;
}

export function ProjectionChart({ data, type }: Props) {
  const chartData = data[type];
  if (!chartData) return null;

  const maxValue = Math.max(
    ...Object.values(chartData).flatMap(({ values }) => values)
  );
  const years = Array.from({ length: 5 }, (_, i) => `Year ${i + 1}`);

  return (
    <div className="bg-white p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4 capitalize">{type} Projection</h3>
      <div className="h-64 relative">
        <svg className="w-full h-full">
          {/* Y-axis */}
          <line
            x1="40"
            y1="20"
            x2="40"
            y2="230"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          {/* X-axis */}
          <line
            x1="40"
            y1="230"
            x2="580"
            y2="230"
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* Data lines */}
          {Object.entries(chartData).map(([key, { values, label }], index) => {
            const points = values.map((value, i) => ({
              x: 40 + ((540 / 4) * i),
              y: 230 - ((value / maxValue) * 200)
            }));

            const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
            const color = [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#8b5cf6'
            ][index % 4];

            return (
              <g key={key}>
                <path
                  d={path}
                  stroke={color}
                  strokeWidth="2"
                  fill="none"
                />
                {points.map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={color}
                  />
                ))}
              </g>
            );
          })}

          {/* X-axis labels */}
          {years.map((year, i) => (
            <text
              key={i}
              x={40 + ((540 / 4) * i)}
              y="250"
              textAnchor="middle"
              className="text-sm text-gray-600"
            >
              {year}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}