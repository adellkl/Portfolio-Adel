import type { CSSProperties } from 'react';
import Image from 'next/image';
import type { Project } from '@/lib/projects';

/* « En action » : le site en ligne dans un cadre de navigateur.
   Vidéo MP4 si `preview.video` est renseigné, sinon la capture pleine page défile lentement
   (pause en haut et en bas, arrêt au survol). Mouvement réduit : image fixe. */
export default function ProjectDemo({ p, n }: { p: Project; n: string }) {
  const pv = p.preview;
  if (!pv) return null;
  const dur = `${Math.max(14, Math.round(pv.height / 110))}s`;
  return (
    <section className="chapter" id="en-action">
      <div className="eyebrow reveal"><span className="mono">{n}</span>En action</div>
      <h2 className="reveal">Le site, tel qu&apos;il est en ligne.</h2>
      <div className="demo panel reveal" style={{ '--dur': dur } as CSSProperties}>
        <div className="demo-bar">
          <span className="demo-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="demo-url mono">{p.urlLabel || p.title}</span>
          {p.url ? <a className="demo-open" href={p.url} target="_blank" rel="noopener">Ouvrir le site ↗</a> : <span></span>}
        </div>
        <div className="demo-view">
          {pv.video
            ? <video src={pv.video} poster={pv.src} autoPlay muted loop playsInline preload="metadata" aria-label={`Vidéo du site ${p.title}`}></video>
            : <Image src={pv.src} alt={`Page d'accueil du site ${p.title}, en entier`} width={1280} height={pv.height} sizes="(max-width: 960px) 100vw, 760px" quality={80} />}
        </div>
      </div>
      <p className="demo-note reveal">{pv.video ? 'Vidéo du site en ligne.' : 'Capture du site en ligne : survolez pour mettre en pause.'}</p>
    </section>
  );
}
