import { create } from 'zustand';
import type { LabSessionResponse, HintMeta, LabStatus, LabTemplate } from '../types';

interface LabSessionState {
  // State
  sessionId: string | null;
  status: LabStatus;
  baseScore: number;
  currentScore: number;
  hints: HintMeta[];
  template: LabTemplate | null;

  // Computed/Derived conceptually
  targetUrl: string | null;

  // Actions
  initSession: (data: LabSessionResponse) => void;
  unlockHint: (hintId: string, text: string, newScore: number) => void;
  markAsCompleted: (finalScore: number) => void;
  reset: () => void;
}

export const useLabSessionStore = create<LabSessionState>((set) => ({
  // Initial State
  sessionId: null,
  status: 'ACTIVE',
  baseScore: 100,
  currentScore: 100,
  hints: [],
  template: null,
  targetUrl: null,

  // Actions
  initSession: (data) =>
    set({
      sessionId: data.id,
      status: data.status,
      baseScore: data.baseScore,
      currentScore: data.currentScore,
      hints: data.hintsMeta,
      template: data.template,
      targetUrl: data.template?.engineConfig?.targetUrl || data.iframeUrl || null,
    }),

  unlockHint: (hintId, text, newScore) =>
    set((state) => ({
      currentScore: newScore,
      hints: state.hints.map((hint) =>
        hint.id === hintId ? { ...hint, isUsed: true, text } : hint,
      ),
    })),

  markAsCompleted: (finalScore) =>
    set({
      status: 'COMPLETED',
      currentScore: finalScore,
    }),

  reset: () =>
    set({
      sessionId: null,
      status: 'ACTIVE',
      baseScore: 100,
      currentScore: 100,
      hints: [],
      template: null,
      targetUrl: null,
    }),
}));