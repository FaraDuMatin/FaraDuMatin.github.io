'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '@/components/header';
import Section from '@/components/section';
import ReturnButton from '@/components/returnButton';
import ProjectFilter, { type Selection } from '@/components/ProjectFilter';
import Loader from '@/components/Loader';
import BackButton from '@/components/BackButton';
import ShaderBackground from '@/components/ShaderBackground';
import { projects, categories, type Category } from "@/lib/projects";
import Navigation from "@/components/navigation";
import { useLanguage } from '@/lib/LanguageContext';

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
  const pushed = useRef(0); // hash entries this page added, so Back never leaves the site

  useEffect(() => {
    const sync = () => setFilter(fromHash(window.location.hash));
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const select = (s: Selection) => {
    if (s === null) return goBack();
    pushed.current++;
    window.location.hash = slug(s); // fires hashchange → sync
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

  return (
    <main className="w-full bg-black flex flex-col items-center">
      <Loader />
      {filter === null && <ShaderBackground />}
      <Header bare={filter === null}>
        {filter === null && <ProjectFilter active={filter} counts={counts} total={projects.length} onChange={select} />}
      </Header>
      {filter !== null && <BackButton onClick={goBack} />}

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
