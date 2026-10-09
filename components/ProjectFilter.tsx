'use client';

import { categories, type Category } from '@/lib/projects';
import { useLanguage } from '@/lib/LanguageContext';
import { useScramble } from '@/lib/useScramble';
import { frames } from '@/components/IslandFrames';

// null = no island picked yet, so no projects shown.
export type Selection = Category | 'all' | null;

interface ProjectFilterProps {
    active: Selection;
    counts: Record<Category, number>;
    total: number;
    onChange: (selection: Selection) => void;
}

// One island per corner on sm+, "All" in the middle.
const placement: Record<Category, string> = {
    "3D": "sm:col-start-1 sm:row-start-1",
    "AI": "sm:col-start-3 sm:row-start-1",
    "Full Stack": "sm:col-start-1 sm:row-start-2",
    "Real-time": "sm:col-start-3 sm:row-start-2",
};

export default function ProjectFilter({ active, counts, total, onChange }: ProjectFilterProps) {
    const { t } = useLanguage();
    const options = [
        { value: 'all' as const, label: t.filters.all, count: total,
          place: "col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:self-center size-48 sm:size-64" },
        ...categories.map(c => ({ value: c, label: t.filters.categories[c], count: counts[c],
          place: `${placement[c]} size-36 sm:size-40` })),
    ];

    return (
        <nav aria-label={t.filters.label} className="mt-10 sm:mt-14">
            <div className="grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-[1fr_2fr_1fr] sm:grid-rows-2 sm:gap-x-10 sm:gap-y-8">
                {options.map(({ value, label, count, place }) => {
                    const isActive = active === value;
                    return (
                        <Island key={value} label={label} count={count} place={place} frame={frames[value]} isActive={isActive}
                            onClick={() => onChange(isActive ? null : value)} />
                    );
                })}
            </div>
        </nav>
    );
}

interface IslandProps {
    label: string;
    count: number;
    place: string;
    frame: (typeof frames)[keyof typeof frames];
    isActive: boolean;
    onClick: () => void;
}

function Island({ label, count, place, frame: { viewBox, Frame }, isActive, onClick }: IslandProps) {
    const [glyphs, scramble] = useScramble(label);
    return (
        <button type="button" aria-pressed={isActive} aria-label={label} onClick={onClick}
            onMouseEnter={scramble} onFocus={scramble}
            className={`${place} group relative flex flex-col items-center justify-center gap-1 transition-colors ${isActive
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-200'}`}>
            <svg viewBox={viewBox} fill="none" stroke="currentColor" aria-hidden
                className={`absolute inset-0 h-full w-full overflow-visible ${isActive ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]' : ''}`}>
                <Frame />
            </svg>
            <span aria-hidden className={`relative font-mono uppercase whitespace-pre ${label.length > 6 ? 'text-xs tracking-[0.15em]' : 'text-sm sm:text-base tracking-[0.2em]'} ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                {glyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
            <span className="relative font-mono text-xs tabular-nums text-zinc-500">{count}</span>
        </button>
    );
}
