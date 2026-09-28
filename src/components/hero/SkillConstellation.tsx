'use client';

import { useEffect, useRef, useState } from 'react';
import { GROUPS, SKILLS, type SkillGroup } from '@/lib/skills';
import { useTheme } from '@/lib/theme';
import { useReducedMotion } from '@/lib/motion';
import type { SceneApi } from './scene';

type Props = { ref?: React.Ref<HTMLDivElement> };

// Interactive 3D skill map. Falls back to a plain tag cloud when WebGL can't start.
export default function SkillConstellation({ ref }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const api = useRef<SceneApi | null>(null);
  const [active, setActive] = useState<SkillGroup | null>(null);
  const [no3d, setNo3d] = useState(false);
  const theme = useTheme();
  const reduced = useReducedMotion();

  // Latest values for the render loop, which lives outside React.
  const reducedRef = useRef(reduced);
  const themeRef = useRef(theme);
  useEffect(() => { reducedRef.current = reduced; }, [reduced]);
  useEffect(() => { themeRef.current = theme; api.current?.readTheme(); }, [theme]);

  useEffect(() => {
    let cancelled = false;
    // Loaded on demand so Three.js stays out of the first page load.
    import('./scene').then(({ createScene }) => {
      if (cancelled || !canvas.current || !box.current || !tip.current) return;
      try {
        api.current = createScene({
          canvas: canvas.current,
          container: box.current,
          tip: tip.current,
          isReduced: () => reducedRef.current,
          isDark: () => themeRef.current !== 'light',
        });
      } catch (e) {
        console.warn(e);
        setNo3d(true);
      }
    }).catch(() => setNo3d(true));
    return () => { cancelled = true; api.current?.dispose(); api.current = null; };
  }, []);

  useEffect(() => { api.current?.setGroup(active); }, [active]);

  const setBox = (el: HTMLDivElement | null) => {
    box.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };

  return (
    <div className={`hero-3d${no3d ? ' no-3d' : ''}`} ref={setBox}>
      <canvas
        id="scene"
        ref={canvas}
        role="img"
        aria-label="3D constellation of my skills: AI and LLMs, full-stack, DevOps and core computer science."
      />
      <div className="cloud" aria-hidden="true">
        {SKILLS.map(([name, g]) => (
          <span key={name} className={active && g !== active ? 'dim' : undefined} style={{ '--c': `var(${GROUPS[g].token})` } as React.CSSProperties}>
            {name}
          </span>
        ))}
      </div>
      <div className="tip" ref={tip} aria-hidden="true" />
      <div className={`legend${active ? ' has-active' : ''}`} role="group" aria-label="Highlight a skill group">
        {(Object.keys(GROUPS) as SkillGroup[]).map(g => (
          <button
            key={g}
            className="chip"
            type="button"
            aria-pressed={active === g}
            onClick={() => setActive(a => (a === g ? null : g))}
            style={{ '--c': `var(${GROUPS[g].token})` } as React.CSSProperties}
          >
            <span className="d" />{GROUPS[g].label}
          </button>
        ))}
      </div>
      <p className="hint">{no3d ? 'Pick a group to highlight it' : 'Drag to rotate, hover a node, or pick a group'}</p>
    </div>
  );
}
