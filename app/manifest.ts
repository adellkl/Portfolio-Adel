import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site';

/* /manifest.webmanifest — nom, couleurs et icônes quand le site est ajouté à l'écran d'accueil */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: 'Sites et applications web, de l’interface à la mise en ligne.',
    start_url: '/',
    display: 'standalone',
    background_color: '#08090a',
    theme_color: '#08090a',
    lang: 'fr',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
