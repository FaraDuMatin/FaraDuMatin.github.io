'use client';

import { useEffect, type CSSProperties } from 'react';
import { Github, Globe, Play } from 'lucide-react';
import { useScramble } from '@/lib/useScramble';
import HudLink from './HudLink';
import EmblaCarousel from './carousel/EmblaCarousel';
import ArchitectureModal from './ArchitectureModal';
import { getTech, readableColor } from '@/lib/techStack';
import '../components/carousel/embla.css';

function mix(color: string, percent: number) {
    return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

function StackPill({ name }: { name: string }) {
    const { color, icon } = getTech(name);
    const mask = icon ? `url(/tech/${icon}.svg) center / contain no-repeat` : undefined;
    return (
        <span style={{ borderColor: mix(color, 35), backgroundColor: mix(color, 10) }}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm text-zinc-200 transition-colors hover:text-white">
            {icon
                ? <span aria-hidden style={{ backgroundColor: color, mask, WebkitMask: mask }} className="h-3.5 w-3.5 shrink-0" />
                : <span aria-hidden style={{ backgroundColor: color }} className="h-2 w-2 shrink-0 rounded-full" />}
            {name}
        </span>
    );
}

function addLineBreak(str: string) {
    return str.split("\\n").map((substring, index) => {
        return (
            <p key={index} className="mb-4">
                {substring}
            </p>
        );
    });
}

function generateSlidePaths(slideRoot: string, slideCount: number, imageExtensions?: string[]): string[] {
    const slidePaths = [];

    for (let i = 1; i <= slideCount; i++) {
        const extension = imageExtensions?.[i - 1] || 'png';
        slidePaths.push(`/${slideRoot}-img${i}.${extension}`);
    }

    return slidePaths;
}

interface SectionProps {
    title: string;
    description: string;
    feature: string;
    stack: string;
    github?: string;
    githubLink?: string;
    site?: string;
    siteLink?: string;
    demo?: string;
    demoLink?: string;
    fullDescription: string;
    root?: string;
    slideCount?: number;
    imageExtensions?: string[];
    video?: string;
    accentColor: string;
    architecture?: string;
}

// Static HUD corner brackets for panels and the carousel.
const cornerPos = [
    'left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2',
    'right-0 bottom-0 border-r-2 border-b-2', 'left-0 bottom-0 border-l-2 border-b-2',
];
function Corners({ color, size }: { color: string; size: string }) {
    return <>{cornerPos.map(pos => (
        <span key={pos} aria-hidden style={{ borderColor: color }} className={`pointer-events-none absolute ${size} ${pos}`} />
    ))}</>;
}

const hud = 'font-[family-name:var(--font-hud)]';

// Arrival order after the dive (ms after the section appears): screenshot first, then the
// title (scrambling in), buttons, features/stack, description.
const ARRIVE = { carousel: 200, title: 500, links: 650, details: 800, text: 950 };
const arrive = (ms: number) => ({ className: 'dive-part', style: { '--dive-delay': `${ms}ms` } as CSSProperties });

export default function Section({title, description, feature, stack, github, githubLink, site, siteLink, demo, demoLink, fullDescription, root, slideCount, imageExtensions, video, accentColor, architecture }: SectionProps) {
    const accent = readableColor(accentColor);
    const [titleGlyphs, scrambleTitle] = useScramble(title);
    useEffect(() => {
        const timer = setTimeout(scrambleTitle, ARRIVE.title);
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps -- once, on arrival
    return (
        <section id={root} className="relative mt-10 w-full bg-black/65 max-w-6xl animate-in fade-in duration-500 p-6 sm:p-12 py-12 sm:py-20 border border-white/5 flex flex-col">
            <Corners color={accent} size="size-8" />
            <h2 {...arrive(ARRIVE.title)} aria-label={`${title}. ${description}`}>
                <span aria-hidden className={`${hud} text-3xl sm:text-5xl font-semibold text-zinc-300 [text-shadow:0_0_18px_rgba(255,255,255,0.2)]`}>
                    <span style={{ color: accent }} className="font-bold whitespace-pre">
                        {titleGlyphs.map((g, i) => <span key={i} style={{ opacity: g.opacity }}>{g.ch}</span>)}{'. '}
                    </span>
                    <span className="block sm:inline">{description}</span>
                </span>
            </h2>
            <div {...arrive(ARRIVE.links)}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {(site && siteLink) && <HudLink href={siteLink} label="Site" icon={Globe} accentColor={accentColor} />}
                {(demo && demoLink) && <HudLink href={demoLink} label="Demo" icon={Play} accentColor={accentColor} />}
                {(github && githubLink) && <HudLink href={githubLink} label="Github" icon={Github} accentColor={accentColor} />}
                {architecture && <ArchitectureModal architecturePath={architecture} accentColor={accentColor} />}
            </div>
            </div>
            <div {...arrive(ARRIVE.carousel)}>
            <div className="relative my-12 p-3 [&_.embla]:my-0">
                <Corners color="rgba(255,255,255,0.5)" size="size-5" />
                <EmblaCarousel slides={(root && slideCount) ? generateSlidePaths(root, slideCount, imageExtensions) : ["placeholder.png"]} video={video} options={{}} />
            </div>
            </div>
            <div {...arrive(ARRIVE.details)}>
            <div className="w-full flex flex-col items-center gap-6 text-center">
                <div>
                    <h3 style={{ color: accent }} className={`${hud} mb-3 text-sm font-semibold uppercase tracking-[0.2em]`}>Features</h3>
                    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                        {feature.split(',').map((f, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-300">
                                <span aria-hidden style={{ backgroundColor: accent }} className="h-1.5 w-1.5 shrink-0 rotate-45" />
                                {f.trim()}
                            </li>
                        ))}
                    </ul>
                </div>
                {stack &&
                    <div>
                        <h3 style={{ color: accent }} className={`${hud} mb-3 text-sm font-semibold uppercase tracking-[0.2em]`}>Stack</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {stack.split(',').map((s, i) => <StackPill key={i} name={s.trim()} />)}
                        </div>
                    </div>
                }
            </div>
            </div>
            <div {...arrive(ARRIVE.text)} className="dive-part mt-10 w-full text-zinc-300 text-base sm:text-lg leading-relaxed">{addLineBreak(fullDescription)}</div>
        </section>
    );
}