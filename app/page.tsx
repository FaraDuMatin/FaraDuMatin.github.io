'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/header';
import Section from '@/components/section';
import ReturnButton from '@/components/returnButton';
import ProjectFilter, { type Selection } from '@/components/ProjectFilter';
import { projects, categories, type Category } from "@/lib/projects";
import Navigation from "@/components/navigation";
import { useLanguage } from '@/lib/LanguageContext';

const counts = Object.fromEntries(
  categories.map(c => [c, projects.filter(p => p.categories.includes(c)).length])
) as Record<Category, number>;

export default function Home() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Selection>(null);

  const visibleProjects = useMemo(
    () => filter === null ? []
      : filter === 'all' ? projects
      : projects.filter(p => p.categories.includes(filter)),
    [filter]
  );

  return (
    <main className="w-full bg-black flex flex-col items-center">
      <Header bare={filter === null}>
        <ProjectFilter active={filter} counts={counts} total={projects.length} onChange={setFilter} />
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
