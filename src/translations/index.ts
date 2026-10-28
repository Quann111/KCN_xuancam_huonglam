import { vi } from './vi';
import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';
import { ko } from './ko';

export type Language = 'vi' | 'en' | 'ja' | 'zh' | 'ko';

export type Translations = typeof vi;

export const translations: Record<Language, Translations> = {
  vi,
  en,
  ja,
  zh,
  ko,
};

export const defaultLanguage: Language = 'vi';

export const languageOptions: { code: Language; label: string; name: string; flag: string; locale: string }[] = [
  { code: 'vi', label: 'VI', name: 'Tiếng Việt', flag: 'vn', locale: 'vi-VN' },
  { code: 'en', label: 'EN', name: 'English', flag: 'gb', locale: 'en-GB' },
  { code: 'ja', label: 'JA', name: '日本語', flag: 'jp', locale: 'ja-JP' },
  { code: 'zh', label: 'ZH', name: '中文', flag: 'cn', locale: 'zh-CN' },
  { code: 'ko', label: 'KO', name: '한국어', flag: 'kr', locale: 'ko-KR' },
];
