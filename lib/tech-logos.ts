/* Logos des technos (simple-icons, SVG officiels des marques) pour la stack des projets.
   Le nom de la stack est rapproché sans tenir compte du numéro de version (« Next.js 16 » → Next.js). */
import { siDeepl, siExpress, siFirebase, siFramer, siGsap, siNextdotjs, siPostgresql, siPwa, siReact, siResend, siStripe, siSupabase, siTailwindcss, siTypescript, siVercel, siVite } from 'simple-icons';

export type TechLogo = { title: string; path: string; hex: string };

const LOGOS: Record<string, TechLogo> = {
  'next.js': siNextdotjs, react: siReact, typescript: siTypescript, tailwind: siTailwindcss, 'tailwind css': siTailwindcss,
  supabase: siSupabase, firebase: siFirebase, stripe: siStripe, deepl: siDeepl, gsap: siGsap, pwa: siPwa, vite: siVite,
  motion: siFramer, 'framer motion': siFramer, vercel: siVercel, postgresql: siPostgresql, express: siExpress, resend: siResend,
};

/** Nom normalisé d'une techno, sans numéro de version (« Tailwind 4 » et « Tailwind CSS » → même outil) */
export const techKey = (name: string) => {
  const k = name.toLowerCase().replace(/\s+\d+(\.\d+)*$/, '').trim();
  return ({ tailwind: 'tailwind css', 'framer motion': 'motion' } as Record<string, string>)[k] ?? k;
};

/** Logo d'une techno de la stack, ou null si on n'en a pas (le nom s'affiche alors seul) */
export function techLogo(name: string): TechLogo | null {
  return LOGOS[techKey(name)] ?? null;
}
