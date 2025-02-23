import { create } from 'zustand';

interface AgentState {
  isResponding: boolean;
  inputMode: 'mobile' | 'desktop';
  setInputMode: (mode: 'mobile' | 'desktop') => void;
}

export const useAgentStore = create<AgentState>((set: any) => ({
  isResponding: false,
  inputMode: 'desktop',
  setInputMode: (mode: 'mobile' | 'desktop') => set({ inputMode: mode }),
}));
