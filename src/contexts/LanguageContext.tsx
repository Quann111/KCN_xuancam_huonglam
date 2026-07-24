import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, defaultLanguage, Translations } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'd-park-language';

const langToHtml: Record<Language, string> = { vi: 'vi', en: 'en', ja: 'ja', zh: 'zh' };

function applyLangAttr(lang: Language) {
  document.documentElement.setAttribute('lang', langToHtml[lang] || 'vi');
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && (saved === 'vi' || saved === 'en' || saved === 'ja' || saved === 'zh')) {
        return saved as Language;
      }
    }
    return defaultLanguage;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.setAttribute('lang', lang === 'vi' ? 'vi' : lang === 'ja' ? 'ja' : lang === 'zh' ? 'zh' : 'en');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.documentElement.setAttribute('lang', language === 'vi' ? 'vi' : language === 'ja' ? 'ja' : language === 'zh' ? 'zh' : 'en');
    }
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}