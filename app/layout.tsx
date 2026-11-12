import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/chrome/Nav';
import Footer from '@/components/chrome/Footer';
import CommandPalette from '@/components/chrome/CommandPalette';
import MotionRuntime from '@/components/motion/MotionRuntime';
import { GITHUB, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';

// adjustFontFallback: false — sinon next/font intercale une police « Fallback » (Arial ajusté) couvrant
// tous les glyphes : les caractères absents du sous-ensemble latin (→, ⌘…) ne tomberaient plus sur la
// police système comme dans le prototype (écart mesuré : « → » 13,9 px au lieu de 11,7 px).
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', adjustFontFallback: false });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono', display: 'swap', adjustFontFallback: false });

const DESCRIPTION = "Portfolio d'Adel Loukal, développeur full-stack : Alpha Fight Club, Lebsa Danah, La Marine, Class Gallery, Test Psychotechnique Permis. Sites et applications web, de l'interface à la mise en ligne.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: ['Adel Loukal', 'développeur full-stack', 'développeur web freelance', 'création de site internet', 'site vitrine', 'application web sur mesure', 'site de réservation', 'Next.js', 'React', 'Supabase', 'Île-de-France'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'fr_FR', siteName: SITE_NAME, url: '/', title: `${SITE_NAME} — ${SITE_TAGLINE}`, description: DESCRIPTION },
  twitter: { card: 'summary_large_image', title: `${SITE_NAME} — ${SITE_TAGLINE}`, description: DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = { themeColor: '#08090a', colorScheme: 'dark' };

/* Données structurées : la personne et le site */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person', '@id': `${SITE_URL}/#adel`, name: SITE_NAME, url: SITE_URL, image: `${SITE_URL}/images/adel-loukal.webp`,
      jobTitle: 'Développeur full-stack', description: SITE_TAGLINE, sameAs: [GITHUB],
      address: { '@type': 'PostalAddress', addressRegion: 'Île-de-France', addressCountry: 'FR' },
      knowsAbout: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Firebase', 'PostgreSQL', 'Vercel'],
    },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#site`, url: SITE_URL, name: SITE_NAME, inLanguage: 'fr-FR', publisher: { '@id': `${SITE_URL}/#adel` } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${mono.variable}`} data-scroll-behavior="smooth">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <noscript><style>{'body{opacity:1}.split .w>span,.fade,.frame,.reveal{opacity:1;transform:none}'}</style></noscript>
      </head>
      <body>
        <Nav />
        <MotionRuntime>{children}</MotionRuntime>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}
