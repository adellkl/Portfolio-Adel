import type { CSSProperties } from 'react';
import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import Featured from '@/components/home/Featured';
import { getProjects } from '@/lib/data';
import Teasers from '@/components/home/Teasers';
import { LetsWorkTogether } from '@/components/ui/lets-work-section';
import { FaqSection } from '@/components/ui/faq-section';

const d = (s: string) => ({ '--d': s }) as CSSProperties;

export default async function HomePage() {
  const projects = await getProjects();
  return (
    <>
      <Hero />
      <Marquee />

      {/* ============ PROJETS ============ */}
      <section className="block" id="projets">
        <div className="wrap">
          <div className="eyebrow reveal"><span className="mono">01</span>Projets</div>
          <h2 className="reveal" style={d('.08s')}>Des produits en ligne, <span className="muted">utilisés pour de vrai.</span></h2>
          <p className="lede reveal" style={d('.16s')}>Le site d&apos;un club de sport, un showroom avec boutique et réservations, un restaurant gastronomique, une galerie d&apos;art et un centre de tests psychotechniques. Chaque étude de cas présente le contexte, les enjeux et la façon dont je les ai traités.</p>
          <Featured projects={projects} />
        </div>
      </section>

      {/* ============ EN SAVOIR PLUS ============ */}
      <Teasers />

      {/* ============ FAQ ============ */}
      <FaqSection n="03" />

      {/* ============ CONTACT ============ */}
      <section className="contact lwt-section" id="contact">
        <div className="wrap"><LetsWorkTogether /></div>
      </section>
    </>
  );
}
