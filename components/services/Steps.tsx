'use client';
/* Étapes qui défilent seules (bindSteps de main.js) */
import { useEffect, useRef } from 'react';
import { $$, reduceMotion } from '@/lib/dom';

const STEPS: [string, string][] = [
  ['Comprendre', 'Le besoin réel, les contraintes, le budget. On définit le problème avant de dessiner quoi que ce soit.'],
  ['Esquisser', 'Une direction visuelle et un premier parcours cliquable, testés tôt pour ne garder que ce qui fonctionne.'],
  ['Construire', 'Code propre, règles de sécurité côté serveur, tests automatisés et performance dès le départ.'],
  ['Mettre en ligne', 'Déploiement sur Vercel, nom de domaine, référencement, puis documentation pour modifier le contenu soi-même.'],
];

export default function Steps() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = ref.current!, steps = $$('.step', wrap), reduce = reduceMotion();
    let stT: ReturnType<typeof setTimeout> | undefined;
    const setStep = (i: number) => {
      steps.forEach((s, k) => s.classList.toggle('on', k === i));
      clearTimeout(stT); if (!reduce) stT = setTimeout(() => setStep((i + 1) % steps.length), 5000);
    };
    const offs = steps.map((s, i) => { const f = () => setStep(i); s.addEventListener('click', f); return () => s.removeEventListener('click', f); });
    const obs = new IntersectionObserver(([e], o) => { if (e.isIntersecting) { setStep(0); o.disconnect(); } }, { threshold: .4 });
    obs.observe(wrap);
    return () => { clearTimeout(stT); obs.disconnect(); offs.forEach(f => f()); };
  }, []);

  return (
    <div className="steps reveal" id="steps" ref={ref}>
      {STEPS.map(([t, d], i) => <div className="step" key={t}><h4><span className="mono">{`0${i + 1}`}</span>{t}</h4><p>{d}</p><div className="bar-p"><i></i></div></div>)}
    </div>
  );
}
