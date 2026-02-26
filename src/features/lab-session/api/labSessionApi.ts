import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '@/shared/api/httpClient';
import type { LabSessionResponse, NextHintResponse } from '../types';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { toast } from 'sonner';

// --- API Calls ---

const fetchLabSession = async (
  sessionId: string,
): Promise<LabSessionResponse> => {
  const { data } = await httpClient.get(`/api/v1/lab-instances/${sessionId}`);
  return data;
};

const requestNextHint = async (
  sessionId: string,
): Promise<NextHintResponse> => {
  const { data } = await httpClient.post(
    `/api/v1/lab-instances/${sessionId}/hints/next`,
  );
  return data;
};

const submitLabCompletion = async (
  sessionId: string,
  flag?: string,
): Promise<{ finalScore: number }> => {
  // 'flag' is optional depending on whether the lab is auto-checked by backend or requires a flag
  const { data } = await httpClient.post(
    `/api/v1/lab-instances/${sessionId}/complete`,
    { flag },
  );
  return data;
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
      const msg = error.response?.data?.message || 'Failed to unlock hint.';
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
      const msg =
        error.response?.data?.message || 'Verification failed. Try again.';
      toast.error(msg);
    },
  });
};
