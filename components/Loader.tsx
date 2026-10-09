'use client';

import { useEffect, useRef, useState } from 'react';

// The shader's four outline shapes orbit the center while the page loads. Then they line up in
// a column (square, ring, triangle, plus) while more shapes pop in around them, and everything
// slides off left together as the black fades, handing over to the shader's own drifting shapes.
// rAF for the orbit, CSS after. No library.
const MIN_SHOWN = 500;    // ms, so it doesn't just flash
const ORBIT = 3000;       // ms per turn
const RADIUS = 50;        // px, orbit radius
const LINE = 450;         // ms to line up (extras pop in meanwhile)
const ROWS = [-36, -12, 12, 36]; // vh, each column shape's row
const POP = 200;          // ms for an extra to pop in
const POP_STAGGER = 25;   // ms between extras popping
const EXIT = 600;         // ms to slide out left
const FADE = 450;         // ms for the black to lift
const FADE_DELAY = 100;   // ms into the exit

// Shape i's spot on the orbit, `turn` radians in.
const orbit = (i: number, turn: number) => {
    const a = turn + (Math.PI / 2) * i + Math.PI / 4;
    return `translate(-50%, -50%) translate(${Math.cos(a) * RADIUS}px, ${Math.sin(a) * RADIUS}px)`;
};
const at = (x: string, y: string) => `translate(-50%, -50%) translate(${x}, ${y})`;

const SHAPES = {
    square: <rect x="5" y="5" width="14" height="14" />,
    ring: <circle cx="12" cy="12" r="7.5" />,
    triangle: <polygon points="12,4 20.5,19 3.5,19" />,
    plus: <path d="M12 4v16M4 12h16" />,
    x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
};
type Kind = keyof typeof SHAPES;

const column: Kind[] = ['square', 'ring', 'triangle', 'plus'];
// Extras: fixed spots (vw / vh from center) so the HTML matches; no two neighbors alike.
const extras: { kind: Kind; x: number; y: number; scale: number; opacity: number }[] = [
    { kind: 'ring',     x: -38, y: -28, scale: 0.8, opacity: 0.7 },
    { kind: 'triangle', x: -24, y: 30,  scale: 1,   opacity: 0.9 },
    { kind: 'x',        x: -14, y: -20, scale: 0.6, opacity: 0.5 },
    { kind: 'square',   x: 14,  y: 24,  scale: 0.9, opacity: 0.8 },
    { kind: 'ring',     x: 22,  y: -34, scale: 1.1, opacity: 0.9 },
    { kind: 'plus',     x: 30,  y: 6,   scale: 0.7, opacity: 0.6 },
    { kind: 'triangle', x: 40,  y: -14, scale: 0.8, opacity: 0.7 },
    { kind: 'square',   x: -32, y: 6,   scale: 0.6, opacity: 0.5 },
    { kind: 'x',        x: 44,  y: 32,  scale: 0.9, opacity: 0.8 },
    { kind: 'ring',     x: 12,  y: -6,  scale: 0.7, opacity: 0.6 },
];

// Mostly black, with a couple of soft blurry gray glows. Plain CSS gradients.
const BACKDROP = [
    'radial-gradient(ellipse 45% 30% at 35% 45%, rgba(255,255,255,0.14), transparent 70%)',
    'radial-gradient(ellipse 40% 35% at 70% 60%, rgba(255,255,255,0.1), transparent 70%)',
].join(', ');

const slide = `transform ${EXIT}ms cubic-bezier(0.5, 0, 0.9, 0.4)`;

// Exported for the /loader-bg test page.
export function LoaderBackdrop() {
    return <div aria-hidden className="absolute inset-0" style={{ backgroundImage: BACKDROP }} />;
}

function Shape({ kind, size = 32 }: { kind: Kind; size?: number }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
            width={size} height={size}
            className="animate-[spin_2s_linear_infinite_reverse] text-zinc-300 drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] motion-reduce:animate-none">
            {SHAPES[kind]}
        </svg>
    );
}

export default function Loader() {
    const [phase, setPhase] = useState<'shown' | 'line' | 'exit' | 'gone'>('shown');
    // Phases only move forward, so a click-skip ('gone') can't be undone by a pending timer.
    const next = (p: 'line' | 'exit' | 'gone') => setPhase(cur => cur === 'gone' ? cur : p);
    const els = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const loaded = new Promise<void>(resolve =>
            document.readyState === 'complete' ? resolve() : window.addEventListener('load', () => resolve(), { once: true }));
        const minimum = new Promise<void>(resolve => setTimeout(resolve, MIN_SHOWN));
        const timers: ReturnType<typeof setTimeout>[] = [];
        Promise.all([loaded, minimum]).then(() => {
            next('line');
            timers.push(setTimeout(() => next('exit'), LINE));
            timers.push(setTimeout(() => next('gone'), LINE + Math.max(EXIT, FADE_DELAY + FADE)));
        });
        return () => timers.forEach(clearTimeout);
    }, []);

    // Orbit, written straight to the DOM. Stops when the column starts, so the CSS transition
    // picks up from wherever each shape is.
    useEffect(() => {
        if (phase !== 'shown') return;
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const t0 = performance.now();
        let raf = 0;
        const tick = (t: number) => {
            const turn = still ? 0 : ((t - t0) / ORBIT) * 2 * Math.PI;
            els.current.forEach((el, i) => { if (el) el.style.transform = orbit(i, turn); });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [phase]);

    if (phase === 'gone') return null;

    const placed = (i: number): React.CSSProperties =>
        phase === 'line' ? {
            transform: at('0px', `${ROWS[i]}vh`),
            transition: `transform ${LINE}ms cubic-bezier(0.2, 0.7, 0.2, 1)`,
        } : phase === 'exit' ? {
            transform: at('-120vw', `${ROWS[i]}vh`),
            transition: slide,
        } : { transform: orbit(i, 0) }; // in the HTML too, so they're spread before JS runs

    return (
        <div role="status" aria-label="Loading" onClick={() => setPhase('gone')} // click skips it entirely
            style={{ transition: `opacity ${FADE}ms ease ${FADE_DELAY}ms` }}
            className={`fixed inset-0 z-[100] overflow-hidden bg-black ${phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}>
            <LoaderBackdrop />
            {column.map((kind, i) => (
                <div key={kind} ref={el => { els.current[i] = el; }} aria-hidden style={placed(i)}
                    className="absolute left-1/2 top-1/2">
                    <Shape kind={kind} />
                </div>
            ))}
            {phase !== 'shown' && extras.map(({ kind, x, y, scale, opacity }, i) => (
                <div key={i} aria-hidden className="absolute left-1/2 top-1/2"
                    style={{
                        transform: at(`${phase === 'exit' ? x - 120 : x}vw`, `${y}vh`),
                        transition: slide,
                        opacity,
                    }}>
                    <div className="animate-in fade-in-0 zoom-in-0 [animation-fill-mode:both]"
                        style={{ animationDuration: `${POP}ms`, animationDelay: `${POP_STAGGER * i}ms` }}>
                        <Shape kind={kind} size={32 * scale} />
                    </div>
                </div>
            ))}
            <span aria-hidden
                style={{ transition: 'opacity 200ms ease' }}
                className={`absolute left-1/2 top-1/2 mt-20 -translate-x-1/2 font-[family-name:var(--font-hud)] text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500 ${phase === 'shown' ? '' : 'opacity-0'}`}>
                Loading
            </span>
        </div>
    );
}
