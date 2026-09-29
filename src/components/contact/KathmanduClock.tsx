'use client';

import { useEffect, useState } from 'react';

// Hour and minute in Kathmandu (UTC+5:45), with a fixed-offset fallback for browsers without time zone data.
function ktmTime(): [number, string] {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    return [+parts.find(p => p.type === 'hour')!.value % 24, parts.find(p => p.type === 'minute')!.value];
  } catch {
    const d = new Date(Date.now() + (5 * 60 + 45) * 60000);
    return [d.getUTCHours(), String(d.getUTCMinutes()).padStart(2, '0')];
  }
}

const hint = (h: number) =>
  h >= 9 && h < 19 ? 'A good time to reach me.' : h >= 19 && h < 23 ? 'I’ll likely reply tomorrow.' : 'I’m probably asleep.';

export default function KathmanduClock() {
  // Null until mounted, so the server render never shows a stale time.
  const [time, setTime] = useState<[number, string] | null>(null);

  useEffect(() => {
    const tick = () => setTime(ktmTime());
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const hhmm = time ? `${String(time[0]).padStart(2, '0')}:${time[1]}` : '--:--';
  const day = time ? time[0] >= 6 && time[0] < 18 : true;

  return (
    <div className="panel clock">
      <span className="clock-ico" aria-hidden="true">
        {day ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
        )}
      </span>
      <div>
        <time dateTime={time ? hhmm : undefined}>{hhmm}</time><span className="clock-l">in Kathmandu</span>
        <p className="muted">{time ? hint(time[0]) : ''}</p>
      </div>
    </div>
  );
}
