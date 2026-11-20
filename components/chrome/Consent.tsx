'use client';
/* Mesure d'audience (Google Tag Manager → Google Analytics 4) avec consentement, conforme CNIL :
   - le mode consentement de Google est « refusé » par défaut (script dans <head>, app/layout.tsx) ;
   - rien n'est mesuré tant que le visiteur n'a pas cliqué « Accepter » ;
   - le choix est gardé 6 mois (localStorage) et modifiable via « Gérer les cookies » (pied de page) ;
   - pas de bandeau ni de mesure sur le dashboard /admin. */
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CONSENT_KEY } from '@/lib/site';

const SIX_MONTHS = 1000 * 60 * 60 * 24 * 182;
type Choice = { v: 'granted' | 'denied'; at: number };

declare global { interface Window { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void } }

export function readConsent(): Choice | null {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null') as Choice | null;
    return c && Date.now() - c.at < SIX_MONTHS ? c : null;
  } catch { return null; }
}

/* window.gtag est défini dans <head> (app/layout.tsx), avant Tag Manager */
const apply = (v: Choice['v']) => window.gtag?.('consent', 'update', { analytics_storage: v });

export default function Consent() {
  const admin = usePathname().startsWith('/admin');
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (admin) return;
    const c = readConsent();
    let t = 0;
    if (!c) t = window.setTimeout(() => { setOpen(true); requestAnimationFrame(() => setShown(true)); }, 1200);
    const reopen = () => { setOpen(true); requestAnimationFrame(() => setShown(true)); };
    addEventListener('consent:open', reopen);
    return () => { clearTimeout(t); removeEventListener('consent:open', reopen); };
  }, [admin]);

  // Pendant que le bandeau est ouvert, le bandeau « musique » attend (même emplacement sur mobile)
  useEffect(() => { document.documentElement.classList.toggle('consent-open', open); }, [open]);

  if (admin || !open) return null;
  const choose = (v: Choice['v']) => {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ v, at: Date.now() })); } catch { /* stockage indisponible */ }
    apply(v);
    setShown(false);
    window.setTimeout(() => setOpen(false), 350);
  };

  return (
    <div className={`cookie${shown ? ' show' : ''}`} role="dialog" aria-live="polite" aria-label="Cookies de mesure d'audience">
      <p><b>Mesure d&apos;audience</b>J&apos;utilise Google Analytics pour savoir quelles pages vous sont utiles. Rien n&apos;est mesuré sans votre accord. <a href="/confidentialite">En savoir plus</a></p>
      <div className="cookie-act">
        <button type="button" className="cookie-no" onClick={() => choose('denied')}>Refuser</button>
        <button type="button" className="cookie-yes" onClick={() => choose('granted')}>Accepter</button>
      </div>
    </div>
  );
}
