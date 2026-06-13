export type ExamType = 'JEE' | 'NEET' | 'UPSC' | 'CAT' | 'GATE' | 'CUET';

export interface AnalysisResult {
  mindStabilityIndex: number;
  stressLevel: string;
  burnoutRisk: string;
  hiddenTriggers: string[];
  emotionalPatterns: string[];
  positiveIndicators: string[];
  recommendations: string[];
  confidence: number;
  mindfulnessExercise: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  moodScore: number;
  exam: ExamType;
  analysis?: AnalysisResult;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
