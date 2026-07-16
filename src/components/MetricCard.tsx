import React from 'react';
import AnimatedCounter from './AnimatedCounter';

interface MetricCardProps {
  title: string;
  value: string;
  label: string;
}

export default function MetricCard({ title, value, label }: MetricCardProps) {
  // Parse numeric part, prefix, and suffix
  const match = value.match(/^([^0-9\.\,]*)([0-9\.\,]+)([^0-9\.\,]*)$/);
  
  let content = <span>{value}</span>;
  if (match) {
    const prefix = match[1];
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const numValue = parseFloat(numStr);
    
    if (!isNaN(numValue)) {
      // Detect decimals
      const decimalMatch = numStr.match(/\.([0-9]+)$/);
      const decimals = decimalMatch ? decimalMatch[1].length : 0;
      
      content = (
        <AnimatedCounter 
          value={numValue} 
          decimals={decimals} 
          prefix={prefix} 
          suffix={suffix} 
        />
      );
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center transition-all hover:shadow-md hover:border-slate-300">
      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h4>
      <div className="text-4xl font-display font-bold text-brand-600 mb-1">{content}</div>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}

