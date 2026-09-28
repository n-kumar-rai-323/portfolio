import Navbar from '@/components/nav/Navbar';
import ScrollProgress from '@/components/nav/ScrollProgress';
import { NAV_LINKS } from '@/lib/nav';

// Home page. Sections are added here one module at a time.
// The placeholders below only exist so the navbar can be tested; each is replaced by its real module.
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <header id="top" className="section" style={{ minHeight: '100vh', display: 'grid', alignItems: 'center' }}>
        <Navbar />
        <div className="wrap">
          <h1 className="display">Module 2:<br /><span className="outline">navbar.</span></h1>
          <p className="lede">Scroll down: the navbar sticks to the top, the active link lights up and the bar at the top fills.</p>
        </div>
      </header>
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
