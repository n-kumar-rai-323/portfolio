'use client';

import { useEffect } from 'react';

const SELECTOR = '.h-reveal, .rise, .fade, .from-left, .from-right, .zoom';

// Adds `.in` to reveal elements as they scroll into view; globals.css runs the animation.
export default function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(SELECTOR));
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
