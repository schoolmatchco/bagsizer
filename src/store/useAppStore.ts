import { create } from 'zustand';

interface Bag {
  id: string;
  name: string;
  dimensions: {
    h: number;
    w: number;
    d: number;
    unit: string;
  };
  material: string;
  estimated_price: number;
  affiliate_link: string;
  categories: string[];
}

interface Airline {
  id: string;
  name: string;
  logo_code: string;
  regions: string[];
  sizers: {
    personal: {
      h: number;
      w: number;
      d: number;
      unit: string;
      strictness: string;
      hard_sided: boolean;
    };
    carry_on: {
      h: number;
      w: number;
      d: number;
      unit: string;
      strictness: string;
      hard_sided: boolean;
    };
  };
  fees: {
    gate_check: number;
  };
}

interface AppState {
  selectedBag: Bag | null;
  selectedAirline: Airline | null;
  setSelectedBag: (bag: Bag | null) => void;
  setSelectedAirline: (airline: Airline | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedBag: null,
  selectedAirline: null,
  setSelectedBag: (bag) => set({ selectedBag: bag }),
  setSelectedAirline: (airline) => set({ selectedAirline: airline }),
}));
