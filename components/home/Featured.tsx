/* Projets mis en avant (5 premiers) */
import type { CSSProperties } from 'react';
import { lc, PROJECTS } from '@/lib/projects';
import { projectHref } from '@/lib/site';
import { VISUALS } from '@/components/visuals';
import Tags from '@/components/Tags';

export default function Featured() {
  return (
    <div className="projects" id="featured">
      {PROJECTS.slice(0, 5).map(p => {
        const V = VISUALS[p.visual];
        return (
          <article className="proj" key={p.slug}>
            <div className="proj-text reveal">
              <span className="mono">{`${p.id} · ${p.category} · ${p.year}`}</span>
              <h3>{`${p.title} — ${lc(p.tagline)}`}</h3>
              <p>{p.summary}</p>
              <div className="tags"><Tags stack={p.stack} /></div>
              <div className="meta">{p.results.slice(0, 2).map(([v, s, l]) => <div key={l}><b data-count={v} data-suffix={s}>0</b>{l}</div>)}</div>
              <a href={projectHref(p.slug)} className="arrow-link">Lire l&apos;étude de cas <span>→</span></a>
            </div>
            <a href={projectHref(p.slug)} className="panel shot spot reveal" style={{ '--d': '.1s' } as CSSProperties} aria-label={`Voir le projet ${p.title}`}>
              <V />
              <span className="pill open">{`Ouvrir ${p.title} →`}</span>
            </a>
          </article>
        );
      })}
    </div>
  );
}
