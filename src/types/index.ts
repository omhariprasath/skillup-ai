export type ScenarioCategory = 
  | 'academic'
  | 'executive'
  | 'negotiation'
  | 'conflict'
  | 'interview';

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  category: ScenarioCategory;
  difficulty: 'Foundation' | 'Intermediate' | 'High-Stakes';
  estimatedMinutes: number;
  personaName: string;
  personaRole: string;
  personaAvatar: string;
  personaTemperament: string;
  description: string;
  contextPrompt: string;
  initialQuestion: string;
  keySkills: string[];
  suggestedOpening: string;
}

export interface DialogueTurn {
  id: string;
  speaker: 'user' | 'interlocutor' | 'coach';
  text: string;
  timestamp: string;
  fillersDetected?: string[];
  wpmAtTurn?: number;
}

export interface ConfidenceScores {
  executivePresence: number; // 0-100
  rhetoricalClarity: number; // 0-100
  pacingComposure: number; // 0-100
  verbalHygiene: number; // 0-100
}

export interface EvaluationResult {
  readinessScore: number;
  executivePresence: number;
  rhetoricalClarity: number;
  pacingComposure: number;
  verbalHygiene: number;
  headlineSummary: string;
  strengths: string[];
  growthOpportunities: string[];
  fillerAnalysis: {
    frequency: string;
    primaryFillers: string[];
    coachingTip: string;
  };
  recommendedDrill: {
    title: string;
    description: string;
  };
  annotatedSegments?: {
    text: string;
    type: 'strength' | 'improvement' | 'filler';
    annotation: string;
  }[];
}

export interface HistoricSession {
  id: string;
  date: string;
  scenarioTitle: string;
  category: ScenarioCategory;
  durationSeconds: number;
  readinessScore: number;
  wpm: number;
  fillerCount: number;
  topFeedback: string;
}
