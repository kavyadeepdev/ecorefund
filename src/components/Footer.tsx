import React from 'react';
import { Recycle, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-brand-500 text-white p-2 rounded-xl">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight">Eco Refund</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
            A tech-enabled Deposit Refund Scheme proposal for India, empowering citizens and securing a cleaner future through smart recycling and instant incentives.
          </p>
        </div>

        {/* Column 2: Navigation Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Quick Navigation</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li><a href="#vision" className="hover:text-brand-400 transition-colors">Vision</a></li>
            <li><a href="#mechanism" className="hover:text-brand-400 transition-colors">Mechanism</a></li>
            <li><a href="#tech" className="hover:text-brand-400 transition-colors">Tech Stack</a></li>
            <li><a href="#economy" className="hover:text-brand-400 transition-colors">Economics</a></li>
            <li><a href="#challenges" className="hover:text-brand-400 transition-colors">Mitigation</a></li>
          </ul>
        </div>

        {/* Column 3: Resources & Repository */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Developer & Code</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Eco Refund is an open-source initiative. Explore the repository and contribute.
          </p>
          <div>
            <a 
              href="https://github.com/kavyadeepdev/ecorefund" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-800 hover:border-slate-700 transition-all"
            >
              <Github className="w-4 h-4" /> View on GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p className="text-slate-500">
          &copy; {new Date().getFullYear()} Eco Refund India. Built for the Swachh Bharat Initiative.
        </p>
        <p className="text-slate-500">
          Source code licensed under MIT.
        </p>
      </div>
    </footer>
  );
}
