import React, { useState, useEffect } from 'react';
import { ArrowLeft, Recycle, Smartphone, Terminal } from 'lucide-react';
import OpenAI from 'openai';
import { DepositItem, RATES, MOCK_PRESETS, RvmMachine, MOCK_RVM_MACHINES, BrandEprRecord, INITIAL_EPR_DATA } from './digital-twin/types';
import CitizenMobileApp from './digital-twin/CitizenMobileApp';
import SmartRvmCabinet from './digital-twin/SmartRvmCabinet';
import OperatorConsole from './digital-twin/OperatorConsole';

interface DigitalTwinProps {
  onClose: () => void;
}

export default function DigitalTwin({ onClose }: DigitalTwinProps) {
  // Mobile / Citizen app state
  const [sessionStep, setSessionStep] = useState<'UNAUTHENTICATED' | 'SCANNING_QR' | 'CONNECTED'>('UNAUTHENTICATED');
  const [walletBalance, setWalletBalance] = useState<number>(45.50);
  const [carbonSaved, setCarbonSaved] = useState<number>(2.435); // kg CO2
  const [userQrToken, setUserQrToken] = useState<string>('');
  const [qrTimer, setQrTimer] = useState<number>(0);
  const [transactions, setTransactions] = useState([
    { id: 'tx-001', date: '2026-06-02', amount: 8.50, items: 3, status: 'Success' },
    { id: 'tx-002', date: '2026-05-25', amount: 14.00, items: 5, status: 'Success' },
  ]);

  // Machine Selection States
  const [selectedMachine, setSelectedMachine] = useState<RvmMachine>(MOCK_RVM_MACHINES[0]);
  const [machineWarning, setMachineWarning] = useState<string | null>(null);

  const handleMachineChange = (newMachine: RvmMachine) => {
    setSelectedMachine(newMachine);
    addLog(`RVM Connection: Switched station to ${newMachine.name}.`, 'info');

    if (currentSessionItems.length > 0) {
      // Find incompatible items
      const incompatible = currentSessionItems.filter((item) => {
        const isSupported = item.type === 'sand'
          ? newMachine.acceptedMaterials.includes('plastic')
          : newMachine.acceptedMaterials.includes(item.type as any);
        return !isSupported;
      });

      if (incompatible.length > 0) {
        const compatibleItems = currentSessionItems.filter((item) => {
          const isSupported = item.type === 'sand'
            ? newMachine.acceptedMaterials.includes('plastic')
            : newMachine.acceptedMaterials.includes(item.type as any);
          return isSupported;
        });

        setCurrentSessionItems(compatibleItems);

        const names = incompatible.map((item) => item.name).join(', ');
        const warnMsg = `Cleared ${incompatible.length} incompatible item(s) (${names}) because ${newMachine.name} does not accept those materials.`;
        setMachineWarning(warnMsg);
        addLog(`Safety alert: ${warnMsg}`, 'warn');

        // Clear warning after 6 seconds
        setTimeout(() => {
          setMachineWarning(null);
        }, 6000);
      } else {
        setMachineWarning(null);
      }
    } else {
      setMachineWarning(null);
    }

    // Reset currently scanned/ingested item if unsupported on new machine
    if (cvResult) {
      const isSupported = cvResult.type === 'sand'
        ? newMachine.acceptedMaterials.includes('plastic')
        : newMachine.acceptedMaterials.includes(cvResult.type as any);
      if (!isSupported) {
        handleResetSlot();
        addLog(`Reset scanner slot: current item is unsupported on the new station.`, 'warn');
      }
    }
  };

  // RVM Cabinet State
  const [currentSessionItems, setCurrentSessionItems] = useState<DepositItem[]>([]);
  const [chuteLocked, setChuteLocked] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [eprBalances, setEprBalances] = useState<BrandEprRecord[]>(INITIAL_EPR_DATA);

  // Scanner Vision states
  const [cvScanning, setCvScanning] = useState(false);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileType, setUploadedFileType] = useState<string>('');
  const [cvResult, setCvResult] = useState<DepositItem | null>(null);
  const [cvRejected, setCvRejected] = useState(false);
  const [cvMessage, setCvMessage] = useState<string>('');
  const [fallbackCalibrationOpen, setFallbackCalibrationOpen] = useState(false);

  // IoT / operator console logs
  const [binFullness, setBinFullness] = useState<number>(38); // % compacted fullness
  const [logs, setLogs] = useState<Array<{ id: string; time: string; msg: string; type: 'info' | 'warn' | 'success' | 'mqtt' }>>([
    { id: '1', time: '13:00:15', msg: 'Core container initialization complete.', type: 'info' },
    { id: '2', time: '13:00:16', msg: '[MQTT] connected to broker.hivemq.com:1883', type: 'mqtt' },
    { id: '3', time: '13:00:18', msg: 'Compact Chamber solenoid system calibrated.', type: 'info' },
    { id: '4', time: '13:02:40', msg: 'LIDAR fill-level sensor readings calibrated. Bin fullness: 38%.', type: 'info' },
  ]);

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' | 'mqtt' = 'info') => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { id: Math.random().toString(), time: timeStr, msg, type }]);
  };

  // Auth scan simulator trigger from Mobile application
  const handleInitiateScan = () => {
    setSessionStep('SCANNING_QR');
    addLog('Operator Terminal: scanning active Citizen QR session...', 'info');

    // Simulate standard optical connection delay
    setTimeout(() => {
      setSessionStep('CONNECTED');
      addLog(`[MQTT] authenticated: rvm/001/session {"user": "Aarav Sharma", "token": "${userQrToken}"}`, 'mqtt');
      addLog('Session active. RVM safety chute UNLOCKED.', 'success');
    }, 1500);
  };

  // Helper to parse file name keyword-based heuristics
  const analyzeFileName = (filename: string): DepositItem => {
    const nameLower = filename.toLowerCase();

    // Check if filename matches any preset name
    const presetMatch = MOCK_PRESETS.find(p => filename.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(filename.toLowerCase()));
    if (presetMatch) {
      const rate = presetMatch.type in RATES ? RATES[presetMatch.type as keyof typeof RATES] : 0;
      const val = presetMatch.isContaminated ? 0 : parseFloat(((presetMatch.weightGrams / 100) * rate).toFixed(2));
      return {
        id: Math.random().toString(),
        name: presetMatch.name,
        type: presetMatch.type,
        weightGrams: presetMatch.weightGrams,
        isContaminated: presetMatch.isContaminated,
        rejectReason: 'rejectReason' in presetMatch ? presetMatch.rejectReason : undefined,
        val,
        subCategory: presetMatch.subCategory,
        brand: presetMatch.brand
      };
    }

    if (nameLower.includes('sand') || nameLower.includes('rock') || nameLower.includes('stone') || nameLower.includes('weight')) {
      return {
        id: Math.random().toString(),
        name: filename,
        type: 'sand',
        weightGrams: 480,
        isContaminated: true,
        rejectReason: 'Weight mismatch: expected 20g-40g, scaled 480g. Sand or liquid content suspected.',
        val: 0,
        subCategory: 'PET Clear Bottle',
        brand: 'Contaminated'
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
        val: 0,
        subCategory: 'Unsupported Metal Cans',
        brand: 'Generic Metal'
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
        val: parseFloat(((w / 100) * rate).toFixed(2)),
        subCategory: 'PET Clear Bottle',
        brand: 'Generic Plastic'
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
        val: parseFloat(((w / 100) * rate).toFixed(2)),
        subCategory: 'Glass Clear Bottle',
        brand: 'Generic Glass'
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
        val: parseFloat(((w / 100) * rate).toFixed(2)),
        subCategory: 'Cardboard / Mixed Paper',
        brand: 'Generic Paper'
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
        val: parseFloat(((w / 100) * rate).toFixed(2)),
        subCategory: 'Organic Compostable',
        brand: 'Organic'
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

  // Run CV classification process using OpenRouter Vision API if configured
  const runCvAnalysis = async (item: DepositItem, srcUrl: string) => {
    setCvScanning(true);
    setCvResult(null);
    setFallbackCalibrationOpen(false);

    const openAiKey = (import.meta as any).env.VITE_OPENAI_API_KEY;
    const openAiBaseUrl = (import.meta as any).env.VITE_OPENAI_BASE_URL;
    const openAiModel = (import.meta as any).env.VITE_OPENAI_MODEL || "gpt-4o-mini";
    const isRealOpenAiConfigured = openAiKey &&
      openAiKey !== 'YOUR_API_KEY_HERE' &&
      openAiKey.trim().length > 0;

    if (srcUrl.startsWith('data:image/') && isRealOpenAiConfigured) {
      setCvMessage(`RVM LLM System: Analysing item validity with ${openAiModel}...`);
      addLog(`[AI Node] Dispatched image vision payload to ${openAiModel}.`, 'mqtt');

      try {
        const openai = new OpenAI({
          apiKey: openAiKey,
          baseURL: openAiBaseUrl || undefined,
          dangerouslyAllowBrowser: true,
          defaultHeaders: {
            "HTTP-Referer": window.location.origin,
            "X-Title": "EcoRefund DRS Digital Twin"
          }
        });

        const systemPrompt = `You are the Computer Vision system inside an automated Reverse Vending Machine (RVM) and depot scale in India.
Analyze the provided image of waste.
Classify the item into broad material classes and specific product-wise segregation sub-categories.

The broad classes are:
- "plastic" (PET bottles, beverage containers, plastic packaging)
- "glass" (bottles, jars)
- "paper" (newspapers, cardboard, flyers)
- "compostable" (food scraps, organic wastes, banana peels)
- "unsupported" (metal cans, electronic waste, toxic items)
- "unknown" (unrecognized waste or random non-waste objects)

You MUST also determine the exact product-wise subCategory and brand:
- subCategory MUST be one of these:
  1. "PET Clear Bottle" (For transparent plastic beverage bottles)
  2. "HDPE Colored Plastic" (For colored or opaque jugs/plastic containers)
  3. "Glass Clear Bottle" (For glass soda/beer/wine/jars)
  4. "Cardboard / Mixed Paper" (For newspapers, boxes, rolls, mixed papers)
  5. "Organic Compostable" (For fruit peels, food leftovers)
  6. "Unsupported Metal Cans" (For metal/aluminum beverage cans)
- brand: Identify the brand name visible on the product label (e.g. "Bisleri", "Coca-Cola", "Amul", "Times of India", "Pepsi") or return "Generic" if none is identifiable.

Check for contamination or fraud:
- "isContaminated": true if the item contains non-waste fillers (like sand/water in a plastic bottle to inflate weight), contains high levels of food residue (>10%), or is a dangerous mixture.
- "rejectReason": Provide a human-readable reason if the item is contaminated, unsupported, or unknown. Otherwise leave it empty.

Provide an estimated weight in grams:
- PET Clear Bottles: typically 20g - 40g
- HDPE Colored Plastics: typically 40g - 80g
- Glass Bottles: typically 200g - 500g
- Cardboard/Paper: typically 100g - 300g
- Compostable/Organic: typically 50g - 150g
- Metal cans: typically 15g - 25g

Format your output strictly as a JSON object with the following fields:
{
  "name": "Full descriptive name of the item (e.g. Bisleri PET Clear Bottle)",
  "type": "plastic" | "glass" | "paper" | "compostable" | "unsupported" | "unknown",
  "subCategory": "PET Clear Bottle" | "HDPE Colored Plastic" | "Glass Clear Bottle" | "Cardboard / Mixed Paper" | "Organic Compostable" | "Unsupported Metal Cans",
  "brand": "string (brand name or 'Generic')",
  "weightGrams": number,
  "isContaminated": boolean,
  "rejectReason": "string (only if rejected)"
}
Do not return any markdown formatting outside the JSON block. Return ONLY the raw JSON string.`;

        const supportsJsonMode = !openAiBaseUrl?.includes('openrouter.ai') &&
          (openAiModel.startsWith('gpt-') || openAiModel.includes('gemini-2.5') || openAiModel.includes('gemini-1.5'));

        const response = await openai.chat.completions.create({
          model: openAiModel,
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
          ...(supportsJsonMode ? { response_format: { type: "json_object" } } : {})
        });

        let content = response.choices[0]?.message?.content || '{}';
        addLog(`[AI Node] Received vision response from ${openAiModel}.`, 'mqtt');

        // Extract the JSON object substring from the response (handles leading/trailing text or markdown)
        const firstBrace = content.indexOf('{');
        const lastBrace = content.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          content = content.substring(firstBrace, lastBrace + 1);
        }

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
          val: parsed.isContaminated ? 0 : val,
          subCategory: parsed.subCategory || undefined,
          brand: parsed.brand || undefined
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
        console.error("AI vision error:", err);
        setCvScanning(false);
        addLog(`[AI Node] Error: ${err.message || 'Vision analysis failed'}. Falling back to local rules.`, 'warn');
        runLocalHeuristics(item);
      }
    } else {
      if (srcUrl.startsWith('data:image/')) {
        addLog(`[AI Node] Key not configured. Using high-fidelity local heuristic rules.`, 'info');
      } else {
        addLog(`[AI Node] Presets bypass active. Running telemetry simulation...`, 'info');
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
    const isSupported = item.type === 'sand'
      ? selectedMachine.acceptedMaterials.includes('plastic')
      : selectedMachine.acceptedMaterials.includes(item.type as any);

    if (!isSupported) {
      const rejectReason = `${selectedMachine.name} does not accept ${item.type === 'sand' ? 'plastic' : item.type} materials. Please select a compatible station or item.`;
      const detectedItem: DepositItem = {
        ...item,
        isContaminated: true,
        rejectReason,
        val: 0
      };
      setCvRejected(true);
      setCvResult(detectedItem);
      setCvMessage(`REJECTED: ${rejectReason}`);
      addLog(`Validation error: ${rejectReason}`, 'warn');
      addLog(`[MQTT] post: rvm/001/reject {"filename": "${item.name}", "reason": "Station Incompatibility"}`, 'mqtt');
      return;
    }

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
      subCategory: preset.subCategory,
      brand: preset.brand
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
    let subCategory = undefined;
    let brand = 'Generic';

    if (type === 'plastic') {
      weight = 25;
      subCategory = 'PET Clear Bottle';
    }
    if (type === 'glass') {
      weight = 350;
      subCategory = 'Glass Clear Bottle';
    }
    if (type === 'paper') {
      weight = 120;
      subCategory = 'Cardboard / Mixed Paper';
    }
    if (type === 'compostable') {
      weight = 80;
      subCategory = 'Organic Compostable';
    }
    if (type === 'unsupported') {
      weight = 20;
      isContaminated = true;
      rejectReason = 'Unrecognized hardware signature. Placed in trash bin instead.';
      subCategory = 'Unsupported Metal Cans';
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
      val,
      subCategory,
      brand
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

      // Update EPR balances
      setEprBalances((prevBalances) => {
        const nextBalances = [...prevBalances];
        currentSessionItems.forEach((item) => {
          const brandName = item.brand || 'Generic';
          const matchIndex = nextBalances.findIndex(b => b.brandName.toLowerCase() === brandName.toLowerCase());

          if (matchIndex !== -1) {
            nextBalances[matchIndex] = {
              ...nextBalances[matchIndex],
              totalWeightGrams: nextBalances[matchIndex].totalWeightGrams + item.weightGrams,
              itemsCount: nextBalances[matchIndex].itemsCount + 1,
              eprCreditsEarned: parseFloat((nextBalances[matchIndex].eprCreditsEarned + (item.weightGrams / 1000)).toFixed(3))
            };
          } else {
            nextBalances.push({
              brandName,
              materialType: item.type,
              totalWeightGrams: item.weightGrams,
              itemsCount: 1,
              eprCreditsEarned: parseFloat((item.weightGrams / 1000).toFixed(3)),
              targetWeightGrams: 3000
            });
          }

          addLog(`[MQTT] post: rvm/001/epr_update {"brand": "${brandName}", "weight_g": ${item.weightGrams}, "credits": ${(item.weightGrams / 1000).toFixed(3)}}`, 'mqtt');
        });
        return nextBalances;
      });

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
            selectedMachine={selectedMachine}
            setSelectedMachine={handleMachineChange}
            machines={MOCK_RVM_MACHINES}
            machineWarning={machineWarning}
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
            selectedMachine={selectedMachine}
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
            eprBalances={eprBalances}
          />
        </div>

      </div>
    </div>
  );
}