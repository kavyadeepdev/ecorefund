import React, { useRef, useState, useEffect } from 'react';
import { 
  Recycle, Lock, Upload, RefreshCw, ShieldAlert, 
  ShieldCheck, AlertTriangle, Check, Send, Camera, Image 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DepositItem, MOCK_PRESETS, RvmMachine, SUBCATEGORY_THEMES } from './types';
import ItemSVG from './ItemSVG';

interface SmartRvmCabinetProps {
  sessionStep: 'UNAUTHENTICATED' | 'SCANNING_QR' | 'CONNECTED';
  currentSessionItems: DepositItem[];
  payoutStatus: 'idle' | 'processing' | 'success';
  cvScanning: boolean;
  uploadedImageSrc: string | null;
  uploadedFileName: string;
  cvResult: DepositItem | null;
  cvRejected: boolean;
  cvMessage: string;
  fallbackCalibrationOpen: boolean;
  chuteLocked: boolean;
  selectedMachine: RvmMachine;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectPreset: (preset: typeof MOCK_PRESETS[number]) => void;
  handleConfirmItem: () => void;
  handleResetSlot: () => void;
  handleCompletePayout: () => void;
  handleCalibrateManual: (type: 'plastic' | 'paper' | 'glass' | 'compostable' | 'unsupported') => void;
}

