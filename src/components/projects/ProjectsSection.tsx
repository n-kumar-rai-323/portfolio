'use client';

import { useMemo, useState } from 'react';
import { CATS, PROJECTS, type ProjectCategory } from '@/lib/projects';
import ProjectCard from './ProjectCard';
import CaseStudyDrawer from './CaseStudyDrawer';
import './projects.css';

type Filter = 'all' | ProjectCategory;

function matches(p: (typeof PROJECTS)[number], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    p.title.toLowerCase().includes(q) ||
    p.short.toLowerCase().includes(q) ||
    p.kind.toLowerCase().includes(q) ||
    p.tech.some(t => t.toLowerCase().includes(q))
  );
}

export default function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      PROJECTS.map((p, i) => ({ p, i }))
        .filter(({ p }) => filter === 'all' || p.cat === filter)
        .filter(({ p }) => matches(p, query)),
    [filter, query],
  );

  return (
    <section className="section" id="projects" aria-labelledby="projTitle">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="sec-title h-reveal" id="projTitle">Projects</h2>
          <p className="sec-sub fade">A working RAG app, plus the extraction, chat and fundamentals work behind it.</p>
        </div>

        <div className="proj-controls rise">
          <div className="proj-cats" role="group" aria-label="Filter by category">
            <button className="chip" type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
              All
            </button>
            {(Object.entries(CATS) as [ProjectCategory, (typeof CATS)[ProjectCategory]][]).map(([key, c]) => (
              <button
                key={key}
                className="chip"
                type="button"
                aria-pressed={filter === key}
                style={{ '--c': `var(${c.token})` } as React.CSSProperties}
                onClick={() => setFilter(key)}
              >
                <span className="d" />
                {c.label}
              </button>
            ))}
          </div>
          <label className="proj-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              placeholder="Search by name or tech…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </label>
        </div>

        {filtered.length > 0 ? (
          <div className="proj-grid">
            {filtered.map(({ p, i }, k) => (
              <ProjectCard key={p.repo} project={p} index={k} query={query} onOpen={() => setOpenIndex(i)} />
            ))}
          </div>
        ) : (
          <p className="proj-empty muted">No projects match “{query}”.</p>
        )}
      </div>

      <CaseStudyDrawer
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onStep={dir => setOpenIndex(idx => (idx === null ? idx : (idx + dir + PROJECTS.length) % PROJECTS.length))}
      />
    </section>
  );
}
