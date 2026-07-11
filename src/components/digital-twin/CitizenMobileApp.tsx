import React from 'react';
import { 
  Smartphone, Zap, Recycle, Coins, Wifi, RefreshCw, ChevronDown, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RvmMachine } from './types';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  items: number;
  status: string;
}

interface CitizenMobileAppProps {
  sessionStep: 'UNAUTHENTICATED' | 'SCANNING_QR' | 'CONNECTED';
  walletBalance: number;
  carbonSaved: number;
  userQrToken: string;
  qrTimer: number;
  transactions: Transaction[];
  handleInitiateScan: () => void;
  selectedMachine: RvmMachine;
  setSelectedMachine: (machine: RvmMachine) => void;
  machines: RvmMachine[];
  machineWarning: string | null;
}

export default function CitizenMobileApp({
  sessionStep,
  walletBalance,
  carbonSaved,
  userQrToken,
  qrTimer,
  transactions,
  handleInitiateScan,
  selectedMachine,
  setSelectedMachine,
  machines,
  machineWarning,
}: CitizenMobileAppProps) {
  return (
    <div className="w-full max-w-[340px] aspect-[9/19] bg-slate-900 rounded-[45px] p-3 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col ring-1 ring-slate-800/50">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
        <span className="w-2 h-2 rounded-full bg-slate-900 mr-2" />
        <span className="w-12 h-1 bg-slate-750 rounded-full" />
      </div>

      <div className="flex-1 bg-slate-950 rounded-[38px] p-4 pt-6 overflow-y-auto flex flex-col space-y-4 select-none scrollbar-none">
        {/* status bar */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 px-2 font-mono">
          <span>13:05 PM</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <span>5G</span>
            <div className="w-5 h-2.5 border border-slate-600 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-4 bg-emerald-500 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Citizen info */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">ECO-CITIZEN</h4>
            <p className="text-sm font-bold text-white">Aarav Sharma</p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-500/20">
            Level 4
          </div>
        </div>

        {/* Nearby Machine Selector */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3 flex flex-col space-y-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">SELECT RVM MACHINE</span>
            <span className="text-[8px] font-mono text-emerald-400 animate-pulse">GPS ACTIVE</span>
          </div>

          <div className="relative">
            <select
              value={selectedMachine.id}
              onChange={(e) => {
                const found = machines.find((m) => m.id === e.target.value);
                if (found) {
                  setSelectedMachine(found);
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer appearance-none pr-8"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id} className="bg-slate-950 text-slate-200">
                  {m.name} ({m.distance})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider">Accepted Materials</span>
            <div className="flex flex-wrap gap-1">
              {selectedMachine.acceptedMaterials.map((mat) => (
                <span
                  key={mat}
                  className="text-[8px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800/60 text-slate-300 font-mono"
                >
                  {mat === 'compostable' ? 'organic' : mat === 'unsupported' ? 'metal' : mat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Machine Warning Display */}
        <AnimatePresence mode="wait">
          {machineWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[10px] text-amber-400 font-medium leading-relaxed flex gap-2 items-start"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400 animate-pulse" />
              <span>{machineWarning}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic QR & Scan trigger */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          
          {sessionStep === 'UNAUTHENTICATED' ? (
            <div className="py-6 flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-white mb-1">DRS Session Inactive</p>
                <p className="text-[10px] text-slate-400 max-w-[200px]">Click scan to read the RVM terminal QR and unlock the deposit chute.</p>
              </div>
              <button 
                onClick={handleInitiateScan}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl tracking-wider transition-all shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer uppercase"
              >
                Scan RVM QR Code
              </button>
            </div>
          ) : sessionStep === 'SCANNING_QR' ? (
            <div className="py-10 flex flex-col items-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase">SCANNING RVM QR...</span>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-2">
              <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase">DYNAMIC USER TOKEN</span>
              
              <div className="w-28 h-28 bg-white p-2 rounded-xl relative flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded flex flex-col items-center justify-center text-slate-400 p-1.5 font-mono text-[9px]">
                  <Recycle className="w-6 h-6 text-emerald-500 animate-spin-slow mb-1" />
                  <span className="text-white font-bold tracking-widest">{userQrToken}</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-between text-[10px] text-slate-400 font-mono px-2 pt-1">
                <span>Refreshes in:</span>
                <span className={qrTimer < 5 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}>{qrTimer}s</span>
              </div>
              <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                <motion.div 
                  key={userQrToken}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: qrTimer, ease: 'linear' }}
                  className={`h-full ${qrTimer < 5 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Wallet Info */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <span className="text-[9px] text-slate-400 font-semibold block uppercase">UPI Wallet</span>
            <div className="flex items-baseline text-white">
              <span className="text-xs font-bold mr-0.5">₹</span>
              <span className="text-xl font-bold font-mono tracking-tight">{walletBalance.toFixed(2)}</span>
            </div>
          </div>
          <div className="space-y-0.5 border-l border-slate-800 pl-4">
            <span className="text-[9px] text-slate-400 font-semibold block uppercase">CO₂ Savings</span>
            <div className="flex items-baseline text-emerald-400">
              <span className="text-xl font-bold font-mono tracking-tight">{carbonSaved.toFixed(2)}</span>
              <span className="text-[9px] font-bold ml-1">kg</span>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="flex-1 flex flex-col min-h-0 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Wallet Transactions</span>
          <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-slate-900/40 border border-slate-850 rounded-xl p-2 flex items-center justify-between text-xs transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">RVM Refund Instant</p>
                    <p className="text-[9px] text-slate-500 font-mono">{tx.date} • {tx.items} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400 font-mono">+₹{tx.amount.toFixed(2)}</p>
                  <p className="text-[8px] text-slate-500 font-semibold uppercase">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
