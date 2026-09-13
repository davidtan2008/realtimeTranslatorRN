import type { AppLanguage } from './AppLanguage';
import type { FeatureID } from './FeatureID';

export type TaskStatus = 'running' | 'pausedListening' | 'ended';

export type TranscriptEntry = {
  id: string;
  source: AppLanguage;
  sourceText: string;
  translatedText: string;
  isFinal: boolean;
  recordedAt: number;
};

export type ConversationSummary = {
  text: string;
  generatedOnDevice: boolean;
};

export type TaskSession = {
  id: string;
  feature: FeatureID;
  status: TaskStatus;
  startedAt: number;
  endedAt?: number;
  title: string;
  sourceLanguage: AppLanguage;
  targetLanguage?: AppLanguage;
  entries: TranscriptEntry[];
  summary?: ConversationSummary;
};

export const MEETING_TRANSCRIPT_LIMIT = 20_000;

export function hasTranscript(task: TaskSession): boolean {
  return task.entries.some((entry) => entry.sourceText.trim().length > 0);
}
