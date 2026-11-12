'use client';
/* Réserver un créneau : informations · calendrier du mois · créneaux du jour.
   Avec Firebase : la demande est enregistrée (dashboard /admin) et le créneau est bloqué pour les autres visiteurs,
   puis la messagerie s'ouvre avec la demande prête. Sans Firebase : seulement la messagerie.
   Disponibilités : BOOKING dans lib/site.ts. */
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight, Clock, Globe, Video } from 'lucide-react';
import { BOOKING, EMAIL } from '@/lib/site';
import { briefText, loadBrief, type Brief } from '@/lib/brief';
import Logo from '@/components/Logo';
import { firebaseEnabled } from '@/lib/firebase';
import { db, slotId } from '@/lib/firebase-client';
import { collection, doc, getDocs, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';

const DOW = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
const pad = (n: number) => String(n).padStart(2, '0');
const key = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const isoDow = (d: Date) => ((d.getDay() + 6) % 7) + 1; // 1 = lundi
const toMin = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const fmtTime = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const longDate = (d: Date) => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

function slotsFor(d: Date, now: Date, taken?: Set<string>) {
  const out: number[] = [];
  for (let m = toMin(BOOKING.from); m + BOOKING.minutes <= toMin(BOOKING.to); m += BOOKING.step) {
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60);
    if (t.getTime() - now.getTime() >= BOOKING.noticeHours * 3600e3 && !taken?.has(slotId(key(d), fmtTime(m)))) out.push(m);
  }
  return out;
}

