import React, { useRef, useEffect } from 'react';
import { Terminal, AlertTriangle, Lock, Unlock, Trash2 } from 'lucide-react';

interface LogItem {
  id: string;
  time: string;
  msg: string;
  type: 'info' | 'warn' | 'success' | 'mqtt';
}

interface OperatorConsoleProps {
  chuteLocked: boolean;
  setChuteLocked: (locked: boolean) => void;
  binFullness: number;
  setBinFullness: (fullness: number) => void;
  logs: LogItem[];
  addLog: (msg: string, type?: 'info' | 'warn' | 'success' | 'mqtt') => void;
}

export default function OperatorConsole({
  chuteLocked,
  setChuteLocked,
  binFullness,
  setBinFullness,
  logs,
  addLog,
}: OperatorConsoleProps) {
  const logConsoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logConsoleRef.current) {
      logConsoleRef.current.scrollTop = logConsoleRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full bg-slate-900 rounded-3xl border border-slate-800 p-5 flex flex-col space-y-5 h-full shadow-2xl relative ring-1 ring-slate-800/80">
      {/* Status Grid */}
      <div className="space-y-3.5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">IoT Telemetry Metrics</span>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-3 flex flex-col justify-center">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">NODE STATUS</span>
            <span className="text-xs font-bold text-emerald-400 font-mono tracking-wider flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> ONLINE
            </span>
          </div>
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-3 flex flex-col justify-center">
            <span className="text-[9px] font-mono text-slate-500 block uppercase">TEMP / HUMID</span>
            <span className="text-xs font-bold text-slate-200 font-mono mt-0.5">28.4°C / 62%</span>
          </div>
        </div>

        {/* Capacity Limit bar */}
        <div className="bg-slate-950 border border-slate-850 rounded-2xl p-3.5 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>COMPACTION CAPACITY</span>
            <span className={`font-bold ${binFullness >= 85 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>{binFullness}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
            <div 
              style={{ width: `${binFullness}%` }}
              className={`h-full transition-all duration-500 ${
                binFullness >= 90 
                  ? 'bg-rose-500' 
                  : binFullness >= 75 
                    ? 'bg-amber-500' 
                    : 'bg-emerald-500'
              }`}
            />
          </div>
          {binFullness >= 90 && (
            <p className="text-[9px] text-rose-400 font-mono animate-pulse flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3" /> ALERT: Machine capacity full. Remote lock active.
            </p>
          )}
        </div>
      </div>

      {/* Overrides */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Remote Control overrides</span>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => {
              const nextState = !chuteLocked;
              setChuteLocked(nextState);
              addLog(`Operator: Remote ${nextState ? 'LOCKED' : 'UNLOCKED'} input chute.`, nextState ? 'warn' : 'info');
              addLog(`[MQTT] cmd: rvm/001/cmd {"lock_chute": ${nextState}}`, 'mqtt');
            }}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${
              chuteLocked 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
            }`}
          >
            {chuteLocked ? (
              <>
                <Lock className="w-4 h-4" /> Unlock Chute Door
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 text-emerald-400" /> Lock Chute Door
              </>
            )}
          </button>
          <button 
            onClick={() => {
              setBinFullness(0);
              addLog('Operator: Emptying container bin. Resetting capacity sensor.', 'info');
              addLog('[MQTT] cmd: rvm/001/bin {"status": "cleared"}', 'mqtt');
            }}
            className="bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-300 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-rose-400" /> Purge & Empty Bin
          </button>
        </div>
      </div>

      {/* MQTT logging console */}
      <div className="flex-1 flex flex-col min-h-0 space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Live MQTT & Sensor Log</span>
        
        <div 
          ref={logConsoleRef}
          className="bg-slate-950 border border-slate-850 rounded-xl p-3 flex-1 overflow-y-auto font-mono text-[9px] space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800"
        >
          {logs.map((log) => (
            <div key={log.id} className="leading-normal">
              <span className="text-slate-600">[{log.time}] </span>
              <span className={`
                ${log.type === 'warn' ? 'text-rose-400' : ''}
                ${log.type === 'success' ? 'text-emerald-400 font-semibold' : ''}
                ${log.type === 'mqtt' ? 'text-cyan-400' : ''}
                ${log.type === 'info' ? 'text-slate-300' : ''}
              `}>
                {log.msg}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
