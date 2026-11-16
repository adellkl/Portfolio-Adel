'use client';
/* Outils (À propos) : deux bandeaux pleine largeur qui défilent en sens opposé
   (en haut : front et animation, de droite à gauche ; en bas : back et infrastructure, de gauche à droite).
   Chaque techno : logo, nom et rôle concret. Survol / focus : la ligne se met en pause, le logo prend sa couleur
   de marque et les projets où je l'ai utilisé s'affichent sous les bandeaux.
   L'outil actif est marqué par aria-pressed (pas par la classe : .reveal reçoit .in hors de React). */
import { useState, type CSSProperties } from 'react';
import type { Project } from '@/lib/projects';
import { USES, projectHref } from '@/lib/site';
import { techKey, techLogo } from '@/lib/tech-logos';

type Tool = [name: string, role: string];
const ROWS: Tool[][] = [
  [['Next.js', 'Framework web'], ['React', 'Interfaces'], ['TypeScript', 'Code fiable'], ['Tailwind CSS', 'Styles'], ['Vite', 'Build rapide'], ['GSAP', 'Animations'], ['Motion', 'Micro-interactions'], ['DeepL', 'Traduction']],
  [['Supabase', 'Base de données'], ['Firebase', 'Temps réel'], ['PostgreSQL', 'Données'], ['Stripe', 'Paiement'], ['Vercel', 'Hébergement'], ['Express', 'API'], ['Resend', 'E-mails']],
];

type P = Pick<Project, 'slug' | 'title' | 'stack'>;

/* Couleur de marque lisible sur fond sombre (les marques noires restent blanches) */
const brand = (hex: string) => {
  const n = parseInt(hex, 16), l = ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000;
  return l < 60 ? 'var(--paper)' : `#${hex}`;
};

export default function Stack({ projects }: { projects: P[] }) {
  const [tool, setTool] = useState<string | null>(null);
  // Projets d'un outil : leur stack, complétée par USES (outils hors stack : Vercel, PostgreSQL…)
  const usedIn = (t: string) => projects.filter(p => p.stack.some(([n]) => techKey(n) === techKey(t)) || USES[t]?.includes(p.slug));
  const list = tool ? usedIn(tool) : [];

  const card = ([name, role]: Tool, key: string, clone: boolean) => {
    const logo = techLogo(name);
    return (
      <button type="button" key={key} className="tk" aria-pressed={tool === name} tabIndex={clone ? -1 : 0} aria-hidden={clone || undefined}
        style={logo ? ({ '--brand': brand(logo.hex) } as CSSProperties) : undefined}
        onMouseEnter={() => setTool(name)} onFocus={() => setTool(name)}>
        <span className="tk-logo">{logo ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={logo.path} /></svg> : null}</span>
        <span className="tk-t"><b>{name}</b><span>{role}</span></span>
      </button>
    );
  };

  return (
    <div className="tools" id="stack" onMouseLeave={() => setTool(null)}>
      <div className="tk-band reveal">
        {ROWS.map((row, r) => (
          <div className={`tk-row${r ? ' rev' : ''}`} key={r}>
            <div className="tk-track" style={{ '--n': row.length } as CSSProperties}>
              {/* Deux copies identiques → boucle sans saut */}
              {row.map((t, i) => card(t, `a${i}`, false))}
              {row.map((t, i) => card(t, `b${i}`, true))}
            </div>
          </div>
        ))}
      </div>
      <div className="wrap-in tools-uses" aria-live="polite">
        {tool ? (
          <span className="tools-line" key={tool}>
            <span className="mono">{`${tool.toUpperCase()} →`}</span>
            {list.length ? list.map(p => <a key={p.slug} href={projectHref(p.slug)}>{p.title}</a>) : <span className="tools-none">utilisé sur mes projets en cours</span>}
          </span>
        ) : <span className="mono tools-hint">Survolez une techno pour voir sur quels projets je l&apos;ai utilisée</span>}
      </div>
    </div>
  );
}
