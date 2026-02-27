import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '@/shared/api/httpClient';
import type { LabSessionResponse, NextHintResponse } from '../types';
import { useLabSessionStore } from '../store/useLabSessionStore';
import { toast } from 'sonner';

/* ─────────────────────────────────────────────────────────
   TYPES — exact backend response shapes
───────────────────────────────────────────────────────── */
export interface ConsumeTokenResponse {
  success: boolean;
  labId: string;
  instanceId: string;
  lab: {
    id: string;
    title: string;
    ar_title: string;
    description: string;
    ar_description: string;
    scenario: string | null;
    ar_scenario: string | null;
    executionMode: 'SHARED_BACKEND' | 'DOCKER' | 'VM';
    engineConfig: { targetUrl?: string } | null;
    initialState: unknown;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    category: string;
    skills: string[];
    xpReward: number;
    pointsReward: number;
    duration: number;
  };
}

/* ─────────────────────────────────────────────────────────
   HELPERS — map backend Lab → LabSessionResponse
───────────────────────────────────────────────────────── */
function mapLabToSession(
  lab: ConsumeTokenResponse['lab'],
  instanceId: string,
): LabSessionResponse {
  return {
    id: instanceId,
    status: 'ACTIVE',
    baseScore: lab.pointsReward ?? 100,
    currentScore: lab.pointsReward ?? 100,
    startedAt: new Date().toISOString(),
    template: {
      id: lab.id,
      title: lab.title,
      category: lab.category as any,
      description: lab.description,
      goal: lab.scenario ?? 'Exploit the vulnerability and capture the flag.',
      skills: lab.skills ?? [],
      badges: [],
      difficulty: lab.difficulty as any,
      scenario: lab.scenario
        ? { context: lab.scenario, exploitation: '' }
        : undefined,
      engineConfig: {
        type: 'shared-backend',
        targetUrl: (lab.engineConfig as any)?.targetUrl ?? undefined,
      },
    },
    hintsMeta: [],
  };
}

/* ─────────────────────────────────────────────────────────
   API CALLS
───────────────────────────────────────────────────────── */

/** Consumes one-time launch token → returns full lab data */
export const consumeToken = async (
  token: string,
): Promise<ConsumeTokenResponse> => {
  const res = await httpClient.post('/practice-labs/launch/consume', { token });
  return res.data;
};

/** Fetches current lab session (after token consumed) */
const fetchLabSession = async (labId: string): Promise<LabSessionResponse> => {
  const res = await httpClient.get(`/practice-labs/${labId}`);
  const lab = res.data.lab;
  const progress = lab.usersProgress?.[0];
  return {
    id: labId,
    status: progress?.flagSubmitted ? 'COMPLETED' : 'ACTIVE',
    baseScore: lab.pointsReward ?? 100,
    currentScore: lab.pointsReward ?? 100,
    startedAt: progress?.startedAt ?? new Date().toISOString(),
    completedAt: progress?.completedAt ?? undefined,
    template: {
      id: lab.id,
      title: lab.title,
      category: lab.category,
      description: lab.description,
      goal: lab.scenario ?? 'Exploit the vulnerability and capture the flag.',
      skills: lab.skills ?? [],
      badges: [],
      difficulty: lab.difficulty,
      scenario: lab.scenario
        ? { context: lab.scenario, exploitation: '' }
        : undefined,
      engineConfig: {
        type: 'shared-backend',
        targetUrl: lab.engineConfig?.targetUrl ?? undefined,
      },
    },
    hintsMeta: (lab.hints ?? []).map((h: any, i: number) => ({
      id: h.id,
      order: h.order,
      penaltyPercent: Math.round((h.xpCost / (lab.xpReward || 100)) * 100),
      isUsed: i < (progress?.hintsUsed ?? 0),
    })),
  };
};

/** Requests next hint (sequential by hintOrder) */
const requestNextHint = async (
  labId: string,
  hintOrder: number,
): Promise<
  NextHintResponse & {
    notEnoughXP?: boolean;
    required?: number;
    available?: number;
  }
> => {
  const res = await httpClient.post(`/practice-labs/${labId}/hint`, {
    hintOrder,
  });
  const data = res.data;

  if (!data.success) {
    // Not enough XP
    return {
      hintId: '',
      text: '',
      penaltyApplied: 0,
      newScore: 0,
      notEnoughXP: true,
      required: data.required,
      available: data.available,
    };
  }

  return {
    hintId: `hint_order_${hintOrder}`,
    text: data.hint.content,
    penaltyApplied: data.hint.xpCost,
    newScore: 0, // backend doesn't return new score; we deduct locally
    notEnoughXP: false,
  };
};

/** Submits the flag */
const submitFlag = async (
  labId: string,
  flag: string,
): Promise<{ finalScore: number; isFirstSolve: boolean; message: string }> => {
  const res = await httpClient.post(`/practice-labs/${labId}/submit`, { flag });
  const data = res.data;

  if (!data.isCorrect) {
    throw new Error(data.message ?? '❌ Wrong flag. Try again!');
  }

  return {
    finalScore: data.submission?.pointsEarned ?? 0,
    isFirstSolve: data.isFirstSolve,
    message: data.message,
  };
};

/* ─────────────────────────────────────────────────────────
   REACT QUERY HOOKS
───────────────────────────────────────────────────────── */

/** Used by LabSessionRoute (session-ID based access) */
export const useLabSessionQuery = (labId: string) => {
  const initSession = useLabSessionStore((s) => s.initSession);

  return useQuery({
    queryKey: ['lab-session', labId],
    queryFn: () => fetchLabSession(labId),
    refetchOnWindowFocus: false,
    select: (data) => {
      initSession(data);
      return data;
    },
  });
};

/** Used by HintsDialog */
export const useNextHintMutation = (labId: string) => {
  const hints = useLabSessionStore((s) => s.hints);
  const unlockHint = useLabSessionStore((s) => s.unlockHint);

  // Find next unused hint order
  const nextOrder = hints.filter((h) => h.isUsed).length + 1;

  return useMutation({
    mutationFn: () => requestNextHint(labId, nextOrder),
    onSuccess: (data) => {
      if (data.notEnoughXP) {
        toast.error(
          `Not enough XP! You need ${data.required} XP but only have ${data.available}.`,
        );
        return;
      }
      unlockHint(data.hintId, data.text, data.newScore);
      toast.info(`💡 Hint unlocked! (${data.penaltyApplied} XP deducted)`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? 'Failed to unlock hint.');
    },
  });
};

/** Used by SubmitFlagDialog */
export const useCompleteLabMutation = (labId: string) => {
  const queryClient = useQueryClient();
  const markAsCompleted = useLabSessionStore((s) => s.markAsCompleted);

  return useMutation({
    mutationFn: (flag?: string) => submitFlag(labId, flag ?? ''),
    onSuccess: (data) => {
      markAsCompleted(data.finalScore);
      if (data.isFirstSolve) {
        toast.success(`🎉 First solve! +${data.finalScore} points earned!`);
      } else {
        toast.success('✅ Correct flag — lab already completed before.');
      }
      queryClient.invalidateQueries({ queryKey: ['lab-session', labId] });
    },
    onError: (error: any) => {
      toast.error(error?.message ?? 'Verification failed.');
    },
  });
};

/** Exported for use in LaunchRoute */
export { mapLabToSession };
