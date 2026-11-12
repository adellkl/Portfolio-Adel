import type { Project } from './projects';

export const EMAIL = 'adelloukal2@gmail.com';

/** URL publique du site (SEO : sitemap, robots, canonical, Open Graph).
    Ordre : NEXT_PUBLIC_SITE_URL (à définir avec ton domaine) → domaine de production Vercel → local. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')).replace(/\/$/, '');
export const SITE_NAME = 'Adel Loukal';
export const SITE_TAGLINE = 'Développeur full-stack & créateur d’expériences digitales';
export const GITHUB = 'https://github.com/adellkl';

/** Informations légales (extrait Kbis du 22/07/2026). Ni adresse ni téléphone publiés, à la demande d'Adel. */
export const LEGAL = {
  company: 'A.L FRONT',                       // nom commercial
  owner: 'Adel Loukal',
  status: 'Entrepreneur individuel (EI)',
  siren: '107 730 020',
  rcs: 'R.C.S. Bobigny 107 730 020',
  activity: 'Développement de sites web',
  since: '18 juillet 2026',
  host: { name: 'Vercel Inc.', address: '440 N Barranca Ave #4133, Covina, CA 91723, États-Unis', url: 'https://vercel.com' },
};

export const onlineCount = (projects: Project[]) => projects.filter(p => p.status === 'En ligne').length;

/** Items « Navigation » de la palette ⌘K : [nom, href, raccourci] */
export const CMDK_NAV: [string, string, string][] = [
  ['Accueil', '/', 'G H'], ['Projets', '/#projets', 'G P'], ['À propos', '/apropos', 'G A'], ['Services', '/services', 'G S'],
  ['Chronologie', '/apropos#parcours', 'G E'], ['Méthode', '/services#methode', 'G M'], ['Contact', '/#contact', 'G C'], ['Réserver un appel', '/rendez-vous', 'G R'],
];

/** Raccourcis clavier « g » puis touche */
export const KEYS: Record<string, string> = { h: '/', p: '/#projets', a: '/apropos', s: '/services', e: '/apropos#parcours', m: '/services#methode', c: '/#contact', r: '/rendez-vous' };

/** Outil → projets qui l'utilisent (À propos) */
export const USES: Record<string, string[]> = {
  React: ['mon-livret', 'alpha-fight-club', 'lebsa-danah', 'la-marine', 'class-gallery', 'test-psychotechnique'], 'Next.js': ['mon-livret', 'alpha-fight-club', 'test-psychotechnique'],
  TypeScript: ['mon-livret', 'alpha-fight-club', 'lebsa-danah', 'la-marine', 'class-gallery'], 'Tailwind CSS': ['alpha-fight-club', 'lebsa-danah', 'class-gallery'],
  Supabase: ['lebsa-danah', 'la-marine'], Firebase: ['mon-livret'], PostgreSQL: ['lebsa-danah', 'la-marine'], API: ['alpha-fight-club', 'lebsa-danah', 'la-marine'],
  Vercel: ['mon-livret', 'alpha-fight-club', 'lebsa-danah', 'la-marine', 'class-gallery'], 'Hébergement': ['mon-livret', 'alpha-fight-club', 'lebsa-danah', 'la-marine', 'class-gallery'],
  Domaines: ['mon-livret', 'alpha-fight-club', 'lebsa-danah', 'la-marine', 'class-gallery', 'test-psychotechnique'], 'E-mails transactionnels': ['lebsa-danah', 'la-marine'],
  'Réservation': ['lebsa-danah', 'la-marine', 'test-psychotechnique'], 'Paiement en ligne': ['mon-livret', 'lebsa-danah'], Authentification: ['mon-livret', 'lebsa-danah', 'la-marine'],
  Administration: ['mon-livret', 'lebsa-danah', 'la-marine'], Formulaires: ['lebsa-danah', 'la-marine', 'class-gallery'], Automatisations: ['lebsa-danah', 'la-marine'],
};

/** Types de projet du brief de contact : [libellé, projet comparable] */
export const TYPES: Record<string, [string, string]> = { vitrine: ['un site vitrine', 'alpha-fight-club'], reservation: ['un site avec réservation', 'la-marine'], 'rendez-vous': ['un site de prise de rendez-vous', 'test-psychotechnique'], catalogue: ['un catalogue en ligne', 'class-gallery'], boutique: ['une boutique avec réservations', 'lebsa-danah'] };

/** Réservation d'appel (accueil, #rdv) : disponibilités en heure de Paris.
    jours : 1 = lundi … 7 = dimanche ; créneaux de `step` minutes entre `from` et `to` (fin exclue). */
export const BOOKING = {
  title: 'Appel découverte', minutes: 15, place: 'Visio ou téléphone', tz: 'Europe/Paris',
  days: [1, 2, 3, 4, 5], from: '09:00', to: '18:00', step: 30,
  noticeHours: 2,   // délai minimum avant un créneau
  horizonDays: 45,  // réservable jusqu'à J+45
};

/** Musique d'ambiance (lib/ambient.ts) : src vide = nappe générée en direct ; sinon un fichier de public/, ex. '/audio/ambiance.mp3' */
export const MUSIC = { src: '', volume: 1 };

export const projectHref =(slug: string) => `/projets/${slug}`;
