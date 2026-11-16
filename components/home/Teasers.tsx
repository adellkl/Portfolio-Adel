/* « En savoir plus » (accueil) : deux cartes qui disent concrètement ce qu'on trouve derrière.
   À propos : qui je suis en une phrase + trois repères. Services : la liste des six services. */
import type { CSSProperties } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/projects';
import { onlineCount } from '@/lib/site';

const SERVICES = [
  'Sites vitrines modernes et rapides',
  'Applications web sur mesure',
  'Réservation et paiement en ligne',
  'Espaces clients et tableaux de bord',
  'E-commerce et intégrations',
  'Refonte, maintenance et évolutions',
];

const check = <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7.5 5.8 10 11 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function Teasers({ projects }: { projects: Project[] }) {
  return (
    <section className="block" id="plus">
      <div className="wrap">
        <div className="eyebrow reveal"><span className="mono">02</span>En savoir plus</div>
        <h2 className="reveal" style={{ '--d': '.08s' } as CSSProperties}>Qui je suis, <span className="muted">et ce que je peux faire pour vous.</span></h2>
        <div className="teasers">
          <a href="/apropos" className="panel teaser t-about spot reveal">
            <div className="t-top">
              <span className="t-photo"><Image src="/images/adel-loukal.webp" alt="" fill sizes="64px" /></span>
              <div>
                <span className="mono">À PROPOS</span>
                <h3>Adel Loukal, développeur full-stack.</h3>
              </div>
            </div>
            <p>Je conçois et je code votre site de A à Z : le design, le développement, la mise en ligne, puis les évolutions. Vous avez un seul interlocuteur du début à la fin.</p>
            <ul className="t-facts">
              <li><b>{onlineCount(projects)}</b><span>sites en ligne</span></li>
              <li><b>1</b><span>seul interlocuteur</span></li>
              <li><b>IDF</b><span>et à distance</span></li>
            </ul>
            <div className="bottom"><span className="t-link">Découvrir mon parcours</span><span className="go">→</span></div>
          </a>
          <a href="/services" className="panel teaser t-svc spot reveal" style={{ '--d': '.08s' } as CSSProperties}>
            <span className="mono">SERVICES</span>
            <h3>Ce que je peux construire pour vous.</h3>
            <ul className="t-list">
              {SERVICES.map(s => <li key={s}>{check}{s}</li>)}
            </ul>
            <div className="bottom"><span className="t-link">Voir les services et ma méthode</span><span className="go">→</span></div>
          </a>
        </div>
      </div>
    </section>
  );
}
