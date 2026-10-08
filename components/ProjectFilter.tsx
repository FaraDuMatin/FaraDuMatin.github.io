'use client';

import { categories, type Category } from '@/lib/projects';
import { useLanguage } from '@/lib/LanguageContext';
import { useScramble } from '@/lib/useScramble';

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
          place: "col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:self-center w-full" },
        ...categories.map(c => ({ value: c, label: t.filters.categories[c], count: counts[c],
          place: `${placement[c]} w-full sm:w-40 sm:justify-self-center` })),
    ];

    return (
        <nav aria-label={t.filters.label} className="mt-10 sm:mt-14">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-[1fr_2fr_1fr] sm:grid-rows-2 sm:gap-x-10 sm:gap-y-8">
                {options.map(({ value, label, count, place }) => {
                    const isActive = active === value;
                    return (
                        <Island key={value} label={label} count={count} place={place} isActive={isActive}
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
    isActive: boolean;
    onClick: () => void;
}

function Island({ label, count, place, isActive, onClick }: IslandProps) {
    const [glyphs, scramble] = useScramble(label);
    return (
        <button type="button" aria-pressed={isActive} aria-label={label} onClick={onClick}
            onMouseEnter={scramble} onFocus={scramble}
            className={`${place} flex h-24 sm:h-40 flex-col items-center justify-center gap-1 border shadow-md transition-colors ${isActive
                ? 'border-zinc-100 bg-zinc-100 text-black'
                : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white'}`}>
            <span aria-hidden className="text-lg sm:text-xl font-medium whitespace-pre">
                {glyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
            <span className={`text-xs tabular-nums ${isActive ? 'text-zinc-500' : 'text-zinc-600'}`}>{count}</span>
        </button>
    );
}
