import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Smartphone, Recycle, Coins, RefreshCw, 
  Trash2, ShieldCheck, ShieldAlert, Cpu, 
  AlertTriangle, CheckCircle, Wifi, Terminal, Lock, 
  Unlock, Send, Zap, Award, Upload, Image as ImageIcon,
  Check, X, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OpenAI from 'openai';

// Daily rates (Rs per 100g)
const RATES = {
  plastic: 2.0,
  paper: 0.5,
  compostable: 0.1,
  glass: 1.0,
};

interface DepositItem {
  id: string;
  name: string;
  type: 'plastic' | 'paper' | 'compostable' | 'glass' | 'unknown' | 'unsupported';
  weightGrams: number;
  isContaminated: boolean;
  rejectReason?: string;
  val: number;
  imageSrc?: string;
}

// Vector SVGs represented as simple JSX to render beautiful placeholders
const ItemSVG = ({ type }: { type: string }) => {
  switch (type) {
    case 'plastic':
      return (
        <svg className="w-16 h-16 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3h6l1 3v2a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V6l1-3Z" />
          <path d="M8 8.5v10a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-10" />
          <path d="M10 12h4m-4 3h4m-4 3h4" strokeDasharray="2 2" />
        </svg>
      );
    case 'glass':
      return (
        <svg className="w-16 h-16 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 2h4v4h-4z" />
          <path d="M10 6v3a4 4 0 0 1-2 3.5v7a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-7A4 4 0 0 1 14 9V6" />
          <circle cx="12" cy="14" r="1.5" className="animate-pulse" />
        </svg>
      );
    case 'paper':
      return (
        <svg className="w-16 h-16 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M8 6h8m-8 4h8m-8 4h6" strokeLinecap="round" />
        </svg>
      );
    case 'compostable':
      return (
        <svg className="w-16 h-16 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
        </svg>
      );
    case 'unsupported':
      return (
        <svg className="w-16 h-16 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h6" strokeLinecap="round" />
          <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" className="text-rose-500" />
          <path d="m16 8-8 8" stroke="currentColor" strokeWidth="2" className="text-rose-500" />
        </svg>
      );
    case 'sand':
      return (
        <svg className="w-16 h-16 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3h6l1 3v2a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V6l1-3Z" />
          <path d="M8 8.5v10a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-10" />
          <path d="M9 14s2 2 3 0 3 0 3 0v4H9v-4Z" fill="currentColor" fillOpacity="0.4" />
          <circle cx="11" cy="16" r="0.5" fill="currentColor" />
          <circle cx="13" cy="17" r="0.5" fill="currentColor" />
          <circle cx="10" cy="18" r="0.5" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className="w-16 h-16 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" strokeLinecap="round" />
        </svg>
      );
  }
};

const MOCK_PRESETS = [
  { id: 'pres-1', name: 'PET Water Bottle (Clean)', type: 'plastic', weightGrams: 25, isContaminated: false },
  { id: 'pres-2', name: 'Glass Soda Bottle', type: 'glass', weightGrams: 320, isContaminated: false },
  { id: 'pres-3', name: 'Old Newspaper Roll', type: 'paper', weightGrams: 180, isContaminated: false },
  { id: 'pres-4', name: 'Organic Banana Peel', type: 'compostable', weightGrams: 90, isContaminated: false },
  { id: 'pres-5', name: 'Water Bottle with Sand', type: 'sand', weightGrams: 480, isContaminated: true, rejectReason: 'Moisture/Weight anomaly: density exceeds PET thresholds by 400%' },
  { id: 'pres-6', name: 'Metal Soda Can', type: 'unsupported', weightGrams: 15, isContaminated: false, rejectReason: 'Material detected: Aluminum. This kiosk only supports Plastic, Paper, Glass, and Organic waste.' }
];

