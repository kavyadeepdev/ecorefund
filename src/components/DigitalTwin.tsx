import React, { useState, useEffect } from 'react';
import { ArrowLeft, Recycle, Smartphone, Terminal } from 'lucide-react';
import OpenAI from 'openai';
import { DepositItem, RATES, MOCK_PRESETS } from './digital-twin/types';
import CitizenMobileApp from './digital-twin/CitizenMobileApp';
import SmartRvmCabinet from './digital-twin/SmartRvmCabinet';
import OperatorConsole from './digital-twin/OperatorConsole';

interface DigitalTwinProps {
  onClose: () => void;
}

export default function DigitalTwin({ onClose }: DigitalTwinProps) {
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
    
    if (nameLower.includes('sand') || nameLower.includes('rock') || nameLower.includes('stone') || nameLower.includes('weight')) {
      return {
        id: Math.random().toString(),
        name: filename,
        type: 'sand',
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
  const handleSelectPreset = (preset: typeof MOCK_PRESETS[number]) => {
    if (sessionStep !== 'CONNECTED' || chuteLocked) return;
    
    setCvResult(null);
    setCvRejected(false);
    
    const rate = preset.type in RATES ? RATES[preset.type as keyof typeof RATES] : 0;
    const val = (preset.weightGrams / 100) * rate;

    const item: DepositItem = {
      id: Math.random().toString(),
      name: preset.name,
      type: preset.type,
      weightGrams: preset.weightGrams,
      isContaminated: preset.isContaminated,
      rejectReason: 'rejectReason' in preset ? preset.rejectReason : undefined,
      val: parseFloat(val.toFixed(2)),
    };

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
      type,
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
          
          <CitizenMobileApp
            sessionStep={sessionStep}
            walletBalance={walletBalance}
            carbonSaved={carbonSaved}
            userQrToken={userQrToken}
            qrTimer={qrTimer}
            transactions={transactions}
            handleInitiateScan={handleInitiateScan}
          />
        </div>

        {/* ================= CENTER PANEL: SMART RVM MACHINE ================= */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Recycle className="w-4 h-4 text-emerald-400" />
            Smart RVM Cabinet
          </div>
          
          <SmartRvmCabinet
            sessionStep={sessionStep}
            currentSessionItems={currentSessionItems}
            payoutStatus={payoutStatus}
            cvScanning={cvScanning}
            uploadedImageSrc={uploadedImageSrc}
            uploadedFileName={uploadedFileName}
            cvResult={cvResult}
            cvRejected={cvRejected}
            cvMessage={cvMessage}
            fallbackCalibrationOpen={fallbackCalibrationOpen}
            chuteLocked={chuteLocked}
            handleFileUpload={handleFileUpload}
            handleSelectPreset={handleSelectPreset}
            handleConfirmItem={handleConfirmItem}
            handleResetSlot={handleResetSlot}
            handleCompletePayout={handleCompletePayout}
            handleCalibrateManual={handleCalibrateManual}
          />
        </div>

        {/* ================= RIGHT PANEL: OPERATOR IoT DASHBOARD ================= */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Operator IoT Console
          </div>
          
          <OperatorConsole
            chuteLocked={chuteLocked}
            setChuteLocked={setChuteLocked}
            binFullness={binFullness}
            setBinFullness={setBinFullness}
            logs={logs}
            addLog={addLog}
          />
        </div>

      </div>
    </div>
  );
}
