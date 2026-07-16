import React, { useState } from 'react';
import { Calculator as CalculatorIcon, IndianRupee, Leaf } from 'lucide-react';
import { motion } from 'motion/react';

const RATES = {
  plastic: 2.0, // Rs per 100g (20 paise per 10g)
  paper: 0.5,   // Rs per 100g (5 paise per 10g)
  compostable: 0.1, // Rs per 100g
  glass: 1.0,   // Rs per 100g
};

export default function Calculator() {
  const [weights, setWeights] = useState({
    plastic: 0,
    paper: 0,
    compostable: 0,
    glass: 0,
  });

  const handleWeightChange = (type: keyof typeof RATES, value: string) => {
    const numValue = parseFloat(value) || 0;
    setWeights((prev) => ({ ...prev, [type]: numValue }));
  };

  const calculateTotal = () => {
    return (Object.keys(weights) as Array<keyof typeof RATES>).reduce((total, type) => {
      const weight = weights[type];
      return total + (weight * 10 * RATES[type]);
    }, 0);
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60 w-full max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-brand-50 p-2.5 rounded-xl text-brand-600">
          <CalculatorIcon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-display font-semibold text-slate-800">
          Earnings Estimator
        </h3>
      </div>

      <div className="space-y-4 mb-8">
        {Object.entries(RATES).map(([type, rate]) => (
          <div key={type} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700 capitalize">
                {type} Waste
              </span>
              <span className="text-slate-500">
                ₹{rate}/100g
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="0.0"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono"
                onChange={(e) => handleWeightChange(type as keyof typeof RATES, e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                kg
              </span>
            </div>
          </div>
        ))}
      </div>

      <motion.div 
        key={calculateTotal()}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-brand-900 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Leaf className="w-24 h-24" />
        </div>
        <p className="text-brand-100 text-sm font-medium mb-1 relative z-10">
          Estimated Instant Payout
        </p>
        <div className="flex items-end gap-1 relative z-10">
          <span className="text-3xl font-display font-bold">₹</span>
          <span className="text-5xl font-display font-bold tracking-tight">
            {calculateTotal().toFixed(2)}
          </span>
        </div>
        <p className="text-brand-100 text-xs mt-3 opacity-80 relative z-10">
          Credited directly to UPI wallet via RVM
        </p>
      </motion.div>
    </div>
  );
}
