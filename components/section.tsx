import { Github, Globe, Play } from 'lucide-react';
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
    accentColor: string;
    architecture?: string;
}

export default function Section({title, description, feature, stack, github, githubLink, site, siteLink, demo, demoLink, fullDescription, root, slideCount, imageExtensions, accentColor, architecture }: SectionProps) {
    const accent = readableColor(accentColor);
    return (
        <section id={root} style={{ boxShadow: `0 0 4px ${accentColor}, 0px 0px 4px ${accentColor} inset`}}  className="relative w-full bg-black/50 max-w-6xl animate-in fade-in duration-500 p-6 sm:p-12 py-12 sm:py-20 border-x border-b border-gray-800 flex flex-col">
            <h2 style={{ borderLeft: `4px  ${accentColor}` }} className="-ml-6 sm:-ml-12 pl-4 sm:pl-10 text-3xl sm:text-5xl font-semibold text-zinc-400">
                <span style={{ color: accentColor }} className="font-bold">{title}. </span>
                <span className="block sm:inline">{description}</span>
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {(site && siteLink) && <HudLink href={siteLink} label="Site" icon={Globe} accentColor={accentColor} />}
                {(demo && demoLink) && <HudLink href={demoLink} label="Demo" icon={Play} accentColor={accentColor} />}
                {(github && githubLink) && <HudLink href={githubLink} label="Github" icon={Github} accentColor={accentColor} />}
                {architecture && <ArchitectureModal architecturePath={architecture} accentColor={accentColor} />}
            </div>
            <EmblaCarousel slides={(root && slideCount) ? generateSlidePaths(root, slideCount, imageExtensions) : ["placeholder.png"]} options={{}} />
            <div className="w-full flex flex-col items-center gap-6 text-center">
                <div>
                    <h3 style={{ color: accent }} className="mb-3 text-xs font-bold uppercase tracking-[0.2em]">Features</h3>
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
                        <h3 style={{ color: accent }} className="mb-3 text-xs font-bold uppercase tracking-[0.2em]">Stack</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {stack.split(',').map((s, i) => <StackPill key={i} name={s.trim()} />)}
                        </div>
                    </div>
                }
            </div>
            <div className="mt-10 w-full text-zinc-300 text-base sm:text-lg leading-relaxed">{addLineBreak(fullDescription)}</div>
        </section>
    );
}