'use client';

import { useEffect, useRef } from 'react';
import Navbar from '@/components/nav/Navbar';
import { SITE } from '@/lib/site';
import { useReducedMotion } from '@/lib/motion';
import TypedRole from './TypedRole';
import SkillConstellation from './SkillConstellation';
import './hero.css';

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Parallax: the copy lifts and fades, the 3D scene shrinks slightly as you scroll away.
  useEffect(() => {
    const c = copy.current, s = scene.current;
    if (!c || !s) return;
    const clear = () => { c.style.transform = c.style.opacity = s.style.transform = s.style.opacity = ''; };
    if (reduced) { clear(); return; }
    // Stacked layout: the hero is taller than the screen, so fading it would dim text still being read.
    const stacked = matchMedia('(max-width: 900px)');
    let raf = 0;
    const update = () => {
      raf = 0;
      if (stacked.matches) { clear(); return; }
      const h = hero.current?.offsetHeight || innerHeight;
      if (scrollY > h * 1.1) return;
      const p = Math.min(Math.max(scrollY / h, 0), 1);
      c.style.transform = `translate3d(0, ${(-p * 90).toFixed(1)}px, 0)`;
      c.style.opacity = (1 - p * 1.1).toFixed(3);
      s.style.transform = `scale(${(1 - p * 0.08).toFixed(4)})`;
      s.style.opacity = (1 - p * 0.85).toFixed(3);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); };
  }, [reduced]);

  return (
    <header className="hero" id="top" ref={hero}>
      <Navbar />
      <div className="wrap hero-inner">
        <div className="hero-copy" ref={copy}>
          <p className="name-line">{SITE.name} / <TypedRole /></p>
          <p className="status"><span className="dot" aria-hidden="true" />AI Engineer at HiTech Solutions and Services, Kathmandu</p>
          <h1 className="display">I build AI<br /><span className="outline">that ships.</span></h1>
          <p className="lede">
            AI engineer with a full-stack and DevOps background. I build RAG systems and AI agents, the app around them
            and the pipeline that deploys them, bringing AI into business software used by SMEs, retailers and
            accountants across Nepal.
          </p>
          <div className="cta">
            <a className="btn btn-primary" href="#projects">See my projects</a>
            <a className="btn btn-ghost" href={`mailto:${SITE.email}`}>Email me</a>
          </div>
        </div>
        <SkillConstellation ref={scene} />
      </div>
      <a className="cue" href="#services" aria-label="Scroll to What I build"><span /></a>
    </header>
  );
}
