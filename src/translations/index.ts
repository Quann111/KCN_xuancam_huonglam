import { vi } from './vi';
import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';

export type Language = 'vi' | 'en' | 'ja' | 'zh';

export type Translations = typeof vi;

export const translations: Record<Language, Translations> = {
  vi,
  en,
  ja,
  zh,
};

export const defaultLanguage: Language = 'vi';