'use client';

import { useLanguage, Language } from '@/lib/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-zinc-700 text-white'
            : 'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
          language === 'fr'
            ? 'bg-zinc-700 text-white'
            : 'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
        }`}
        aria-label="Passer au français"
      >
        FR
      </button>
    </div>
  );
}
