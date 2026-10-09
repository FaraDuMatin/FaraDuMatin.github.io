// HUD-style island frame (Animus / FUI): Igloo-style corner brackets around a cut-corner panel.
// Drawn in currentColor so the island sets the color per state. Brackets open outward on hover.
import type { Category } from '@/lib/projects';

const slide = 'transition-transform duration-300 ease-out';

function bracketFrame(w: number, h: number) {
    const [i, a, inset, cut] = [3, 16, 16, 14];
    return function BracketFrame() {
        return (
            <>
                <g className={`${slide} group-hover:-translate-x-1 group-hover:-translate-y-1`}><path d={`M ${i},${i + a} V ${i} H ${i + a}`} strokeWidth={1.5} /></g>
                <g className={`${slide} group-hover:translate-x-1 group-hover:-translate-y-1`}><path d={`M ${w - i - a},${i} H ${w - i} V ${i + a}`} strokeWidth={1.5} /></g>
                <g className={`${slide} group-hover:translate-x-1 group-hover:translate-y-1`}><path d={`M ${w - i},${h - i - a} V ${h - i} H ${w - i - a}`} strokeWidth={1.5} /></g>
                <g className={`${slide} group-hover:-translate-x-1 group-hover:translate-y-1`}><path d={`M ${i + a},${h - i} H ${i} V ${h - i - a}`} strokeWidth={1.5} /></g>
                <path opacity={0.35} d={`M ${inset + cut},${inset} H ${w - inset - cut} L ${w - inset},${inset + cut} V ${h - inset - cut}
                    L ${w - inset - cut},${h - inset} H ${inset + cut} L ${inset},${h - inset - cut} V ${inset + cut} Z`} />
            </>
        );
    };
}

// Same square shape; "All" is drawn at its larger size so strokes and brackets stay the same weight.
const large = { viewBox: '0 0 256 256', Frame: bracketFrame(256, 256) };
const square = { viewBox: '0 0 160 160', Frame: bracketFrame(160, 160) };

export const frames: Record<Category | 'all', { viewBox: string; Frame: () => JSX.Element }> = {
    "all": large,
    "3D": square,
    "AI": square,
    "Full Stack": square,
    "Real-time": square,
};
