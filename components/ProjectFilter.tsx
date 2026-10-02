'use client';

import { categories, type Category } from '@/lib/projects';
import { useLanguage } from '@/lib/LanguageContext';

interface ProjectFilterProps {
    active: Category | null;
    counts: Record<Category, number>;
    total: number;
    onChange: (category: Category | null) => void;
}

export default function ProjectFilter({ active, counts, total, onChange }: ProjectFilterProps) {
    const { t } = useLanguage();
    const options = [
        { value: null, label: t.filters.all, count: total },
        ...categories.map(c => ({ value: c, label: t.filters.categories[c], count: counts[c] })),
    ];

    return (
        <nav aria-label={t.filters.label}
            className="md:sticky top-0 z-40 w-full max-w-6xl border-x border-b border-zinc-800 bg-black/80 backdrop-blur-md px-6 sm:px-12 py-3">
            <div className="flex flex-wrap items-center gap-2">
                {options.map(({ value, label, count }) => {
                    const isActive = active === value;
                    return (
                        <button key={label} type="button" aria-pressed={isActive} onClick={() => onChange(value)}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${isActive
                                ? 'border-zinc-100 bg-zinc-100 text-black'
                                : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-white'}`}>
                            {label}
                            <span className={`text-xs tabular-nums ${isActive ? 'text-zinc-500' : 'text-zinc-600'}`}>{count}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
