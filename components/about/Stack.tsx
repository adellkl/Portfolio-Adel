'use client';
/* Outils : survol/focus d'une pill → projets qui l'utilisent (interactions.js §4c) */
import { useEffect, useRef, type CSSProperties } from 'react';
import { $, $$, esc } from '@/lib/dom';
import { USES, projectHref } from '@/lib/site';

const groups: [string, string, string[]][] = [
  ['Front-end', 'Les interfaces que voient vos clients', ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']],
  ['Back-end & données', 'Bases de données, authentification et API', ['Supabase', 'Firebase', 'API', 'PostgreSQL']],
  ['Déploiement', 'Mise en ligne, domaines et e-mails', ['Vercel', 'Hébergement', 'Domaines', 'E-mails transactionnels']],
  ['Fonctionnalités', 'Ce que je construis le plus souvent', ['Réservation', 'Paiement en ligne', 'Authentification', 'Administration', 'Formulaires', 'Automatisations']],
];

export default function Stack({ projects }: { projects: { slug: string; title: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stack = ref.current!;
    const show = (c: HTMLElement) => {
      const panel = c.closest('.panel')!, uses = $('.uses', panel)!, list = (USES[c.textContent!] || []).map(s => projects.find(p => p.slug === s)).filter(p => !!p);
      $$('.pill', panel).forEach(x => x.classList.toggle('on', x === c));
      uses.innerHTML = list.length ? `<span class="mono">${c.textContent!.toUpperCase()} →</span> ${list.map(p => `<a href="${projectHref(p.slug)}">${esc(p.title)}</a>`).join('')}` : '';
      uses.classList.remove('flash'); void uses.offsetWidth; uses.classList.add('flash');
    };
    const on = (e: Event) => { const c = (e.target as Element).closest<HTMLElement>('.pill'); if (c) show(c); };
    stack.addEventListener('pointerover', on);
    stack.addEventListener('focusin', on);
    return () => { stack.removeEventListener('pointerover', on); stack.removeEventListener('focusin', on); };
  }, [projects]);

  return (
    <div className="stack" id="stack" ref={ref}>
      {groups.map(([t, d, c], i) => <div className="panel reveal spot" style={{ '--d': `${i * .06}s` } as CSSProperties} key={t}>
        <h4>{t}<span className="mono">{String(c.length).padStart(2, '0')}</span></h4>
        <p style={{ fontSize: 14, color: 'var(--fog)', marginBottom: 16 }}>{d}</p>
        <div className="chips">{c.map(x => <span className="pill" tabIndex={0} role="button" key={x}>{x}</span>)}</div>
        <div className="uses"><span className="mono">Survolez un outil pour voir où je l&apos;ai utilisé</span></div></div>)}
    </div>
  );
}
