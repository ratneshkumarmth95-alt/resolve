import { create } from 'zustand';
import { MachineData, InterventionData } from './mock-data';

export type Timeframe = '24h' | '7d' | '30d';

interface MurmurState {
  timeframe: Timeframe;
  earlyActionToggle: boolean; // false = Without Early Action, true = With Early Action
  speedFactor: 1 | 10 | 60;
  machines: MachineData[];
  interventions: InterventionData[];
  totalSavedDollars: number;
  totalHoursPreserved: number;
  failuresAverted: number;
  selectedMachineId: string | null;
  toastMessage: { id: string; title: string; desc: string; type: 'success' | 'amber' | 'info' } | null;

  setTimeframe: (t: Timeframe) => void;
  setEarlyActionToggle: (val: boolean) => void;
  setSpeedFactor: (s: 1 | 10 | 60) => void;
  setMachines: (m: MachineData[]) => void;
  setInterventions: (i: InterventionData[]) => void;
  setSelectedMachineId: (id: string | null) => void;
  showToast: (title: string, desc: string, type?: 'success' | 'amber' | 'info') => void;
  clearToast: () => void;
  updateStateFromApi: (data: any) => void;
}

export const useMurmurStore = create<MurmurState>((set) => ({
  timeframe: '24h',
  earlyActionToggle: false,
  speedFactor: 1,
  machines: [],
  interventions: [],
  totalSavedDollars: 482500,
  totalHoursPreserved: 142.5,
  failuresAverted: 19,
  selectedMachineId: null,
  toastMessage: null,

  setTimeframe: (t) => set({ timeframe: t }),
  setEarlyActionToggle: (val) => set({ earlyActionToggle: val }),
  setSpeedFactor: (s) => set({ speedFactor: s }),
  setMachines: (machines) => set({ machines }),
  setInterventions: (interventions) => set({ interventions }),
  setSelectedMachineId: (id) => set({ selectedMachineId: id }),
  showToast: (title, desc, type = 'success') =>
    set({
      toastMessage: { id: Date.now().toString(), title, desc, type },
    }),
  clearToast: () => set({ toastMessage: null }),
  updateStateFromApi: (data) =>
    set((state) => ({
      machines: data.machines || state.machines,
      interventions: data.interventions || state.interventions,
      totalSavedDollars: data.totalSavedDollars ?? state.totalSavedDollars,
      totalHoursPreserved: data.totalHoursPreserved ?? state.totalHoursPreserved,
      failuresAverted: data.failuresAverted ?? state.failuresAverted,
      speedFactor: data.speedFactor ?? state.speedFactor,
    })),
}));
