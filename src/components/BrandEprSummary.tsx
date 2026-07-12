import { motion } from 'motion/react';
import { Building, ChartBar, ShieldCheck } from 'lucide-react';
import type { DepositItem } from './digital-twin/types';

interface BrandEprSummaryProps {
  sessionItems: DepositItem[];
}

export default function BrandEprSummary({ sessionItems }: BrandEprSummaryProps) {
  const totalValue = sessionItems.reduce((sum, item) => sum + item.val, 0);

  const brandSummary = sessionItems.length
    ? Object.entries(
        sessionItems.reduce((acc, item) => {
          const brand = item.brand || 'Generic';
          acc[brand] = acc[brand] || { count: 0, value: 0, weight: 0 };
          acc[brand].count += 1;
          acc[brand].value += item.val;
          acc[brand].weight += item.weightGrams;
          return acc;
        }, {} as Record<string, { count: number; value: number; weight: number }>)
      ).map(([brand, summary]) => ({
        brand,
        contribution: totalValue > 0 ? `${Math.round((summary.value / totalValue) * 100)}%` : `${Math.round((summary.weight / Math.max(sessionItems.reduce((sum, item) => sum + item.weightGrams, 0), 1)) * 100)}%`,
        description: `${summary.count} item${summary.count > 1 ? 's' : ''}, ${summary.weight}g reclaimed`,
        amount: summary.value,
      }))
    : [];

  const displaySummary = brandSummary.length ? brandSummary : [
    { brand: 'Bisleri', contribution: '24%', description: 'High-volume PET bottle returns supporting beverage EPR targets.', amount: 0 },
    { brand: 'Coca-Cola', contribution: '18%', description: 'Branded plastic collection with traceable recycling performance.', amount: 0 },
    { brand: 'Amul', contribution: '12%', description: 'Dairy packaging returns integrated with source segregation incentives.', amount: 0 },
    { brand: 'Other FMCG', contribution: '46%', description: 'A broad portfolio of packaging flows from multiple consumer brands.', amount: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Brand-level EPR tracking</p>
          <h3 className="mt-3 text-2xl font-display font-bold text-slate-950">Brand product segregation for better responsibility reporting</h3>
        </div>
        <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-950 px-4 py-3 text-white shadow-lg">
          <ChartBar className="w-5 h-5 text-brand-400" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Sync status</p>
            <p className="text-sm font-semibold">{sessionItems.length ? 'Live session data' : 'Preview mode'}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {displaySummary.map((item) => (
          <div key={item.brand} className="rounded-3xl border border-slate-200 p-5 bg-slate-50 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.brand}</p>
                <p className="text-xs text-slate-500">Brand-specific EPR flow</p>
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-slate-950">{item.contribution}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl bg-slate-950 p-6 text-white border border-slate-900">
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-slate-400 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Brand-specific material traceability is central to EPR compliance.
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Eco Refund records product-level deposits for each brand, enabling manufacturers to verify the reclaimed share of their packaging and accurately report EPR recovery obligations.
        </p>
        {!sessionItems.length && (
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Open the digital twin to sync live session data for accurate brand-level EPR reporting.
          </p>
        )}
      </div>
    </motion.div>
  );
}
