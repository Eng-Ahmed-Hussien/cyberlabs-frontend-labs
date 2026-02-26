import { create } from 'zustand';
import type { LabSessionResponse, HintMeta, LabStatus } from '../types';

interface LabSessionState {
  // State
  sessionId: string | null;
  status: LabStatus;
  baseScore: number;
  currentScore: number;
  iframeUrl: string | null;
  hints: HintMeta[];

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
  iframeUrl: null,
  hints: [],

  // Actions
  initSession: (data) =>
    set({
      sessionId: data.id,
      status: data.status,
      baseScore: data.baseScore,
      currentScore: data.currentScore,
      iframeUrl: data.iframeUrl,
      hints: data.hintsMeta,
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
      iframeUrl: null,
      hints: [],
    }),
}));
