'use client';
/* Texte géant qui défile à l'infini par-dessus une image fixe : répétitions pleines puis en contour
   (le contour laisse voir l'image). Deux groupes identiques → boucle sans saut (translateX 0 → -50 %).
   Vitesse : ~20 s pour parcourir la largeur de l'écran, quelle que soit la longueur du texte.
   Styles : « AnimatedOutlineMarquee » dans app/globals.css (le projet n'utilise pas Tailwind). */
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type Props = {
  text: string;
  /** Image de fond (fixe). Sans image : surface sombre du site. */
  image?: string | null;
  alt?: string;
  /** Nombre de paires plein + contour par groupe */
  pairs?: number;
  /** Secondes pour parcourir une largeur d'écran */
  secondsPerScreen?: number;
  className?: string;
  /** Couleur du texte (pleine et contour). Par défaut : couleur des titres du site */
  color?: string | null;
  /** Contenu posé sur l'image, sous le texte animé */
  children?: ReactNode;
};

export default function AnimatedOutlineMarquee({ text, image, alt = '', pairs = 2, secondsPerScreen = 20, color, className, children }: Props) {
  const track = useRef<HTMLDivElement>(null);

  /* Durée proportionnelle à la largeur d'un groupe : vitesse constante, en px/s */
  useEffect(() => {
    const t = track.current, group = t?.firstElementChild as HTMLElement | null;
    if (!t || !group) return;
    const set = () => t.style.setProperty('--aom-dur', `${(group.offsetWidth / Math.max(1, t.parentElement!.clientWidth)) * secondsPerScreen}s`);
    const ro = new ResizeObserver(set);
    ro.observe(group); ro.observe(t.parentElement!);
    set();
    return () => ro.disconnect();
  }, [secondsPerScreen, text]);

  const items = Array.from({ length: pairs * 2 }, (_, i) => (i % 2 ? 'outlined' : 'filled'));
  const group = (hidden: boolean) => (
    <div className="aom-group" aria-hidden={hidden || undefined}>
      {items.map((kind, i) => <span key={i} className={`aom-word ${kind}`}>{text}</span>)}
    </div>
  );

  return (
    <div className={`aom${className ? ` ${className}` : ''}`} style={color ? ({ '--aom-color': color } as CSSProperties) : undefined}>
      <div className="aom-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image ? <img src={image} alt={alt} loading="lazy" decoding="async" /> : null}
      </div>
      {children ? <div className="aom-over">{children}</div> : null}
      <div className="aom-track" ref={track} aria-hidden="true">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
