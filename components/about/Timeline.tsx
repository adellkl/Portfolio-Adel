'use client';
/* Accordéon chronologie (renderTimeline de main.js) */
import { useEffect, useRef, type CSSProperties } from 'react';
import { $$ } from '@/lib/dom';
import type { Project } from '@/lib/projects';
import { projectHref } from '@/lib/site';

export default function Timeline({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const off: (() => void)[] = [];
    $$('.xp-row', ref.current!).forEach(r => {
      const t = (e: Event) => { if ((e.target as Element).closest('a')) return; r.classList.toggle('open'); r.setAttribute('aria-expanded', String(r.classList.contains('open'))); };
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
          <div className="xp-d">{`${p.tagline}.`}<div className="xp-more">{`${p.summary} `}<a href={projectHref(p.slug)} className="arrow-link" style={{ fontSize: 14, marginTop: 8 }}>Étude de cas <span>→</span></a></div></div>
          <span className="plus">+</span>
        </div>
      ))}
    </div>
  );
}
