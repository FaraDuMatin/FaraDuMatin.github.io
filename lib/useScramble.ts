'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Matched frame by frame to igloo.inc's hover: letters appear fast left to right,
// then lock in one by one, slower. ~400ms for 9 chars.
const APPEAR = 15;          // ms between each char appearing
const RESOLVE = 100;        // ms until the first char locks in
const RESOLVE_STAGGER = 35; // each next char locks in this much later
const FADE = 60;            // ms for a char to fade in
const STEP = 33;            // glyphs change in steps, not every frame
const MAX_OFFSET = 6;       // a char starts up to 6 codes away from the real one, then closes in

export type Glyph = { ch: string; opacity: number };

const settled = (text: string): Glyph[] => Array.from(text, ch => ({ ch, opacity: 1 }));

export function useScramble(text: string) {
    const [glyphs, setGlyphs] = useState(() => settled(text));
    const frame = useRef(0);

    useEffect(() => {
        setGlyphs(settled(text));
        return () => cancelAnimationFrame(frame.current);
    }, [text]);

    const play = useCallback(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        cancelAnimationFrame(frame.current);
        const chars = Array.from(text);
        const end = RESOLVE + (chars.length - 1) * RESOLVE_STAGGER;
        // One random direction per char per step, so a glyph holds for the whole step.
        const signs = chars.map(() => Array.from({ length: Math.ceil(end / STEP) + 1 }, () => Math.random() < 0.5 ? -1 : 1));
        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            if (elapsed >= end) return setGlyphs(settled(text));
            const step = Math.floor(elapsed / STEP);
            setGlyphs(chars.map((ch, i) => {
                const appearAt = i * APPEAR;
                const resolveAt = RESOLVE + i * RESOLVE_STAGGER;
                if (elapsed < appearAt) return { ch, opacity: 0 };
                const opacity = Math.min((elapsed - appearAt) / FADE, 1);
                if (elapsed >= resolveAt || ch === ' ') return { ch, opacity };
                const progress = Math.max(0, (step * STEP - appearAt) / (resolveAt - appearAt));
                const offset = Math.max(1, Math.round(MAX_OFFSET * (1 - progress))) * signs[i][step];
                const code = ch.charCodeAt(0) + offset;
                return { ch: code > 32 ? String.fromCharCode(code) : ch, opacity };
            }));
            frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
    }, [text]);

    return [glyphs, play] as const;
}
