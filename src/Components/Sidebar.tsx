import React, { useEffect, useRef, useState } from 'react';
import './Sidebar.css';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string>('home');
  const [open, setOpen] = useState<boolean>(false);

  const links = [
    { id: 'home', label: t('nav.home') },
    { id: 'project1', label: t('projects.project1.title') },
    { id: 'project2', label: t('projects.project2.title') },
    { id: 'project3', label: t('projects.project3.title') },
    { id: 'experience', label: t('experience.title') },
    { id: 'education', label: t('education.title') },
  ];

  const manualScrollRef = useRef(false);
  const manualTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.45 };
    const observer = new IntersectionObserver((entries) => {
      // If a manual scroll just occurred, ignore observer updates briefly
      if (manualScrollRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id || 'home');
        }
      });
    }, observerOptions);

    links.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (manualTimerRef.current) window.clearTimeout(manualTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Mark that user initiated a manual scroll to avoid observer race
    manualScrollRef.current = true;
    if (manualTimerRef.current) window.clearTimeout(manualTimerRef.current);
    // Give the browser time to perform smooth scroll before re-enabling observer updates
    manualTimerRef.current = window.setTimeout(() => {
      manualScrollRef.current = false;
      manualTimerRef.current = null;
    }, 700);

    // Immediately set active so UI updates while scrolling
    setActiveId(id);

    // Use window.scrollTo with computed offsets for more consistent behavior
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const target = rect.top + scrollTop;

    window.scrollTo({ top: target, behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav className={`sidebar ${open ? 'open' : ''}`} aria-label={t('nav.navigation') || 'Navigation'}>
      <button
        className="sidebar-toggle"
        aria-expanded={open}
        aria-controls="sidebar-list"
        onClick={() => setOpen((s) => !s)}
      >
        ☰
      </button>

      <ul id="sidebar-list" className="sidebar-list">
        {links.map((link) => (
          <li key={link.id} className={`sidebar-item ${activeId === link.id ? 'active' : ''}`}>
            <button className="sidebar-link" onClick={() => handleClick(link.id)}>
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
