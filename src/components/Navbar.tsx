import React, { useState } from 'react';
import { Recycle, Cpu, X } from 'lucide-react';

interface NavbarProps {
  onLaunchDigitalTwin: () => void;
}

const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Economic Model', href: '#economy' },
  { label: 'How It Works', href: '#mechanism' },
  { label: 'Strategic Solutions', href: '#challenges' },
  { label: 'Digital Twin', href: '#digital-twin' },
  { label: 'About', href: '#vision' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onLaunchDigitalTwin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleNavItem = (href: string) => {
    if (href === '#digital-twin') {
      onLaunchDigitalTwin();
    }
    handleClose();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/20 backdrop-blur-xl border-b border-white/20 shadow-sm shadow-slate-950/10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-center relative">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500 text-white p-2 rounded-2xl shadow-lg shadow-brand-500/20">
            <Recycle className="w-6 h-6" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-slate-900">
            Eco Refund
          </span>
        </div>

        <button
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute right-6 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/70 bg-white/85 text-slate-900 shadow-sm shadow-slate-950/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="relative inline-flex flex-col items-center justify-center w-6 h-5 gap-1.5">
            <span
              className={`block h-[1.5px] w-5 rounded-full bg-slate-900 transition-transform duration-300 origin-center ${isOpen ? 'translate-y-2.5 rotate-45' : ''}`}
            />
            <span
              className={`block h-[1.5px] w-5 rounded-full bg-slate-900 transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`block h-[1.5px] w-5 rounded-full bg-slate-900 transition-transform duration-300 origin-center ${isOpen ? '-translate-y-2.5 -rotate-45' : ''}`}
            />
          </div>
        </button>
      </div>

      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div
          className="absolute inset-0 bg-slate-950/55 backdrop-blur-2xl transition-opacity duration-300"
          onClick={handleClose}
        />

        <div className={`absolute right-0 top-0 h-full w-full max-w-md md:max-w-lg bg-slate-900/95 border-l border-white/15 shadow-2xl shadow-slate-950/60 backdrop-blur-xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full px-8 py-12 flex flex-col justify-between backdrop-blur-lg">
            <div>
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="bg-brand-500 text-white p-2 rounded-2xl shadow-lg shadow-brand-500/20">
                    <Recycle className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-semibold text-white">Eco Refund</span>
                </div>
                <button
                  onClick={handleClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white transition-colors hover:bg-white/20"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href === '#digital-twin' ? '#' : link.href}
                    onClick={(event) => {
                      if (link.href === '#digital-twin') {
                        event.preventDefault();
                      }
                      handleNavItem(link.href);
                    }}
                    className="block rounded-3xl border border-slate-700/40 bg-slate-900/90 px-4 py-4 text-3xl font-semibold text-white shadow-lg shadow-slate-950/35 transition-all duration-300 hover:border-brand-300 hover:bg-slate-900/95 hover:text-brand-300 hover:-translate-x-1"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
