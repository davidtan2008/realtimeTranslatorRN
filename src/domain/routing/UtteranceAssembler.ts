import type { AppLanguage } from '../AppLanguage';
import type { Utterance } from '../TaskStore';

export class UtteranceAssembler {
  lastLanguage?: AppLanguage;
  private utteranceId = `u-${Date.now()}`;
  private texts = new Map<AppLanguage, string>();
  private lockedLanguage?: AppLanguage;

  ingest(language: AppLanguage, text: string, isFinal: boolean): Utterance | undefined {
    const trimmed = text.trim();
    if (!trimmed) return undefined;
    if (!UtteranceAssembler.matchesClaimedLanguage(trimmed, language)) return undefined;
    this.texts.set(language, trimmed);
    this.lockedLanguage ??= language;
    const winner = this.lockedLanguage;
    if (winner !== language && !isFinal) return undefined;
    this.lastLanguage = winner;
    return {
      id: this.utteranceId,
      language: winner,
      text: this.texts.get(winner) ?? '',
      isFinal: isFinal && winner === language,
    };
  }

  static matchesClaimedLanguage(text: string, claimed: AppLanguage): boolean {
    let han = 0;
    let latin = 0;
    for (const char of text) {
      const code = char.charCodeAt(0);
      if (code >= 0x4e00 && code <= 0x9fff) han += 1;
      else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) latin += 1;
    }
    if (claimed === 'zhHans') return han * 2 >= latin || han > 0;
    if (claimed === 'english' || claimed === 'vietnamese') return latin >= han;
    return true;
  }
}

export type Clause = {
  utteranceId: string;
  text: string;
  language: AppLanguage;
};

const TERMINALS = new Set(['，', '。', '！', '？', '；', ',', '.', '!', '?', ';', ':']);

export function splitClause(
  utteranceId: string,
  fullText: string,
  alreadySpokenLength: number,
  language: AppLanguage,
  settled: boolean,
): { clauses: Clause[]; spokenLength: number } {
  if (fullText.length <= alreadySpokenLength) {
    return { clauses: [], spokenLength: alreadySpokenLength };
  }
  const suffix = fullText.slice(alreadySpokenLength);
  const last = suffix[suffix.length - 1];
  const canSpeak = settled || (last !== undefined && TERMINALS.has(last));
  if (!canSpeak) return { clauses: [], spokenLength: alreadySpokenLength };
  return {
    clauses: [{ utteranceId, text: suffix, language }],
    spokenLength: fullText.length,
  };
}
