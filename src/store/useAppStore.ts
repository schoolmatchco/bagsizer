import { create } from 'zustand';

export interface Bag {
  id: string;
  name: string;
  brand?: string;
  dimensions: {
    h: number;
    w: number;
    d: number;
    unit: string;
  };
  material: 'soft' | 'hard';
  estimated_price: number;
  affiliate_link: string;
  categories: string[];
  description: string;
  commission_tier?: 'high' | 'medium' | 'low';
  image_url?: string;
  versatility_score?: number;
}

export interface Sizer {
  h: number;
  w: number;
  d: number;
  unit: string;
  strictness: 'extreme' | 'high' | 'medium' | 'low';
  hard_sided: boolean;
}

export interface Airline {
  id: string;
  name: string;
  logo: string;
  regions: string[];
  sizers: {
    personal: Sizer;
    carry_on: Sizer;
  };
  fees: {
    gate_check: number;
  };
}

interface AppState {
  // Airline selection
  selectedAirline: Airline | null;
  selectedSizerType: 'personal' | 'carry_on';

  // Bag selection (from database)
  selectedBag: Bag | null;

  // Custom dimensions (manual input)
  customDimensions: { h: number; w: number; d: number; unit: string } | null;

  // Actions
  setSelectedBag: (bag: Bag | null) => void;
  setSelectedAirline: (airline: Airline | null) => void;
  setSelectedSizerType: (type: 'personal' | 'carry_on') => void;
  setCustomDimensions: (dims: { h: number; w: number; d: number; unit: string } | null) => void;
  clearSelection: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedBag: null,
  selectedAirline: null,
  selectedSizerType: 'carry_on',
  customDimensions: null,

  setSelectedBag: (bag) => set({ selectedBag: bag, customDimensions: null }),
  setSelectedAirline: (airline) => set({ selectedAirline: airline }),
  setSelectedSizerType: (type) => set({ selectedSizerType: type }),
  setCustomDimensions: (dims) => set({ customDimensions: dims, selectedBag: null }),
  clearSelection: () => set({ selectedBag: null, customDimensions: null }),
}));
