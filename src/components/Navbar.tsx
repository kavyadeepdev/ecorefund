import React, { useState, useEffect } from 'react';
import { Recycle, Cpu, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onLaunchDigitalTwin: () => void;
}

export default function Navbar({ onLaunchDigitalTwin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#vision', label: 'Vision' },
    { href: '#mechanism', label: 'Mechanism' },
    { href: '#tech', label: 'Tech Stack' },
    { href: '#economy', label: 'Economics' },
    { href: '#challenges', label: 'Roadmap' },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 w-full ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm py-3' 
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-brand-500 text-white p-2 rounded-xl">
            <Recycle className="w-6 h-6" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-slate-900">
            Eco Refund
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              className="hover:text-brand-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button 
            onClick={onLaunchDigitalTwin} 
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer text-xs flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" /> Demo Twin
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden items-center justify-center p-2 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-slate-100/50 transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-slate-200"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-slate-600 hover:text-brand-600 transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-slate-100 my-1" />
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLaunchDigitalTwin();
                }}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4" /> Demo Twin
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

