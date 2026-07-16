export interface DepositItem {
  id: string;
  name: string;
  type: 'plastic' | 'paper' | 'compostable' | 'glass' | 'unknown' | 'unsupported' | 'sand';
  weightGrams: number;
  isContaminated: boolean;
  rejectReason?: string;
  val: number;
  imageSrc?: string;
  subCategory?: string;
  brand?: string;
}

export const RATES = {
  plastic: 2.0, // Rs per 100g
  paper: 0.5,   // Rs per 100g
  compostable: 0.1, // Rs per 100g
  glass: 1.0,   // Rs per 100g
};

export const MOCK_PRESETS = [
  { 
    id: 'pres-1', 
    name: 'Bisleri PET Bottle', 
    type: 'plastic', 
    weightGrams: 25, 
    isContaminated: false,
    subCategory: 'PET Clear Bottle',
    brand: 'Bisleri'
  },
  { 
    id: 'pres-2', 
    name: 'Amul Milk Jug', 
    type: 'plastic', 
    weightGrams: 55, 
    isContaminated: false,
    subCategory: 'HDPE Colored Plastic',
    brand: 'Amul'
  },
  { 
    id: 'pres-3', 
    name: 'Coca-Cola Glass Soda', 
    type: 'glass', 
    weightGrams: 320, 
    isContaminated: false,
    subCategory: 'Glass Clear Bottle',
    brand: 'Coca-Cola'
  },
  { 
    id: 'pres-4', 
    name: 'Times of India News Roll', 
    type: 'paper', 
    weightGrams: 180, 
    isContaminated: false,
    subCategory: 'Cardboard / Mixed Paper',
    brand: 'Times of India'
  },
  { 
    id: 'pres-5', 
    name: 'Organic Banana Peel', 
    type: 'compostable', 
    weightGrams: 90, 
    isContaminated: false,
    subCategory: 'Organic Compostable',
    brand: 'Local Farms'
  },
  { 
    id: 'pres-6', 
    name: 'PET Bottle with Sand', 
    type: 'sand', 
    weightGrams: 480, 
    isContaminated: true, 
    rejectReason: 'Moisture/Weight anomaly: density exceeds PET thresholds by 400%',
    subCategory: 'PET Clear Bottle',
    brand: 'Aquafina'
  },
  { 
    id: 'pres-7', 
    name: 'Pepsi Aluminum Can', 
    type: 'unsupported', 
    weightGrams: 15, 
    isContaminated: false, 
    rejectReason: 'Material detected: Aluminum. This kiosk only supports Plastic, Paper, Glass, and Organic waste.',
    subCategory: 'Unsupported Metal Cans',
    brand: 'Pepsi'
  }
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

// Helper styles for product-wise categories
export const SUBCATEGORY_THEMES: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  'PET Clear Bottle': {
    border: 'border-sky-500/30',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    dot: 'bg-sky-500'
  },
  'HDPE Colored Plastic': {
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    dot: 'bg-purple-500'
  },
  'Glass Clear Bottle': {
    border: 'border-teal-500/30',
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    dot: 'bg-teal-500'
  },
  'Cardboard / Mixed Paper': {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-500'
  },
  'Organic Compostable': {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500'
  },
  'Unsupported Metal Cans': {
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    dot: 'bg-rose-500'
  }
};

export interface BrandEprRecord {
  brandName: string;
  materialType: string;
  totalWeightGrams: number;
  itemsCount: number;
  eprCreditsEarned: number;
  targetWeightGrams: number;
}

export const INITIAL_EPR_DATA: BrandEprRecord[] = [
  {
    brandName: 'Bisleri',
    materialType: 'plastic',
    totalWeightGrams: 1850,
    itemsCount: 74,
    eprCreditsEarned: 1.85,
    targetWeightGrams: 5000,
  },
  {
    brandName: 'Amul',
    materialType: 'plastic',
    totalWeightGrams: 2200,
    itemsCount: 40,
    eprCreditsEarned: 2.20,
    targetWeightGrams: 4000,
  },
  {
    brandName: 'Coca-Cola',
    materialType: 'glass',
    totalWeightGrams: 6400,
    itemsCount: 20,
    eprCreditsEarned: 6.40,
    targetWeightGrams: 10000,
  },
  {
    brandName: 'Times of India',
    materialType: 'paper',
    totalWeightGrams: 3600,
    itemsCount: 20,
    eprCreditsEarned: 3.60,
    targetWeightGrams: 6000,
  },
  {
    brandName: 'Local Farms',
    materialType: 'compostable',
    totalWeightGrams: 900,
    itemsCount: 10,
    eprCreditsEarned: 0.90,
    targetWeightGrams: 2000,
  },
];