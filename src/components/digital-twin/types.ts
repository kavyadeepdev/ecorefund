export interface DepositItem {
  id: string;
  name: string;
  type: 'plastic' | 'paper' | 'compostable' | 'glass' | 'unknown' | 'unsupported' | 'sand';
  weightGrams: number;
  isContaminated: boolean;
  rejectReason?: string;
  val: number;
  imageSrc?: string;
}

export const RATES = {
  plastic: 2.0, // Rs per 100g
  paper: 0.5,   // Rs per 100g
  compostable: 0.1, // Rs per 100g
  glass: 1.0,   // Rs per 100g
};

export const MOCK_PRESETS = [
  { id: 'pres-1', name: 'PET Water Bottle (Clean)', type: 'plastic', weightGrams: 25, isContaminated: false },
  { id: 'pres-2', name: 'Glass Soda Bottle', type: 'glass', weightGrams: 320, isContaminated: false },
  { id: 'pres-3', name: 'Old Newspaper Roll', type: 'paper', weightGrams: 180, isContaminated: false },
  { id: 'pres-4', name: 'Organic Banana Peel', type: 'compostable', weightGrams: 90, isContaminated: false },
  { id: 'pres-5', name: 'Water Bottle with Sand', type: 'sand', weightGrams: 480, isContaminated: true, rejectReason: 'Moisture/Weight anomaly: density exceeds PET thresholds by 400%' },
  { id: 'pres-6', name: 'Metal Soda Can', type: 'unsupported', weightGrams: 15, isContaminated: false, rejectReason: 'Material detected: Aluminum. This kiosk only supports Plastic, Paper, Glass, and Organic waste.' }
] as const;

export interface RvmMachine {
  id: string;
  name: string;
  distance: string;
  acceptedMaterials: ('plastic' | 'glass' | 'paper' | 'compostable' | 'unsupported')[];
}

export const MOCK_RVM_MACHINES: RvmMachine[] = [
  {
    id: 'rvm-1',
    name: 'City Center Mall RVM',
    distance: '0.4 km',
    acceptedMaterials: ['plastic', 'glass', 'unsupported']
  },
  {
    id: 'rvm-2',
    name: 'Metro Station Kiosk',
    distance: '1.2 km',
    acceptedMaterials: ['plastic', 'paper', 'unsupported']
  },
  {
    id: 'rvm-3',
    name: 'Green Plaza Eco Hub',
    distance: '2.5 km',
    acceptedMaterials: ['plastic', 'glass', 'paper', 'compostable', 'unsupported']
  },
  {
    id: 'rvm-4',
    name: 'Sardar Patel Park Depot',
    distance: '3.1 km',
    acceptedMaterials: ['compostable']
  }
];

