'use client';

import { useEffect, useState } from 'react';
import { isInVocab, type Hit } from '@/lib/tfidf';
import KnowledgeMap from './KnowledgeMap';

const PILL_LABELS = ['Tokenise', 'Vectorise', 'Retrieve', 'Answer'];

type Props = { step: number; tokensShown: string[]; top: Hit[] };

// Right-hand "under the hood" panel: pipeline pills, the tokenised query, the knowledge map and top hits.
export default function KnowledgeHood({ step, tokensShown, top }: Props) {
  const [barWidths, setBarWidths] = useState<number[]>([]);

  // Two rAFs force a reflow at width 0 first, so the fill-in is a visible CSS transition, not a jump.
  useEffect(() => {
    let cancelled = false;
    setBarWidths(top.map(() => 0));
    if (!top.length) return;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        const scale = Math.max(0.5, top[0]?.score ?? 0.5);
        setBarWidths(top.map(h => Math.min(100, (h.score / scale) * 100)));
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [top]);

  return (
    <div className="panel hood from-right">
      <p className="hood-title">Under the hood: <span>TF-IDF + cosine similarity</span></p>
      <ol className="pills" aria-label="Pipeline steps">
        {PILL_LABELS.map((label, i) => (
          <li key={label} className={`${i < step ? 'done' : ''}${i === step ? ' on' : ''}`.trim()}>{label}</li>
        ))}
      </ol>
      <div>
        <p className="hl">Query tokens, after stop words are removed</p>
        <div className="toks">
          {tokensShown.length
            ? tokensShown.map((t, i) => (
              <span key={`${t}-${i}`} className={`tok${isInVocab(t) ? '' : ' miss'}`} style={{ animationDelay: `${i * 60}ms` }} title={isInVocab(t) ? 'in vocabulary' : 'not in vocabulary'}>
                {t}
              </span>
            ))
            : <span className="muted">Ask something to see it tokenised.</span>}
        </div>
      </div>
      <div>
        <p className="hl">Knowledge map: each dot is a passage, placed with PCA</p>
        <KnowledgeMap hits={top} />
      </div>
      <div>
        <p className="hl">Top passages</p>
        <ol className="hits">
          {top.length
            ? top.map((h, i) => (
              <li key={h.i}>
                <div className="hit-top"><b>{h.p.title}</b><span>{h.score.toFixed(2)}</span></div>
                <div className="bar"><i style={{ width: `${barWidths[i] ?? 0}%` }} /></div>
              </li>
            ))
            : <li className="none">The three closest passages will appear here with their scores.</li>}
        </ol>
      </div>
    </div>
  );
}
