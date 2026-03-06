import { create } from 'zustand';

interface UIState {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  aiMode: boolean;
  setAiMode: (aiMode: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoaded: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  aiMode: false,
  setAiMode: (aiMode) => set({ aiMode }),
}));
