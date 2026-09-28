import { KB } from '@/lib/kb';
import { MAP_H, MAP_W, PTS, type Hit } from '@/lib/tfidf';

// PCA-projected map of every KB passage; the current hits light up and connect to a weighted query point.
export default function KnowledgeMap({ hits }: { hits: Hit[] }) {
  const active = hits.filter(h => h.score > 0);
  let qx = 0, qy = 0;
  if (active.length) {
    const wsum = active.reduce((s, h) => s + h.score, 0);
    qx = active.reduce((s, h) => s + PTS[h.i][0] * h.score, 0) / wsum;
    qy = active.reduce((s, h) => s + PTS[h.i][1] * h.score, 0) / wsum;
  }

  return (
    <svg className="kmap" viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label="Two-dimensional map of the knowledge base passages">
      <defs>
        <filter id="kglow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g>
        {active.map(h => {
          const [x, y] = PTS[h.i];
          return <line key={h.i} className="ql" x1={qx} y1={qy} x2={x} y2={y} />;
        })}
      </g>
      <g>
        {PTS.map(([x, y], i) => (
          <circle
            key={KB[i].id}
            cx={x} cy={y} r={5}
            className={`kd${active.some(h => h.i === i) ? ' hit' : ''}`}
            style={{ '--c': `var(--${KB[i].c})` } as React.CSSProperties}
          >
            <title>{KB[i].title}</title>
          </circle>
        ))}
      </g>
      <g>
        {active.map(h => {
          const [x, y] = PTS[h.i];
          const right = x > MAP_W - 110;
          return (
            <text key={h.i} className="kl" x={right ? x - 9 : x + 9} y={y + 3.5} textAnchor={right ? 'end' : 'start'}>
              {KB[h.i].title}
            </text>
          );
        })}
        {active.length > 0 && (
          <>
            <circle cx={qx} cy={qy} r={6} className="qring" />
            <circle cx={qx} cy={qy} r={6} className="qp" filter="url(#kglow)" />
          </>
        )}
      </g>
    </svg>
  );
}
