import { create } from 'zustand';

interface UIState {
  aiMode: boolean;
  setAiMode: (aiMode: boolean) => void;
  modelLoaded: boolean;
  setModelLoaded: (modelLoaded: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  aiMode: false,
  setAiMode: (aiMode) => set({ aiMode }),
  modelLoaded: false,
  setModelLoaded: (modelLoaded) => set({ modelLoaded }),
}));
