import { create } from 'zustand';

export interface Bag {
  id: string;
  name: string;
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
}

export interface Sizer {
  h: number;
  w: number;
  d: number;
  unit: string;
  strictness: 'extreme' | 'high' | 'medium';
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
  selectedBag: Bag | null;
  selectedAirline: Airline | null;
  selectedSizerType: 'personal' | 'carry_on';
  setSelectedBag: (bag: Bag | null) => void;
  setSelectedAirline: (airline: Airline | null) => void;
  setSelectedSizerType: (type: 'personal' | 'carry_on') => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedBag: null,
  selectedAirline: null,
  selectedSizerType: 'carry_on',
  setSelectedBag: (bag) => set({ selectedBag: bag }),
  setSelectedAirline: (airline) => set({ selectedAirline: airline }),
  setSelectedSizerType: (type) => set({ selectedSizerType: type }),
}));
