'use client';

import type { ReactNode } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

// bare: no frame (border, glow, name bar) — used while no island is selected.
export default function Header({ children, bare = false }: { children?: ReactNode; bare?: boolean }) {
  const { t, language } = useLanguage();

  return (
    <header
      style={bare ? undefined : { boxShadow: `0 0 4px gray, 0px 0px 4px gray inset` }}
      className={`w-full max-w-6xl p-6 sm:p-12 py-12 sm:py-20 border-x border-b flex flex-col ${bare ? 'bg-black border-transparent' : 'bg-zinc-950 border-zinc-800'}`}
    >
      <div className={`flex mb-0 ${bare ? 'flex-col items-center gap-6' : 'justify-between items-start'}`}>
        <h1 className={`text-3xl sm:text-5xl font-semibold text-zinc-400 ${bare ? 'text-center' : 'border-l-4 border-zinc-500 -ml-6 sm:-ml-12 pl-4 sm:pl-10'}`}>
          <span className="font-bold text-white">{t.header.name} </span>
          <span className="block sm:inline">{t.header.title}</span>
        </h1>
        <LanguageSwitcher />
      </div>
      <div className={`text-zinc-400 text-xl sm:text-2xl flex flex-row gap-4 mt-8 ${bare ? 'justify-center' : ''}`}>
        <a href="mailto:mohameffarah1@gmail.com">
          <img
            src="/icons/Gmail_24.svg"
            alt="Email Icon"
            className="inline w-6 h-6 mr-2 mb-1 "
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
            className="inline w-6 h-6 mr-2 mb-1"
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
            className="inline w-6 h-6 mr-2 mb-1"
          />
        </a>
        <a
          href={language === 'en' ? '/Resume_Farah.pdf' : '/CV_Farah.pdf'}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-transparent hover:bg-zinc-700 text-zinc-200 rounded-md text-sm font-medium transition-colors border border-zinc-700"
          aria-label="Download CV"
        >
          {t.header.resume}
        </a>
      </div>
      {children}
    </header>
  );
}