export default function SmartRvmCabinet({
  sessionStep,
  currentSessionItems,
  payoutStatus,
  cvScanning,
  uploadedImageSrc,
  uploadedFileName,
  cvResult,
  cvRejected,
  cvMessage,
  fallbackCalibrationOpen,
  chuteLocked,
  selectedMachine,
  handleFileUpload,
  handleSelectPreset,
  handleConfirmItem,
  handleResetSlot,
  handleCompletePayout,
  handleCalibrateManual,
}: SmartRvmCabinetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobileQuery = window.matchMedia('(max-width: 1024px)');
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobileOrTablet(mobileQuery.matches || hasTouch);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const totalSessionPayout = currentSessionItems.reduce((acc, item) => acc + item.val, 0);
  const totalSessionWeight = currentSessionItems.reduce((acc, item) => acc + item.weightGrams, 0);

  return (
    <div className="w-full bg-slate-900 rounded-3xl border border-slate-800 p-6 flex flex-col space-y-5 shadow-2xl relative overflow-hidden ring-1 ring-slate-800/80">
      
      {/* RVM LCD Interface */}
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col font-mono relative overflow-hidden">
        <div className="flex justify-between items-center text-[10px] text-slate-500 mb-2 border-b border-slate-900/60 pb-1">
          <span>RVM-001 // SECURE CHUTE</span>
          <span className="text-emerald-400 tracking-wider">ONLINE</span>
        </div>
        
        <div className="py-2 min-h-16 flex flex-col justify-center items-center text-center">
          {sessionStep === 'UNAUTHENTICATED' && (
            <div className="space-y-1.5">
              <p className="text-emerald-400 text-xs font-bold tracking-widest animate-pulse">TERMINAL LOCKED</p>
              <p className="text-[10px] text-slate-400">Initiate session from mobile application.</p>
            </div>
          )}

          {sessionStep === 'SCANNING_QR' && (
            <div className="space-y-1 flex flex-col items-center">
              <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
              <p className="text-emerald-400 text-[10px] font-bold">SCANNING CITIZEN APP AUTH...</p>
            </div>
          )}

          {sessionStep === 'CONNECTED' && (
            <div className="w-full text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> CHUTE ACCESS OPEN
                </span>
                <span className="text-slate-400 font-semibold">{currentSessionItems.length} Verified Item(s)</span>
              </div>
              
              {payoutStatus === 'idle' ? (
                <>
                  {currentSessionItems.length > 0 ? (
                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1 py-0.5 scrollbar-thin scrollbar-thumb-slate-800">
                      {currentSessionItems.map((item, index) => {
                        const theme = SUBCATEGORY_THEMES[item.subCategory || ''] || {
                          border: 'border-slate-800/50',
                          bg: 'bg-slate-950/40',
                          text: 'text-slate-400',
                          dot: 'bg-slate-500'
                        };
                        return (
                          <div 
                            key={item.id || index} 
                            className={`flex justify-between items-center px-2 py-1.5 rounded-lg border text-[10px] ${theme.border} ${theme.bg}`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${theme.dot}`} />
                              <div className="truncate">
                                <span className="font-bold text-slate-200">{item.brand || 'Generic'}</span>
                                <span className="text-slate-500 mx-1">•</span>
                                <span className="text-slate-400">{item.subCategory || item.type}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 font-mono shrink-0">
                              <span className="text-slate-500">{item.weightGrams}g</span>
                              <span className="text-emerald-400 font-bold">₹{item.val.toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-[10px] leading-relaxed italic py-1">
                      No items in chute. Use preset samples below or upload an image to simulate optical CV camera scanning.
                    </p>
                  )}
                  
                  <div className="flex justify-between font-bold text-xs text-white pt-1.5 border-t border-slate-900">
                    <span className="text-slate-400 uppercase tracking-wider text-[9px] self-center">Est. Refund</span>
                    <div className="flex items-baseline gap-1.5 font-mono">
                      <span className="text-[10px] text-slate-500 font-normal">({totalSessionWeight}g)</span>
                      <span className="text-sm text-emerald-400">₹{totalSessionPayout.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : payoutStatus === 'processing' ? (
                <div className="flex items-center justify-center gap-2 py-3">
                  <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-emerald-400 font-bold">UPI ROUTING IN PROGRESS...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-3 text-emerald-400 font-bold">
                  <Check className="w-5 h-5" />
                  <span>PAYOUT SUCCESSFUL!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ingestion Slot Camera / Upload Zone */}
      <div className="border-4 border-slate-800 rounded-3xl p-5 bg-slate-950 flex flex-col space-y-4">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>OPTICAL CHUTE CAMERA VIEWPORT</span>
          <span className={`w-2 h-2 rounded-full ${sessionStep === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
        </div>

        {/* Visual Box Slot */}
        <div className="h-44 bg-slate-900 rounded-2xl border-2 border-slate-850 flex flex-col items-center justify-center relative overflow-hidden group">
          
          {/* Shutters if locked */}
          {sessionStep !== 'CONNECTED' && (
            <div className="absolute inset-0 bg-slate-800 border border-slate-700 z-30 flex items-center justify-center">
              <span className="text-xs font-mono text-slate-500 tracking-widest flex items-center gap-2 uppercase font-bold">
                <Lock className="w-4 h-4 text-rose-500" /> Chute Sealed
              </span>
            </div>
          )}

          {/* Laser scan lines overlay */}
          {cvScanning && (
            <motion.div 
              initial={{ top: '0%' }}
              animate={{ top: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-md shadow-emerald-500/80 z-20"
            />
          )}

          {/* File reader viewport */}
          {uploadedImageSrc ? (
            <div className="w-full h-full relative flex items-center justify-center p-2 z-10">
              {/* Bounding box outline */}
              {cvResult && !cvScanning && (
                <div className={`absolute inset-4 border-2 rounded-xl z-20 pointer-events-none ${cvRejected ? 'border-rose-500 animate-pulse' : 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.15)]'}`}>
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded text-white shadow-sm ${cvRejected ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                      {cvRejected ? 'REJECTED' : 'ACCEPTED'} • {cvResult.type.toUpperCase()}
                    </span>
                    {cvResult.subCategory && (
                      <span className="bg-slate-950/95 text-[8px] border border-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded shadow-sm">
                        {cvResult.brand ? `${cvResult.brand} • ` : ''}{cvResult.subCategory}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-slate-950/95 text-[8px] border border-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded">
                    Estimated Weight: {cvResult.weightGrams}g
                  </div>
                </div>
              )}
              
              {/* Render either custom uploaded image or Preset graphic representation */}
              {uploadedImageSrc.startsWith('data:') ? (
                <img src={uploadedImageSrc} alt="uploaded item" className="max-h-full max-w-full object-contain rounded-lg opacity-80" />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1.5 p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                  <ItemSVG type={uploadedImageSrc} />
                  <span className="text-xs font-bold text-slate-300 block truncate max-w-[150px]">{uploadedFileName}</span>
                </div>
              )}
            </div>
          ) : (
            // Empty Upload trigger state
            <div className="z-10 flex flex-col items-center justify-center p-4 text-center space-y-2.5">
              {isMobileOrTablet ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">Click Photo or Select Image</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">Use your device camera or gallery</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => cameraInputRef.current?.click()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950/20"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Take Photo
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-400 text-[10px] font-bold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Image className="w-3.5 h-3.5" />
                      Gallery
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-300">Drag & Drop or Click to Upload</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">JPEG, PNG or preset items below</p>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-400 text-[10px] font-bold py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Choose Waste Image
                  </button>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload} 
              />
              <input 
                type="file" 
                ref={cameraInputRef} 
                className="hidden" 
                accept="image/*" 
                capture="environment" 
                onChange={handleFileUpload} 
              />
            </div>
          )}
        </div>

        {/* Alert Feedback messaging */}
        <AnimatePresence mode="wait">
          {cvMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3 rounded-xl text-xs font-mono flex items-start gap-2.5 ${
                cvScanning 
                  ? 'bg-slate-900 border border-slate-800 text-slate-400'
                  : cvRejected
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              }`}
            >
              {cvScanning && <RefreshCw className="w-4 h-4 animate-spin shrink-0 mt-0.5" />}
              {!cvScanning && cvRejected && <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              {!cvScanning && !cvRejected && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
              <span className="leading-snug">{cvMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fallback calibration if AI output is unknown */}
        {fallbackCalibrationOpen && (
          <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-3.5 space-y-3">
            <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Sensor Uncertainty Fallback
            </span>
            <p className="text-[10px] text-slate-400 leading-normal">
              The AI classifier is unsure of this item's texture. Please manually classify it to calibrate scale density:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button onClick={() => handleCalibrateManual('plastic')} className="bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 p-1.5 rounded text-[9px] font-semibold transition-all">Plastic</button>
              <button onClick={() => handleCalibrateManual('glass')} className="bg-slate-950 border border-slate-800 hover:border-emerald-500 text-slate-300 p-1.5 rounded text-[9px] font-semibold transition-all">Glass</button>
              <button onClick={() => handleCalibrateManual('paper')} className="bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 p-1.5 rounded text-[9px] font-semibold transition-all">Paper</button>
              <button onClick={() => handleCalibrateManual('compostable')} className="bg-slate-950 border border-slate-800 hover:border-yellow-600 text-slate-300 p-1.5 rounded text-[9px] font-semibold transition-all">Organic</button>
              <button onClick={() => handleCalibrateManual('unsupported')} className="bg-slate-950 border border-slate-800 hover:border-rose-500 col-span-2 text-slate-300 p-1.5 rounded text-[9px] font-semibold transition-all">Unsupported</button>
            </div>
          </div>
        )}

        {/* Action controller below camera slot */}
        {cvResult && !cvScanning && (
          <div className="flex gap-2">
            {cvRejected ? (
              <button 
                onClick={handleResetSlot}
                className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-xs py-2 px-4 rounded-xl transition-all border border-slate-800 cursor-pointer"
              >
                Clear Chute & Try Another
              </button>
            ) : (
              <>
                <button 
                  onClick={handleResetSlot}
                  className="w-1/3 bg-slate-900 hover:bg-slate-850 text-slate-400 font-bold text-xs py-2.5 px-4 rounded-xl transition-all border border-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmItem}
                  className="w-2/3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Add Item to Session
                </button>
              </>
            )}
          </div>
        )}

        {/* Settlement complete controls */}
        {sessionStep === 'CONNECTED' && currentSessionItems.length > 0 && !cvResult && !cvScanning && (
          <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-900/50">
            <div className="text-left font-mono">
              <span className="text-[8px] text-slate-500 block uppercase">Running Total</span>
              <span className="text-xs font-bold text-slate-200">
                ₹{totalSessionPayout.toFixed(2)} ({totalSessionWeight}g)
              </span>
            </div>
            <button 
              onClick={handleCompletePayout}
              disabled={payoutStatus !== 'idle'}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              Finish & Pay <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Quick Presets Panel */}
      <div className="space-y-3.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Or Select Preset Waste Sample</span>
          <span className="text-[10px] text-slate-500 font-mono">Simulates camera ingestion</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {MOCK_PRESETS.map((preset) => {
            const isSupported = preset.type === 'sand'
              ? selectedMachine.acceptedMaterials.includes('plastic')
              : selectedMachine.acceptedMaterials.includes(preset.type as any);

            const isDisabled = sessionStep !== 'CONNECTED' || cvScanning || !isSupported;
            const theme = SUBCATEGORY_THEMES[preset.subCategory] || {
              border: 'border-slate-800',
              bg: 'bg-slate-900/40',
              text: 'text-slate-400',
              dot: 'bg-slate-500'
            };

            return (
              <button
                key={preset.id}
                disabled={isDisabled}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-2.5 rounded-xl border transition-all flex flex-col text-xs relative overflow-hidden ${
                  sessionStep !== 'CONNECTED' 
                    ? 'opacity-40 cursor-not-allowed border-slate-800 bg-slate-900/10 text-slate-600'
                    : !isSupported
                      ? 'opacity-25 cursor-not-allowed border-rose-950/40 bg-rose-950/5 text-rose-400/60'
                      : `bg-slate-900/40 hover:bg-slate-850 cursor-pointer ${theme.border} hover:border-emerald-500/50`
                }`}
              >
                {/* Background glow aligned with subcategory color */}
                {isSupported && sessionStep === 'CONNECTED' && (
                  <div className={`absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6 blur-md opacity-15 pointer-events-none ${theme.dot}`} />
                )}

                <div className="flex justify-between items-start w-full gap-1">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono ${theme.bg} ${theme.text}`}>
                    {preset.brand}
                  </span>
                  
                  {preset.isContaminated && isSupported && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mt-1" />
                  )}
                  
                  {!isSupported && sessionStep === 'CONNECTED' && (
                    <span className="px-1 rounded bg-rose-500/20 text-[7px] font-bold text-rose-400 font-mono tracking-wide">
                      UNSUPPORTED
                    </span>
                  )}
                </div>

                <span className="font-bold text-slate-200 mt-2 block truncate w-full">{preset.name}</span>
                
                <div className="flex justify-between items-center w-full mt-1 border-t border-slate-900 pt-1 text-[9px] text-slate-500 font-mono">
                  <span>{preset.subCategory}</span>
                  <span className="font-semibold text-slate-400">{preset.weightGrams}g</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}