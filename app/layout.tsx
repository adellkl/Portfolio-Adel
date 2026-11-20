import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/chrome/Nav';
import Footer from '@/components/chrome/Footer';
import CommandPalette from '@/components/chrome/CommandPalette';
import MotionRuntime from '@/components/motion/MotionRuntime';
import { CONSENT_KEY, EMAIL, GITHUB, GTM_ID, LEGAL, SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/site';
import Script from 'next/script';
import Consent from '@/components/chrome/Consent';
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
        {GTM_ID ? (
          /* Mode consentement Google : tout est refusé par défaut, puis on reprend le choix déjà fait (6 mois).
             Pas de mesure sur /admin. Tag Manager se charge ensuite et lit ces réglages. */
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
gtag('set','ads_data_redaction',true);
try{var c=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');if(c&&Date.now()-c.at<15724800000&&c.v==='granted')gtag('consent','update',{analytics_storage:'granted'});}catch(e){}
gtag('js',new Date());` }} />
        ) : null}
      </head>
      <body>
        <Nav />
        <MotionRuntime>{children}</MotionRuntime>
        <Footer />
        <CommandPalette projects={(await getProjects()).map(({ slug, title, tagline, id }) => ({ slug, title, tagline, id }))} />
        {GTM_ID ? (
          <>
            <Consent />
            <Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `if(!location.pathname.startsWith('/admin')){(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');}` }} />
          </>
        ) : null}
      </body>
    </html>
  );
}
