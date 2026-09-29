import KathmanduClock from './KathmanduClock';
import ContactLinks from './ContactLinks';
import ContactForm from './ContactForm';
import './contact.css';

export default function ContactSection() {
  return (
    <section className="section contact" id="contact" aria-labelledby="ctTitle">
      <div className="wrap">
        <h2 className="display h-reveal" id="ctTitle">Let&apos;s build<br /><span className="outline">something smart.</span></h2>

        <div className="ct">
          <div className="fade">
            <p className="lede">Got a pile of documents that should answer questions, an agent idea, or something you&apos;d like to build together? Tell me about it.</p>
            <KathmanduClock />
            <ContactLinks />
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
