'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { useScramble } from '@/lib/useScramble';

// Igloo-style: label inside four corner brackets. On hover the brackets lock on (globals.css)
// and the label scrambles.
const corners = [
    { pos: 'left-0 top-0 border-l-[1.5px] border-t-[1.5px]', gx: -1, gy: -1 },
    { pos: 'right-0 top-0 border-r-[1.5px] border-t-[1.5px]', gx: 1, gy: -1 },
    { pos: 'right-0 bottom-0 border-r-[1.5px] border-b-[1.5px]', gx: 1, gy: 1 },
    { pos: 'left-0 bottom-0 border-l-[1.5px] border-b-[1.5px]', gx: -1, gy: 1 },
];

export default function BackButton({ onClick }: { onClick: () => void }) {
    const { language } = useLanguage();
    const label = language === 'fr' ? 'Retour' : 'Back';
    const [glyphs, scramble] = useScramble(label);

    return (
        <button type="button" aria-label={label} onClick={onClick} onMouseEnter={scramble} onFocus={scramble}
            className="group fixed right-5 top-5 z-50 px-7 py-4 font-mono text-base text-zinc-200 outline-none transition-colors hover:text-white">
            {corners.map(({ pos, gx, gy }) => (
                <span key={pos} aria-hidden style={{ '--gx': gx, '--gy': gy } as React.CSSProperties}
                    className={`bracket-lock absolute size-3 border-current ${pos}`} />
            ))}
            <span aria-hidden className="whitespace-pre">
                {glyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
        </button>
    );
}
