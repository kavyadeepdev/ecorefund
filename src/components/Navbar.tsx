import React from 'react';
import { Recycle, Cpu } from 'lucide-react';

interface NavbarProps {
  onLaunchDigitalTwin: () => void;
}

export default function Navbar({ onLaunchDigitalTwin }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500 text-white p-2 rounded-xl">
            <Recycle className="w-6 h-6" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-slate-900">
            Eco Refund
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#vision" className="hover:text-brand-600 transition-colors">Vision</a>
          <a href="#mechanism" className="hover:text-brand-600 transition-colors">Mechanism</a>
          <a href="#tech" className="hover:text-brand-600 transition-colors">Tech Stack</a>
          <a href="#economy" className="hover:text-brand-600 transition-colors">Economics</a>
          <a href="#challenges" className="hover:text-brand-600 transition-colors">Roadmap</a>
          <button 
            onClick={onLaunchDigitalTwin} 
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer text-xs flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" /> Demo Twin
          </button>
        </div>
      </div>
    </nav>
  );
}
