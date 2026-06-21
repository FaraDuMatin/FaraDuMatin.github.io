import type { CSSProperties } from 'react';
import EmblaCarousel from './carousel/EmblaCarousel';
import ArchitectureModal from './ArchitectureModal';
import '../components/carousel/embla.css';

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
            {architecture && <ArchitectureModal architecturePath={architecture} accentColor={accentColor} />}
            <h2 style={{ borderLeft: `4px  ${accentColor}` }} className="-ml-6 sm:-ml-12 pl-4 sm:pl-10 text-3xl sm:text-5xl font-semibold text-zinc-400">
                <span style={{ color: accentColor }} className="font-bold">{title}. </span>
                <span className="block sm:inline">{description}</span>
            </h2>
            <EmblaCarousel slides={(root && slideCount) ? generateSlidePaths(root, slideCount, imageExtensions) : ["placeholder.png"]} options={{}} />
            <div className="w-full flex flex-col md:flex-row gap-10">
                <div className="max-w-sm text-zinc-400 text-xl sm:text-2xl flex flex-col gap-8">
                    {(site && siteLink) &&
                        <a href={siteLink} target="_blank" rel="noopener noreferrer" style={{ backgroundImage: `radial-gradient(ellipse 55% 70% at 100% 0%, ${accentColor}59, transparent)`, '--accent': accentColor } as CSSProperties} className="group flex w-full items-center gap-2 rounded-xl border p-4 transition border-neutral-800 bg-neutral-950 shadow-sm hover:border-[color:var(--accent)]">
                            <span style={{ color: accentColor }} className="font-bold">Site:</span>
                            <span className="text-zinc-400 group-hover:underline">{site}</span>
                        </a>
                    }
                    {(demo && demoLink) &&
                        <a href={demoLink} target="_blank" rel="noopener noreferrer" style={{ backgroundImage: `radial-gradient(ellipse 55% 70% at 100% 0%, ${accentColor}59, transparent)`, '--accent': accentColor } as CSSProperties} className="group flex w-full items-center gap-2 rounded-xl border p-4 transition border-neutral-800 bg-neutral-950 shadow-sm hover:border-[color:var(--accent)]">
                            <span style={{ color: accentColor }} className="font-bold">Demo:</span>
                            <span className="text-zinc-400 group-hover:underline">{demo}</span>
                        </a>
                    }
                    {/* <p><span style={{ color: accentColor }} className="font-bold">Stack:</span> {stack}</p> */}
                    <p className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 shadow-sm"><span style={{ color: accentColor }} className="font-bold">Features:</span> {feature}</p>
                    {(github && githubLink) &&
                        <p className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-4 shadow-sm"><span style={{ color: accentColor }} className="font-bold">Github:</span> <a className="hover:underline" href={githubLink} target="_blank" rel="noopener noreferrer">{github}</a></p>
                    }
                </div>
                <div className="md:w-0 md:flex-1 text-zinc-400 text-base sm:text-lg leading-relaxed">{addLineBreak(fullDescription)}</div>
            </div>
        </section>
    );
}