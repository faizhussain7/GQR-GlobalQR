import { ParsedQRData } from "@/src/utils/qrParser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface ScanHistoryItem extends ParsedQRData {
  id: string;
  timestamp: number;
}

interface ScanStore {
  currentScan: ParsedQRData | null;
  scanHistory: ScanHistoryItem[];
  isScanning: boolean;

  // Actions
  setCurrentScan: (scan: ParsedQRData | null) => void;
  addToHistory: (scan: ParsedQRData) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  removeFromHistory: (id: string) => Promise<void>;
  setIsScanning: (isScanning: boolean) => void;
}

const HISTORY_STORAGE_KEY = "@qr_scan_history";
const MAX_HISTORY_ITEMS = 100;

export const useScanStore = create<ScanStore>((set, get) => ({
  currentScan: null,
  scanHistory: [],
  isScanning: true,

  setCurrentScan: (scan) => set({ currentScan: scan }),

  addToHistory: async (scan) => {
    const historyItem: ScanHistoryItem = {
      ...scan,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const currentHistory = get().scanHistory;

    // Check if this exact content was already scanned recently (within 5 seconds)
    const recentDuplicate = currentHistory.find(
      (item) => item.raw === scan.raw && Date.now() - item.timestamp < 5000
    );

    if (recentDuplicate) {
      return; // Don't add duplicates
    }

    const newHistory = [historyItem, ...currentHistory].slice(
      0,
      MAX_HISTORY_ITEMS
    );

    set({ scanHistory: newHistory });

    try {
      await AsyncStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(newHistory)
      );
    } catch (error) {
      console.error("Error saving scan history:", error);
    }
  },

  loadHistory: async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        set({ scanHistory: history });
      }
    } catch (error) {
      console.error("Error loading scan history:", error);
    }
  },

  clearHistory: async () => {
    set({ scanHistory: [] });
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing scan history:", error);
    }
  },

  removeFromHistory: async (id) => {
    const newHistory = get().scanHistory.filter((item) => item.id !== id);
    set({ scanHistory: newHistory });

    try {
      await AsyncStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(newHistory)
      );
    } catch (error) {
      console.error("Error removing from history:", error);
    }
  },

  setIsScanning: (isScanning) => set({ isScanning }),
}));
