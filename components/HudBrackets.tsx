// Igloo-style corner brackets. Put inside a `group relative` element; on hover they lock on
// (bracket-lock in globals.css). --gx / --gy give each corner its outward direction.
const corners = [
    { pos: 'left-0 top-0 border-l-[1.5px] border-t-[1.5px]', gx: -1, gy: -1 },
    { pos: 'right-0 top-0 border-r-[1.5px] border-t-[1.5px]', gx: 1, gy: -1 },
    { pos: 'right-0 bottom-0 border-r-[1.5px] border-b-[1.5px]', gx: 1, gy: 1 },
    { pos: 'left-0 bottom-0 border-l-[1.5px] border-b-[1.5px]', gx: -1, gy: 1 },
];

// mount: also lock on when they first appear (e.g. moving to the newly picked language).
export default function HudBrackets({ mount = false }: { mount?: boolean }) {
    return (
        <>
            {corners.map(({ pos, gx, gy }) => (
                <span key={pos} aria-hidden style={{ '--gx': gx, '--gy': gy } as React.CSSProperties}
                    className={`bracket-lock ${mount ? 'bracket-mount' : ''} absolute size-3 border-current ${pos}`} />
            ))}
        </>
    );
}
