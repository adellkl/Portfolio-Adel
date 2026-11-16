import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/chrome/Nav';
import Footer from '@/components/chrome/Footer';
import CommandPalette from '@/components/chrome/CommandPalette';
import MotionRuntime from '@/components/motion/MotionRuntime';
import { EMAIL, GITHUB, LEGAL, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';
import { getProjects } from '@/lib/data';

// adjustFontFallback: false — sinon next/font intercale une police « Fallback » (Arial ajusté) couvrant
// tous les glyphes : les caractères absents du sous-ensemble latin (→, ⌘…) ne tomberaient plus sur la
// police système comme dans le prototype (écart mesuré : « → » 13,9 px au lieu de 11,7 px).
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', adjustFontFallback: false });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: '400', variable: '--font-mono', display: 'swap', adjustFontFallback: false });

const DESCRIPTION = "Adel Loukal, développeur full-stack freelance en Île-de-France : sites vitrines, sites de réservation et applications web sur mesure, du design à la mise en ligne.";
const HOME_TITLE = `${SITE_NAME} — Développeur web freelance, sites et applications`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: ['Adel Loukal', 'développeur full-stack', 'développeur web freelance', 'création de site internet', 'site vitrine', 'application web sur mesure', 'site de réservation', 'Next.js', 'React', 'Supabase', 'Île-de-France'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'fr_FR', siteName: SITE_NAME, url: '/', title: HOME_TITLE, description: DESCRIPTION },
  twitter: { card: 'summary_large_image', title: HOME_TITLE, description: DESCRIPTION },
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
      knowsAbout: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Supabase', 'Firebase', 'PostgreSQL', 'Stripe', 'Vercel', 'GSAP', 'Express'],
      worksFor: { '@id': `${SITE_URL}/#entreprise` },
    },
    {
      '@type': 'ProfessionalService', '@id': `${SITE_URL}/#entreprise`, name: `${LEGAL.company} — ${SITE_NAME}`, url: SITE_URL, email: EMAIL,
      image: `${SITE_URL}/images/adel-loukal.webp`, description: DESCRIPTION, founder: { '@id': `${SITE_URL}/#adel` },
      areaServed: [{ '@type': 'AdministrativeArea', name: 'Île-de-France' }, { '@type': 'Country', name: 'France' }],
      address: { '@type': 'PostalAddress', addressRegion: 'Île-de-France', addressCountry: 'FR' },
      knowsLanguage: ['fr', 'en'],
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Services', itemListElement: [
        'Sites vitrines', 'Applications web sur mesure', 'Plateformes de réservation et paiement',
        'Espaces clients et tableaux de bord', 'E-commerce et intégrations', 'Refonte, maintenance et évolution',
      ].map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })) },
    },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#site`, url: SITE_URL, name: SITE_NAME, inLanguage: 'fr-FR', publisher: { '@id': `${SITE_URL}/#adel` } },
  ],
};

export const revalidate = 60;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
        <CommandPalette projects={(await getProjects()).map(({ slug, title, tagline, id }) => ({ slug, title, tagline, id }))} />
      </body>
    </html>
  );
}
