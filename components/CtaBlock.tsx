/* Bloc d'appel au contact, en bas des pages secondaires */
export default function CtaBlock({ n }: { n: string }) {
  return (
    <section className="contact" style={{ paddingTop: 128 }}>
      <div className="wrap">
        <a href="/#contact" className="panel contact-box reveal spot" style={{ display: 'block' }}>
          <div className="eyebrow"><span className="mono">{n}</span>Contact</div>
          <h2>Un projet en tête ?<br /><span className="muted">Parlons-en.</span></h2>
          <span className="arrow-link" style={{ marginTop: 32, position: 'relative', zIndex: 2 }}>Écrire un message <span>→</span></span>
        </a>
      </div>
    </section>
  );
}