export default function DigitalTwin({ onClose }: { onClose: () => void }) {
  // Navigation & Session Steps
  // Steps: 'UNAUTHENTICATED' | 'SCANNING_QR' | 'CONNECTED'
  const [sessionStep, setSessionStep] = useState<'UNAUTHENTICATED' | 'SCANNING_QR' | 'CONNECTED'>('UNAUTHENTICATED');
  
  // App Wallet Balance
  const [walletBalance, setWalletBalance] = useState(150.00);
  const [carbonSaved, setCarbonSaved] = useState(8.5);
  const [userQrToken, setUserQrToken] = useState('ECO-8472-UPI');
  const [qrTimer, setQrTimer] = useState(15);
  const [transactions, setTransactions] = useState([
    { id: 'tx-001', date: '2026-05-26', amount: 8.50, items: 3, status: 'Success' },
    { id: 'tx-002', date: '2026-05-25', amount: 14.00, items: 5, status: 'Success' },
  ]);

  // RVM Cabinet State
  const [currentSessionItems, setCurrentSessionItems] = useState<DepositItem[]>([]);
  const [chuteLocked, setChuteLocked] = useState(false);
  const [binFullness, setBinFullness] = useState(42);
  const [payoutStatus, setPayoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [fallbackCalibrationOpen, setFallbackCalibrationOpen] = useState(false);

  // Current Analyzed Item states
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileType, setUploadedFileType] = useState<string>('');
  const [cvScanning, setCvScanning] = useState(false);
  const [cvResult, setCvResult] = useState<DepositItem | null>(null);
  const [cvRejected, setCvRejected] = useState<boolean>(false);
  const [cvMessage, setCvMessage] = useState<string>('');

  // Logs list
  const [logs, setLogs] = useState<{ id: string; time: string; msg: string; type: 'info' | 'warn' | 'success' | 'mqtt' }[]>([
    { id: '1', time: '13:05:00', msg: 'DRS AI-Classifier Node v2.5 initialized.', type: 'info' },
    { id: '2', time: '13:05:01', msg: '[MQTT] Subscribed to topic: rvm/001/telemetry', type: 'mqtt' },
    { id: '3', time: '13:05:02', msg: 'Chute door status: LOCKED (Awaiting user scan)', type: 'info' }
  ]);

  const logConsole = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (logConsole.current) {
      logConsole.current.scrollTop = logConsole.current.scrollHeight;
    }
  }, [logs]);

  // QR Code generator loop
  useEffect(() => {
    const timer = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          const rand = Math.floor(1000 + Math.random() * 9000);
          setUserQrToken(`ECO-${rand}-UPI`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' | 'mqtt' = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { id: Math.random().toString(), time: timeStr, msg, type }]);
  };

  // 1. Phone App Scan Click
  const handleInitiateScan = () => {
    if (sessionStep !== 'UNAUTHENTICATED') return;
    setSessionStep('SCANNING_QR');
    addLog('RVM Optical Scanner: Laser alignment triggered.', 'info');
    
    setTimeout(() => {
      setSessionStep('CONNECTED');
      addLog(`[MQTT] authenticated: rvm/001/session {"user": "Aarav Sharma", "token": "${userQrToken}"}`, 'mqtt');
      addLog('Session active. RVM safety chute UNLOCKED.', 'success');
    }, 1500);
  };

  // Helper to parse file name keyword-based heuristics
  const analyzeFileName = (filename: string): DepositItem => {
    const nameLower = filename.toLowerCase();
    
    // Heuristic checking
    if (nameLower.includes('sand') || nameLower.includes('rock') || nameLower.includes('stone') || nameLower.includes('weight')) {
      return {
        id: Math.random().toString(),
        name: filename,
        type: 'plastic', // classified as plastic visually
        weightGrams: 480,
        isContaminated: true,
        rejectReason: 'Weight mismatch: expected 20g-40g, scaled 480g. Sand or liquid content suspected.',
        val: 0
      };
    }
    if (nameLower.includes('can') || nameLower.includes('tin') || nameLower.includes('metal') || nameLower.includes('aluminum') || nameLower.includes('coke')) {
      return {
        id: Math.random().toString(),
        name: filename,
        type: 'unsupported',
        weightGrams: 15,
        isContaminated: false,
        rejectReason: 'Metal can detected. This kiosk only recycles Plastics, Paper, Glass, and Biodegradable waste.',
        val: 0
      };
    }
    if (nameLower.includes('bottle') || nameLower.includes('plastic') || nameLower.includes('pet') || nameLower.includes('water')) {
      const rate = RATES.plastic;
      const w = 25;
      return {
        id: Math.random().toString(),
        name: filename,
        type: 'plastic',
        weightGrams: w,
        isContaminated: false,
        val: parseFloat(((w / 100) * rate).toFixed(2))
      };
    }
    if (nameLower.includes('glass') || nameLower.includes('beer') || nameLower.includes('wine')) {
      const rate = RATES.glass;
      const w = 310;
      return {
        id: Math.random().toString(),
        name: filename,
        type: 'glass',
        weightGrams: w,
        isContaminated: false,
        val: parseFloat(((w / 100) * rate).toFixed(2))
      };
    }
    if (nameLower.includes('paper') || nameLower.includes('news') || nameLower.includes('cardboard') || nameLower.includes('book')) {
      const rate = RATES.paper;
      const w = 150;
      return {
        id: Math.random().toString(),
        name: filename,
        type: 'paper',
        weightGrams: w,
        isContaminated: false,
        val: parseFloat(((w / 100) * rate).toFixed(2))
      };
    }
    if (nameLower.includes('banana') || nameLower.includes('peel') || nameLower.includes('apple') || nameLower.includes('food') || nameLower.includes('waste') || nameLower.includes('organic')) {
      const rate = RATES.compostable;
      const w = 100;
      return {
        id: Math.random().toString(),
        name: filename,
        type: 'compostable',
        weightGrams: w,
        isContaminated: false,
        val: parseFloat(((w / 100) * rate).toFixed(2))
      };
    }

    // Default Unknown -> triggers manual calibration selection panel
    return {
      id: Math.random().toString(),
      name: filename,
      type: 'unknown',
      weightGrams: 0,
      isContaminated: false,
      val: 0
    };
  };

  // Run CV classification process using OpenAI Vision API if configured
  const runCvAnalysis = async (item: DepositItem, srcUrl: string) => {
    setCvScanning(true);
    setCvResult(null);
    setFallbackCalibrationOpen(false);

    const openAiKey = (import.meta as any).env.VITE_OPENAI_API_KEY;
    const isRealOpenAiConfigured = openAiKey && 
      openAiKey !== 'YOUR_API_KEY_HERE' && 
      openAiKey.trim().length > 0;

    // Custom upload vision check with OpenAI
    if (srcUrl.startsWith('data:image/') && isRealOpenAiConfigured) {
      setCvMessage('RVM LLM System: Analysing item validity with GPT-4o-mini...');
      addLog(`[OpenAI] Dispatched image vision payload to gpt-4o-mini node.`, 'mqtt');
      
      try {
        const openai = new OpenAI({
          apiKey: openAiKey,
          dangerouslyAllowBrowser: true
        });

        const systemPrompt = `You are the Computer Vision system inside an automated Reverse Vending Machine (RVM) and depot scale in India.
Analyze the provided image of waste.
Identify the material class. The allowed classes are:
- "plastic" (PET bottles, beverage containers, plastic packaging)
- "glass" (bottles, jars)
- "paper" (newspapers, cardboard, flyers)
- "compostable" (food scraps, organic wastes, banana peels)
- "unsupported" (metal cans, electronic waste, toxic items)
- "unknown" (unrecognized waste or random non-waste objects)

Check for contamination or fraud:
- "isContaminated": true if the item contains non-waste fillers (like sand/water in a plastic bottle to inflate weight), contains high levels of food residue (>10%), or is a dangerous mixture.
- "rejectReason": Provide a human-readable reason if the item is contaminated, unsupported, or unknown. Otherwise leave it empty.

Provide an estimated weight in grams:
- Plastic bottles: typically 20g - 40g
- Glass bottles: typically 200g - 500g
- Paper / Newspapers: typically 100g - 300g
- Compostable / Banana peels: typically 50g - 150g
- Metal cans: typically 15g - 25g

Format your output strictly as a JSON object with the following fields:
{
  "name": "Short descriptive name of the item (e.g. Clean Plastic Water Bottle)",
  "type": "plastic" | "glass" | "paper" | "compostable" | "unsupported" | "unknown",
  "weightGrams": number,
  "isContaminated": boolean,
  "rejectReason": "string (only if rejected)"
}
Do not return any markdown formatting outside the JSON block. Return ONLY the raw JSON string.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Classify this waste item for reverse vending deposit." },
                {
                  type: "image_url",
                  image_url: {
                    url: srcUrl
                  }
                }
              ]
            }
          ],
          response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content || '{}';
        addLog(`[OpenAI] Received vision response from gpt-4o-mini.`, 'mqtt');
        
        const parsed = JSON.parse(content);
        
        // Calculate price value based on rate sheet
        const rate = parsed.type in RATES ? RATES[parsed.type as keyof typeof RATES] : 0;
        const val = parseFloat(((parsed.weightGrams / 100) * rate).toFixed(2));

        const detectedItem: DepositItem = {
          id: Math.random().toString(),
          name: parsed.name || item.name,
          type: parsed.type || 'unknown',
          weightGrams: parsed.weightGrams || 0,
          isContaminated: !!parsed.isContaminated,
          rejectReason: parsed.rejectReason || undefined,
          val: parsed.isContaminated ? 0 : val
        };

        setCvScanning(false);
        if (detectedItem.type === 'unknown') {
          setFallbackCalibrationOpen(true);
          setCvMessage('AI confidence score < 60%. Operator manual calibration required.');
          addLog('CV Model unsure: prompting operator calibration.', 'warn');
        } else {
          processDetectionResult(detectedItem);
        }

      } catch (err: any) {
        console.error("OpenAI vision error:", err);
        setCvScanning(false);
        addLog(`[OpenAI] Error: ${err.message || 'Vision analysis failed'}. Falling back to local rules.`, 'warn');
        runLocalHeuristics(item);
      }
    } else {
      // Local/Preset mode
      if (srcUrl.startsWith('data:image/')) {
        addLog(`[OpenAI] Key not configured. Using high-fidelity local heuristic rules.`, 'info');
      } else {
        addLog(`[OpenAI] Presets bypass active. Running telemetry simulation...`, 'info');
      }
      
      setCvMessage('RVM CV System: Running deep object detection (YOLOv8)...');
      setTimeout(() => {
        setCvScanning(false);
        runLocalHeuristics(item);
      }, 1500);
    }
  };

  const runLocalHeuristics = (item: DepositItem) => {
    if (item.type === 'unknown') {
      setFallbackCalibrationOpen(true);
      setCvMessage('AI confidence score < 60%. Operator manual calibration required.');
      addLog('CV Model unsure: prompting operator calibration.', 'warn');
    } else {
      processDetectionResult(item);
    }
  };

  const processDetectionResult = (item: DepositItem) => {
    if (item.isContaminated || item.type === 'unsupported') {
      setCvRejected(true);
      setCvResult(item);
      setCvMessage(`REJECTED: ${item.rejectReason}`);
      addLog(`Safety alert: Object rejected. Reason: ${item.rejectReason}`, 'warn');
      addLog(`[MQTT] post: rvm/001/reject {"filename": "${item.name}", "reason": "${item.rejectReason}"}`, 'mqtt');
    } else {
      setCvRejected(false);
      setCvResult(item);
      setCvMessage(`ACCEPTED: Classified as ${item.type.toUpperCase()} (${item.weightGrams}g). Estimated payout: ₹${item.val.toFixed(2)}`);
      addLog(`Valid item accepted: ${item.name} | Payout: ₹${item.val.toFixed(2)}`, 'success');
      addLog(`[MQTT] post: rvm/001/deposit {"type": "${item.type}", "weight": ${item.weightGrams}, "val": ${item.val.toFixed(2)}}`, 'mqtt');
    }
  };

  // Handle Preset Image click
  const handleSelectPreset = (preset: typeof MOCK_PRESETS[0]) => {
    if (sessionStep !== 'CONNECTED' || chuteLocked) return;
    
    // Clear old status
    setCvResult(null);
    setCvRejected(false);
    
    const rate = preset.type in RATES ? RATES[preset.type as keyof typeof RATES] : 0;
    const val = (preset.weightGrams / 100) * rate;

    const item: DepositItem = {
      id: Math.random().toString(),
      name: preset.name,
      type: preset.type as any,
      weightGrams: preset.weightGrams,
      isContaminated: preset.isContaminated,
      rejectReason: preset.rejectReason,
      val: parseFloat(val.toFixed(2)),
    };

    // Use a mock SVG representation for src
    setUploadedImageSrc(preset.type);
    setUploadedFileName(preset.name);
    runCvAnalysis(item, preset.type);
  };

  // Handle File Input Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvResult(null);
    setCvRejected(false);

    setUploadedFileName(file.name);
    setUploadedFileType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const srcUrl = reader.result as string;
      setUploadedImageSrc(srcUrl);
      
      const parsedItem = analyzeFileName(file.name);
      runCvAnalysis(parsedItem, srcUrl);
    };
    reader.readAsDataURL(file);
  };

  // Confirm adding the accepted item to session list
  const handleConfirmItem = () => {
    if (!cvResult) return;
    setCurrentSessionItems((prev) => [...prev, cvResult]);
    setBinFullness((prev) => Math.min(100, prev + Math.ceil(cvResult.weightGrams / 40)));
    
    // Clear slot
    setUploadedImageSrc(null);
    setCvResult(null);
    setCvMessage('');
  };

  // Manual fallback selection if AI is unsure
  const handleCalibrateManual = (type: 'plastic' | 'paper' | 'glass' | 'compostable' | 'unsupported') => {
    setFallbackCalibrationOpen(false);
    
    let weight = 30;
    let isContaminated = false;
    let rejectReason = undefined;

    if (type === 'glass') weight = 350;
    if (type === 'paper') weight = 120;
    if (type === 'compostable') weight = 80;
    if (type === 'unsupported') {
      weight = 20;
      isContaminated = true;
      rejectReason = 'Unrecognized hardware signature. Placed in trash bin instead.';
    }

    const rate = type in RATES ? RATES[type as keyof typeof RATES] : 0;
    const val = parseFloat(((weight / 100) * rate).toFixed(2));

    const item: DepositItem = {
      id: Math.random().toString(),
      name: uploadedFileName,
      type: type as any,
      weightGrams: weight,
      isContaminated,
      rejectReason,
      val
    };

    processDetectionResult(item);
  };

  // Clear slot on rejection or reset
  const handleResetSlot = () => {
    setUploadedImageSrc(null);
    setCvResult(null);
    setCvRejected(false);
    setCvMessage('');
  };

  // Settlement UPI Transfer
  const handleCompletePayout = () => {
    if (currentSessionItems.length === 0) return;
    setPayoutStatus('processing');
    addLog('Initiating micro-UPI payout processing...', 'info');

    const totalVal = currentSessionItems.reduce((acc, item) => acc + item.val, 0);
    const totalWeight = currentSessionItems.reduce((acc, item) => acc + item.weightGrams, 0);

    setTimeout(() => {
      setWalletBalance((prev) => prev + totalVal);
      setCarbonSaved((prev) => prev + parseFloat((totalWeight * 0.0016).toFixed(3)));
      
      const newTx = {
        id: `tx-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().split('T')[0],
        amount: parseFloat(totalVal.toFixed(2)),
        items: currentSessionItems.length,
        status: 'Success'
      };

      setTransactions((prev) => [newTx, ...prev]);
      setPayoutStatus('success');
      addLog(`Instant settlement success: ₹${totalVal.toFixed(2)} sent via UPI routing.`, 'success');
      addLog(`[MQTT] post: rvm/001/payout_status {"status": "SUCCESS", "tx_id": "${newTx.id}"}`, 'mqtt');

      setTimeout(() => {
        setCurrentSessionItems([]);
        setPayoutStatus('idle');
        setSessionStep('UNAUTHENTICATED');
        handleResetSlot();
      }, 4000);
    }, 2000);
  };

  const totalSessionPayout = currentSessionItems.reduce((acc, item) => acc + item.val, 0);
  const totalSessionWeight = currentSessionItems.reduce((acc, item) => acc + item.weightGrams, 0);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl transition-all mr-2 flex items-center gap-2 text-sm font-medium cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
            <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl border border-emerald-500/30">
              <Recycle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                Eco Refund
              </span>
              <span className="text-xs text-slate-400 font-mono">
                DRS Digital Twin v2.5 // Smart Scanner
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400 font-mono tracking-widest hidden sm:inline">
              IMAGE CLASSIFIER ONLINE
            </span>
          </div>
        </div>
      </nav>

      {/* Main Panel grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= LEFT PANEL: PHONE ================= */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Citizen Mobile App
          </div>
          
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
        </div>

        {/* ================= CENTER PANEL: SMART RVM MACHINE ================= */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-400" />
            Smart RVM Cabinet
          </div>
          
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
                  <div className="w-full text-left text-xs space-y-1">
                    <div className="flex justify-between border-b border-slate-900 pb-1 mb-1">
                      <span className="text-emerald-400 font-bold">CHUTE ACCESS GRANTED</span>
                      <span className="text-slate-400 font-semibold">{currentSessionItems.length} Verified</span>
                    </div>
                    {payoutStatus === 'idle' ? (
                      <>
                        <p className="text-slate-400">Scan waste item using upload or presets below.</p>
                        <div className="flex justify-between font-bold text-sm text-white pt-1">
                          <span>Session Payout:</span>
                          <span className="text-emerald-400 font-mono">₹{totalSessionPayout.toFixed(2)}</span>
                        </div>
                      </>
                    ) : payoutStatus === 'processing' ? (
                      <div className="flex items-center justify-center gap-2 py-2">
                        <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                        <span className="text-emerald-400 font-bold">UPI ROUTING IN PROGRESS...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 py-2 text-emerald-400 font-bold">
                        <CheckCircle className="w-5 h-5" />
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
                      <div className={`absolute inset-4 border-2 rounded-xl z-20 pointer-events-none ${cvRejected ? 'border-rose-500 animate-pulse' : 'border-emerald-500'}`}>
                        <span className={`absolute top-2 left-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded text-white ${cvRejected ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                          {cvRejected ? 'REJECTED' : 'ACCEPTED'} • {cvResult.type.toUpperCase()} ({cvResult.weightGrams}g)
                        </span>
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
                  <div className="z-10 flex flex-col items-center justify-center p-4 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:border-emerald-500/40 transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-300">Drag & Drop or Click to Upload</p>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">JPEG, PNG or preset items below</p>
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-400 text-slate-400 text-[10px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                    >
                      Choose Waste Image
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
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
                {MOCK_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    disabled={sessionStep !== 'CONNECTED' || cvScanning}
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-2.5 rounded-xl border transition-all flex flex-col text-xs relative ${
                      sessionStep !== 'CONNECTED' 
                        ? 'opacity-40 cursor-not-allowed border-slate-800 bg-slate-900/10 text-slate-600'
                        : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 text-slate-300 cursor-pointer'
                    }`}
                  >
                    {preset.isContaminated && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                    <span className="font-semibold block truncate w-[90%]">{preset.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">{preset.weightGrams}g • {preset.type}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ================= RIGHT PANEL: OPERATOR IoT DASHBOARD ================= */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Operator IoT Console
          </div>
          
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
                    setChuteLocked(!chuteLocked);
                    addLog(`Operator: Remote ${!chuteLocked ? 'LOCKED' : 'UNLOCKED'} input chute.`, !chuteLocked ? 'warn' : 'info');
                    addLog(`[MQTT] cmd: rvm/001/cmd {"lock_chute": ${!chuteLocked}}`, 'mqtt');
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${
                    chuteLocked 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  {chuteLocked ? (
                    <>
                      <Lock className="w-4 h-4" /> Unlock Chute Chute
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
                ref={logConsole}
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
        </div>

      </div>
    </div>
  );
}
