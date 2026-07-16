import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, TrendingUp, ShieldAlert, Award, Calendar, ChevronRight } from 'lucide-react';

interface MonthlyData {
  month: string;
  volume: {
    plastic: number;
    glass: number;
    paper: number;
    compostable: number;
  };
  payout: {
    plastic: number;
    glass: number;
    paper: number;
    compostable: number;
  };
  co2: {
    plastic: number;
    glass: number;
    paper: number;
    compostable: number;
  };
}

const DATA_2026: MonthlyData[] = [
  {
    month: 'Jan',
    volume: { plastic: 12.4, glass: 28.2, paper: 15.1, compostable: 35.6 },
    payout: { plastic: 24800, glass: 14100, paper: 7550, compostable: 35600 },
    co2: { plastic: 18600, glass: 8460, paper: 13590, compostable: 17800 }
  },
  {
    month: 'Feb',
    volume: { plastic: 14.8, glass: 26.5, paper: 18.3, compostable: 32.2 },
    payout: { plastic: 32560, glass: 12250, paper: 9150, compostable: 29500 },
    co2: { plastic: 22200, glass: 7950, paper: 16470, compostable: 16100 }
  },
  {
    month: 'Mar',
    volume: { plastic: 19.2, glass: 31.1, paper: 16.0, compostable: 38.4 },
    payout: { plastic: 36480, glass: 18550, paper: 8800, compostable: 42200 },
    co2: { plastic: 28800, glass: 9330, paper: 14400, compostable: 19200 }
  },
  {
    month: 'Apr',
    volume: { plastic: 22.5, glass: 34.0, paper: 20.4, compostable: 45.8 },
    payout: { plastic: 49500, glass: 20400, paper: 11220, compostable: 48900 },
    co2: { plastic: 33750, glass: 10200, paper: 18360, compostable: 22900 }
  },
  {
    month: 'May',
    volume: { plastic: 28.1, glass: 30.8, paper: 24.2, compostable: 40.1 },
    payout: { plastic: 61820, glass: 15400, paper: 13310, compostable: 44100 },
    co2: { plastic: 42150, glass: 9240, paper: 21780, compostable: 20050 }
  },
  {
    month: 'Jun',
    volume: { plastic: 35.6, glass: 39.3, paper: 28.5, compostable: 51.4 },
    payout: { plastic: 78320, glass: 27510, paper: 17100, compostable: 61680 },
    co2: { plastic: 53400, glass: 11790, paper: 25650, compostable: 25700 }
  }
];

type MetricType = 'volume' | 'payout' | 'co2';
type MaterialType = 'all' | 'plastic' | 'glass' | 'paper' | 'compostable';

