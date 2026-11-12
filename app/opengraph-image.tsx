import { ImageResponse } from 'next/og';
import { OG_SIZE, OgCard } from '@/components/og';

/* Image de partage par défaut (accueil, à propos, services, rendez-vous) */
export const alt = 'Adel Loukal — Développeur full-stack & créateur d’expériences digitales';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <OgCard kicker="PORTFOLIO" title="Je conçois et je code" muted="des produits web de bout en bout."
      tags={['Sites vitrines', 'Applications sur mesure', 'Réservation & paiement']} foot="Développeur full-stack · Disponible pour de nouveaux projets" />,
    size,
  );
}
