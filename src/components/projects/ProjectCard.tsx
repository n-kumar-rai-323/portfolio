'use client';

import { DEMO_URL } from '@/lib/site';
import { CATS, type Project } from '@/lib/projects';
import { highlight } from '@/lib/highlight';

type Props = {
  project: Project;
  index: number;
  query: string;
  onOpen: () => void;
};

// A pointer-driven radial spotlight; set directly on the node to skip a re-render per mouse move.
function spot(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export default function ProjectCard({ project: p, index, query, onOpen }: Props) {
  return (
    <article
      className={`card rise${p.featured ? ' feat' : ''}`}
      style={{ '--i': index % 3, '--c': `var(${CATS[p.cat].token})` } as React.CSSProperties}
      onPointerMove={spot}
    >
      <p className="kind">{p.kind}</p>
      <h3>
        <button className="card-open" type="button" aria-haspopup="dialog" onClick={onOpen}>
          <span className="t">{highlight(p.title, query)}</span>
        </button>
      </h3>
      <p className="desc">{p.short}</p>
      {p.pipeline && (
        <ol className="pipe" aria-label="Pipeline">
          {p.pipeline.map((s, k) => (
            <li key={s} style={{ '--i': k } as React.CSSProperties}><span>{s}</span></li>
          ))}
        </ol>
      )}
      <ul className="tags">
        {p.tech.map(t => <li key={t}>{highlight(t, query)}</li>)}
      </ul>
      <div className="foot">
        {p.demo && <a className="btn btn-primary btn-sm live" href={DEMO_URL} target="_blank" rel="noopener">Try it live</a>}
        <span className="more">Read the case study</span>
      </div>
    </article>
  );
}
