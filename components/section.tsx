import type { CSSProperties } from 'react';
import { Github, Globe, Play } from 'lucide-react';
import MagneticPill from './MagneticPill';
import EmblaCarousel from './carousel/EmblaCarousel';
import ArchitectureModal from './ArchitectureModal';
import '../components/carousel/embla.css';

function LinkPill({ href, label, icon: Icon, accentColor }: { href: string; label: string; icon: typeof Github; accentColor: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ '--accent': accentColor } as CSSProperties}
            className="group inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm font-medium text-zinc-300 shadow-sm transition hover:border-[color:var(--accent)] hover:text-white">
            <Icon className="h-4 w-4" style={{ color: accentColor }} />
            {label}
        </a>
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
    return (
        <section id={root} style={{ boxShadow: `0 0 4px ${accentColor}, 0px 0px 4px ${accentColor} inset`}}  className="relative w-full bg-black max-w-6xl p-6 sm:p-12 py-12 sm:py-20 border-x border-b border-gray-800 flex flex-col">
            <h2 style={{ borderLeft: `4px  ${accentColor}` }} className="-ml-6 sm:-ml-12 pl-4 sm:pl-10 text-3xl sm:text-5xl font-semibold text-zinc-400">
                <span style={{ color: accentColor }} className="font-bold">{title}. </span>
                <span className="block sm:inline">{description}</span>
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
                {(site && siteLink) && <MagneticPill href={siteLink} label="Site" icon={Globe} accentColor={accentColor} />}
                {(demo && demoLink) && <MagneticPill href={demoLink} label="Demo" icon={Play} accentColor={accentColor} />}
                {(github && githubLink) && <LinkPill href={githubLink} label="Github" icon={Github} accentColor={accentColor} />}
                {architecture && <ArchitectureModal architecturePath={architecture} accentColor={accentColor} />}
            </div>
            <EmblaCarousel slides={(root && slideCount) ? generateSlidePaths(root, slideCount, imageExtensions) : ["placeholder.png"]} options={{}} />
            <div className="w-full flex flex-col gap-10">
                <div className="w-full flex flex-col md:flex-row gap-10">
                    <div className="md:w-2/5 shrink-0 flex flex-col gap-6">
                        <div>
                            <h3 style={{ color: accentColor }} className="mb-3 text-sm font-bold uppercase tracking-wider">Features</h3>
                            <div className="flex flex-wrap gap-2">
                                {feature.split(',').map((f, i) => (
                                    <span key={i} className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-sm text-zinc-400">{f.trim()}</span>
                                ))}
                            </div>
                        </div>
                        {stack &&
                            <div>
                                <h3 style={{ color: accentColor }} className="mb-3 text-sm font-bold uppercase tracking-wider">Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {stack.split(',').map((s, i) => (
                                        <span key={i} className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-sm text-zinc-400">{s.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                    <div className="md:flex-1 text-zinc-300 text-base sm:text-lg leading-relaxed">{addLineBreak(fullDescription)}</div>
                </div>
            </div>
        </section>
    );
}