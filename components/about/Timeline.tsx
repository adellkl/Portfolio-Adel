'use client';
/* Chronologie en accordéon, comme la FAQ : un clic (ou Entrée / Espace) sur un projet déroule un court texte
   et deux boutons (voir le site, voir l'étude de cas) ; un seul projet ouvert à la fois. */
import { useEffect, useRef, type CSSProperties } from 'react';
import { $$ } from '@/lib/dom';
import type { Project } from '@/lib/projects';
import { projectHref } from '@/lib/site';

export default function Timeline({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const off: (() => void)[] = [];
    $$('.xp-row', ref.current!).forEach(r => {
      // Comme la FAQ : un seul projet ouvert à la fois
      const t = (e: Event) => {
        if ((e.target as Element).closest('a')) return;
        const open = !r.classList.contains('open');
        $$('.xp-row', ref.current!).forEach(x => { x.classList.toggle('open', false); x.setAttribute('aria-expanded', 'false'); });
        r.classList.toggle('open', open); r.setAttribute('aria-expanded', String(open));
      };
      const k = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(e); } };
      r.addEventListener('click', t); r.addEventListener('keydown', k);
      off.push(() => { r.removeEventListener('click', t); r.removeEventListener('keydown', k); });
    });
    return () => off.forEach(f => f());
  }, []);

  return (
    <div className="xp" id="xp" ref={ref}>
      {projects.map((p, i) => (
        <div className="xp-row reveal" style={{ '--d': `${i * .05}s` } as CSSProperties} tabIndex={0} role="button" aria-expanded="false" key={p.slug}>
          <span className="mono">{p.period}</span>
          <h4>{p.title}<small>{`${p.category} · ${p.status}`}</small></h4>
          <div className="xp-d">{`${p.tagline}.`}
            <div className="xp-more">
              <p>{p.summary}</p>
              <span className="xp-act">
                {p.url ? <a href={p.url} target="_blank" rel="noopener" className="xp-btn site">Voir le site <span>↗</span></a> : null}
                <a href={projectHref(p.slug)} className="xp-btn">Voir l&apos;étude de cas <span>→</span></a>
              </span>
            </div>
          </div>
          <span className="plus">+</span>
        </div>
      ))}
    </div>
  );
}
