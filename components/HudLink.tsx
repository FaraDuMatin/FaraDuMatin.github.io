'use client';

import type { LucideIcon } from 'lucide-react';
import HudBrackets from './HudBrackets';
import { useScramble } from '@/lib/useScramble';

// HUD link button, same look as Resume: corner brackets, frosted panel, glow, scramble on hover.
// The icon keeps the project's accent color.
export default function HudLink({ href, label, icon: Icon, accentColor }: { href: string; label: string; icon: LucideIcon; accentColor: string }) {
    const [glyphs, scramble] = useScramble(label);
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            onMouseEnter={scramble} onFocus={scramble}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-black/30 font-[family-name:var(--font-hud)] text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-black/40 [text-shadow:0_0_18px_rgba(255,255,255,0.35)]">
            <HudBrackets />
            <Icon aria-hidden className="h-4 w-4" style={{ color: accentColor }} />
            <span aria-hidden className="whitespace-pre">
                {glyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}
            </span>
        </a>
    );
}