export default function PerformanceDashboard() {
  const [activeMetric, setActiveMetric] = useState<MetricType>('volume');
  const [activeMaterial, setActiveMaterial] = useState<MaterialType>('all');
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number } | null>(null);

  const getValue = (data: MonthlyData, material: MaterialType, metric: MetricType): number => {
    const metricData = data[metric];
    if (material === 'all') {
      return metricData.plastic + metricData.glass + metricData.paper + metricData.compostable;
    }
    return metricData[material as keyof typeof metricData];
  };

  const getMetricDetails = () => {
    switch (activeMetric) {
      case 'volume':
        return { label: 'Recycling Volume', unit: ' Tons', prefix: '', color: '#22c55e' };
      case 'payout':
        return { label: 'Payouts Distributed', unit: '', prefix: '₹', color: '#10b981' };
      case 'co2':
        return { label: 'Carbon Saved', unit: ' kg CO2', prefix: '', color: '#06b6d4' };
    }
  };

  const details = getMetricDetails();

  // Get active values
  const pointsData = DATA_2026.map((d, index) => ({
    label: d.month,
    value: getValue(d, activeMaterial, activeMetric),
    raw: d
  }));

  const maxVal = Math.max(...pointsData.map(p => p.value)) * 1.15 || 10;
  
  // SVG Chart layout dimensions
  const width = 680;
  const height = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Compute SVG coordinates
  const coords = pointsData.map((p, i) => {
    const x = padding.left + (i / (pointsData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (p.value / maxVal) * chartHeight;
    return { x, y, label: p.label, value: p.value };
  });

  // Create SVG path
  let pathD = '';
  if (coords.length > 0) {
    pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      // Bezier curve interpolation for smooth waves
      const cpX1 = coords[i - 1].x + chartWidth / (pointsData.length - 1) / 2;
      const cpY1 = coords[i - 1].y;
      const cpX2 = coords[i].x - chartWidth / (pointsData.length - 1) / 2;
      const cpY2 = coords[i].y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${coords[i].x} ${coords[i].y}`;
    }
  }

  // Create SVG area path (closes at the bottom)
  const areaD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${padding.top + chartHeight} L ${coords[0].x} ${padding.top + chartHeight} Z`
    : '';

  // Get total for current selection
  const totalVal = pointsData.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              Live Performance Analytics
            </div>
            <h3 className="text-2xl font-display font-bold text-white tracking-tight">
              Recycling Performance Hub
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Real-time telemetry showing collection volumes, payout distributions, and ecological impact.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex bg-slate-800/80 border border-slate-700/60 p-1.5 rounded-2xl self-start md:self-center">
            {(['volume', 'payout', 'co2'] as MetricType[]).map((metric) => (
              <button
                key={metric}
                onClick={() => {
                  setActiveMetric(metric);
                  setHoveredPoint(null);
                }}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeMetric === metric
                    ? 'text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeMetric === metric && (
                  <motion.div
                    layoutId="activeMetricTab"
                    className="absolute inset-0 bg-brand-600 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {metric === 'volume' && 'Volume (Tons)'}
                {metric === 'payout' && 'Payouts (INR)'}
                {metric === 'co2' && 'CO2 Saved (kg)'}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Stats Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1">Total Impact (6M)</span>
            <span className="text-xl font-display font-bold text-white">
              {details.prefix}
              {totalVal.toLocaleString(undefined, { maximumFractionDigits: activeMetric === 'volume' ? 1 : 0 })}
              {details.unit}
            </span>
          </div>
          <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1">Monthly Avg</span>
            <span className="text-xl font-display font-bold text-brand-400">
              {details.prefix}
              {(totalVal / 6).toLocaleString(undefined, { maximumFractionDigits: activeMetric === 'volume' ? 1 : 0 })}
              {details.unit}
            </span>
          </div>
          <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1">MoM Growth</span>
            <span className="text-xl font-display font-bold text-emerald-400">+28.4%</span>
          </div>
          <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-1">EPR Fulfillment</span>
            <span className="text-xl font-display font-bold text-cyan-400">92.6%</span>
          </div>
        </div>

        {/* Filters and Graph Area */}
        <div className="bg-slate-950/50 border border-slate-800/60 rounded-3xl p-4 md:p-6">
          {/* Material Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'plastic', 'glass', 'paper', 'compostable'] as MaterialType[]).map((material) => (
              <button
                key={material}
                onClick={() => {
                  setActiveMaterial(material);
                  setHoveredPoint(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all ${
                  activeMaterial === material
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'text-slate-500 border-transparent hover:text-slate-300'
                }`}
              >
                {material === 'all' ? 'All Materials' : material}
              </button>
            ))}
          </div>

          {/* SVG Graph Container */}
          <div className="relative overflow-x-auto overflow-y-hidden md:overflow-visible">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full min-w-[620px] h-auto drop-shadow-lg"
            >
              {/* Grids */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = padding.top + chartHeight * ratio;
                const valueLabel = maxVal * (1 - ratio);
                return (
                  <g key={index} className="opacity-20">
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={width - padding.right}
                      y2={y}
                      stroke="#475569"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 12}
                      y={y + 4}
                      fill="#94a3b8"
                      fontSize="10"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      {details.prefix}
                      {valueLabel.toLocaleString(undefined, {
                        notation: 'compact',
                        compactDisplay: 'short',
                        maximumFractionDigits: 1,
                      })}
                      {activeMetric === 'volume' ? 'T' : ''}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {coords.map((c, index) => (
                <text
                  key={index}
                  x={c.x}
                  y={height - padding.bottom + 22}
                  fill="#64748b"
                  fontSize="11"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {c.label}
                </text>
              ))}

              {/* Area Gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={details.color} stopOpacity="0.32" />
                  <stop offset="100%" stopColor={details.color} stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Area path */}
              {areaD && (
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  key={`area-${activeMetric}-${activeMaterial}`}
                  d={areaD}
                  fill="url(#chartGradient)"
                />
              )}

              {/* Stroke line path */}
              {pathD && (
                <motion.path
                  key={`line-${activeMetric}-${activeMaterial}`}
                  initial={{ pathLength: 0, opacity: 0.4 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  d={pathD}
                  fill="none"
                  stroke={details.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              )}

              {/* Data points */}
              {coords.map((c, index) => (
                <g key={index}>
                  {/* Invisible larger hover target circle */}
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="16"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint({ index, x: c.x, y: c.y })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Visual Circle */}
                  <motion.circle
                    key={`circle-${activeMetric}-${activeMaterial}-${index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                    cx={c.x}
                    cy={c.y}
                    r={hoveredPoint?.index === index ? '7' : '4.5'}
                    fill={details.color}
                    stroke="#0f172a"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            <AnimatePresence>
              {hoveredPoint !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    left: `${(hoveredPoint.x / width) * 100}%`,
                    top: `${(hoveredPoint.y / height) * 100 - 15}%`,
                    transform: 'translate(-50%, -100%)',
                  }}
                  className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-xl shadow-xl z-20 pointer-events-none min-w-[130px]"
                >
                  <p className="text-[10px] uppercase font-bold text-slate-400">
                    {pointsData[hoveredPoint.index].label} 2026
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {details.prefix}
                    {pointsData[hoveredPoint.index].value.toLocaleString(undefined, {
                      maximumFractionDigits: activeMetric === 'volume' ? 2 : 0,
                    })}
                    {details.unit}
                  </p>
                  <div className="w-full h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: details.color,
                        width: `${(pointsData[hoveredPoint.index].value / maxVal) * 100}%`,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
