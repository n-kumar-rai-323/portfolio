import Hero from '@/components/hero/Hero';
import Services from '@/components/services/Services';
import ProjectsSection from '@/components/projects/ProjectsSection';
import ScrollProgress from '@/components/nav/ScrollProgress';
import RevealObserver from '@/components/RevealObserver';
import { NAV_LINKS } from '@/lib/nav';

// Sections not built yet. Their placeholders keep the navbar links working until each module lands.
const DONE = ['services', 'projects'];
const PENDING = NAV_LINKS.filter(l => !DONE.includes(l.id));

// Home page. Sections are added here one module at a time.
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <main id="main">
        <Services />
        <ProjectsSection />
        {PENDING.map(l => (
          <section key={l.id} id={l.id} className="section" style={{ minHeight: '80vh' }}>
            <div className="wrap">
              <h2 className="sec-title">{l.label}</h2>
              <p className="sec-sub">Placeholder. The real section arrives in its own module.</p>
            </div>
          </section>
        ))}
      </main>
      <RevealObserver />
    </>
  );
}
