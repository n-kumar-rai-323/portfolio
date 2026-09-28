// Home page. Sections are added here one module at a time.
export default function Home() {
  return (
    <main id="main">
      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <h1 className="sec-title">Module 1: foundation</h1>
            <p className="sec-sub">Next.js setup, design tokens and shared styles. Sections come next.</p>
          </div>
          <div className="panel" style={{ padding: 24, marginTop: 40, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a className="btn btn-primary" href="#">Primary button</a>
            <a className="btn btn-ghost" href="#">Ghost button</a>
            <button className="chip" type="button" style={{ '--c': 'var(--violet)' } as React.CSSProperties}>
              <span className="d" />Chip
            </button>
            <ul className="tags"><li>React</li><li>Next.js</li><li>TypeScript</li></ul>
          </div>
        </div>
      </section>
    </main>
  );
}
