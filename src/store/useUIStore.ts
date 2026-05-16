import { create } from 'zustand';

interface UIState {
  // BUG-23 FIX: Removed unused isLoaded/setIsLoaded — was never read or set anywhere
  aiMode: boolean;
  setAiMode: (aiMode: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  aiMode: false,
  setAiMode: (aiMode) => set({ aiMode }),
}));
