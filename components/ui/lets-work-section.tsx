'use client';
/* « Travaillons ensemble » — adapté du composant LetsWorkTogether (Tailwind/shadcn)
   en CSS du site (voir « CONTACT : TRAVAILLONS ENSEMBLE » dans app/globals.css).
   Clic sur le titre → état « Parlons-en » : réserver un appel (page /rendez-vous) ou écrire un e-mail.
   /?type=…#contact (quiz des services) ouvre directement cet état avec le sujet prérempli. */
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CalendarDays, Mail } from 'lucide-react';
import { EMAIL, TYPES } from '@/lib/site';
import { reduceMotion } from '@/lib/dom';
import { briefText, loadBrief, type Brief } from '@/lib/brief';

export function LetsWorkTogether() {
  const [clicked, setClicked] = useState(false);
  const [done, setDone] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setBrief(loadBrief());
      const q = new URLSearchParams(location.search).get('type');
      if (q && TYPES[q]) { setType(q); setClicked(true); setDone(true); }
    });
    return () => { cancelAnimationFrame(id); clearTimeout(timer.current); };
  }, []);

  const open = () => {
    setClicked(true);
    timer.current = setTimeout(() => setDone(true), reduceMotion() ? 0 : 500);
  };

  const label = type ? TYPES[type][0] : '';
  const subject = `Projet${type ? ' — ' + label : ''}`;
  const body = `Bonjour Adel,\n\n${type ? `Je cherche quelqu'un pour ${label}.\n` : ''}${brief ? `\n${briefText(brief)}\n` : ''}`;
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className={`lwt${clicked ? ' clicked' : ''}${done ? ' done' : ''}`}>
      {/* État 2 : parlons-en */}
      <div className="lwt-done" aria-hidden={!done}>
        <div className="lwt-head">
          <span className="lwt-kicker">{type ? `Projet : ${label}` : 'Parfait'}</span>
          <h3>{type ? 'Parlons de votre projet' : 'Parlons-en'}</h3>
        </div>
        <div className="lwt-actions">
          <a className="lwt-cta" href="/rendez-vous" tabIndex={done ? 0 : -1}>
            <i className="bar"></i>
            <span className="lwt-btn"><CalendarDays size={18} strokeWidth={1.5} />Réserver un appel<ArrowUpRight size={18} strokeWidth={1.5} /></span>
            <i className="bar"></i>
          </a>
          <a className="lwt-mail" href={mailto} tabIndex={done ? 0 : -1}><Mail size={15} strokeWidth={1.5} />Écrire un e-mail</a>
        </div>
        <button className="lwt-sub mono" data-copy="" tabIndex={done ? 0 : -1}>{`${EMAIL} · copier`}</button>
      </div>

      {/* État 1 : invitation */}
      <div className="lwt-status"><span className="dot"></span>Disponible pour de nouveaux projets</div>
      <button className="lwt-trigger" onClick={open} aria-label="Travaillons ensemble : me contacter" tabIndex={clicked ? -1 : 0}>
        <span className="lwt-title" role="heading" aria-level={2}>
          <span><span>Travaillons</span></span>
          <span><span className="muted">ensemble</span></span>
        </span>
        <span className="lwt-circle"><ArrowUpRight size={28} strokeWidth={1.5} /></span>
        <i className="lwt-line l"></i><i className="lwt-line r"></i>
      </button>
      <div className="lwt-foot">
        <p>Un site vitrine, une application sur mesure ou une plateforme de réservation ? Parlez-moi de votre projet, on le construit ensemble.</p>
        <span className="mono">{EMAIL}</span>
      </div>
    </div>
  );
}
