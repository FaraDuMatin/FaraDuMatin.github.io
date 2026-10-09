'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import HudBrackets from './HudBrackets';
import BackButton from './BackButton';
import { useScramble } from '@/lib/useScramble';

const glow = '[text-shadow:0_0_18px_rgba(255,255,255,0.35)]';
const iconGlow = 'drop-shadow-[0_0_6px_rgba(255,255,255,0.45)] transition-[filter] hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]';

// bare: HUD style — no frame, centered, HUD font and glow like the islands.
// onBack: shows the Back button next to the language switch (top right).
export default function Header({ children, bare = false, onBack }: { children?: ReactNode; bare?: boolean; onBack?: () => void }) {
  const { t, language } = useLanguage();
  const [resumeGlyphs, scrambleResume] = useScramble(t.header.resume);

  return (
    <header
      style={bare ? undefined : { boxShadow: `0 0 4px gray, 0px 0px 4px gray inset` }}
      className={`relative z-10 w-full max-w-6xl p-6 sm:p-12 py-12 sm:py-20 border-x border-b flex flex-col ${bare ? 'bg-transparent border-transparent font-[family-name:var(--font-hud)]' : 'bg-zinc-950 border-zinc-800'}`}
    >
      <div className={`flex mb-0 ${bare ? 'flex-col items-center gap-6' : 'justify-between items-start'}`}>
        <h1 className={`text-3xl sm:text-5xl font-semibold text-zinc-400 ${bare ? `text-center ${glow}` : 'border-l-4 border-zinc-500 -ml-6 sm:-ml-12 pl-4 sm:pl-10'}`}>
          <span className="font-bold text-white">{t.header.name} </span>
          <span className="block sm:inline">{t.header.title}</span>
        </h1>
        {bare
          ? (
            <div className="fixed right-5 top-5 z-50 flex items-center gap-4">
              <LanguageSwitcher hud />
              {onBack && <BackButton onClick={onBack} />}
            </div>
          )
          : <LanguageSwitcher />}
      </div>
      <div className={`text-zinc-400 text-xl sm:text-2xl flex flex-row gap-4 mt-8 ${bare ? 'justify-center items-center' : ''}`}>
        <a href="mailto:mohameffarah1@gmail.com">
          <img
            src="/icons/Gmail_24.svg"
            alt="Email Icon"
            className={`inline w-6 h-6 mr-2 mb-1 ${bare ? iconGlow : ''}`}
          />
        </a>
        <a
          href="https://www.linkedin.com/in/farah-mohamed-1411a0264/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <img
            src="/icons/LinkedIn_24.svg"
            alt="LinkedIn Icon"
            className={`inline w-6 h-6 mr-2 mb-1 ${bare ? iconGlow : ''}`}
          />
        </a>
        <a
          href="https://github.com/FaraDuMatin/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <img
            src="/icons/mark-github-24.svg"
            alt="GitHub Icon"
            className={`inline w-6 h-6 mr-2 mb-1 ${bare ? iconGlow : ''}`}
          />
        </a>
        {bare ? (
          <a
            href={language === 'en' ? '/Resume_Farah.pdf' : '/CV_Farah.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={scrambleResume}
            onFocus={scrambleResume}
            className={`group relative ml-2 px-6 py-2.5 bg-black/30 text-white text-sm font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-black/40 ${glow}`}
            aria-label="Download CV"
          >
            <HudBrackets />
            <span aria-hidden className="whitespace-pre">
              {resumeGlyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
          </a>
        ) : (
          <a
            href={language === 'en' ? '/Resume_Farah.pdf' : '/CV_Farah.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-transparent hover:bg-zinc-700 text-zinc-200 rounded-md text-sm font-medium transition-colors border border-zinc-700"
            aria-label="Download CV"
          >
            {t.header.resume}
          </a>
        )}
      </div>
      {children}
    </header>
  );
}
