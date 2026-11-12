import Logo from '@/components/Logo';
/* Gabarit commun des images de partage (Open Graph / Twitter), généré par next/og.
   Reprend les couleurs du site : fond --void, texte --paper / --ash, accent --lime. */
export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({ kicker, title, muted, tags, foot }: { kicker: string; title: string; muted?: string; tags?: string[]; foot: string }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#08090a', color: '#fff', fontFamily: 'sans-serif',
      backgroundImage: 'radial-gradient(700px 360px at 85% 0%, rgba(208,214,224,.10), transparent 70%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, color: '#fff' }}>
        <Logo size={40} />
        Adel Loukal
        <span style={{ marginLeft: 'auto', fontSize: 22, color: '#62666d', letterSpacing: 2 }}>{kicker}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', fontSize: 76, lineHeight: 1.05, letterSpacing: -2.5, color: '#fff' }}>{title}</div>
        {muted ? <div style={{ display: 'flex', fontSize: 76, lineHeight: 1.05, letterSpacing: -2.5, color: '#62666d' }}>{muted}</div> : null}
        {tags?.length ? (
          <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            {tags.map(t => <div key={t} style={{ display: 'flex', fontSize: 24, color: '#8a8f98', background: 'rgba(255,255,255,.06)', borderRadius: 8, padding: '6px 14px' }}>{t}</div>)}
          </div>
        ) : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: '#8a8f98' }}>
        <div style={{ display: 'flex', width: 12, height: 12, borderRadius: 6, background: '#e4f222' }} />
        {foot}
      </div>
    </div>
  );
}
