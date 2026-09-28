import type { StepType } from '@/lib/services';

const NODES: { type: StepType; label: string; x: number; token: string }[] = [
  { type: 'plan', label: 'Plan', x: 10, token: '--violet' },
  { type: 'tool', label: 'Tool', x: 115, token: '--amber' },
  { type: 'observe', label: 'Observe', x: 220, token: '--muted' },
  { type: 'done', label: 'Done', x: 325, token: '--cyan' },
];

// Plan -> Tool -> Observe -> Done diagram; the current step lights up.
export default function AgentLoop({ current }: { current: StepType | null }) {
  return (
    <svg className="loop" viewBox="0 0 415 112" role="img" aria-label="Agent loop: Plan, then Tool, then Observe, looping back to Plan until Done">
      <defs>
        <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path className="arrow" d="M0 0 10 5 0 10z" />
        </marker>
      </defs>
      <path className="wire" d="M90 38H113" markerEnd="url(#ah)" />
      <path className="wire" d="M195 38H218" markerEnd="url(#ah)" />
      <path className="wire" d="M300 38H323" markerEnd="url(#ah)" />
      <path className="wire" d="M260 57C260 100 50 100 50 59" markerEnd="url(#ah)" />
      <text className="lbl" x="155" y="106" textAnchor="middle">loop until done</text>
      {NODES.map(n => (
        <g key={n.type} className={`ln${current === n.type ? ' on' : ''}`} style={{ '--c': `var(${n.token})` } as React.CSSProperties}>
          <rect x={n.x} y="20" width="80" height="36" rx="18" />
          <text x={n.x + 40} y="43" textAnchor="middle">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}
