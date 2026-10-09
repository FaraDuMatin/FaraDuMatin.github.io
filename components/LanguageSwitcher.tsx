'use client';

import { useLanguage, Language } from '@/lib/LanguageContext';
import HudBrackets from './HudBrackets';

const options: { value: Language; label: string; aria: string }[] = [
  { value: 'en', label: 'EN', aria: 'Switch to English' },
  { value: 'fr', label: 'FR', aria: 'Passer au français' },
];

// hud: home-view style — "EN / FR", brackets snap onto the active language.
export default function LanguageSwitcher({ hud = false, className = '' }: { hud?: boolean; className?: string }) {
  const { language, setLanguage } = useLanguage();

  if (hud) return (
    <div className={`flex items-center gap-1 font-[family-name:var(--font-hud)] text-sm font-semibold tracking-[0.15em] ${className}`}>
      {options.map(({ value, label, aria }, i) => (
        <span key={value} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="text-zinc-600">/</span>}
          <button onClick={() => setLanguage(value)} aria-label={aria} aria-pressed={language === value}
            className={`group relative px-3 py-1.5 transition-colors ${language === value
              ? 'text-white [text-shadow:0_0_12px_rgba(255,255,255,0.5)]'
              : 'text-zinc-500 hover:text-zinc-200'}`}>
            {language === value && <HudBrackets key={language} mount />}
            {label}
          </button>
        </span>
      ))}
    </div>
  );

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
