import type { CSSProperties } from 'react';

export default function Teasers() {
  return (
    <section className="block" id="plus">
      <div className="wrap">
        <div className="eyebrow reveal"><span className="mono">02</span>En savoir plus</div>
        <h2 className="reveal" style={{ '--d': '.08s' } as CSSProperties}>Qui je suis, <span className="muted">et ce que je peux faire pour vous.</span></h2>
        <div className="teasers">
          <a href="/apropos" className="panel teaser spot reveal">
            <span className="mono">À PROPOS</span>
            <h3>Entre le design et le code.</h3>
            <p>Mon parcours, mes principes, mes outils et la chronologie de mes projets.</p>
            <div className="bottom"><div className="chips"><span className="pill">Next.js</span><span className="pill">React</span><span className="pill">Supabase</span></div><span className="go">→</span></div>
          </a>
          <a href="/services" className="panel teaser spot reveal" style={{ '--d': '.08s' } as CSSProperties}>
            <span className="mono">SERVICES</span>
            <h3>Du site vitrine à l&apos;application sur mesure.</h3>
            <p>Sites vitrines, applications sur mesure, réservation et paiement, espaces clients, e-commerce et refontes. Avec ma méthode et les questions fréquentes.</p>
            <div className="bottom"><div className="chips"><span className="pill">Réservation</span><span className="pill">Catalogue</span><span className="pill">Back-office</span></div><span className="go">→</span></div>
          </a>
        </div>
      </div>
    </section>
  );
}
