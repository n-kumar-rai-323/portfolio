import Hero from '@/components/hero/Hero';
import ScrollProgress from '@/components/nav/ScrollProgress';
import { NAV_LINKS } from '@/lib/nav';

// Home page. Sections are added here one module at a time.
// The placeholders below keep the navbar links working until each real section module lands.
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <main id="main">
        {NAV_LINKS.map(l => (
          <section key={l.id} id={l.id} className="section" style={{ minHeight: '80vh' }}>
            <div className="wrap">
              <h2 className="sec-title">{l.label}</h2>
              <p className="sec-sub">Placeholder. The real section arrives in its own module.</p>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
