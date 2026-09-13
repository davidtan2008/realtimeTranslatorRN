import { defaultPeer, nativeName, type AppLanguage } from './AppLanguage';
import type { FeatureID } from './FeatureID';
import type { ConversationSummary, TaskSession, TaskStatus, TranscriptEntry } from './TaskSession';
import { hasTranscript } from './TaskSession';

export type Utterance = {
  id: string;
  language: AppLanguage;
  text: string;
  isFinal: boolean;
};

export type SummaryAvailability =
  | 'available'
  | 'deviceNotEligible'
  | 'modelNotReady'
  | 'unavailable';

export type SpeechRecognitionStyle = 'liveCaptions' | 'meetingNotes';

export interface TaskStore {
  activeTask(feature: FeatureID): Promise<TaskSession | undefined>;
  unfinishedTasks(): Promise<TaskSession[]>;
  startNew(
    feature: FeatureID,
    source: AppLanguage,
    target?: AppLanguage,
  ): Promise<TaskSession>;
  append(taskId: string, entries: TranscriptEntry[]): Promise<void>;
  setStatus(taskId: string, status: TaskStatus): Promise<void>;
  end(taskId: string, summary?: ConversationSummary): Promise<TaskSession>;
  list(filter?: FeatureID): Promise<TaskSession[]>;
  task(id: string): Promise<TaskSession | undefined>;
  delete(id: string): Promise<void>;
}

export function makeTitle(
  feature: FeatureID,
  source: AppLanguage,
  target?: AppLanguage,
): string {
  const pair = target ?? defaultPeer(source);
  if (feature === 'faceToFace') {
    return `面对面 · ${nativeName(source)} ↔ ${nativeName(pair)}`;
  }
  if (feature === 'simultaneous') {
    return `同声传译 · ${nativeName(source)} → ${nativeName(pair)}`;
  }
  return `会议 · ${nativeName(source)}`;
}

export class InMemoryTaskStore implements TaskStore {
  private tasks = new Map<string, TaskSession>();

  async activeTask(feature: FeatureID): Promise<TaskSession | undefined> {
    return [...this.tasks.values()]
      .reverse()
      .find((item) => item.feature === feature && item.status !== 'ended');
  }

  async unfinishedTasks(): Promise<TaskSession[]> {
    return [...this.tasks.values()].filter((item) => item.status !== 'ended').reverse();
  }

  async startNew(
    feature: FeatureID,
    source: AppLanguage,
    target?: AppLanguage,
  ): Promise<TaskSession> {
    const existing = await this.activeTask(feature);
    if (existing) {
      if (!hasTranscript(existing)) {
        this.tasks.delete(existing.id);
      } else {
        existing.status = 'ended';
        existing.endedAt = Date.now();
      }
    }
    const session: TaskSession = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      feature,
      status: 'running',
      startedAt: Date.now(),
      title: makeTitle(feature, source, target),
      sourceLanguage: source,
      targetLanguage: target,
      entries: [],
    };
    this.tasks.set(session.id, session);
    return session;
  }

  async append(taskId: string, entries: TranscriptEntry[]): Promise<void> {
    const current = this.tasks.get(taskId);
    if (!current) return;
    current.entries = [...current.entries, ...entries];
  }

  async setStatus(taskId: string, status: TaskStatus): Promise<void> {
    const current = this.tasks.get(taskId);
    if (current) current.status = status;
  }

  async end(taskId: string, summary?: ConversationSummary): Promise<TaskSession> {
    const current = this.tasks.get(taskId);
    if (!current) throw new Error('not found');
    if (!hasTranscript(current)) {
      this.tasks.delete(taskId);
    }
    current.status = 'ended';
    current.endedAt = Date.now();
    if (summary) current.summary = summary;
    return current;
  }

  async list(filter?: FeatureID): Promise<TaskSession[]> {
    return [...this.tasks.values()]
      .filter((item) => item.status === 'ended')
      .filter((item) => filter === undefined || item.feature === filter)
      .reverse();
  }

  async task(id: string): Promise<TaskSession | undefined> {
    return this.tasks.get(id);
  }

  async delete(id: string): Promise<void> {
    this.tasks.delete(id);
  }
}
