/* Projets mis en avant (5 premiers) */
import type { CSSProperties } from 'react';
import { lc, type Project } from '@/lib/projects';
import { projectHref } from '@/lib/site';
import { ProjectVisual } from '@/components/visuals';
import Tags from '@/components/Tags';

export default function Featured({ projects }: { projects: Project[] }) {
  return (
    <div className="projects" id="featured">
      {projects.map(p => {
        return (
          <article className="proj" key={p.slug}>
            <div className="proj-text reveal">
              <span className="mono">{`${p.id} · ${p.category} · ${p.year}`}</span>
              <h3>{`${p.title} — ${lc(p.tagline)}`}</h3>
              <p>{p.summary}</p>
              <div className="tags"><Tags stack={p.stack} /></div>
              <div className="meta">{p.results.slice(0, 2).map(([v, s, l, pre]) => <div key={l}><b data-count={v} data-suffix={s} data-prefix={pre}>{`${pre ?? ''}0`}</b>{l}</div>)}</div>
              <a href={projectHref(p.slug)} className="arrow-link">Lire l&apos;étude de cas <span>→</span></a>
            </div>
            <a href={projectHref(p.slug)} className="panel shot spot reveal" style={{ '--d': '.1s' } as CSSProperties} aria-label={`Voir le projet ${p.title}`}>
              <ProjectVisual p={p} />
              <span className="pill open">{`Ouvrir ${p.title} →`}</span>
            </a>
          </article>
        );
      })}
    </div>
  );
}
