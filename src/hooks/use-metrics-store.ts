import { create } from 'zustand';
import type { DailyMetrics, FocusSession } from '@/lib/types/focus';

interface MetricsState {
  dailyMetrics: DailyMetrics | null;
  focusSessions: FocusSession[];
  isLoading: boolean;
  error: string | null;
  setDailyMetrics: (metrics: DailyMetrics) => void;
  setFocusSessions: (sessions: FocusSession[]) => void;
  updateFocusTime: (minutes: number) => void;
  updateDeepWorkSessions: (count: number) => void;
  reset: () => void;
}

export const useMetricsStore = create<MetricsState>((set) => ({
  dailyMetrics: null,
  focusSessions: [],
  isLoading: true,
  error: null,
  setDailyMetrics: (metrics) => set({ dailyMetrics: metrics }),
  setFocusSessions: (sessions) => set({ focusSessions: sessions }),
  updateFocusTime: (minutes) => 
    set((state) => ({
      dailyMetrics: state.dailyMetrics 
        ? { ...state.dailyMetrics, focus_time: state.dailyMetrics.focus_time + minutes }
        : null
    })),
  updateDeepWorkSessions: (count) =>
    set((state) => ({
      dailyMetrics: state.dailyMetrics
        ? { ...state.dailyMetrics, deep_work_sessions: state.dailyMetrics.deep_work_sessions + count }
        : null
    })),
  reset: () => set({ dailyMetrics: null, focusSessions: [], isLoading: true, error: null }),
}));