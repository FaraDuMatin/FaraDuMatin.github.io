'use client';

import type { ReactNode } from 'react';
import { FileUser } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useScramble } from '@/lib/useScramble';
import BackButton from './BackButton';

const glow = '[text-shadow:0_0_18px_rgba(255,255,255,0.35)]';
const links = [
  { href: 'mailto:mohameffarah1@gmail.com', icon: '/icons/Gmail_24.svg', label: 'Email' },
  { href: 'https://www.linkedin.com/in/farah-mohamed-1411a0264/', icon: '/icons/LinkedIn_24.svg', label: 'LinkedIn' },
  { href: 'https://github.com/FaraDuMatin/', icon: '/icons/mark-github-24.svg', label: 'GitHub' },
];
const iconGlow = 'drop-shadow-[0_0_6px_rgba(255,255,255,0.45)] transition-[filter] hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]';

// HUD: a thin line under each header link; lights up and widens on hover. Put in a `group relative`.
function Underline() {
  return <span aria-hidden className="absolute bottom-0 left-1/2 h-[1.5px] w-full -translate-x-1/2 scale-x-75 bg-white/40 transition-[transform,background-color,box-shadow] duration-200 group-hover:scale-x-125 group-hover:bg-white group-hover:shadow-[0_0_8px_rgba(255,255,255,0.8)]" />;
}

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
        {links.map(({ href, icon, label }) => (
          <a key={label} href={href} aria-label={label}
            {...(href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
            {...(bare && { 'data-sound': 'ui', className: 'group relative px-1 pb-2.5' })}>
            <img src={icon} alt="" className={`w-6 h-6 ${bare ? `block ${iconGlow}` : 'inline mr-2 mb-1'}`} />
            {bare && <Underline />}
          </a>
        ))}
        {bare ? (
          <a
            href={language === 'en' ? '/Resume_Farah.pdf' : '/CV_Farah.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            data-sound="ui"
            onMouseEnter={scrambleResume}
            onFocus={scrambleResume}
            className={`group relative flex items-center gap-2 px-1 pb-2.5 text-white text-xs font-semibold uppercase tracking-[0.15em] ${glow}`}
            aria-label={t.header.resume}
          >
            <FileUser aria-hidden className={`block w-6 h-6 ${iconGlow}`} />
            <span aria-hidden className="whitespace-pre">
              {resumeGlyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
            <Underline />
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
