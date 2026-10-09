'use client';

import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useScramble } from '@/lib/useScramble';
import HudBrackets from '@/components/HudBrackets';

// Igloo-style: label inside four corner brackets. On hover the brackets lock on and the label scrambles.
// Below sm: just a chevron, to save room.
export default function BackButton({ onClick }: { onClick: () => void }) {
    const { language } = useLanguage();
    const label = language === 'fr' ? 'Retour' : 'Back';
    const [glyphs, scramble] = useScramble(label);

    return (
        <button type="button" aria-label={label} onClick={onClick} data-sound="ui" onMouseEnter={scramble} onFocus={scramble}
            className="group relative grid size-11 place-items-center font-mono text-base text-zinc-200 outline-none transition-colors hover:text-white sm:block sm:size-auto sm:w-32 sm:py-4 sm:text-center">
            <HudBrackets />
            <ChevronLeft aria-hidden className="h-5 w-5 sm:hidden" />
            <span aria-hidden className="hidden whitespace-pre sm:inline">
                {glyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
        </button>
    );
}
