'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useScramble } from '@/lib/useScramble';
import { isSoundOn, playSound, setSoundOn, subscribeSound, unlockSound } from '@/lib/sound';
import HudBrackets from './HudBrackets';

// Bottom-left "Sound: Off / On" toggle (igloo.inc style). Also wires the page's sounds:
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

    const Icon = on ? Volume2 : VolumeX;
    return (
        <button type="button" aria-pressed={on} aria-label={label} data-sound="hover"
            onClick={() => setSoundOn(!on)} onMouseEnter={scramble} onFocus={scramble}
            className="group fixed bottom-5 left-5 z-50 flex items-center gap-2.5 px-4 py-3 font-[family-name:var(--font-hud)] text-xs font-semibold uppercase tracking-[0.15em] text-zinc-300 transition-colors hover:text-white">
            <HudBrackets />
            <Icon aria-hidden className={`h-4 w-4 ${on ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : ''}`} />
            <span aria-hidden className="whitespace-pre">
                {glyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
        </button>
    );
}
