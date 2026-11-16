/* Rendez-vous : ce qui se passe après l'appel. Titre fixe à gauche, les 5 étapes en liste à droite
   (numéro, icône, titre, une phrase), séparées par de fines lignes comme la FAQ. */
import type { CSSProperties } from 'react';
import { FileText, MessagesSquare, PhoneCall, Rocket, Search } from 'lucide-react';

const STEPS = [
  { icon: PhoneCall, t: "L'appel découverte", d: 'Quinze minutes pour comprendre votre activité, votre besoin et vos délais. Vous repartez avec une première idée claire.' },
  { icon: Search, t: "J'étudie votre projet", d: "Après l'appel, j'analyse votre besoin, je regarde ce qui se fait dans votre secteur et j'imagine la solution la plus adaptée." },
  { icon: FileText, t: 'Je vous fais une proposition', d: 'Vous recevez une proposition détaillée : ce que je construis, le planning et le prix, sans surprise.' },
  { icon: MessagesSquare, t: 'Vous me faites vos retours', d: "Vous me dites ce qui vous plaît et ce qu'il faut ajuster. On affine ensemble jusqu'à ce que tout soit clair." },
  { icon: Rocket, t: 'Je réalise le projet final', d: "Je conçois et je développe votre site, avec des points réguliers, jusqu'à la mise en ligne." },
];

export function AfterCall() {
  return (
    <section className="block ac" id="apres">
      <div className="wrap ac-grid">
        <div className="ac-head">
          <div className="eyebrow reveal"><span className="mono">ET APRÈS ?</span></div>
          <h2 className="reveal" style={{ '--d': '.08s' } as CSSProperties}>De l&apos;appel <span className="muted">au projet en ligne.</span></h2>
          <p className="reveal" style={{ '--d': '.14s' } as CSSProperties}>Pas de mauvaise surprise : voici exactement ce qui se passe une fois votre créneau réservé.</p>
        </div>
        <ol className="ac-list">
          {STEPS.map(({ icon: Icon, t, d }, i) => (
            <li className={`reveal${i === 0 ? ' now' : ''}`} style={{ '--d': `${.1 + i * .06}s` } as CSSProperties} key={t}>
              <span className="ac-n mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="ac-ic"><Icon size={20} strokeWidth={1.5} /></span>
              <div>
                <b>{t}</b>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
