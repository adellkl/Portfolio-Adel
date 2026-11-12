import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMeta } from '@/lib/seo';
import { COLORS, lc, PROJECTS } from '@/lib/projects';
import { SITE_URL, projectHref } from '@/lib/site';
import { VISUALS } from '@/components/visuals';
import SplitTitle from '@/components/SplitTitle';
import Tags from '@/components/Tags';
import ProjectRuntime from '@/components/ProjectRuntime';
import ProjectGallery from '@/components/ProjectGallery';
import Charte from '@/components/Charte';

export const dynamicParams = false;
export function generateStaticParams() { return PROJECTS.map(p => ({ slug: p.slug })); }

export async function generateMetadata({ params }: PageProps<'/projets/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find(x => x.slug === slug);
  if (!p) return {};
  return pageMeta(`${p.title} — ${p.tagline} · Adel Loukal`, p.summary, projectHref(p.slug), 'article');
}

const d = (s: string) => ({ '--d': s }) as CSSProperties;

export default async function ProjectPage({ params }: PageProps<'/projets/[slug]'>) {
  const { slug } = await params;
  const idx = PROJECTS.findIndex(p => p.slug === slug);
  if (idx < 0) notFound();
  const p = PROJECTS[idx];
  const nxt = PROJECTS[(idx + 1) % PROJECTS.length];
  const statusDot = ({ 'En ligne': 'var(--green)', 'En développement': 'var(--iris)' } as Record<string, string>)[p.status] || 'var(--ash)';
  const Visual = VISUALS[p.visual], NextVisual = VISUALS[nxt.visual];

  return (
    <main id="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, headline: `${p.title} — ${p.tagline}`, description: p.summary,
        url: `${SITE_URL}${projectHref(p.slug)}`, dateCreated: p.year, inLanguage: 'fr-FR', keywords: p.stack.map(([n]) => n).join(', '),
        author: { '@id': `${SITE_URL}/#adel` }, ...(p.url ? { sameAs: p.url } : {}),
      }).replace(/</g, '\\u003c') }} />
      <header className="p-hero">
        <div className="wrap">
          <a href="/#projets" className="back fade"><span>←</span> Tous les projets</a>
          <span className="mono pid fade" style={{ transitionDelay: '.05s' }}>{`${p.id} · ${p.category} · ${p.year}`}</span>
          <SplitTitle text={`${p.title} —|_${lc(p.tagline)}_`} delay=".1" />
          <p className="lede fade" style={{ transitionDelay: '.7s' }}>{p.summary}</p>
          <div className="p-links fade" style={{ transitionDelay: '.8s' }}>
            {p.url ? <a className="ghost" href={p.url} target="_blank" rel="noopener">{`Voir le site · ${p.urlLabel} ↗`}</a> : <span className="pill">{p.status}</span>}
          </div>
          <div className="p-meta fade" style={{ transitionDelay: '.9s' }}>
            <div>Client<b>{p.client}</b></div>
            <div>Rôle<b>{p.role}</b></div>
            <div>Période<b>{p.period}</b></div>
            <div>Statut<b><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><i style={{ width: 8, height: 8, borderRadius: '50%', background: statusDot, display: 'block' }}></i>{p.status}</span></b></div>
            <div>Stack<b><span className="tags" style={{ marginTop: 2 }}><Tags stack={p.stack} /></span></b></div>
          </div>
          <div className="stage" style={{ marginTop: 64 }}>
            <div className="floor"></div>
            <div className="frame panel p-shot spot"><Visual /></div>
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="p-body">
          <aside className="toc" id="toc">
            <a href="#contexte">Contexte</a><a href="#enjeux">Enjeux</a><a href="#approche">Approche</a><a href="#chiffres">En chiffres</a>{p.gallery ? <a href="#galerie">Galerie</a> : null}{p.charte ? <a href="#charte">Charte graphique</a> : null}
          </aside>
          <article>
            <section className="chapter" id="contexte">
              <div className="eyebrow reveal"><span className="mono">01</span>Contexte</div>
              <h2 className="reveal">D&apos;où part le projet.</h2>
              <p className="reveal" dangerouslySetInnerHTML={{ __html: p.context }} />
            </section>

            <section className="chapter" id="enjeux">
              <div className="eyebrow reveal"><span className="mono">02</span>Enjeux</div>
              <h2 className="reveal">Ce qu&apos;il fallait résoudre.</h2>
              <div className="problems">
                {p.problems.map(([t, c, l], i) => <div className="card reveal" style={d(`${i * .08}s`)} key={i}><span className="id mono">{`${p.id}-${i + 1}`}</span><p>{t}</p><span className="tag"><i style={{ background: COLORS[c] }}></i>{l}</span></div>)}
              </div>
            </section>

            <section className="chapter" id="approche">
              <div className="eyebrow reveal"><span className="mono">03</span>Approche</div>
              <h2 className="reveal">Comment je l&apos;ai construit.</h2>
              <div className="approach">
                {p.approach.map(([t, dd], i) => <div className="ap reveal" style={d(`${i * .06}s`)} key={i}><span className="mono">{`0${i + 1}`}</span><div><h4>{t}</h4><p>{dd}</p></div></div>)}
              </div>
            </section>

            <section className="chapter" id="chiffres">
              <div className="eyebrow reveal"><span className="mono">04</span>En chiffres</div>
              <h2 className="reveal">Le projet en quelques nombres.</h2>
              <div className="results">
                {p.results.map(([v, s, l, pre], i) => <div className="panel reveal" style={d(`${i * .08}s`)} key={i}><b data-count={v} data-suffix={s} data-prefix={pre}>{`${pre ?? ''}0`}</b><span>{l}</span></div>)}
              </div>
            </section>

            <ProjectGallery p={p} n="05" />

            <Charte p={p} n="06" />
          </article>
        </div>

        <a href={projectHref(nxt.slug)} className="panel next spot reveal">
          <div>
            <span className="mono">{`PROJET SUIVANT · ${nxt.id}`}</span>
            <h3>{nxt.title}</h3>
            <span className="arrow-link">{`${nxt.tagline} `}<span>→</span></span>
          </div>
          <div className="preview in"><NextVisual /></div>
        </a>
      </div>
      <ProjectRuntime />
    </main>
  );
}
