'use client';

import { categories, type Category } from '@/lib/projects';
import { useLanguage } from '@/lib/LanguageContext';
import { useScramble } from '@/lib/useScramble';
import { frames, type IslandFrame } from '@/components/IslandFrames';

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
                        <Island key={value} label={label} count={count} place={place} frame={frames[value]} big={value === 'all'}
                            isActive={isActive} onClick={() => onChange(isActive ? null : value)} />
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
    frame: IslandFrame;
    big: boolean;
    isActive: boolean;
    onClick: () => void;
}

const glow = '[text-shadow:0_0_12px_rgba(255,255,255,0.5)]';

function Island({ label, count, place, frame: { viewBox, Frame, clip }, big, isActive, onClick }: IslandProps) {
    const [glyphs, scramble] = useScramble(label);
    const size = big ? 'text-2xl sm:text-3xl tracking-[0.2em]'
        : label.length > 6 ? 'text-sm sm:text-base tracking-[0.08em]' : 'text-xl sm:text-2xl tracking-[0.15em]';
    return (
        <button type="button" aria-pressed={isActive} aria-label={label} onClick={onClick}
            onMouseEnter={scramble} onFocus={scramble}
            className={`${place} group relative flex flex-col items-center justify-center gap-1 font-[family-name:var(--font-hud)] transition-colors ${isActive
                ? 'text-white'
                : 'text-zinc-300 hover:text-white'}`}>
            {/* Frosted panel so the label reads over the shader. */}
            <span aria-hidden style={{ clipPath: clip }}
                className="absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-colors group-hover:bg-black/35" />
            <svg viewBox={viewBox} fill="none" stroke="currentColor" aria-hidden
                className={`absolute inset-0 h-full w-full overflow-visible transition-[filter] ${isActive
                    ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]'
                    : 'drop-shadow-[0_0_6px_rgba(255,255,255,0.35)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]'}`}>
                <Frame />
            </svg>
            <span aria-hidden className={`relative font-semibold uppercase whitespace-pre ${size} ${glow} text-white`}>
                {glyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
            <span className={`relative font-medium tabular-nums ${big ? 'text-base' : 'text-sm'} text-zinc-300/80`}>{count}</span>
        </button>
    );
}
