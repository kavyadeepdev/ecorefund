import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  label: string;
}

export default function MetricCard({ title, value, label }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-center">
      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h4>
      <div className="text-4xl font-display font-bold text-brand-600 mb-1">{value}</div>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}
