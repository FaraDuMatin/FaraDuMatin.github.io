'use client';

import { useEffect, useRef, useState } from 'react';
import { Palette } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/lib/LanguageContext';
import HudBrackets from './HudBrackets';

// Home-only palette (bottom right). Hover shows the colors; click pins them open until a
// color is picked, the button is clicked again, an outside click, or Escape. Each color is a glowing diamond in HUD brackets.
export const BACKGROUND_COLORS = [
    { hex: '#ffffff', swatch: '#d4d4d8', en: 'Gray', fr: 'Gris' },
    { hex: '#0661ff', swatch: '#3b82f6', en: 'Blue', fr: 'Bleu' },
    { hex: '#8b5cf6', swatch: '#8b5cf6', en: 'Violet', fr: 'Violet' },
    { hex: '#14b8a6', swatch: '#14b8a6', en: 'Teal', fr: 'Sarcelle' },
    { hex: '#f59e0b', swatch: '#f59e0b', en: 'Amber', fr: 'Ambre' },
    { hex: '#f43f5e', swatch: '#f43f5e', en: 'Rose', fr: 'Rose' },
    { hex: '#6366f1', swatch: '#6366f1', en: 'Indigo', fr: 'Indigo' },
    { hex: '#06b6d4', swatch: '#06b6d4', en: 'Cyan', fr: 'Cyan' },
    { hex: '#22c55e', swatch: '#22c55e', en: 'Green', fr: 'Vert' },
    { hex: '#84cc16', swatch: '#84cc16', en: 'Lime', fr: 'Citron vert' },
    { hex: '#f97316', swatch: '#f97316', en: 'Orange', fr: 'Orange' },
    { hex: '#d946ef', swatch: '#d946ef', en: 'Fuchsia', fr: 'Fuchsia' },
];

const glow = (color: string, px: number) => `0 0 ${px}px ${color}`;

export default function BackgroundPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
    const { language } = useLanguage();
    const [hover, setHover] = useState(false);
    const [pinned, setPinned] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const label = language === 'fr' ? 'Couleur du fond' : 'Background color';
    const open = hover || pinned;

    // Unpin on outside click or Escape.
    useEffect(() => {
        if (!pinned) return;
        const onPointer = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setPinned(false); };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPinned(false); };
        document.addEventListener('pointerdown', onPointer);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('pointerdown', onPointer); document.removeEventListener('keydown', onKey); };
    }, [pinned]);

    return (
        <div ref={root} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            className="fixed bottom-5 right-5 z-50 font-[family-name:var(--font-hud)]">
            {open && (
                // pb-3 instead of a margin: no gap, so moving the mouse up to the colors keeps them open.
                <div className="absolute bottom-full right-0 pb-3 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                    <div role="radiogroup" aria-label={label} className="relative grid w-max grid-cols-[repeat(6,2.5rem)] gap-1 bg-black/40 p-2">
                        {BACKGROUND_COLORS.map(({ hex, swatch, en, fr }) => {
                            const selected = hex === value;
                            return (
                                <button key={hex} type="button" role="radio" aria-checked={selected} aria-label={language === 'fr' ? fr : en}
                                    onClick={() => { onChange(hex); setPinned(false); setHover(false); }}
                                    className={`group relative grid size-10 place-items-center transition-colors ${selected ? 'text-white' : 'text-zinc-600 hover:text-zinc-200'}`}>
                                    <HudBrackets />
                                    <span aria-hidden style={{ backgroundColor: swatch, boxShadow: glow(swatch, selected ? 14 : 8) }}
                                        className={`size-3 rotate-45 transition-transform duration-200 ${selected ? 'scale-125' : 'group-hover:scale-125'}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button type="button" aria-label={label} aria-expanded={open} aria-pressed={pinned} onClick={() => setPinned(p => !p)}
                            className={`group relative p-3 transition-colors ${open ? 'text-white' : 'text-zinc-300 hover:text-white'}`}>
                            <HudBrackets />
                            <Palette aria-hidden className={`h-5 w-5 transition-[filter] ${open
                                ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                                : 'drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]'}`} />
                        </button>
                    </TooltipTrigger>
                    {!pinned && <TooltipContent side="left">{label}</TooltipContent>}
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
