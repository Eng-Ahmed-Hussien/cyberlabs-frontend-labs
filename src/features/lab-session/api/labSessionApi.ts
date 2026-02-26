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

// ... (keep the useLabSessionQuery and useNextHintMutation hooks exactly as they were in the previous message) ...
