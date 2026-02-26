import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LabSessionResponse, NextHintResponse } from '../types';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { toast } from 'sonner';
import { mockLabSession, mockHintTexts } from './mockData';

// --- MOCKED API Calls ---

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Temporary in-memory state for the mock to persist hint usage during the session
let currentMockSession = { ...mockLabSession };

const fetchLabSession = async (
  sessionId: string,
): Promise<LabSessionResponse> => {
  await delay(1000); // Simulate network latency

  if (sessionId === 'error-test') {
    throw new Error('Lab instance not found or expired.');
  }

  // Restore from memory if we unlocked hints
  return currentMockSession;
};

const requestNextHint = async (
  sessionId: string,
): Promise<NextHintResponse> => {
  await delay(800); // Simulate network latency

  // Find next unused hint
  const nextHintIndex = currentMockSession.hintsMeta.findIndex(
    (h) => !h.isUsed,
  );

  if (nextHintIndex === -1) {
    throw new Error('No more hints available.');
  }

  const hintToUnlock = currentMockSession.hintsMeta[nextHintIndex];
  const penaltyAmount =
    (currentMockSession.baseScore * hintToUnlock.penaltyPercent) / 100;
  const newScore = Math.max(0, currentMockSession.currentScore - penaltyAmount);

  // Update mock memory
  currentMockSession.hintsMeta[nextHintIndex].isUsed = true;
  currentMockSession.hintsMeta[nextHintIndex].text =
    mockHintTexts[hintToUnlock.id];
  currentMockSession.currentScore = newScore;

  return {
    hintId: hintToUnlock.id,
    text: mockHintTexts[hintToUnlock.id],
    penaltyApplied: penaltyAmount,
    newScore: newScore,
  };
};

const submitLabCompletion = async (
  sessionId: string,
  flag?: string
): Promise<{ finalScore: number }> => {
  await delay(1000);
  
  if (flag !== 'CYBER{SQLI_Byp4ss_M0ck}' && flag !== undefined) {
    throw new Error('Invalid flag');
  }

  currentMockSession.status = 'COMPLETED';
  return { finalScore: currentMockSession.currentScore };
};

// --- React Query Hooks ---

export const useLabSessionQuery = (sessionId: string) => {
  const initSession = useLabSessionStore((state) => state.initSession);

  return useQuery({
    queryKey: ['lab-session', sessionId],
    queryFn: () => fetchLabSession(sessionId),
    // Security/UX: We don't want the iframe to reload if the user switches tabs
    refetchOnWindowFocus: false, 
    // Synchronize Server State with Zustand Client State upon successful fetch
    select: (data) => {
      initSession(data);
      return data;
    },
  });
};

export const useNextHintMutation = (sessionId: string) => {
  const unlockHint = useLabSessionStore((state) => state.unlockHint);

  return useMutation({
    mutationFn: () => requestNextHint(sessionId),
    onSuccess: (data) => {
      // Instantly update UI without refetching the whole session
      unlockHint(data.hintId, data.text, data.newScore);
      toast.info('Hint unlocked! Your potential score has decreased.');
    },
    onError: (error: any) => {
      const msg = error.message || 'Failed to unlock hint.';
      toast.error(msg);
    },
  });
};

export const useCompleteLabMutation = (sessionId: string) => {
  const queryClient = useQueryClient();
  const markAsCompleted = useLabSessionStore((state) => state.markAsCompleted);

  return useMutation({
    mutationFn: (flag?: string) => submitLabCompletion(sessionId, flag),
    onSuccess: (data) => {
      markAsCompleted(data.finalScore);
      toast.success(`🎉 Lab Completed! Final Score: ${data.finalScore}`);
      
      // Invalidate query to ensure fresh data if the user re-enters
      queryClient.invalidateQueries({ queryKey: ['lab-session', sessionId] });
    },
    onError: (error: any) => {
      const msg = error.message || 'Verification failed. Try again.';
      toast.error(msg);
    },
  });
};