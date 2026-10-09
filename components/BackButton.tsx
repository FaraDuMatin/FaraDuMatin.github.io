'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useScramble } from '@/lib/useScramble';
import HudBrackets from '@/components/HudBrackets';

// Igloo-style: label inside four corner brackets. On hover the brackets lock on and the label scrambles.
export default function BackButton({ onClick }: { onClick: () => void }) {
    const { language } = useLanguage();
    const label = language === 'fr' ? 'Retour' : 'Back';
    const [glyphs, scramble] = useScramble(label);

    return (
        <button type="button" aria-label={label} onClick={onClick} onMouseEnter={scramble} onFocus={scramble}
            className="group relative w-32 py-4 text-center font-mono text-base text-zinc-200 outline-none transition-colors hover:text-white">
            <HudBrackets />
            <span aria-hidden className="whitespace-pre">
                {glyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
        </button>
    );
}
