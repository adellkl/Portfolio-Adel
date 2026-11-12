'use client';
/* Bouton son de la nav. Musique active par défaut : elle démarre tout de suite si le navigateur
   l'autorise, sinon à la première interaction (les navigateurs interdisent le son avant).
   Si le visiteur la coupe, son choix est mémorisé. */
import { useEffect, useState } from 'react';
import { autoplayAllowed, isPlaying, onChange, onVisibility, pause, play, running, toggle, wanted } from '@/lib/ambient';

export default function MusicToggle() {
  const [on, setOn] = useState(isPlaying);

  useEffect(() => {
    const off = onChange(setOn);
    // click / touchend / keydown : les gestes qui débloquent le son partout, iPhone compris
    const EVENTS = ['click', 'touchend', 'keydown'] as const;
    const first = async (e: Event) => {
      if ((e.target as Element | null)?.closest?.('.snd-btn, .snd-hint')) return; // le bouton et le bandeau gèrent eux-mêmes
      if (e instanceof KeyboardEvent && (e.metaKey || e.ctrlKey || e.altKey || e.key === 'Tab' || e.key === 'Escape')) return;
      if (!wanted()) { unbind(); return; }
      await play(false);
      if (running()) unbind();
    };
    const unbind = () => EVENTS.forEach(t => removeEventListener(t, first, true));
    if (!isPlaying()) EVENTS.forEach(t => addEventListener(t, first, true));
    if (wanted() && autoplayAllowed()) play(false).then(() => { if (running()) unbind(); });
    document.addEventListener('visibilitychange', onVisibility);
    return () => { off(); unbind(); document.removeEventListener('visibilitychange', onVisibility); pause(false); };
  }, []);

  return (
    <button type="button" className={`snd-btn${on ? ' on' : ''}`} onClick={toggle} aria-pressed={on}
      aria-label={on ? 'Couper la musique' : 'Lancer la musique'} title={on ? 'Couper la musique' : 'Lancer la musique'}>
      <span aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    </button>
  );
}
