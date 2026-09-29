'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/site';
import { CHECKS, MAX_MSG, PLACEHOLDERS, TOPICS, type Field, type Topic } from '@/lib/contact';

const EMPTY: Record<Field, string> = { name: '', email: '', message: '' };

// No backend: on submit it opens the visitor's email app with the message filled in.
export default function ContactForm() {
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const refs = { name: useRef<HTMLInputElement>(null), email: useRef<HTMLInputElement>(null), message: useRef<HTMLTextAreaElement>(null) };
  const doneTitle = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const check = (f: Field, v = values[f]) => {
    const msg = CHECKS[f](v);
    setErrors(e => ({ ...e, [f]: msg }));
    return !msg;
  };

  const onChange = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValues(s => ({ ...s, [f]: v }));
    // Once a field shows an error, re-check it as the visitor types so the error clears promptly.
    if (errors[f]) check(f, v);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields: Field[] = ['name', 'email', 'message'];
    const bad = fields.filter(f => !check(f));
    if (bad.length) { refs[bad[0]].current?.focus(); return; }
    setSending(true);
    // A short pause lets the paper plane fly before the mail app takes over.
    timer.current = setTimeout(() => {
      const name = values.name.trim();
      const subject = `${topic} from ${name}`;
      const body = `${values.message.trim()}\n\n— ${name}\n${values.email.trim()}`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setSending(false);
      setDone(true);
    }, 900);
  };

  const reset = () => {
    setTopic(TOPICS[0]); setValues(EMPTY); setErrors(EMPTY); setDone(false);
    requestAnimationFrame(() => refs.name.current?.focus());
  };

  useEffect(() => { if (done) doneTitle.current?.focus(); }, [done]);

  const n = values.message.length;
  const field = (f: 'name' | 'email', label: string, type: string, autoComplete: string) => (
    <div className="field">
      <label htmlFor={`f-${f}`}>{label}</label>
      <input
        id={`f-${f}`} name={f} type={type} autoComplete={autoComplete} inputMode={f === 'email' ? 'email' : undefined}
        ref={refs[f]} value={values[f]} onChange={onChange(f)} onBlur={() => { if (values[f]) check(f); }}
        aria-invalid={errors[f] ? true : undefined} aria-describedby={`e-${f}`}
      />
      <p className="err" id={`e-${f}`}>{errors[f]}</p>
    </div>
  );

  return (
    <form className="panel cform zoom" noValidate aria-labelledby="cfTitle" onSubmit={onSubmit}>
      {!done ? (
        <div>
          <h3 id="cfTitle">Send a message</h3>
          <fieldset className="topics">
            <legend>What&apos;s it about?</legend>
            <div className="topic-list">
              {TOPICS.map(t => (
                <label key={t} className="topic">
                  <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {field('name', 'Your name', 'text', 'name')}
          {field('email', 'Your email', 'email', 'email')}
          <div className="field">
            <div className="lab-row">
              <label htmlFor="f-message">Message</label>
              <span className={`cnt${n > MAX_MSG * 0.9 ? ' warn' : ''}`} id="cnt">{n} / {MAX_MSG}</span>
            </div>
            <textarea
              id="f-message" name="message" maxLength={MAX_MSG} rows={6} placeholder={PLACEHOLDERS[topic]}
              ref={refs.message} value={values.message} onChange={onChange('message')} onBlur={() => { if (values.message) check('message'); }}
              aria-invalid={errors.message ? true : undefined} aria-describedby="e-message cnt"
            />
            <p className="err" id="e-message">{errors.message}</p>
          </div>
          <button className={`btn btn-primary send${sending ? ' sending' : ''}`} type="submit" disabled={sending}>
            <span>{sending ? 'Sending…' : 'Send message'}</span>
            <svg className="plane" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" /></svg>
          </button>
          <p className="fine">Opens your email app with everything filled in.</p>
        </div>
      ) : (
        <div className="done">
          <div className="tick" aria-hidden="true">✓</div>
          <h3 ref={doneTitle} tabIndex={-1} id="cfTitle">Message ready</h3>
          <p>Your email app should have opened with the message filled in, so just press send. If nothing opened, write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
          <button className="btn btn-ghost btn-sm" type="button" onClick={reset}>Write another</button>
        </div>
      )}
    </form>
  );
}
