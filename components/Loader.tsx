'use client';

import { useEffect, useState } from 'react';

// Matched to igloo.inc's loader: a 10-char bar of - = + (low / mid / high) that scrolls right
// one char per step, like a wave whose wavelength drifts. Fades out once the page has loaded.
const LENGTH = 10;
const STEP = 70;        // ms per shift
const MIN_SHOWN = 1500; // ms, so it doesn't just flash
const FADE = 300;       // ms

const bar = (n: number) => {
    const wavelength = 7 + 3 * Math.sin(n * 0.15);
    return Array.from({ length: LENGTH }, (_, i) => {
        const v = Math.sin((2 * Math.PI * (i - n)) / wavelength);
        return v < -0.33 ? '-' : v < 0.33 ? '=' : '+';
    }).join('');
};

export default function Loader() {
    const [n, setN] = useState(0);
    const [phase, setPhase] = useState<'shown' | 'fading' | 'gone'>('shown');

    useEffect(() => {
        const interval = setInterval(() => setN(x => x + 1), STEP);
        const loaded = new Promise<void>(resolve =>
            document.readyState === 'complete' ? resolve() : window.addEventListener('load', () => resolve(), { once: true }));
        const minimum = new Promise<void>(resolve => setTimeout(resolve, MIN_SHOWN));
        let fadeTimer: ReturnType<typeof setTimeout>;
        Promise.all([loaded, minimum]).then(() => {
            setPhase('fading');
            fadeTimer = setTimeout(() => setPhase('gone'), FADE);
        });
        return () => { clearInterval(interval); clearTimeout(fadeTimer); };
    }, []);

    if (phase === 'gone') return null;

    return (
        <div role="status" aria-label="Loading"
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-300 ${phase === 'fading' ? 'opacity-0' : 'opacity-100'}`}>
            <span aria-hidden className="font-mono text-lg tracking-[0.3em] text-white whitespace-pre">{bar(n)}</span>
        </div>
    );
}
