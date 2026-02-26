export type LabStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

export interface HintMeta {
  id: string;
  order: number;
  penaltyPercent: number;
  isUsed: boolean;
  text?: string;
}

export interface ScenarioMeta {
  context: string;
  vulnerableCode?: string;
  exploitation: string;
}

export type ExecutionEngine = 'client-side' | 'shared-backend' | 'docker-container';

export interface LabTemplate {
  id: string;
  title: string;
  category: 'SQLi' | 'XSS' | 'CSRF' | 'RCE' | 'AUTH' | 'MISC';
  description: string;
  goal: string;
  skills: string[];
  badges: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'; // Keeping old ones for backward compatibility temporarily
  scenario?: ScenarioMeta;
  engineConfig: {
    type: ExecutionEngine;
    // For client-side labs, we might pass a component name or identifier
    clientComponentId?: string;
    // For docker/shared, we pass the final URL to the iframe
    targetUrl?: string;
  };
}

export interface LabSessionResponse {
  id: string;
  status: LabStatus;
  baseScore: number;
  currentScore: number;
  startedAt: string;
  completedAt?: string;
  template: LabTemplate;
  hintsMeta: HintMeta[];
  // Deprecated: Moving towards engineConfig.targetUrl, but kept for fallback
  iframeUrl?: string; 
}

export interface NextHintResponse {
  hintId: string;
  text: string;
  penaltyApplied: number;
  newScore: number;
}