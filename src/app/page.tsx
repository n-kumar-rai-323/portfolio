import Hero from '@/components/hero/Hero';
import Services from '@/components/services/Services';
import ProjectsSection from '@/components/projects/ProjectsSection';
import AskSection from '@/components/ask/AskSection';
import Journey from '@/components/journey/Journey';
import ContactSection from '@/components/contact/ContactSection';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/nav/ScrollProgress';
import RevealObserver from '@/components/RevealObserver';

// Home page. Section order must match NAV_LINKS in lib/nav.ts.
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <main id="main">
        <Services />
        <ProjectsSection />
        <AskSection />
        <Journey />
        <ContactSection />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
