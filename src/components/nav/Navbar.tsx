'use client';

import { useEffect, useState } from 'react';
import { NAV_LINKS } from '@/lib/nav';
import ThemeToggle from './ThemeToggle';
import './nav.css';

export default function Navbar() {
  const [fixed, setFixed] = useState(false);
  const [active, setActive] = useState<string | null>(null);

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

  return (
    <nav className={`nav${fixed ? ' fixed' : ''}`} aria-label="Primary">
      <div className="wrap nav-in">
        <a href="#top" className="logo" aria-label="nishan.ai, back to top">nishan<span>.</span>ai</a>
        <ul className="nav-links">
          {NAV_LINKS.map(l => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={active === l.id ? 'active' : undefined}
                aria-current={active === l.id ? 'true' : undefined}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </div>
    </nav>
  );
}
