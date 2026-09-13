import type { AppLanguage } from '../domain/AppLanguage';
import type { SpeechRecognitionStyle, SummaryAvailability, Utterance } from '../domain/TaskStore';

export type SpeechEvent =
  | { type: 'utterance'; utterance: Utterance }
  | { type: 'interrupted'; retryable: boolean }
  | { type: 'routeHint'; language: AppLanguage };

export type LanguageCapabilitySnapshot = {
  language: AppLanguage;
  speech: boolean;
  translate: boolean;
  speak: boolean;
};

/**
 * TurboModule contract. iOS / Android / Harmony each implement this.
 * JS must never import SpeechRecognizer / SpeechAnalyzer types.
 */
export type SpeechEngine = {
  capabilities(): Promise<LanguageCapabilitySnapshot[]>;
  start(options: {
    languages: AppLanguage[];
    fallback: AppLanguage;
    style: SpeechRecognitionStyle;
  }): void;
  stop(): Promise<void>;
  subscribe(listener: (event: SpeechEvent) => void): () => void;
};

export type Translator = {
  prepare(pairs: Array<{ from: AppLanguage; to: AppLanguage }>): Promise<void>;
  translate(job: {
    requestId: string;
    from: AppLanguage;
    to: AppLanguage;
    text: string;
    isFinal: boolean;
  }): Promise<string>;
  cancel(requestId: string): void;
};

export type Synthesizer = {
  enqueue(text: string, language: AppLanguage): Promise<void>;
  stopAndClear(): Promise<void>;
};

export type AudioUseCase = 'faceToFace' | 'interpretationCaptions' | 'interpretationVoiceOut';

export type AudioSession = {
  activate(useCase: AudioUseCase): Promise<void>;
  deactivate(): Promise<void>;
  canSpeakWithoutEcho(): Promise<boolean>;
  subscribeRoute(listener: (canSpeak: boolean) => void): () => void;
};

export type DeviceSummary = {
  availability(): Promise<SummaryAvailability>;
  summarize(text: string, output: AppLanguage): Promise<string>;
};
