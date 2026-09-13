export type AppLanguage =
  | 'zhHans'
  | 'english'
  | 'japanese'
  | 'korean'
  | 'thai'
  | 'vietnamese';

export const allLanguages: AppLanguage[] = [
  'zhHans',
  'english',
  'japanese',
  'korean',
  'thai',
  'vietnamese',
];

export function nativeName(language: AppLanguage): string {
  switch (language) {
    case 'zhHans':
      return '中文';
    case 'english':
      return 'English';
    case 'japanese':
      return '日本語';
    case 'korean':
      return '한국어';
    case 'thai':
      return 'ไทย';
    case 'vietnamese':
      return 'Tiếng Việt';
  }
}

export function speechLocale(language: AppLanguage): string {
  switch (language) {
    case 'zhHans':
      return 'zh-CN';
    case 'english':
      return 'en-US';
    case 'japanese':
      return 'ja-JP';
    case 'korean':
      return 'ko-KR';
    case 'thai':
      return 'th-TH';
    case 'vietnamese':
      return 'vi-VN';
  }
}

export function defaultPeer(language: AppLanguage): AppLanguage {
  return language === 'english' ? 'zhHans' : 'english';
}
