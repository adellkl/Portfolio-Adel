/* Réalisations (accueil) — présentation façon agence.
   Chaque projet : l'image à gauche (même taille pour tous) reste fixe pendant que le récit défile à droite :
   pourquoi le projet est né, ma réponse, ce que ça change, puis les technos en logos qui défilent.
   Le récit (lib/stories.ts) est volontairement différent de l'étude de cas, qui garde le détail technique. */
import type { CSSProperties } from 'react';
import type { Project } from '@/lib/projects';
import { projectHref } from '@/lib/site';
import { galleryImage } from '@/components/visuals';
import { techLogo } from '@/lib/tech-logos';
import { STORIES } from '@/lib/stories';

const d = (s: string) => ({ '--d': s }) as CSSProperties;
const pad = (n: number) => String(n).padStart(2, '0');

/** Bandeau de logos qui défile en boucle (liste répétée pour remplir la largeur, puis doublée) */
function TechMarquee({ stack }: { stack: Project['stack'] }) {
  if (!stack.length) return null;
  const base: Project['stack'] = [];
  while (base.length < 8) base.push(...stack);
  const item = ([name]: Project['stack'][number], i: number, hidden: boolean) => {
    const logo = techLogo(name);
    return (
      <span className="ag-tech-i" key={`${hidden ? 'b' : 'a'}${i}`} aria-hidden={hidden || undefined}>
        {logo ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={logo.path} /></svg> : null}
        {name}
      </span>
    );
  };
  return (
    <div className="ag-tech" role="img" aria-label={`Technos : ${stack.map(([n]) => n).join(', ')}`}>
      <div className="ag-tech-track" style={{ '--n': base.length } as CSSProperties}>
        {base.map((s, i) => item(s, i, i >= stack.length))}
        {base.map((s, i) => item(s, i, true))}
      </div>
    </div>
  );
}

function Story({ p, i }: { p: Project; i: number }) {
  const img = p.gallery?.length ? galleryImage(p) : null;
  const story = STORIES[p.slug];
  return (
    <article className="ag-proj">
      {/* Image fixe pendant que le récit défile */}
      <div className="ag-stick">
        <a href={projectHref(p.slug)} className="ag-media reveal" aria-label={`Voir l'étude de cas ${p.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img ? <img src={img} alt={`${p.title} — ${p.tagline}`} loading="lazy" decoding="async" /> : null}
          <span className="ag-pill" aria-hidden="true">Voir l&apos;étude de cas <span>→</span></span>
        </a>
        <span className="ag-cap mono">{`${pad(i + 1)} · ${p.category} · ${p.year}`}</span>
      </div>

      {/* Récit */}
      <div className="ag-story">
        <header className="reveal">
          <span className="ag-k mono">{p.client}</span>
          <h3>{p.title}</h3>
          <p className="ag-tagline">{p.tagline}</p>
        </header>

        {story ? (
          <>
            <section className="ag-part reveal">
              <span className="ag-k mono">POURQUOI CE PROJET</span>
              <p className="ag-text">{story.why}</p>
            </section>
            <section className="ag-part reveal">
              <span className="ag-k mono">MA RÉPONSE</span>
              <p className="ag-text">{story.how}</p>
            </section>
            <section className="ag-part reveal">
              <span className="ag-k mono">CE QUE ÇA CHANGE</span>
              <p className="ag-text ag-impact">{story.impact}</p>
            </section>
          </>
        ) : (
          <section className="ag-part reveal">
            <span className="ag-k mono">LE PROJET</span>
            <p className="ag-text">{p.summary}</p>
          </section>
        )}

        <section className="ag-part reveal">
          <span className="ag-k mono">TECHNOS UTILISÉES</span>
          <TechMarquee stack={p.stack} />
        </section>

        <div className="ag-cta reveal">
          <a href={projectHref(p.slug)} className="pill-white ag-go">Voir l&apos;étude de cas <span>→</span></a>
          {p.url ? <a href={p.url} target="_blank" rel="noopener" className="arrow-link">{`${p.urlLabel} ↗`}</a> : null}
        </div>
      </div>
    </article>
  );
}

export default function Showcase({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <section className="block ag" id="projets">
      <div className="wrap">
        <div className="ag-head">
          <div>
            <div className="eyebrow reveal"><span className="mono">01</span>Réalisations</div>
            <h2 className="reveal" style={d('.08s')}>Des sites qui travaillent <span className="muted">pour leurs clients.</span></h2>
          </div>
          <div className="ag-intro reveal" style={d('.16s')}>
            <p>Restaurant, showroom, club de sport, galerie d&apos;art ou SaaS : pour chaque projet, pourquoi il est né, comment je l&apos;ai construit et ce qu&apos;il a changé.</p>
            <a href="#contact" className="arrow-link">Me confier un projet <span>→</span></a>
          </div>
        </div>

        <div className="ag-list">
          {projects.map((p, i) => <Story key={p.slug} p={p} i={i} />)}
        </div>

      </div>
    </section>
  );
}

