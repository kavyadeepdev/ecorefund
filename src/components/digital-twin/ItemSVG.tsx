import React from 'react';

interface ItemSVGProps {
  type: string;
}

export default function ItemSVG({ type }: ItemSVGProps) {
  switch (type) {
    case 'plastic':
      return (
        <svg className="w-16 h-16 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3h6l1 3v2a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V6l1-3Z" />
          <path d="M8 8.5v10a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-10" />
          <path d="M10 12h4m-4 3h4m-4 3h4" strokeDasharray="2 2" />
        </svg>
      );
    case 'glass':
      return (
        <svg className="w-16 h-16 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 2h4v4h-4z" />
          <path d="M10 6v3a4 4 0 0 1-2 3.5v7a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-7A4 4 0 0 1 14 9V6" />
          <circle cx="12" cy="14" r="1.5" className="animate-pulse" />
        </svg>
      );
    case 'paper':
      return (
        <svg className="w-16 h-16 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M8 6h8m-8 4h8m-8 4h6" strokeLinecap="round" />
        </svg>
      );
    case 'compostable':
      return (
        <svg className="w-16 h-16 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 'unsupported':
      return (
        <svg className="w-16 h-16 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h6" strokeLinecap="round" />
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" className="text-rose-500" />
          <path d="m16 8-8 8" stroke="currentColor" strokeWidth="2" className="text-rose-500" />
        </svg>
      );
    case 'sand':
      return (
        <svg className="w-16 h-16 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3h6l1 3v2a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V6l1-3Z" />
          <path d="M8 8.5v10a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-10" />
          <path d="M9 14s2 2 3 0 3 0 3 0v4H9v-4Z" fill="currentColor" fillOpacity="0.4" />
          <circle cx="11" cy="16" r="0.5" fill="currentColor" />
          <circle cx="13" cy="17" r="0.5" fill="currentColor" />
          <circle cx="10" cy="18" r="0.5" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className="w-16 h-16 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round" />
        </svg>
      );
  }
}
