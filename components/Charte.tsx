import type { CSSProperties } from 'react';
import { Caveat, Cormorant_Garamond, Figtree, Geist, IBM_Plex_Mono, Montserrat, Newsreader, Roboto, Schibsted_Grotesk } from 'next/font/google';
import type { FontKey, Project } from '@/lib/projects';

/* Charte graphique d'un projet : intention, typographies (spécimens dans la vraie police) et couleurs.
   Les polices ne sont chargées que sur les pages projet (pas de préchargement). */
const geist = Geist({ subsets: ['latin'], display: 'swap', preload: false, weight: '500' });
const figtree = Figtree({ subsets: ['latin'], display: 'swap', preload: false, weight: '400' });
const newsreader = Newsreader({ subsets: ['latin'], display: 'swap', preload: false, weight: '400' });
const schibsted = Schibsted_Grotesk({ subsets: ['latin'], display: 'swap', preload: false, weight: '400' });
const plexmono = IBM_Plex_Mono({ subsets: ['latin'], display: 'swap', preload: false, weight: '400' });
const caveat = Caveat({ subsets: ['latin'], display: 'swap', preload: false, weight: '400' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], display: 'swap', preload: false, weight: ['300', '400'], style: ['normal', 'italic'] });
const montserrat = Montserrat({ subsets: ['latin'], display: 'swap', preload: false, weight: '400' });
const roboto = Roboto({ subsets: ['latin'], display: 'swap', preload: false, weight: ['400', '600'] });

const FAMILY: Record<FontKey, { name: string; style: CSSProperties }> = {
  geist: { name: 'Geist', style: { ...geist.style, fontWeight: 500 } },
  figtree: { name: 'Figtree', style: figtree.style },
  newsreader: { name: 'Newsreader', style: newsreader.style },
  schibsted: { name: 'Schibsted Grotesk', style: schibsted.style },
  plexmono: { name: 'IBM Plex Mono', style: { ...plexmono.style, textTransform: 'uppercase', letterSpacing: '.04em' } },
  caveat: { name: 'Caveat', style: caveat.style },
  cormorant: { name: 'Cormorant Garamond', style: { ...cormorant.style, fontWeight: 300 } },
  montserrat: { name: 'Montserrat', style: montserrat.style },
  roboto: { name: 'Roboto', style: { ...roboto.style, fontWeight: 600 } },
  inter: { name: 'Inter', style: { fontFamily: 'var(--sans)' } },
  system: { name: 'Police système', style: { fontFamily: '-apple-system, system-ui, "Segoe UI", Roboto, sans-serif' } },
};

/* Texte lisible sur une pastille de couleur */
const ink = (hex: string) => {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#08090a' : '#fff';
};

export default function Charte({ p, n }: { p: Project; n: string }) {
  const c = p.charte;
  if (!c) return null;
  return (
    <section className="chapter" id="charte">
      <div className="eyebrow reveal"><span className="mono">{n}</span>Charte graphique</div>
      <h2 className="reveal">Typographie et couleurs.</h2>
      <p className="reveal">{c.intent}</p>

      <div className="ch-block reveal">
        <span className="ch-label mono">TYPOGRAPHIE</span>
        <div className="ch-fonts">
          {c.fonts.map(([role, key, note]) => {
            const f = FAMILY[key as FontKey] ?? { name: key, style: { fontFamily: `"${key}", var(--sans)` } };
            return (
              <div className="ch-font" key={role}>
                <span className="ch-aa" style={f.style}>Aa</span>
                <div>
                  <span className="mono">{role.toUpperCase()}</span>
                  <b style={f.style}>{f.name}</b>
                  <span className="ch-note">{note}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ch-block reveal">
        <span className="ch-label mono">COULEURS</span>
        <div className="ch-colors">
          {c.colors.map(([name, hex, role], i) => (
            <div className="ch-color" key={name} style={{ '--i': i } as CSSProperties}>
              <span className="ch-chip" style={{ background: hex, color: ink(hex) }}><span className="mono">{hex}</span></span>
              <b>{name}</b>
              <span>{role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
