'use client';

import Header from '@/components/header';
import Section from '@/components/section';
import ReturnButton from '@/components/returnButton';
import { projects } from "@/lib/projects";
import Navigation from "@/components/navigation";
import { useLanguage } from '@/lib/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <main className="w-full bg-black flex flex-col items-center">
      <Header />

      {projects.map((project, index) => {
        const translatedProject = {
          ...project,
          ...t.projects[index]
        };
        return <Section key={project.root} {...translatedProject} />;
      })}
      <Navigation projects={projects} />
      <ReturnButton />
    </main>
  );
}
