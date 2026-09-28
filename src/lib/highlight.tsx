import { Fragment, type ReactNode } from 'react';

// Wraps case-insensitive matches of `query` in <mark>, used for project search highlighting.
export function highlight(text: string, query: string): ReactNode {
  const q = query.trim().toLowerCase();
  if (!q) return text;
  const lower = text.toLowerCase();
  const parts: ReactNode[] = [];
  let i = 0;
  let idx: number;
  while ((idx = lower.indexOf(q, i)) !== -1) {
    parts.push(text.slice(i, idx));
    parts.push(<mark key={idx}>{text.slice(idx, idx + q.length)}</mark>);
    i = idx + q.length;
  }
  parts.push(text.slice(i));
  return <Fragment>{parts}</Fragment>;
}
