'use client';
/* Bandeau d'arrivée : annonce la musique d'ambiance et propose de la laisser jouer ou de la couper.
   Affiché une fois par visite tant que le visiteur n'a pas fait de choix (le choix est mémorisé).
   Rendu hors de <nav> : son backdrop-filter ferait de la nav le repère des éléments fixes. */
import { useEffect, useRef, useState } from 'react';
import { chosen, isPlaying, onChange, pause, play, remember } from '@/lib/ambient';

const SESSION = 'music-hint';

export default function MusicHint() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [on, setOn] = useState(isPlaying);
  const hideTimer = useRef(0);

  useEffect(() => {
    const off = onChange(setOn);
    let seen = true;
    try { seen = chosen() || sessionStorage.getItem(SESSION) === '1'; sessionStorage.setItem(SESSION, '1'); } catch { /* stockage indisponible */ }
    if (seen) return off;
    // Après l'animation d'entrée de la page
    const t1 = window.setTimeout(() => setMounted(true), 1500);
    const t2 = window.setTimeout(() => setShow(true), 1550);
    return () => { off(); clearTimeout(t1); clearTimeout(t2); clearTimeout(hideTimer.current); };
  }, []);

  const close = () => { setShow(false); clearTimeout(hideTimer.current); hideTimer.current = window.setTimeout(() => setMounted(false), 400); };

  // Une fois la musique lancée, le bandeau se retire seul après quelques secondes
  useEffect(() => {
    if (!on || !show) return;
    const t = window.setTimeout(close, 9000);
    return () => clearTimeout(t);
  }, [on, show]);

  if (!mounted) return null;
  const keep = () => { play(); remember(true); close(); };
  const stop = () => { pause(); remember(false); close(); };

  return (
    <div className={`snd-hint${show ? ' show' : ''}${on ? ' on' : ''}`} role="status" aria-live="polite">
      <span className="snd-hint-ic" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <div className="snd-hint-t">
        <b>Musique d&apos;ambiance</b>
        <span>{on ? 'Elle accompagne votre visite.' : 'Elle démarre à votre premier clic.'}</span>
      </div>
      <div className="snd-hint-act">
        <button type="button" className="snd-hint-go" onClick={keep}>{on ? 'Laisser jouer' : 'Écouter'}</button>
        <button type="button" className="snd-hint-no" onClick={stop}>{on ? 'Couper' : 'Non merci'}</button>
      </div>
    </div>
  );
}
