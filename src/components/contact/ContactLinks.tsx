'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/site';

async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    } catch { return false; }
  }
}

export default function ContactLinks() {
  const [copied, setCopied] = useState<'' | 'ok' | 'fail'>('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copyEmail = async () => {
    setCopied(await copyText(SITE.email) ? 'ok' : 'fail');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(''), 2600);
  };

  return (
    <ul className="links">
      <li>
        <button className="lrow" type="button" onClick={copyEmail}>
          <span className="k">Email</span><span className="v">{SITE.email}</span>
          <span className="a" aria-live="polite">{copied === 'ok' ? 'Copied!' : copied === 'fail' ? 'Couldn’t copy' : 'Click to copy'}</span>
        </button>
      </li>
      <li>
        <a className="lrow" href={SITE.github} target="_blank" rel="noopener">
          <span className="k">GitHub</span><span className="v">{SITE.github.split('/').pop()}</span><span className="a">78 public repos</span>
        </a>
      </li>
      <li>
        <a className="lrow" href={SITE.linkedin} target="_blank" rel="noopener">
          <span className="k">LinkedIn</span><span className="v">{SITE.linkedin.split('/').filter(Boolean).pop()}</span><span className="a">Connect</span>
        </a>
      </li>
      <li>
        {SITE.resume.url ? (
          <a className="lrow" href={SITE.resume.url} target="_blank" rel="noopener">
            <span className="k">Resume</span><span className="v">{SITE.resume.label}</span><span className="a">PDF</span>
          </a>
        ) : (
          <span className="lrow" aria-disabled="true">
            <span className="k">Resume</span><span className="v">Coming soon</span><span className="a">Not ready yet</span>
          </span>
        )}
      </li>
    </ul>
  );
}
