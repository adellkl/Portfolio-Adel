'use client';
/* Texte qui roule : chaque formule monte mot par mot et laisse place à la suivante.
   Toutes les formules partagent la même cellule de grille, sur une seule ligne : la hauteur du titre ne bouge pas.
   Les formules plus larges que le titre (petits écrans) sont écartées ; la 1re est toujours gardée.
   Mouvement réduit : seule la première formule est affichée. */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { reduceMotion } from '@/lib/dom';

export default function TextRotator({ items, interval = 2600, startDelay = 2200 }: { items: string[]; interval?: number; startDelay?: number }) {
  const [{ cur, prev }, setState] = useState<{ cur: number; prev: number | null }>({ cur: 0, prev: null });
  const [fits, setFits] = useState<boolean[]>(() => items.map(() => true));
  const root = useRef<HTMLSpanElement>(null);
  const fitsRef = useRef(fits);

  /* Mesure : quelles formules tiennent sur une ligne dans la largeur du titre */
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const el = root.current, h = el?.closest('h1, h2, h3');
      if (!el || !h) return;
      // place disponible : le conteneur du titre (le titre lui-même s'élargit avec la formule), borné par son max-width
      const mw = parseFloat(getComputedStyle(h).maxWidth);
      const max = Math.min(h.parentElement?.clientWidth ?? h.clientWidth, Number.isFinite(mw) ? mw : Infinity);
      const next = [...el.children].map((c, k) => k === 0 || c.getBoundingClientRect().width <= max + .5);
      fitsRef.current = next;
      setFits(f => (f.join() === next.join() ? f : next));
    };
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    raf = requestAnimationFrame(measure);
    addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); };
  }, []);

  useEffect(() => {
    if (reduceMotion() || items.length < 2) return;
    let iv: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        if (document.hidden) return;
        setState(s => {
          let n = s.cur;
          for (let i = 0; i < items.length; i++) { n = (n + 1) % items.length; if (fitsRef.current[n]) break; }
          return n === s.cur ? s : { prev: s.cur, cur: n };
        });
      }, interval);
    }, startDelay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [items.length, interval, startDelay]);

  return (
    <span className="rot" ref={root}>
      {items.map((text, k) => (
        <span key={text} className={`rot-item${k === cur ? ' on' : k === prev ? ' out' : ''}${fits[k] ? '' : ' skip'}`} aria-hidden={k !== cur}>
          {text.split(' ').map((w, i) => <span key={i} style={{ '--k': i } as CSSProperties}>{i ? ' ' : ''}<span className="rw">{w}</span></span>)}
        </span>
      ))}
    </span>
  );
}
