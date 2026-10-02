import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Roboto } from 'next/font/google';
import { SITE } from '@/lib/site';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-roboto',
});

// Monospace face for headings, labels and controls: the terminal look.
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const description =
  'Nishan Kumar Rai is an AI Engineer in Kathmandu, Nepal, building RAG systems and AI agents, plus the full-stack app and DevOps pipeline around them.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: 'Nishan Kumar Rai — AI Engineer | RAG, AI Agents, Full-stack & DevOps',
  description,
  authors: [{ name: SITE.name }],
  keywords: [
    'Nishan Kumar Rai', 'AI Engineer', 'RAG', 'AI agents', 'LLM', 'LangChain', 'ChromaDB', 'Llama 3.1',
    'Full-stack developer', 'MERN', 'Django', 'DevOps', 'Docker', 'Kathmandu', 'Nepal',
  ],
  alternates: { canonical: '/' },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🪐</text></svg>",
  },
  openGraph: {
    type: 'website',
    url: SITE.url,
    title: 'Nishan Kumar Rai — AI Engineer',
    description: 'I build AI that ships: RAG systems, AI agents, and the full-stack app and DevOps pipeline around them.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Nishan Kumar Rai, AI Engineer. I build AI that ships.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nishan Kumar Rai — AI Engineer',
    description: 'I build AI that ships: RAG systems, AI agents, full-stack and DevOps.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#060914',
  colorScheme: 'dark light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  jobTitle: SITE.role,
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  image: `${SITE.url}og-image.png`,
  worksFor: { '@type': 'Organization', name: SITE.company.name, url: SITE.company.url },
  address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
  knowsAbout: ['Large language models', 'Retrieval-augmented generation', 'AI agents', 'LangChain', 'ChromaDB', 'React', 'Node.js', 'Django', 'Docker', 'CI/CD'],
  sameAs: [SITE.github, SITE.linkedin],
};

// Runs before first paint: marks JS as available and applies the saved theme to avoid a flash.
const themeScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
