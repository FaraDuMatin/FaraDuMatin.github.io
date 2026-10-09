'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useScramble } from '@/lib/useScramble';
import { AMBIENTS, getAmbient, isSoundOn, playSound, setAmbient, setSoundOn, subscribeSound, unlockSound } from '@/lib/sound';
import HudBrackets from './HudBrackets';

// Bottom-left "Sound: Off / On" toggle (igloo.inc style). Hovering it opens the ambient picker
// above (like the color picker): numbered loops in HUD brackets. Also wires the page's sounds:
// hovering anything with data-sound plays "hover", clicking data-sound="ui" plays "click".
export default function SoundToggle() {
    const on = useSyncExternalStore(subscribeSound, isSoundOn, () => false);
    const { language } = useLanguage();
    const label = language === 'fr' ? `Son : ${on ? 'activé' : 'coupé'}` : `Sound: ${on ? 'On' : 'Off'}`;
    const [glyphs, scramble] = useScramble(label);

    useEffect(() => {
        const onOver = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return; // a tap isn't a hover
            const el = (e.target as Element).closest?.('[data-sound]');
            if (el && !(e.relatedTarget instanceof Node && el.contains(e.relatedTarget))) playSound('hover');
        };
        const onClick = (e: MouseEvent) => {
            if ((e.target as Element).closest?.('[data-sound="ui"]')) playSound('click');
        };
        document.addEventListener('pointerover', onOver);
        document.addEventListener('click', onClick);
        document.addEventListener('pointerdown', unlockSound);
        document.addEventListener('keydown', unlockSound);
        return () => {
            document.removeEventListener('pointerover', onOver);
            document.removeEventListener('click', onClick);
            document.removeEventListener('pointerdown', unlockSound);
            document.removeEventListener('keydown', unlockSound);
        };
    }, []);

    const ambient = useSyncExternalStore(subscribeSound, getAmbient, () => 0);
    const [open, setOpen] = useState(false);
    const Icon = on ? Volume2 : VolumeX;
    return (
        <div onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)} onBlur={e => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
            className="fixed bottom-5 left-5 z-50 font-[family-name:var(--font-hud)] text-xs font-semibold uppercase tracking-[0.15em]">
            {open && (
                // pb-3 instead of a margin: no gap, so moving the mouse up keeps it open.
                <div className="absolute bottom-full left-0 pb-3 animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
                    <div role="radiogroup" aria-label={language === 'fr' ? 'Ambiance' : 'Ambient'}
                        className="grid w-max grid-cols-[repeat(5,2.5rem)] gap-1 bg-black/40 p-2">
                        {AMBIENTS.map((_, i) => {
                            const selected = on && i === ambient;
                            return (
                                <button key={i} type="button" role="radio" aria-checked={selected} data-sound="ui"
                                    aria-label={`${language === 'fr' ? 'Ambiance' : 'Ambient'} ${i + 1}`}
                                    onClick={() => setAmbient(i)}
                                    className={`group relative grid size-10 place-items-center tabular-nums transition-colors ${selected
                                        ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                                        : 'text-zinc-600 hover:text-zinc-200'}`}>
                                    <HudBrackets />
                                    {String(i + 1).padStart(2, '0')}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
            <button type="button" aria-pressed={on} aria-label={label} data-sound="hover"
                onClick={() => setSoundOn(!on)} onMouseEnter={scramble} onFocus={scramble}
                className="group relative flex items-center gap-2.5 px-4 py-3 text-zinc-300 transition-colors hover:text-white">
                <HudBrackets />
                <Icon aria-hidden className={`h-4 w-4 ${on ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : ''}`} />
                <span aria-hidden className="whitespace-pre">
                    {glyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
                </span>
            </button>
        </div>
    );
}
