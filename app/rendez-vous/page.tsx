import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import SplitTitle from '@/components/SplitTitle';
import { BookingSection } from '@/components/ui/booking-section';

export const metadata: Metadata = pageMeta('Réserver un appel — Adel Loukal', 'Réservez un appel découverte de 15 minutes avec Adel Loukal pour parler de votre site ou de votre application web.', '/rendez-vous');

export default function RendezVousPage() {
  return (
    <>
      <header className="page-hero" id="top">
        <div className="hero-glow"></div>
        <div className="wrap">
          <div className="eyebrow fade"><span className="mono">RENDEZ-VOUS</span></div>
          <SplitTitle text="Un appel de 15 minutes,|_pour parler de votre projet._" />
          <p className="lede fade" style={{ transitionDelay: '.6s' }}>Choisissez un jour et une heure : votre messagerie s&apos;ouvre avec la demande prête, et je vous confirme le créneau par e-mail.</p>
        </div>
      </header>
      <BookingSection />
    </>
  );
}
