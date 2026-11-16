import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import Showcase from '@/components/home/Showcase';
import { getProjects } from '@/lib/data';
import Teasers from '@/components/home/Teasers';
import { LetsWorkTogether } from '@/components/ui/lets-work-section';
import { FaqSection } from '@/components/ui/faq-section';

export default async function HomePage() {
  const projects = await getProjects();
  return (
    <>
      <Hero />
      <Marquee projects={projects} />

      {/* ============ PROJETS ============ */}
      <Showcase projects={projects} />

      {/* ============ EN SAVOIR PLUS ============ */}
      <Teasers projects={projects} />

      {/* ============ CONTACT ============ */}
      <section className="contact lwt-section" id="contact">
        <div className="wrap"><LetsWorkTogether /></div>
      </section>

      {/* ============ FAQ ============ */}
      <FaqSection n="03" />
    </>
  );
}
