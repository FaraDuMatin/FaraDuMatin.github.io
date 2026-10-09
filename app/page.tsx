'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/header';
import Section from '@/components/section';
import ReturnButton from '@/components/returnButton';
import ProjectFilter, { type Selection } from '@/components/ProjectFilter';
import Loader from '@/components/Loader';
import ShaderBackground from '@/components/ShaderBackground';
import BackgroundPicker, { BACKGROUND_COLORS } from '@/components/BackgroundPicker';
import { projects, categories, type Category } from "@/lib/projects";
import Navigation from "@/components/navigation";
import { useLanguage } from '@/lib/LanguageContext';
import { oncePerFrame } from '@/lib/oncePerFrame';
import { playSound } from '@/lib/sound';
import SoundToggle from '@/components/SoundToggle';

// Dive timing — tune here.
const DIVE = 900;          // ms — push into the card (page swaps at the end, under black)
const DIVE_EASE = 'cubic-bezier(0.45, 0.05, 0.75, 0.6)'; // moves right away, speeds up
const DIVE_SCALE = 6;      // how far the home view zooms into the card
const SHADER_SCALE = 3;    // how far the shader background zooms
const VEIL_DELAY = 600;    // ms before the screen starts going black
const VEIL_FADE = DIVE - VEIL_DELAY; // ms to full black, timed to land on the swap
const DIVE_HOLD = 150;     // ms on black after the swap, so the project page has rendered
const DIVE_REVEAL = 700;   // ms — black lifts

const counts = Object.fromEntries(
  categories.map(c => [c, projects.filter(p => p.categories.includes(c)).length])
) as Record<Category, number>;

// The selected island lives in the URL hash (#ai, #full-stack, #all…) so the browser's
// back gesture works. No section id uses these names, so the hash never scrolls.
const slug = (s: Category | 'all') => s.toLowerCase().replace(/ /g, '-');
const fromHash = (hash: string): Selection =>
  hash === '#all' ? 'all' : categories.find(c => `#${slug(c)}` === hash) ?? null;

export default function Home() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Selection>(null);
  const [background, setBackground] = useState(BACKGROUND_COLORS[0].hex);
  const pushed = useRef(0); // hash entries this page added, so Back never leaves the site

  useEffect(() => {
    const sync = () => setFilter(fromHash(window.location.hash));
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  // Island → project page, Igloo-style dive: the home view pushes into the clicked card with
  // blur and color fringing while the shader dives and darkens; the page swaps under black, then
  // the black lifts and the project parts arrive one by one (see .dive-part in section.tsx).
  // Web Animations API only, no library. Reduced motion (or no rect) switches instantly.
  const diving = useRef(false);
  const [veil, setVeil] = useState<'off' | 'in' | 'out'>('off');
  const open = (s: Category | 'all') => {
    pushed.current++;
    window.location.hash = slug(s); // fires hashchange → sync
    window.scrollTo(0, 0);
  };
  const select = (s: Selection, from?: DOMRect) => {
    if (s === null) return goBack();
    if (diving.current) return;
    if (!from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playSound('click');
      return open(s);
    }
    diving.current = true;
    playSound('dive');
    // The zoomed header overflows the page; hide the scrollbars until the swap.
    document.documentElement.style.overflow = 'hidden';

    const cx = from.left + from.width / 2, cy = from.top + from.height / 2;
    const timing = { duration: DIVE, easing: DIVE_EASE, fill: 'forwards' as const };
    const anims: Animation[] = [];
    const header = document.querySelector('header');
    if (header) {
      const r = header.getBoundingClientRect();
      header.style.transformOrigin = `${cx - r.left}px ${cy - r.top}px`;
      // Transform + opacity only: GPU-cheap. (Blur/color-fringe filters here were too laggy.)
      anims.push(header.animate([
        { transform: 'scale(1)', opacity: 1 },
        { offset: 0.5, opacity: 1 },
        { transform: `scale(${DIVE_SCALE})`, opacity: 0 },
      ], timing));
    }
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.transformOrigin = `${cx}px ${cy}px`;
      anims.push(canvas.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: `scale(${SHADER_SCALE})`, opacity: 0.3 },
      ], timing));
    }
    setVeil('in');

    setTimeout(() => { // under full black: swap the page and reset the dive
      open(s);
      anims.forEach(a => a.cancel());
      if (header) header.style.transformOrigin = '';
      document.documentElement.style.overflow = '';
    }, DIVE);
    setTimeout(() => setVeil('out'), DIVE + DIVE_HOLD);
    setTimeout(() => { setVeil('off'); diving.current = false; }, DIVE + DIVE_HOLD + DIVE_REVEAL);
  };

  const goBack = () => {
    if (pushed.current > 0) {
      pushed.current--;
      window.history.back();
    } else {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
      setFilter(null);
    }
  };

  const visibleProjects = useMemo(
    () => filter === null ? []
      : filter === 'all' ? projects
      : projects.filter(p => p.categories.includes(filter)),
    [filter]
  );

  // Accent of the project crossing the middle of the screen; tints the shader behind it.
  const [inView, setInView] = useState<string | undefined>();
  useEffect(() => {
    const update = () => {
      const middle = window.innerHeight / 2;
      const current = visibleProjects.find(({ root }) => {
        const rect = document.getElementById(root)?.getBoundingClientRect();
        return rect && rect.top <= middle && rect.bottom >= middle;
      });
      setInView((current ?? visibleProjects[0])?.accentColor);
    };
    update();
    const onScroll = oncePerFrame(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { onScroll.cancel(); window.removeEventListener('scroll', onScroll); };
  }, [visibleProjects]);

  return (
    <main className="w-full bg-black flex flex-col items-center">
      <Loader />
      <ShaderBackground dim={filter !== null} accent={filter !== null ? inView : undefined} base={background} />
      {filter === null && <BackgroundPicker value={background} onChange={setBackground} />}
      <SoundToggle />
      {/* Dive veil: goes black at the end of the dive, lifts after the swap. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] bg-black" style={{
        opacity: veil === 'in' ? 1 : 0,
        transition: veil === 'in' ? `opacity ${VEIL_FADE}ms ease-in ${VEIL_DELAY}ms`
          : veil === 'out' ? `opacity ${DIVE_REVEAL}ms ease-out` : 'none',
      }} />
      <Header bare onBack={filter !== null ? goBack : undefined}>
        {filter === null && <ProjectFilter active={filter} counts={counts} total={projects.length} onChange={select} />}
      </Header>

      {projects.map((project, index) => {
        // Merge with the full, unfiltered index: t.projects is positional.
        const translatedProject = {
          ...project,
          ...t.projects[index]
        };
        if (!visibleProjects.includes(project)) return null;
        return <Section key={project.root} {...translatedProject} />;
      })}
      <Navigation projects={visibleProjects} />
      <ReturnButton />
    </main>
  );
}
