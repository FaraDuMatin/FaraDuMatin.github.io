// HUD-style island frame (Animus / FUI): Igloo-style corner brackets around a cut-corner panel.
// Drawn in currentColor so the island sets the color per state. Brackets open outward on hover.
import type { Category } from '@/lib/projects';

const slide = 'transition-transform duration-300 ease-out';

export type IslandFrame = {
    viewBox: string;
    Frame: () => JSX.Element;
    clip: string; // the panel's shape as a % clip-path, for the frosted backdrop behind it
};

function bracketFrame(w: number, h: number): IslandFrame {
    const [i, a, inset, cut] = [3, 18, 16, 14];
    const panel = `M ${inset + cut},${inset} H ${w - inset - cut} L ${w - inset},${inset + cut} V ${h - inset - cut}
        L ${w - inset - cut},${h - inset} H ${inset + cut} L ${inset},${h - inset - cut} V ${inset + cut} Z`;
    const px = (x: number) => `${(x / w) * 100}%`, py = (y: number) => `${(y / h) * 100}%`;
    const clip = `polygon(${[
        [inset + cut, inset], [w - inset - cut, inset], [w - inset, inset + cut], [w - inset, h - inset - cut],
        [w - inset - cut, h - inset], [inset + cut, h - inset], [inset, h - inset - cut], [inset, inset + cut],
    ].map(([x, y]) => `${px(x)} ${py(y)}`).join(', ')})`;

    function BracketFrame() {
        return (
            <>
                <g className={`${slide} group-hover:-translate-x-1 group-hover:-translate-y-1`}><path d={`M ${i},${i + a} V ${i} H ${i + a}`} strokeWidth={2.5} /></g>
                <g className={`${slide} group-hover:translate-x-1 group-hover:-translate-y-1`}><path d={`M ${w - i - a},${i} H ${w - i} V ${i + a}`} strokeWidth={2.5} /></g>
                <g className={`${slide} group-hover:translate-x-1 group-hover:translate-y-1`}><path d={`M ${w - i},${h - i - a} V ${h - i} H ${w - i - a}`} strokeWidth={2.5} /></g>
                <g className={`${slide} group-hover:-translate-x-1 group-hover:translate-y-1`}><path d={`M ${i + a},${h - i} H ${i} V ${h - i - a}`} strokeWidth={2.5} /></g>
                <path d={panel} strokeWidth={1.5} opacity={0.7} />
            </>
        );
    }
    return { viewBox: `0 0 ${w} ${h}`, Frame: BracketFrame, clip };
}

// Same square shape; "All" is drawn at its larger size so strokes and brackets stay the same weight.
const large = bracketFrame(256, 256);
const square = bracketFrame(160, 160);

export const frames: Record<Category | 'all', IslandFrame> = {
    "all": large,
    "3D": square,
    "AI": square,
    "Full Stack": square,
    "Real-time": square,
};