export function BookingSection() {
  const [now, setNow] = useState<Date | null>(null); // date du client uniquement (pas d'écart d'hydratation)
  const [month, setMonth] = useState<Date | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null); // réponses du quiz, si la personne l'a fait
  const [taken, setTaken] = useState<Set<string>>(() => new Set()); // créneaux déjà réservés
  const [state, setState] = useState<'idle' | 'saving' | 'error' | 'taken'>('idle');
  const panel = useRef<HTMLDivElement>(null);

  // Formulaire ouvert : le calendrier se réduit, la colonne du formulaire s'agrandit (transition CSS).
  // Classe posée à la main : le panneau porte aussi .reveal/.in, ajoutée hors de React.
  useEffect(() => { panel.current?.classList.toggle('is-form', slot !== null); }, [slot]);

  const available = useMemo(() => (d: Date) => {
    if (!now) return false;
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const limit = new Date(start); limit.setDate(limit.getDate() + BOOKING.horizonDays);
    return d >= start && d <= limit && BOOKING.days.includes(isoDow(d)) && slotsFor(d, now, taken).length > 0;
  }, [now, taken]);

  /* Créneaux pris du mois affiché (verrous publics, sans donnée personnelle) */
  useEffect(() => {
    if (!firebaseEnabled || !month) return;
    let alive = true;
    const from = key(month), to = key(new Date(month.getFullYear(), month.getMonth() + 1, 0));
    getDocs(query(collection(db(), 'slots'), where('date', '>=', from), where('date', '<=', to)))
      .then(snap => { if (alive) setTaken(prev => new Set([...prev, ...snap.docs.map(d => d.id)])); })
      .catch(() => { /* lecture impossible : on affiche tous les créneaux, l'enregistrement refusera les doublons */ });
    return () => { alive = false; };
  }, [month]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const n = new Date(); setNow(n); setBrief(loadBrief());
      const first = new Date(n.getFullYear(), n.getMonth(), n.getDate());
      for (let i = 0; i <= BOOKING.horizonDays; i++) {
        const d = new Date(first); d.setDate(first.getDate() + i);
        if (BOOKING.days.includes(isoDow(d)) && slotsFor(d, n).length) { setDay(d); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); return; }
      }
      setMonth(new Date(n.getFullYear(), n.getMonth(), 1));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* Grille du mois (lundi en premier) */
  const cells: (Date | null)[] = [];
  if (month) {
    const lead = isoDow(month) - 1;
    for (let i = 0; i < lead; i++) cells.push(null);
    const len = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= len; i++) cells.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  const thisMonth = now ? new Date(now.getFullYear(), now.getMonth(), 1) : null;
  const lastMonth = now ? (() => { const l = new Date(now); l.setDate(l.getDate() + BOOKING.horizonDays); return new Date(l.getFullYear(), l.getMonth(), 1); })() : null;
  const shift = (k: number) => month && setMonth(new Date(month.getFullYear(), month.getMonth() + k, 1));
  const slots = day && now ? slotsFor(day, now, taken) : [];

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!day || slot === null || state === 'saving') return;
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim().slice(0, 80), mail = String(f.get('email') || '').trim().slice(0, 120), msg = String(f.get('message') || '').trim().slice(0, 2000);
    const date = key(day), time = fmtTime(slot), id = slotId(date, time);

    // 1. Enregistrement (rendez-vous + verrou du créneau, en une seule écriture atomique)
    if (firebaseEnabled) {
      setState('saving');
      try {
        const b = writeBatch(db());
        b.set(doc(db(), 'appointments', id), { name, email: mail, message: msg, date, time, status: 'nouveau', createdAt: serverTimestamp(), ...(brief ? { brief: brief.recommendation } : {}) });
        b.set(doc(db(), 'slots', id), { date, time });
        await b.commit();
        setTaken(t => new Set(t).add(id));
      } catch (err) {
        // Créneau pris entre-temps (le verrou existe déjà) ou règles refusées
        const code = (err as { code?: string }).code;
        setState(code === 'permission-denied' ? 'taken' : 'error');
        if (code === 'permission-denied') setTaken(t => new Set(t).add(id));
        return;
      }
    }
    // 2. Messagerie, avec la demande prête
    const when = `${longDate(day)} à ${time}`;
    const subject = `Demande d'appel — ${when} (${name})`;
    const body = `Bonjour Adel,\n\nJe souhaite réserver un ${BOOKING.title.toLowerCase()} de ${BOOKING.minutes} minutes le ${when} (heure de Paris).\n${msg ? `\nMon projet : ${msg}\n` : ''}\n${name}\n${mail}`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setState('idle'); setSent(true);
  };

  return (
    <section className="block" id="rdv">
      <div className="wrap">
        <div className="panel book reveal" ref={panel}>
          <div className="book-info">
            <span className="book-logo"><Logo size={20} /></span>
            <span className="book-who">Adel Loukal</span>
            <h3>{BOOKING.title}</h3>
            <ul>
              <li><Clock size={16} strokeWidth={1.5} />{`${BOOKING.minutes} min`}</li>
              <li><Video size={16} strokeWidth={1.5} />{BOOKING.place}</li>
              <li><Globe size={16} strokeWidth={1.5} />{BOOKING.tz}</li>
            </ul>
            <p>Présentez votre besoin, je vous dis comment je m&apos;y prendrais et ce que ça implique.</p>
          </div>

          <div className="book-cal">
            <div className="book-month">
              <b>{month ? month.toLocaleDateString('fr-FR', { month: 'long' }) : ' '} <span className="muted">{month?.getFullYear()}</span></b>
              <span className="book-nav">
                <button aria-label="Mois précédent" onClick={() => shift(-1)} disabled={!month || !thisMonth || month <= thisMonth}><ChevronLeft size={18} strokeWidth={1.5} /></button>
                <button aria-label="Mois suivant" onClick={() => shift(1)} disabled={!month || !lastMonth || month >= lastMonth}><ChevronRight size={18} strokeWidth={1.5} /></button>
              </span>
            </div>
            <div className="book-grid">
              {DOW.map(d => <span className="book-dn" key={d}>{d.replace('.', '').toUpperCase()}.</span>)}
              {cells.map((d, i) => {
                if (!d) return <span key={`e${i}`}></span>;
                const ok = available(d), sel = !!day && key(d) === key(day), today = !!now && key(d) === key(now);
                return ok
                  ? <button key={key(d)} className={`bd av${sel ? ' sel' : ''}${today ? ' today' : ''}`} onClick={() => { setDay(d); setSlot(null); setSent(false); }} aria-pressed={sel} aria-label={longDate(d)}>{d.getDate()}</button>
                  : <span key={key(d)} className={`bd${today ? ' today' : ''}`}>{d.getDate()}</span>;
              })}
            </div>
          </div>

          <div className="book-slots">
            {slot === null || !day ? (
              <>
                <div className="book-day"><span>{day ? <><b>{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</b> {day.getDate()}</> : <b>Choisissez un jour</b>}</span><span className="mono">24 h</span></div>
                <div className="book-list">
                  {slots.map(m => <button key={m} className="book-slot" onClick={() => { setSlot(m); setSent(false); }}>{fmtTime(m)}</button>)}
                  {day && !slots.length ? <span className="book-empty">Plus de créneau ce jour-là.</span> : null}
                </div>
              </>
            ) : (
              <form className="book-form" onSubmit={submit} key={`${key(day)}-${slot}`}>
                <button type="button" className="book-back" onClick={() => { setSlot(null); setState('idle'); }}>← Changer d&apos;heure</button>
                <div className="book-when"><b>{longDate(day)}</b><span>{`${fmtTime(slot)} – ${fmtTime(slot + BOOKING.minutes)} · heure de Paris`}</span></div>
                <input name="name" placeholder="Votre nom" required aria-label="Votre nom" />
                <input name="email" type="email" placeholder="votre@email.com" required aria-label="Votre email" />
                {brief ? <div className="book-brief"><span className="mono">BRIEF DU QUIZ</span>{brief.recommendation}</div> : null}
                <textarea name="message" rows={brief ? 6 : 3} placeholder="Votre projet en deux mots (facultatif)" aria-label="Votre projet" defaultValue={brief ? briefText(brief) : undefined}></textarea>
                <button className="btn-lime" type="submit" disabled={state === 'saving'}>{state === 'saving' ? 'Envoi…' : 'Demander ce créneau'}</button>
                {sent ? <span className="sent mono">{firebaseEnabled ? '✓ Demande enregistrée. Votre messagerie s\'ouvre aussi avec la demande prête ; je vous confirme le créneau par e-mail.' : '✓ Votre messagerie s\'ouvre avec la demande prête. Je vous confirme le créneau par e-mail.'}</span> : null}
                {state === 'taken' ? <span className="sent mono book-err">Ce créneau vient d&apos;être réservé. Choisissez-en un autre.</span> : null}
                {state === 'error' ? <span className="sent mono book-err">L&apos;enregistrement a échoué. Réessayez, ou écrivez-moi directement.</span> : null}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
