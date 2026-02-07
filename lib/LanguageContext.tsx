'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { en } from './translations/en';
import { fr } from './translations/fr';

export type Language = 'en' | 'fr';

type Translation = typeof en;

const translations: Record<Language, Translation> = {
  en,
  fr,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t: translations[language] 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
