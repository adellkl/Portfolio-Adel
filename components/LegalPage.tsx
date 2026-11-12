import type { ReactNode } from 'react';
import SplitTitle from '@/components/SplitTitle';

/* Gabarit des pages légales : en-tête du site + sections numérotées */
export default function LegalPage({ eyebrow, title, lede, updated, sections }: {
  eyebrow: string; title: string; lede: string; updated: string; sections: [string, ReactNode][];
}) {
  return (
    <>
      <header className="page-hero" id="top">
        <div className="hero-glow"></div>
        <div className="wrap">
          <div className="eyebrow fade"><span className="mono">{eyebrow}</span></div>
          <SplitTitle text={title} />
          <p className="lede fade" style={{ transitionDelay: '.6s' }}>{lede}</p>
        </div>
      </header>
      <section className="block legal" style={{ paddingTop: 96 }}>
        <div className="wrap">
          {sections.map(([h, body], i) => (
            <div className="legal-row reveal" key={h}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <div><h2>{h}</h2>{body}</div>
            </div>
          ))}
          <p className="legal-updated mono">{`Dernière mise à jour : ${updated}`}</p>
        </div>
      </section>
    </>
  );
}
