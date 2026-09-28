import { PROCESS } from '@/lib/services';
import CapabilityExplorer from './CapabilityExplorer';
import './services.css';

export default function Services() {
  return (
    <section className="section" id="services" aria-labelledby="svcTitle">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="sec-title h-reveal" id="svcTitle">What I build</h2>
          <p className="sec-sub fade">Usually all three together: the AI, the app around it and the pipeline that ships it.</p>
        </div>

        <CapabilityExplorer />

        <div className="process">
          <h3 className="rise">How I work</h3>
          <ol>
            {PROCESS.map((p, i) => (
              <li key={p.title} className="rise" style={{ '--i': i } as React.CSSProperties}>
                <strong>{p.title}</strong>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
