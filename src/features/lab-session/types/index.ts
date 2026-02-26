export type LabStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

export interface HintMeta {
  id: string;
  order: number;
  penaltyPercent: number;
  isUsed: boolean;
  text?: string;
}

export interface LabTemplate {
  id: string;
  title: string;
  description: string;
  goal: string;
  skills: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  executionMode: 'FRONTEND' | 'SHARED_BACKEND' | 'DOCKER';
}

export interface LabSessionResponse {
  id: string;
  status: LabStatus;
  baseScore: number;
  currentScore: number;
  startedAt: string;
  completedAt?: string;
  iframeUrl: string;
  template: LabTemplate;
  hintsMeta: HintMeta[];
}

export interface NextHintResponse {
  hintId: string;
  text: string;
  penaltyApplied: number;
  newScore: number;
}
