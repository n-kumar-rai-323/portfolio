'use client';

import { useEffect, useState } from 'react';
import { ROLES } from '@/lib/skills';
import { useReducedMotion } from '@/lib/motion';

// Types each role, pauses, deletes it and moves to the next.
export default function TypedRole() {
  const reduced = useReducedMotion();
  const [text, setText] = useState('');

  useEffect(() => {
    if (reduced) { setText(ROLES[0]); return; }
    let w = 0, i = 0, del = false, timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = ROLES[w];
      if (!del) {
        setText(word.slice(0, ++i));
        if (i === word.length) { del = true; timer = setTimeout(tick, 1900); return; }
        timer = setTimeout(tick, 75);
      } else {
        setText(word.slice(0, --i));
        if (i === 0) { del = false; w = (w + 1) % ROLES.length; timer = setTimeout(tick, 350); return; }
        timer = setTimeout(tick, 38);
      }
    };
    tick();
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <>
      <span className="sr-only">AI Engineer</span>
      <span aria-hidden="true">{text}</span>
      <span className="caret" aria-hidden="true" />
    </>
  );
}
