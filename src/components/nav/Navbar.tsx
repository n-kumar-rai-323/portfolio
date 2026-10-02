'use client';

import { useEffect, useRef, useState } from 'react';
import { NAV_LINKS } from '@/lib/nav';
import ThemeToggle from './ThemeToggle';
import './nav.css';

export default function Navbar() {
  const [fixed, setFixed] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const nav = useRef<HTMLElement>(null);

  // Stick to the top once the first screen is mostly scrolled past.
  useEffect(() => {
    const onScroll = () => setFixed(scrollY > innerHeight * 0.6);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the link for the section in the middle of the screen.
  useEffect(() => {
    const sections = ['top', ...NAV_LINKS.map(l => l.id)]
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Small-screen menu: Escape or a tap outside the nav closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e: PointerEvent) => { if (!nav.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

  return (
    <nav className={`nav${fixed ? ' fixed' : ''}${open ? ' open' : ''}`} aria-label="Primary" ref={nav}>
      <div className="wrap nav-in">
        <a href="#top" className="logo" aria-label="nishan.ai, back to top" onClick={() => setOpen(false)}>nishan<span>.</span>ai</a>
        <ul className="nav-links" id="navLinks">
          {NAV_LINKS.map(l => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={active === l.id ? 'active' : undefined}
                aria-current={active === l.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
        <button
          className="icon-btn nav-toggle"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="navLinks"
          onClick={() => setOpen(o => !o)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d={open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
          </svg>
        </button>
      </div>
    </nav>
  );
}
