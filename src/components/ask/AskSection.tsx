'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/site';
import { SUGGESTED_QUESTIONS } from '@/lib/kb';
import { compose, queryTokens, retrieve, type Hit } from '@/lib/tfidf';
import { linkify } from '@/lib/linkify';
import { useReducedMotion } from '@/lib/motion';
import KnowledgeHood from './KnowledgeHood';
import './ask.css';

const GREETING = 'Hi! I’m a small retrieval bot trained on notes about Nishan. Ask me about his work, skills, projects or how to reach him.';
const TYPE_MS = 16;

type Msg = {
  id: number;
  role: 'me' | 'bot';
  text: string;
  displayed?: string;
  status?: 'thinking' | 'typing' | 'done';
  source?: string;
  score?: number;
  follow?: string;
};

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export default function AskSection() {
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, role: 'bot', text: GREETING, displayed: GREETING, status: 'done' }]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState(-1);
  const [tokensShown, setTokensShown] = useState<string[]>([]);
  const [top, setTop] = useState<Hit[]>([]);
  const [liveText, setLiveText] = useState('');
  const runId = useRef(0);
  const nextId = useRef(1);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = msgsRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function ask(raw: string) {
    const q = raw.trim().slice(0, 200);
    if (!q) return;
    const my = ++runId.current;
    setInputValue('');
    const meId = nextId.current++;
    const botId = nextId.current++;
    setMessages(prev => [...prev, { id: meId, role: 'me', text: q }, { id: botId, role: 'bot', text: '', status: 'thinking' }]);

    const { shown, used } = queryTokens(q);
    const hits = retrieve(used);

    setStep(0); setTokensShown(shown);
    await sleep(reduced ? 0 : 420); if (my !== runId.current) return;
    setStep(1);
    await sleep(reduced ? 0 : 380); if (my !== runId.current) return;
    setStep(2); setTop(hits);
    await sleep(reduced ? 0 : 520); if (my !== runId.current) return;
    setStep(3);

    const ans = compose(hits);
    const text = ans ? ans.text : `I won’t guess on that one. I only know what’s in my notes about Nishan. Try one of the suggested questions, or email him at ${SITE.email}.`;

    setMessages(prev => prev.map(m => (m.id === botId ? { ...m, status: 'typing', text, displayed: '' } : m)));

    if (reduced) {
      if (my !== runId.current) return;
      setMessages(prev => prev.map(m => (m.id === botId ? { ...m, displayed: text } : m)));
    } else {
      const chunk = Math.max(2, Math.round(text.length / 90));
      for (let i = 0; i <= text.length; i += chunk) {
        if (my !== runId.current) return;
        setMessages(prev => prev.map(m => (m.id === botId ? { ...m, displayed: text.slice(0, i) } : m)));
        await sleep(TYPE_MS);
      }
      if (my !== runId.current) return;
      setMessages(prev => prev.map(m => (m.id === botId ? { ...m, displayed: text } : m)));
    }

    setStep(4);
    setMessages(prev => prev.map(m => (m.id === botId
      ? { ...m, status: 'done', source: ans?.source, score: ans?.score, follow: ans ? ans.follow : 'How can I contact him?' }
      : m)));
    setLiveText(text);
  }

  function reset() {
    runId.current++;
    setMessages([{ id: nextId.current++, role: 'bot', text: GREETING, displayed: GREETING, status: 'done' }]);
    setStep(-1); setTokensShown([]); setTop([]); setLiveText('');
    inputRef.current?.focus();
  }

  return (
    <section className="section" id="ask" aria-labelledby="askTitle">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="sec-title h-reveal" id="askTitle">Ask my AI anything about me</h2>
          <p className="sec-sub fade">A tiny retrieval system running entirely in your browser: no API and no server. It turns your question into a TF-IDF vector, finds the closest passages in my notes by cosine similarity and answers from them. Same idea as my RAG projects, minus the LLM.</p>
        </div>

        <div className="ask">
          <div className="panel win chat from-left" data-title="ask-nishan — chat">
            <div className="msgs" ref={msgsRef} role="log" aria-label="Conversation">
              {messages.map(m => (
                <div key={m.id} className={`bub ${m.role}`}>
                  {m.role === 'me' ? (
                    m.text
                  ) : m.status === 'thinking' ? (
                    <span className="typing" aria-label="Thinking"><i /><i /><i /></span>
                  ) : (
                    <>
                      <span className="ans">{linkify(m.displayed ?? '')}</span>
                      {m.status === 'done' && m.follow && (
                        <>
                          <span className="src">{m.source ? `Source: ${m.source} · match ${m.score!.toFixed(2)}` : 'No passage scored above 0.08'}</span>
                          <div className="fu"><button className="chip" type="button" onClick={() => ask(m.follow!)}>{m.follow}</button></div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="suggest" role="group" aria-label="Suggested questions">
              {SUGGESTED_QUESTIONS.map(q => (
                <button key={q} className="chip" type="button" onClick={() => ask(q)}>{q}</button>
              ))}
            </div>
            <form className="ask-form" onSubmit={e => { e.preventDefault(); ask(inputValue); }}>
              <label className="sr-only" htmlFor="askIn">Ask a question about Nishan</label>
              <input
                id="askIn" ref={inputRef} type="text" autoComplete="off" maxLength={200}
                placeholder="Ask about skills, projects, contact…" value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
              <button className="btn btn-primary btn-sm" type="submit">Ask</button>
              <button className="icon-btn" type="button" aria-label="Reset the conversation" title="Reset" onClick={reset}>↺</button>
            </form>
          </div>

          <KnowledgeHood step={step} tokensShown={tokensShown} top={top} />
        </div>
        <div className="sr-only" aria-live="polite">{liveText}</div>
      </div>
    </section>
  );
}
