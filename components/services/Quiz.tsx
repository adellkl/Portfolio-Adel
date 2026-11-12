'use client';
/* Quiz « quel service pour vous ? » (interactions.js §4b).
   À la fin, les réponses sont sauvegardées (lib/brief.ts) et mènent à la réservation d'un appel ou à un e-mail prérempli. */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { lc } from '@/lib/projects';
import { EMAIL, TYPES, projectHref } from '@/lib/site';
import { briefText, clearBrief, saveBrief, type Brief } from '@/lib/brief';

type Score = Record<string, number>;
const Q: [string, [string, Score][]][] = [
  ['De quoi avez-vous besoin ?', [['Présenter mon activité', { vitrine: 2 }], ['Prendre des réservations ou des rendez-vous', { reservation: 2, 'rendez-vous': 2 }], ['Montrer un catalogue de produits ou d\'œuvres', { catalogue: 2, boutique: 1 }], ['Vendre ou louer des produits', { boutique: 2 }]]],
  ['Vos clients doivent-ils réserver en ligne ?', [['Oui, une table ou une date', { reservation: 3, boutique: 1 }], ['Oui, un rendez-vous à une heure précise', { 'rendez-vous': 3 }], ['Non', { vitrine: 1, catalogue: 1 }]]],
  ['Qui va mettre à jour le site ?', [['Moi, depuis un back-office', { reservation: 1, boutique: 1, catalogue: 1 }], ['Je préfère vous confier les mises à jour', { vitrine: 2, 'rendez-vous': 1 }], ['Plusieurs personnes de mon équipe', { reservation: 2 }]]],
];
const R: Record<string, [string, string, string]> = {
  vitrine: ['Site vitrine', 'Un site soigné qui présente votre activité, vos horaires et vos tarifs, avec des contenus faciles à faire évoluer.', 'alpha-fight-club'],
  reservation: ['Site & réservation en ligne', 'Un site qui présente votre établissement et prend les réservations, avec un back-office pour tout gérer.', 'la-marine'],
  'rendez-vous': ['Prise de rendez-vous', 'Un site clair qui explique vos services et laisse vos clients réserver un créneau à toute heure.', 'test-psychotechnique'],
  catalogue: ['Catalogue en ligne', 'Un catalogue bilingue avec une page par pièce, pensé pour être trouvé sur Google.', 'class-gallery'],
  boutique: ['Boutique & réservations', 'Un site qui montre vos produits, gère leurs disponibilités et prend les demandes, avec un back-office sécurisé.', 'lebsa-danah'],
};

/* Rejoue un historique de réponses → étape + score */
const replay = (hist: string) => {
  let step = 0; const score: Score = {};
  [...hist].forEach(i => { Object.entries(Q[step][1][+i][1]).forEach(([k, v]) => score[k] = (score[k] || 0) + v); step++; });
  return { step, score };
};
const bestOf = (score: Score) => Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
/** Brief complet à partir d'un historique terminé */
const toBrief = (hist: string): Brief => {
  const best = bestOf(replay(hist).score);
  return { type: best, recommendation: R[best][0], answers: [...hist].map((i, k) => [Q[k][0], Q[k][1][+i][0]]), at: new Date().toISOString() };
};

export default function Quiz({ projects }: { projects: { slug: string; title: string; tagline: string }[] }) {
  const [hist, setHist] = useState('');
  const [chosen, setChosen] = useState<number | null>(null);
  const [n, setN] = useState(0); // remonte .q-body à chaque rendu (animation qIn)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const { step } = replay(hist);
  const prog = <div className="q-prog">{Q.map((_, i) => <i className={i < step ? 'done' : i === step ? 'cur' : ''} key={i}></i>)}</div>;

  const pick = (i: number) => {
    setChosen(i);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const h = hist + i;
      if (h.length === Q.length) saveBrief(toBrief(h)); // quiz terminé : on garde les réponses
      setHist(h); setChosen(null); setN(x => x + 1);
    }, 220);
  };
  const again = () => { clearBrief(); setHist(''); setChosen(null); setN(x => x + 1); };
  const back = () => { setHist(h => h.slice(0, -1)); setChosen(null); setN(x => x + 1); };

  let body;
  if (step < Q.length) {
    const [q, opts] = Q[step];
    body = <div className="q-body" key={n}><span className="mono">{`QUESTION ${step + 1} / ${Q.length}`}</span><h3>{q}</h3>
      <div className="q-opts">{opts.map(([l], i) => <button className={`q-opt${chosen === i ? ' chosen' : ''}`} data-i={i} style={{ '--i': i } as CSSProperties} key={i} onClick={() => pick(i)}><span className="mono">{String.fromCharCode(65 + i)}</span>{l}</button>)}</div>
      {step ? <button className="q-back" onClick={back}>← Question précédente</button> : null}</div>;
  } else {
    const brief = toBrief(hist), best = brief.type;
    const [t, d, slug] = R[best], p = projects.find(x => x.slug === slug);
    const subject = `Projet — ${TYPES[best][0]}`;
    const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Bonjour Adel,\n\nJe cherche quelqu'un pour ${TYPES[best][0]}.\n\n${briefText(brief)}\n`)}`;
    body = <div className="q-body q-res" key={n}><span className="mono">RECOMMANDATION</span><h3>{t}</h3><p>{d}</p>
      {p ? <p className="ref">Exemple concret : <a href={projectHref(p.slug)}>{`${p.title} — ${lc(p.tagline)} →`}</a></p> : null}
      <div className="q-actions"><a className="btn-lime" href={`/rendez-vous?type=${best}`}>Réserver un appel avec ce brief</a><a className="ghost" href={mailto}>Écrire un e-mail</a><button className="ghost q-again" onClick={again}>Recommencer</button></div>
      <p className="q-saved mono">Vos réponses sont gardées et jointes à votre demande.</p></div>;
  }

  return <div className="panel quiz reveal" id="quizBox" data-hist={hist || undefined}>{prog}{body}</div>;
}
