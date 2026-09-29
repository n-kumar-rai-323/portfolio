'use client';

import { useEffect, useRef, useState } from 'react';
import { STAGES } from '@/lib/journey';
import { useReducedMotion } from '@/lib/motion';
import './journey.css';

export default function Journey() {
  const tl = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  // How many stages have scrolled past the trigger line. Each one lights its stage and stack layer.
  const [reached, setReached] = useState(0);

  // The timeline line fills as you scroll; a stage turns on once its top passes 62% of the viewport.
  useEffect(() => {
    const list = tl.current;
    if (!list) return;
    if (reduced) { list.style.setProperty('--p', '1'); setReached(STAGES.length); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const trig = innerHeight * 0.62;
      const rect = list.getBoundingClientRect();
      list.style.setProperty('--p', Math.min(Math.max((trig - rect.top) / rect.height, 0), 1).toFixed(4));
      const tops = Array.from(list.children, li => li.getBoundingClientRect().top);
      setReached(tops.filter(t => t < trig).length);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
  }, [reduced]);

  return (
    <section className="section" id="journey" aria-labelledby="jyTitle">
      <div className="wrap">
        <div className="jy">
          <div className="jy-left">
            <h2 className="sec-title h-reveal" id="jyTitle">Where I&apos;ve been</h2>
            <p className="sec-sub fade">Full-stack first, then DevOps, now AI.</p>
            <div className="stack" aria-hidden="true">
              {STAGES.map((s, i) => (
                <div
                  key={s.layer}
                  className={`layer${s.now ? ' top' : ''}${i < reached ? ' on' : ''}`}
                  style={{ '--c': `var(${s.token})` } as React.CSSProperties}
                >
                  <span className="d" />{s.layer}<small>{s.now ? 'now' : `layer ${i + 1}`}</small>
                </div>
              ))}
            </div>
            <p className="stack-cap">Each stage adds a layer. None of them went away.</p>
          </div>

          <ol className="tl" ref={tl}>
            {STAGES.map((s, i) => (
              <li key={s.title} className={`stage${s.now ? ' now' : ''}${i < reached ? ' on' : ''}`}>
                <span className="when">{s.when}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul className="tags">{s.tags.map(t => <li key={t}>{t}</li>)}</ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
