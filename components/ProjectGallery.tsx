import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Project } from '@/lib/projects';

/* Galerie bento : 5 captures du site en ligne (3 ordinateur, 2 mobile).
   Disposition : grande vue + mobile / mobile + vue / bandeau large. */
const AREAS = ['g-a', 'g-d', 'g-e', 'g-b', 'g-c'];

export default function ProjectGallery({ p, n }: { p: Project; n: string }) {
  if (!p.gallery?.length) return null;
  return (
    <section className="chapter" id="galerie">
      <div className="eyebrow reveal"><span className="mono">{n}</span>Galerie</div>
      <h2 className="reveal">Le site, en images.</h2>
      <div className="bento">
        {p.gallery.map(([label, kind], i) => (
          <figure className={`bento-item ${AREAS[i]} reveal${kind === 'm' ? ' is-mobile' : ''}`} style={{ '--d': `${i * .06}s` } as CSSProperties} key={i}>
            <Image src={`/projets/${p.slug}/${i + 1}.jpg`} alt={`${p.title} — ${label}`} fill
              sizes={kind === 'm' ? '(max-width: 640px) 50vw, 260px' : '(max-width: 640px) 100vw, 760px'} />
            <figcaption className="mono">{label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
