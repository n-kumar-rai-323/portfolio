import { SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <p>© {new Date().getFullYear()} {SITE.name}</p>
        <p>Built with Next.js, Three.js and a lot of coffee</p>
      </div>
    </footer>
  );
}
