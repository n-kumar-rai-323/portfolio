import { KB, type KBEntry } from '@/lib/kb';

export type Hit = { i: number; p: KBEntry; score: number };
export type Answer = { text: string; source: string; score: number; follow: string };

const STOP = new Set(('a an the is are was were be been being am do does did doing done have has had having he his him himself she her they them their it its of on in at to for from by with about as and or but if then so than that this these those what which who whom whose when where why how can could would should will shall may might must i me my you your yours we our us nishan nishans kumar rai tell please any anything some something there here also just like get got into over out up down more most very really much many know knows let lets show give me okay ok hi hello hey').split(' '));

const SYN: Record<string, string[]> = {
  job: ['work', 'role'], employer: ['work', 'company'], employ: ['work'], hire: ['contact'], email: ['contact'], reach: ['contact'], phone: ['contact'],
  skill: ['stack'], tech: ['stack'], technology: ['stack'], experience: ['background'], resume: ['resume'], agent: ['agent'], deploy: ['devop'], based: ['location'], live: ['live'],
};

function stem(w: string): string {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function tokenize(text: string): string[] {
  return String(text).toLowerCase().replace(/https?:\/\/\S+/g, ' ').replace(/[^a-z0-9]+/g, ' ').split(' ')
    .filter(w => w.length > 1 && !STOP.has(w)).map(stem);
}

// Build the TF-IDF index. Title and keywords are counted twice: they carry more signal than body text.
const DOC_TOKENS = KB.map(p => [...tokenize(p.title), ...tokenize(p.title), ...tokenize(p.keywords), ...tokenize(p.keywords), ...tokenize(p.answer)]);
const VOCAB = new Map<string, number>();
DOC_TOKENS.forEach(ts => ts.forEach(t => { if (!VOCAB.has(t)) VOCAB.set(t, VOCAB.size); }));
const V = VOCAB.size, NDOC = KB.length;
const DF = new Float64Array(V);
DOC_TOKENS.forEach(ts => new Set(ts).forEach(t => DF[VOCAB.get(t)!]++));
const IDF = Array.from(DF, df => Math.log((NDOC + 1) / (df + 1)) + 1);

function vectorize(tokens: string[]): Float64Array {
  const v = new Float64Array(V), counts = new Map<string, number>();
  tokens.forEach(t => { if (VOCAB.has(t)) counts.set(t, (counts.get(t) || 0) + 1); });
  counts.forEach((n, t) => { const j = VOCAB.get(t)!; v[j] = (1 + Math.log(n)) * IDF[j]; });
  let norm = 0; for (let j = 0; j < V; j++) norm += v[j] * v[j];
  norm = Math.sqrt(norm) || 1;
  for (let j = 0; j < V; j++) v[j] /= norm;
  return v;
}
const DOC_VECS = DOC_TOKENS.map(vectorize);
const dot = (a: Float64Array, b: Float64Array) => { let s = 0; for (let j = 0; j < a.length; j++) s += a[j] * b[j]; return s; };

export function isInVocab(token: string): boolean {
  return VOCAB.has(token);
}

// Expands the query with synonyms so e.g. "job" also retrieves the "role" passage.
export function queryTokens(q: string): { shown: string[]; used: string[] } {
  const base = tokenize(q), out: string[] = [];
  base.forEach(t => { out.push(t); (SYN[t] || []).forEach(s => { if (!base.includes(s) && !out.includes(s)) out.push(s); }); });
  return { shown: base, used: out };
}

export function retrieve(tokens: string[]): Hit[] {
  const qv = vectorize(tokens);
  return KB.map((p, i) => ({ i, p, score: dot(qv, DOC_VECS[i]) })).sort((a, b) => b.score - a.score).slice(0, 3);
}

// Merges the top two passages into one answer when they're both strong matches.
export function compose(top: Hit[]): Answer | null {
  const best = top[0], second = top[1];
  if (!best || best.score < 0.08) return null;
  if (second && second.score > 0.12 && second.score > best.score * 0.7) {
    return { text: best.p.answer + ' ' + second.p.answer, source: best.p.title + ' + ' + second.p.title, score: best.score, follow: second.p.follow };
  }
  return { text: best.p.answer, source: best.p.title, score: best.score, follow: best.p.follow };
}

// 2-D layout of the passages for the knowledge map: PCA by power iteration, then a little repulsion
// so close passages don't overlap.
function layout2d(): [number, number][] {
  const mean = new Float64Array(V);
  DOC_VECS.forEach(v => { for (let j = 0; j < V; j++) mean[j] += v[j] / NDOC; });
  const X = DOC_VECS.map(v => v.map((x, j) => x - mean[j]));
  const comps: Float64Array[] = [];
  for (let c = 0; c < 2; c++) {
    let v = new Float64Array(V).map((_, j) => Math.sin(j * 12.9898 + c * 78.233) + 0.01);
    for (let it = 0; it < 80; it++) {
      const u = X.map(x => dot(x, v));
      const nv = new Float64Array(V);
      X.forEach((x, i) => { for (let j = 0; j < V; j++) nv[j] += x[j] * u[i]; });
      comps.forEach(p => { const d = dot(nv, p); for (let j = 0; j < V; j++) nv[j] -= d * p[j]; });
      const n = Math.sqrt(dot(nv, nv)) || 1;
      for (let j = 0; j < V; j++) nv[j] /= n;
      v = nv;
    }
    comps.push(v);
  }
  const pts: [number, number][] = X.map(x => [dot(x, comps[0]), dot(x, comps[1])]);
  for (let a = 0; a < 2; a++) {
    const lo = Math.min(...pts.map(p => p[a])), hi = Math.max(...pts.map(p => p[a]));
    pts.forEach(p => { p[a] = hi > lo ? (p[a] - lo) / (hi - lo) : 0.5; });
  }
  const MIN = 0.13;
  for (let it = 0; it < 120; it++) {
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[j][0] - pts[i][0], dy = pts[j][1] - pts[i][1], d = Math.hypot(dx, dy) || 0.001;
      if (d < MIN) {
        const push = (MIN - d) / 2, ux = dx / d, uy = dy / d;
        pts[i][0] -= ux * push; pts[i][1] -= uy * push; pts[j][0] += ux * push; pts[j][1] += uy * push;
      }
    }
    pts.forEach(p => { p[0] = Math.min(1, Math.max(0, p[0])); p[1] = Math.min(1, Math.max(0, p[1])); });
  }
  return pts;
}

export const MAP_W = 400, MAP_H = 240;
const PAD = 26;
export const PTS: [number, number][] = layout2d().map(([x, y]) => [PAD + x * (MAP_W - 2 * PAD), PAD + y * (MAP_H - 2 * PAD)]);
