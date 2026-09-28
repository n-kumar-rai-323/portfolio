'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CAPABILITIES, STEP_LABEL } from '@/lib/services';
import { DEMO_URL } from '@/lib/site';
import { useReducedMotion } from '@/lib/motion';
import AgentLoop from './AgentLoop';

const STEP_MS = 750;

// Capability tabs on the left; a simulated agent trace for the selected one on the right.
export default function CapabilityExplorer() {
  const [capIdx, setCapIdx] = useState(0);
  const [taskIdx, setTaskIdx] = useState(0);
  const [shown, setShown] = useState(0);          // how many steps of the trace are visible
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const runId = useRef(0);
  const started = useRef(false);                   // set once any trace has run
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const cap = CAPABILITIES[capIdx];
  const steps = cap.tasks[taskIdx].steps;
  const current = status === 'idle' || shown === 0 ? null : steps[shown - 1][0];

  // Reveals the steps one by one. A newer run cancels an older one.
  const run = useCallback(async (total: number) => {
    const my = ++runId.current;
    started.current = true;
    setStatus('running');
    for (let k = 1; k <= total; k++) {
      if (my !== runId.current) return;
      setShown(k);
      if (k < total) await new Promise(r => setTimeout(r, reduced ? 0 : STEP_MS));
    }
    if (my === runId.current) setStatus('done');
  }, [reduced]);

  const reset = () => { runId.current++; setShown(0); setStatus('idle'); };

  const selectCap = (i: number) => {
    setCapIdx(i); setTaskIdx(0); reset();
    run(CAPABILITIES[i].tasks[0].steps.length);
  };
  const selectTask = (i: number) => {
    setTaskIdx(i); setShown(0);
    run(cap.tasks[i].steps.length);
  };

  // Arrow keys, Home and End move between tabs.
  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const d = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    const n = d ? (i + d + CAPABILITIES.length) % CAPABILITIES.length
      : e.key === 'Home' ? 0 : e.key === 'End' ? CAPABILITIES.length - 1 : null;
    if (n === null) return;
    e.preventDefault();
    tabs.current[n]?.focus();
    selectCap(n);
  };

  // Play the first trace once, when the panel scrolls into view.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const io = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { io.disconnect(); if (!started.current) run(CAPABILITIES[0].tasks[0].steps.length); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); runId.current++; };
  }, [run]);

  return (
    <div className="svc">
      <div className="cap-list from-left" role="tablist" aria-label="Capabilities" aria-orientation="vertical">
        {CAPABILITIES.map((c, i) => (
          <button
            key={c.title}
            ref={el => { tabs.current[i] = el; }}
            className="cap"
            type="button"
            role="tab"
            id={`tab-${i}`}
            aria-selected={i === capIdx}
            aria-controls="trace"
            tabIndex={i === capIdx ? 0 : -1}
            onClick={() => selectCap(i)}
            onKeyDown={e => onTabKey(e, i)}
            style={{ '--c': `var(${c.token})` } as React.CSSProperties}
          >
            <span className="cdot" aria-hidden="true" />
            <span className="cap-t">{c.title}</span>
            <span className="cap-d">{c.desc}</span>
          </button>
        ))}
      </div>

      <div className="panel trace from-right" id="trace" role="tabpanel" aria-labelledby={`tab-${capIdx}`} ref={panel}>
        <div className="trace-head">
          <p className="trace-title">Simulated trace</p>
          <span className="sim">Example run, not live data</span>
        </div>
        <AgentLoop current={current} />
        <div className="tasks" role="group" aria-label="Example tasks">
          {cap.tasks.map((t, i) => (
            <button key={t.label} className="chip" type="button" aria-pressed={i === taskIdx} onClick={() => selectTask(i)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="trace-actions">
          <button className="btn btn-primary btn-sm" type="button" onClick={() => { setShown(0); run(steps.length); }}>
            {status === 'running' ? 'Running…' : status === 'done' ? 'Run again' : 'Run trace'}
          </button>
          {cap.demo && <a className="try" href={DEMO_URL} target="_blank" rel="noopener">Try the real one</a>}
        </div>
        <ol className="log" aria-live="polite">
          {status === 'idle' ? (
            <li className="idle">Pick an example task and press Run trace.</li>
          ) : (
            steps.slice(0, shown).map(([type, text], k) => (
              <li key={k} className={`step s-${type}`}>
                <span className="st">{STEP_LABEL[type]}</span>
                <span className="sx">{type === 'tool' ? <code>{text}</code> : text}</span>
              </li>
            ))
          )}
        </ol>
      </div>
    </div>
  );
}
