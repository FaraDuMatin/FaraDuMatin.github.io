'use client';

import { useLanguage } from '@/lib/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useLanguage();
  
  return (
    <header
      style={{ boxShadow: `0 0 4px gray, 0px 0px 4px gray inset` }}
      className="w-full bg-zinc-950 max-w-6xl p-6 sm:p-12 py-12 sm:py-20 border-x border-b border-zinc-800 flex flex-col"
    >
      <div className="flex justify-between items-start mb-0">
        <h1 className="border-l-4 border-zinc-500 -ml-6 sm:-ml-12 pl-4 sm:pl-10 text-3xl sm:text-5xl font-semibold text-zinc-400">
          <span className="font-bold text-white">{t.header.name} </span>
          <span className="block sm:inline">{t.header.title}</span>
        </h1>
        <LanguageSwitcher />
      </div>
      <div className="text-zinc-400 text-xl sm:text-2xl flex flex-row gap-4 mt-8">
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
          href="/CV_Farah_English.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-transparent hover:bg-zinc-700 text-zinc-200 rounded-md text-sm font-medium transition-colors border border-zinc-700"
          aria-label="Download CV"
        >
          {t.header.resume}
        </a>
      </div>
    </header>
  );
}
