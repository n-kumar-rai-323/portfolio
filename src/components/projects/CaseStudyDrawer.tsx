'use client';

import { useEffect, useRef } from 'react';
import { CATS, PROJECTS } from '@/lib/projects';
import { DEMO_URL, SITE } from '@/lib/site';

type Props = {
  index: number | null;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';

// Slide-in case-study panel: traps focus and locks scroll while open, restores focus on close.
export default function CaseStudyDrawer({ index, onClose, onStep }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.documentElement.classList.add('lock');
    closeRef.current?.focus();
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    return () => {
      document.documentElement.classList.remove('lock');
      lastFocus.current?.focus?.();
    };
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const root = closeRef.current?.closest('.drawer');
      if (!root) return;
      const f = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const p = index !== null ? PROJECTS[index] : null;
  const prev = index !== null ? PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length] : null;
  const next = index !== null ? PROJECTS[(index + 1) % PROJECTS.length] : null;

  return (
    <>
      <div className={`scrim${open ? ' open' : ''}`} onClick={onClose} />
      <aside className={`drawer${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="dTitle" aria-hidden={!open}>
        <div className="drawer-head">
          <p className="muted">{p ? `Case study ${index! + 1} of ${PROJECTS.length}` : 'Case study'}</p>
          <button className="icon-btn" type="button" ref={closeRef} aria-label="Close case study" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div className="drawer-body" ref={bodyRef}>
          {p && (
            <>
              <p className="d-kind">{p.kind} · {CATS[p.cat].label}</p>
              <h2 id="dTitle">{p.title}</h2>
              <p className="d-sum">{p.short}</p>
              <h3>The problem</h3>
              <p className="d-body-t">{p.problem}</p>
              <h3>How it works</h3>
              <ol className="d-steps">{p.how.map(s => <li key={s}>{s}</li>)}</ol>
              <h3>Outcome</h3>
              <p className="d-body-t">{p.outcome}</p>
              <h3>Built with</h3>
              <ul className="tags">{p.tech.map(t => <li key={t}>{t}</li>)}</ul>
              <div className="d-actions">
                <a className="btn btn-primary btn-sm" href={`${SITE.github}/${p.repo}`} target="_blank" rel="noopener">View code on GitHub</a>
                {p.demo && <a className="btn btn-ghost btn-sm" href={DEMO_URL} target="_blank" rel="noopener">Open live demo</a>}
              </div>
            </>
          )}
        </div>
        <div className="drawer-foot">
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => onStep(-1)} aria-label={prev ? `Previous case study: ${prev.title}` : undefined}>
            {prev ? `Previous: ${prev.title}` : 'Previous'}
          </button>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => onStep(1)} aria-label={next ? `Next case study: ${next.title}` : undefined}>
            {next ? `Next: ${next.title}` : 'Next'}
          </button>
        </div>
      </aside>
    </>
  );
}
