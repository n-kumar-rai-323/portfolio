import { Fragment, type ReactNode } from 'react';

const URL_OR_EMAIL = /(https?:\/\/[^\s<]+[^\s<.,;:!?)])|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

// Turns plain text into React nodes, wrapping URLs and email addresses as links.
export function linkify(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  const re = new RegExp(URL_OR_EMAIL);
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [full, url, mail] = m;
    parts.push(
      url
        ? <a key={m.index} href={url} target="_blank" rel="noopener">{url}</a>
        : <a key={m.index} href={`mailto:${mail}`}>{mail}</a>,
    );
    last = m.index + full.length;
  }
  parts.push(text.slice(last));
  return <Fragment>{parts}</Fragment>;
}
