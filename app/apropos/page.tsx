import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import SplitTitle from '@/components/SplitTitle';
import Stack from '@/components/about/Stack';
import Timeline from '@/components/about/Timeline';
import CtaBlock from '@/components/CtaBlock';
import { getProjects } from '@/lib/data';
import { onlineCount } from '@/lib/site';

export const metadata: Metadata = pageMeta('À propos — Adel Loukal', 'Qui je suis, ma façon de travailler, mes outils et la chronologie de mes projets.', '/apropos');

const d = (s: string) => ({ '--d': s }) as CSSProperties;
const ico = { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', stroke: '#d0d6e0', strokeWidth: 1.3 } as const;

export default async function AboutPage() {
  const projects = await getProjects();
  const links = projects.map(p => ({ slug: p.slug, title: p.title }));
  return (
    <>
      <header className="page-hero" id="top">
        <div className="hero-glow"></div>
        <div className="wrap">
          <div className="eyebrow fade"><span className="mono">À PROPOS</span></div>
          <SplitTitle text="Entre le design et le code,|_là où les produits se jouent._" />
          <p className="lede fade" style={{ transitionDelay: '.7s' }}>Développeur full-stack et créateur d&apos;expériences digitales, du design de l&apos;interface à la mise en ligne.</p>
        </div>
      </header>

      {/* ============ BIO ============ */}
      <section className="block" style={{ paddingTop: 96 }}>
        <div className="wrap">
          <div className="about" style={{ marginTop: 0 }}>
            <div>
              <div className="panel id-card reveal spot">
                <div className="id-top"><Image src="/images/adel-loukal.webp" alt="Portrait d'Adel Loukal" fill sizes="(max-width: 960px) 100vw, 440px" priority /></div>
                <div className="facts">
                  <div><span>ENTREPRISE</span><span>A.L FRONT · EI</span></div>
                  <div><span>BASE</span><span>Île-de-France · à distance</span></div>
                  <div><span>PROJETS</span><span id="nbProjects">{`${projects.length} projets, dont ${onlineCount(projects)} en ligne`}</span></div>
                  <div><span>STACK</span><span>Next.js · React · TypeScript</span></div>
                  <div><span>BACKEND</span><span>Supabase · PostgreSQL · Express</span></div>
                  <div><span>STATUT</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><span className="dot"></span>Disponible</span></div>
                </div>
              </div>
              <div className="panel now reveal" style={d('.1s')}><span className="mono">EN CE MOMENT</span><p>En recherche de nouveaux projets.</p></div>
              <div className="bio-actions reveal" style={d('.15s')}>
                <a className="ghost" href="https://github.com/adellkl" target="_blank" rel="noopener">GitHub ↗</a>
                <button className="ghost copy" data-copy="">Copier mon email</button>
              </div>
            </div>
            <div className="bio">
              <p className="reveal">Je suis Adel, <strong>développeur full-stack</strong> spécialisé dans la conception de produits web modernes et utiles. Je prends en charge un projet dans sa globalité : design de l&apos;interface, développement front-end, base de données, authentification, automatisations et mise en ligne.</p>
              <p className="reveal" style={d('.06s')}>Mes projets vont du <strong>site d&apos;un restaurant gastronomique</strong> au catalogue d&apos;une galerie d&apos;art, en passant par la boutique et les réservations d&apos;un showroom. Ce qui les relie : partir d&apos;un vrai besoin et livrer quelque chose qui tourne.</p>
              <p className="reveal" style={d('.12s')}>Mon objectif est de créer des outils <strong>beaux, rapides et simples à utiliser</strong>, qui répondent à un vrai besoin métier.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ VALEURS ============ */}
      <section className="block">
        <div className="wrap">
          <div className="eyebrow reveal"><span className="mono">01</span>Ce qui compte pour moi</div>
          <h2 className="reveal" style={d('.08s')}>Quatre principes, sur chaque projet.</h2>
          <div className="values" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginTop: 48 }}>
            <div className="panel value reveal spot">
              <svg {...ico}><circle cx="9" cy="9" r="7" /><circle cx="9" cy="9" r="3" /></svg>
              <h4>Précision</h4><p>Chaque détail compte, de l&apos;espacement d&apos;un bouton à la règle de sécurité d&apos;une base de données.</p>
            </div>
            <div className="panel value reveal spot" style={d('.06s')}>
              <svg {...ico}><path d="M3 9h12M11 5l4 4-4 4" /></svg>
              <h4>Vitesse</h4><p>Livrer tôt, tester, itérer. Le nouveau site d&apos;Alpha Fight Club est passé de l&apos;idée à la mise en ligne en moins de trois semaines.</p>
            </div>
            <div className="panel value reveal spot" style={d('.12s')}>
              <svg {...ico}><rect x="2.5" y="2.5" width="13" height="13" rx="3" /><path d="M6 9l2 2 4-4" /></svg>
              <h4>Fiabilité</h4><p>Des tests automatisés et des contrôles côté serveur, pas seulement dans l&apos;interface.</p>
            </div>
            <div className="panel value reveal spot" style={d('.18s')}>
              <svg {...ico}><circle cx="6" cy="7" r="2.5" /><circle cx="12" cy="7" r="2.5" /><path d="M2 15c0-2.2 1.8-4 4-4s4 1.8 4 4M8 15c0-2.2 1.8-4 4-4s4 1.8 4 4" /></svg>
              <h4>Autonomie</h4><p>Un seul interlocuteur du design au déploiement, avec une documentation claire à la fin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ OUTILS ============ */}
      <section className="block">
        <div className="wrap">
          <div className="eyebrow reveal"><span className="mono">02</span>Outils</div>
          <h2 className="reveal" style={d('.08s')}>Ce que j&apos;utilise au quotidien.</h2>
          <Stack projects={links} />
        </div>
      </section>

      {/* ============ CHRONOLOGIE ============ */}
      <section className="block" id="parcours">
        <div className="wrap">
          <div className="eyebrow reveal"><span className="mono">03</span>Chronologie</div>
          <h2 className="reveal" style={d('.08s')}>Un an de projets livrés.</h2>
          <Timeline projects={projects} />
        </div>
      </section>

      <CtaBlock n="04" />
    </>
  );
}
