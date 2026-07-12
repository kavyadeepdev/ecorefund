import React, { useMemo, useState } from 'react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const series = [
  {
    id: 'plastic',
    label: 'Plastic recovery',
    values: [48, 62, 73, 88, 102, 118],
    color: '#22c55e',
  },
  {
    id: 'glass',
    label: 'Glass yield',
    values: [35, 42, 58, 70, 82, 95],
    color: '#2563eb',
  },
  {
    id: 'paper',
    label: 'Paper volume',
    values: [28, 33, 47, 57, 68, 77],
    color: '#f59e0b',
  },
];

export default function PerformanceChart() {
  const [active, setActive] = useState(series[0].id);
  const activeSeries = useMemo(() => series.find((item) => item.id === active) ?? series[0], [active]);
  const maxValue = Math.max(...activeSeries.values) + 12;

  const points = activeSeries.values.map((value, index) => {
    const x = 60 + index * 90;
    const y = 220 - (value / maxValue) * 180;
    return { x, y, value };
  });

  const pathData = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <div className="bg-white/95 rounded-[28px] border border-slate-200/90 shadow-2xl p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500 mb-2">Recycling performance</p>
          <h3 className="text-2xl font-display font-bold text-slate-900">Live collection insights</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {series.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                active === item.id
                  ? 'bg-slate-950 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg viewBox="0 0 620 260" className="w-full h-[260px]">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={activeSeries.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={activeSeries.color} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path
            d={`${pathData} L 560 240 L 60 240 Z`}
            fill="url(#lineGradient)"
            opacity="0.8"
          />
          <path
            d={pathData}
            fill="none"
            stroke={activeSeries.color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((point, index) => (
            <g key={index}>
              <circle cx={point.x} cy={point.y} r="10" fill="#fff" stroke={activeSeries.color} strokeWidth="4" />
              <circle cx={point.x} cy={point.y} r="4" fill={activeSeries.color} />
            </g>
          ))}
          {months.map((month, index) => (
            <text key={month} x={60 + index * 90} y="255" textAnchor="middle" fill="#64748b" fontSize="12">
              {month}
            </text>
          ))}
          <line x1="60" y1="20" x2="60" y2="230" stroke="#e2e8f0" strokeWidth="1" />
          {Array.from({ length: 4 }, (_, index) => {
            const y = 40 + index * 50;
            return <line key={index} x1="60" y1={y} x2="560" y2={y} stroke="#e2e8f0" strokeWidth="1" opacity="0.8" />;
          })}
        </svg>
        <div className="absolute bottom-4 left-6 rounded-3xl bg-slate-950/95 px-4 py-3 text-white shadow-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Current month</p>
          <p className="text-lg font-semibold">{activeSeries.values[activeSeries.values.length - 1]} tonnes collected</p>
        </div>
      </div>
    </div>
  );
}
