'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Settings2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { AMBIENTS, getAmbient, isSoundOn, setAmbient, setSoundOn, subscribeSound } from '@/lib/sound';
import { BACKGROUND_COLORS } from './BackgroundPicker';
import HudBrackets from './HudBrackets';
import LanguageSwitcher from './LanguageSwitcher';

const glow = (color: string, px: number) => `0 0 ${px}px ${color}`;

// Every section: small label on top, its controls below, all left-aligned.
const section = 'flex flex-col items-start gap-2';
const label = 'text-[10px] text-zinc-500';
// "ON / OFF", styled like the "EN / FR" switch.
const choice = (active: boolean) => `group relative px-3 py-1.5 transition-colors ${active
    ? 'text-white [text-shadow:0_0_12px_rgba(255,255,255,0.5)]' : 'text-zinc-500'}`;

// Mobile only (below sm): one settings button, top right, in place of the bottom-corner Sound and
// Color controls and the top-right language switch, which cover too much of a small screen.
// Tap opens a panel; closes on a second tap, an outside tap, or Escape.
// background / onBackground: the color section, home only (omit on project pages).
export default function MobileMenu({ background, onBackground }: { background?: string; onBackground?: (hex: string) => void }) {
    const { language } = useLanguage();
    const fr = language === 'fr';
    const on = useSyncExternalStore(subscribeSound, isSoundOn, () => false);
    const ambient = useSyncExternalStore(subscribeSound, getAmbient, () => 0);
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onPointer = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('pointerdown', onPointer);
        document.addEventListener('keydown', onKey);
        return () => { document.removeEventListener('pointerdown', onPointer); document.removeEventListener('keydown', onKey); };
    }, [open]);

    return (
        <div ref={root} className="relative font-[family-name:var(--font-hud)] text-xs font-semibold uppercase tracking-[0.15em] sm:hidden">
            <button type="button" aria-label={fr ? 'Réglages' : 'Settings'} aria-expanded={open} onClick={() => setOpen(o => !o)} data-sound="ui"
                className={`group relative grid size-11 place-items-center transition-colors ${open ? 'text-white' : 'text-zinc-300'}`}>
                <HudBrackets />
                <Settings2 aria-hidden className={`h-4 w-4 ${open ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-3 flex w-max flex-col gap-5 bg-black/80 p-4 backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-1 duration-200">
                    <div className={section}>
                        <span className={label}>{fr ? 'Son' : 'Sound'}</span>
                        <div className="flex items-center gap-1 text-sm">
                            {[true, false].map((value, i) => (
                                <span key={String(value)} className="flex items-center gap-1">
                                    {i > 0 && <span aria-hidden className="text-zinc-600">/</span>}
                                    <button type="button" aria-pressed={on === value} onClick={() => setSoundOn(value)} data-sound="ui" className={choice(on === value)}>
                                        {on === value && <HudBrackets key={String(on)} mount />}
                                        {value ? (fr ? 'Oui' : 'On') : (fr ? 'Non' : 'Off')}
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {on && (
                        <div className={section}>
                            <span className={label}>{fr ? 'Piste' : 'Track'}</span>
                            <div role="radiogroup" aria-label={fr ? 'Piste' : 'Track'} className="grid grid-cols-5 gap-1">
                                {AMBIENTS.map((_, i) => {
                                    const selected = i === ambient;
                                    return (
                                        <button key={i} type="button" role="radio" aria-checked={selected} data-sound="ui"
                                            aria-label={`${fr ? 'Piste' : 'Track'} ${i + 1}`} onClick={() => setAmbient(i)}
                                            className={`group relative grid size-10 place-items-center tabular-nums ${selected
                                                ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'text-zinc-600'}`}>
                                            <HudBrackets />
                                            {String(i + 1).padStart(2, '0')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className={section}>
                        <span className={label}>{fr ? 'Langue' : 'Language'}</span>
                        <LanguageSwitcher hud />
                    </div>

                    {background && onBackground && (
                        <div className={section}>
                            <span className={label}>{fr ? 'Couleur' : 'Color'}</span>
                            <div role="radiogroup" aria-label={fr ? 'Couleur du fond' : 'Background color'} className="grid grid-cols-6 gap-1">
                                {BACKGROUND_COLORS.map(({ hex, swatch, en, fr: frName }) => {
                                    const selected = hex === background;
                                    return (
                                        <button key={hex} type="button" role="radio" aria-checked={selected} aria-label={fr ? frName : en} data-sound="ui"
                                            onClick={() => onBackground(hex)}
                                            className={`group relative grid size-10 place-items-center ${selected ? 'text-white' : 'text-zinc-600'}`}>
                                            <HudBrackets />
                                            <span aria-hidden style={{ backgroundColor: swatch, boxShadow: glow(swatch, selected ? 14 : 8) }}
                                                className={`size-3 rotate-45 ${selected ? 'scale-125' : ''}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
