import type { AppLanguage } from '../domain/AppLanguage';
import type { SpeechEvent, SpeechEngine } from './NativeContracts';
import type { SpeechRecognitionStyle } from '../domain/TaskStore';

/** M1 fake: inject text from UI or tests. Never ships as production ASR. */
export class FakeSpeechEngine implements SpeechEngine {
  private listener: ((event: SpeechEvent) => void) | undefined;

  async capabilities() {
    return [
      { language: 'zhHans' as AppLanguage, speech: true, translate: true, speak: true },
      { language: 'english' as AppLanguage, speech: true, translate: true, speak: true },
    ];
  }

  start(_options: {
    languages: AppLanguage[];
    fallback: AppLanguage;
    style: SpeechRecognitionStyle;
  }): void {}

  async stop(): Promise<void> {}

  subscribe(listener: (event: SpeechEvent) => void): () => void {
    this.listener = listener;
    return () => {
      this.listener = undefined;
    };
  }

  inject(language: AppLanguage, text: string, isFinal: boolean): void {
    this.listener?.({
      type: 'utterance',
      utterance: { id: 'fake', language, text, isFinal },
    });
  }
}
