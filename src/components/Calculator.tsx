import React, { useState } from 'react';
import { Calculator as CalculatorIcon, IndianRupee, Leaf, Award } from 'lucide-react';
import { motion } from 'motion/react';

const RATES = {
  plastic: 2.0, // Rs per 100g (20 paise per 10g)
  paper: 0.5,   // Rs per 100g (5 paise per 10g)
  compostable: 0.1, // Rs per 100g
  glass: 1.0,   // Rs per 100g
};

interface CalculatorProduct {
  id: string;
  name: string;
  brand: string;
  type: string;
  weightGrams: number;
  ratePer100g: number;
  unsupported?: boolean;
}

const PRODUCTS: CalculatorProduct[] = [
  { id: 'bisleri', name: 'Bisleri PET Bottle', brand: 'Bisleri', type: 'plastic', weightGrams: 25, ratePer100g: 2.0 },
  { id: 'amul', name: 'Amul Milk Jug', brand: 'Amul', type: 'plastic', weightGrams: 55, ratePer100g: 2.0 },
  { id: 'coke', name: 'Coca-Cola Glass Soda', brand: 'Coca-Cola', type: 'glass', weightGrams: 320, ratePer100g: 1.0 },
  { id: 'toi', name: 'Times of India News Roll', brand: 'Times of India', type: 'paper', weightGrams: 180, ratePer100g: 0.5 },
  { id: 'organic', name: 'Organic Banana Peel', brand: 'Local Farms', type: 'compostable', weightGrams: 90, ratePer100g: 0.1 },
  { id: 'pepsi', name: 'Pepsi Aluminum Can', brand: 'Pepsi', type: 'unsupported', weightGrams: 15, ratePer100g: 0.0, unsupported: true },
];

export default function Calculator() {
  const [calcMode, setCalcMode] = useState<'material' | 'brand'>('material');
  
  // State for Material Mode
  const [weights, setWeights] = useState({
    plastic: 0,
    paper: 0,
    compostable: 0,
    glass: 0,
  });

  // State for Brand Mode
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({
    bisleri: 0,
    amul: 0,
    coke: 0,
    toi: 0,
    organic: 0,
    pepsi: 0,
  });

  const handleWeightChange = (type: keyof typeof RATES, value: string) => {
    const numValue = parseFloat(value) || 0;
    setWeights((prev) => ({ ...prev, [type]: numValue }));
  };

  const handleProductQtyChange = (id: string, delta: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  // Perform Calculations
  let totalPayout = 0;
  let totalWeightKg = 0;
  let totalEprCredits = 0;

  if (calcMode === 'material') {
    totalPayout = (Object.keys(weights) as Array<keyof typeof RATES>).reduce((total, type) => {
      const w = weights[type];
      return total + (w * 10 * RATES[type]);
    }, 0);
    
    totalWeightKg = weights.plastic + weights.paper + weights.compostable + weights.glass;
    // 1 credit per kg of recyclable material (exclude compostable from plastic-equivalent credits if desired, but let's count all standard categories)
    totalEprCredits = totalWeightKg;
  } else {
    PRODUCTS.forEach((p) => {
      const qty = productQuantities[p.id] || 0;
      if (qty > 0) {
        if (!p.unsupported) {
          const itemPayout = (p.weightGrams / 100) * p.ratePer100g;
          totalPayout += itemPayout * qty;
          totalEprCredits += (p.weightGrams / 1000) * qty;
        }
        totalWeightKg += (p.weightGrams / 1000) * qty;
      }
    });
  }

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

      {/* Mode Toggle Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button
          onClick={() => setCalcMode('material')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            calcMode === 'material'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          By Material
        </button>
        <button
          onClick={() => setCalcMode('brand')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            calcMode === 'brand'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          By Brand & Product
        </button>
      </div>

      {calcMode === 'material' ? (
        /* ================= BY MATERIAL FORM ================= */
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
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono text-sm"
                  onChange={(e) => handleWeightChange(type as keyof typeof RATES, e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                  kg
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ================= BY BRAND/PRODUCT LIST ================= */
        <div className="space-y-3 mb-8 max-h-[290px] overflow-y-auto pr-1 py-1 scrollbar-thin scrollbar-thumb-slate-200">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-3">
              <div className="min-w-0 pr-2">
                <span className="text-xs font-bold text-slate-800 block truncate">{p.name}</span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {p.brand} • {p.weightGrams}g • {p.unsupported ? 'Unsupported' : `₹${((p.weightGrams / 100) * p.ratePer100g).toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleProductQtyChange(p.id, -1)}
                  className="w-7 h-7 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-all cursor-pointer active:scale-95 text-sm"
                >
                  -
                </button>
                <span className="w-5 text-center font-mono text-xs font-bold text-slate-800">{productQuantities[p.id]}</span>
                <button
                  onClick={() => handleProductQtyChange(p.id, 1)}
                  className="w-7 h-7 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-all cursor-pointer active:scale-95 text-sm"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estimator Payout Summary Card */}
      <motion.div 
        key={calcMode + totalPayout + totalWeightKg}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-brand-900 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Leaf className="w-24 h-24" />
        </div>
        
        <p className="text-brand-100 text-xs font-medium mb-1 relative z-10">
          Estimated Instant Payout
        </p>
        <div className="flex items-end gap-1 relative z-10">
          <span className="text-2xl font-display font-bold">₹</span>
          <span className="text-4xl font-display font-bold tracking-tight">
            {totalPayout.toFixed(2)}
          </span>
        </div>

        {/* EPR Compliance Section */}
        <div className="mt-4 pt-3 border-t border-brand-850 flex justify-between text-xs text-brand-100 relative z-10 font-mono">
          <div>
            <span className="block text-[9px] opacity-60 uppercase font-bold tracking-wider">Est. Weight</span>
            <span className="font-bold text-white text-xs">{totalWeightKg.toFixed(3)} kg</span>
          </div>
          <div className="text-right">
            <span className="block text-[9px] opacity-60 uppercase font-bold tracking-wider">EPR Compliance Credits</span>
            <span className="font-bold text-emerald-300 flex items-center justify-end gap-1 text-xs">
              <Award className="w-3.5 h-3.5 shrink-0" /> {totalEprCredits.toFixed(3)}
            </span>
          </div>
        </div>

        <p className="text-brand-200 text-[9px] mt-4 opacity-70 relative z-10 leading-normal">
          * Payouts and brand-specific EPR credits are recorded instantly upon Reverse Vending deposit.
        </p>
      </motion.div>
    </div>
  );
}
