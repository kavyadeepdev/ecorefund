import { BarChart3, CircleDollarSign, Leaf, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const wasteData = [
  { label: 'Municipal Waste', value: 340, unit: 'kt/day', color: '#22c55e' },
  { label: 'Plastic Waste', value: 52, unit: 'kt/day', color: '#2563eb' },
  { label: 'Recycled', value: 31, unit: '%', color: '#f59e0b' },
];

export default function WasteDashboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">India waste crisis</p>
            <h3 className="mt-3 text-2xl font-display font-bold text-slate-950">Tracking municipal and plastic waste generation</h3>
          </div>
          <div className="rounded-3xl bg-brand-50 p-3 text-brand-700">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {wasteData.map((item) => (
            <div key={item.label} className="rounded-3xl border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-3xl font-display font-bold text-slate-950">{item.value}</span>
                <span className="text-sm text-slate-500">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-100 bg-slate-950 px-4 py-6 shadow-inner">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.24em] text-slate-400 mb-4">
            <span>Waste generation trend</span>
            <span>2025 estimate</span>
          </div>
          <svg viewBox="0 0 300 140" className="w-full h-[140px]">
            <polyline points="18,108 68,76 118,88 168,54 218,60 268,38" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="108" r="6" fill="#22c55e" />
            <circle cx="68" cy="76" r="6" fill="#22c55e" />
            <circle cx="118" cy="88" r="6" fill="#22c55e" />
            <circle cx="168" cy="54" r="6" fill="#22c55e" />
            <circle cx="218" cy="60" r="6" fill="#22c55e" />
            <circle cx="268" cy="38" r="6" fill="#22c55e" />
          </svg>

          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
              <span>Annual municipal solid waste now exceeds 124 million tonnes.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
              <span>Plastic makes up about 15% of daily disposal, with only 30-35% formally recovered.</span>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 shadow-2xl text-white"
      >
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-slate-400 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Eco Refund impact</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-900/95 p-5">
            <div className="flex items-center gap-3 mb-3 text-slate-400">
              <CircleDollarSign className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.24em]">Reward signal</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              By turning segregated waste into instant UPI payouts, we make proper disposal the simplest choice for communities.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-900/95 p-5">
            <div className="flex items-center gap-3 mb-3 text-slate-400">
              <Leaf className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.24em]">Closed loop</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              The platform directly addresses plastic waste by incentivizing brand-specific, source-separated collection and clean secondary material sales.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
