'use client';
/* Rendez-vous : liste en temps réel, filtres, confirmation / annulation (libère le créneau), suppression. */
import { useMemo, useState } from 'react';
import { deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Check, Mail, Trash2, X } from 'lucide-react';
import { db, type Appointment } from '@/lib/firebase-client';
import { BOOKING } from '@/lib/site';
import { askConfirm } from './Confirm';

export type AppointmentRow = Appointment & { id: string };
type Row = AppointmentRow;
type Filter = 'avenir' | 'nouveaux' | 'passes' | 'tous';

export const longDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

function mailto(r: Row, kind: 'confirm' | 'cancel' | 'reply') {
  const when = `${longDate(r.date)} à ${r.time}`;
  const subject = kind === 'confirm' ? `Rendez-vous confirmé — ${when}` : kind === 'cancel' ? `Rendez-vous — ${when}` : `Votre demande d'appel — ${when}`;
  const body = kind === 'confirm'
    ? `Bonjour ${r.name},\n\nC'est noté : je vous appelle le ${when} (heure de Paris) pour notre ${BOOKING.title.toLowerCase()} de ${BOOKING.minutes} minutes.\n\nÀ bientôt,\nAdel`
    : kind === 'cancel'
      ? `Bonjour ${r.name},\n\nJe ne suis malheureusement pas disponible le ${when}. Pouvez-vous choisir un autre créneau sur la page rendez-vous du site ?\n\nMerci et à bientôt,\nAdel`
      : `Bonjour ${r.name},\n\n`;
  return `mailto:${r.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Appointments({ rows, error }: { rows: Row[] | null; error: string }) {
  const [filter, setFilter] = useState<Filter>('avenir');
  const t = today();

  const shown = useMemo(() => {
    if (!rows) return [];
    if (filter === 'avenir') return rows.filter(r => r.date >= t && r.status !== 'annulé');
    if (filter === 'nouveaux') return rows.filter(r => r.status === 'nouveau');
    if (filter === 'passes') return rows.filter(r => r.date < t).reverse();
    return rows;
  }, [rows, filter, t]);

  const setStatus = async (r: Row, status: Appointment['status']) => {
    if (status === 'annulé') {
      // Annuler libère le créneau pour les autres visiteurs
      const b = writeBatch(db());
      b.update(doc(db(), 'appointments', r.id), { status });
      b.delete(doc(db(), 'slots', r.id));
      await b.commit();
    } else await updateDoc(doc(db(), 'appointments', r.id), { status });
  };
  const remove = async (r: Row) => {
    if (!await askConfirm({ title: 'Supprimer ce rendez-vous ?', text: `La demande de ${r.name} (${longDate(r.date)} à ${r.time}) sera effacée et le créneau libéré. Cette action est définitive.`, confirm: 'Supprimer' })) return;
    await deleteDoc(doc(db(), 'appointments', r.id));
    await deleteDoc(doc(db(), 'slots', r.id)).catch(() => {});
  };

  const counts: Record<Filter, number> = {
    avenir: rows?.filter(r => r.date >= t && r.status !== 'annulé').length ?? 0,
    nouveaux: rows?.filter(r => r.status === 'nouveau').length ?? 0,
    passes: rows?.filter(r => r.date < t).length ?? 0,
    tous: rows?.length ?? 0,
  };

  return (
    <section>
      <div className="adm-head">
        <div><h1>Rendez-vous</h1><p className="adm-muted">Les demandes d&apos;appel envoyées depuis la page rendez-vous.</p></div>
        <div className="filters" role="tablist">
          {([['avenir', 'À venir'], ['nouveaux', 'À traiter'], ['passes', 'Passés'], ['tous', 'Tous']] as [Filter, string][]).map(([k, l]) =>
            <button key={k} className={`vchip${filter === k ? ' on' : ''}`} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}>{l}<em>{counts[k]}</em></button>)}
        </div>
      </div>

      {error ? <p className="adm-err">{error}</p> : null}
      {!rows ? <p className="adm-muted">Chargement…</p> : !shown.length ? <div className="adm-empty panel">Aucun rendez-vous ici pour l&apos;instant.</div> : (
        <ul className="adm-list">
          {shown.map(r => (
            <li key={r.id} className={`adm-rdv panel st-${r.status === 'annulé' ? 'cancel' : r.status === 'confirmé' ? 'ok' : 'new'}`}>
              <div className="adm-rdv-when">
                <b>{longDate(r.date)}</b>
                <span className="mono">{`${r.time} · ${BOOKING.minutes} min`}</span>
                <span className="adm-status"><i></i>{r.status}</span>
              </div>
              <div className="adm-rdv-who">
                <b>{r.name}</b>
                <a href={mailto(r, 'reply')}>{r.email}</a>
                {r.brief ? <span className="tag"><i style={{ background: 'var(--lime)' }}></i>{`Quiz : ${r.brief}`}</span> : null}
                {r.message ? <p>{r.message}</p> : null}
                {r.createdAt ? <span className="adm-muted mono">{`Reçu le ${r.createdAt.toDate().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}`}</span> : null}
              </div>
              <div className="adm-rdv-act">
                {r.status !== 'confirmé' ? <a className="ghost" href={mailto(r, 'confirm')} onClick={() => setStatus(r, 'confirmé')}><Check size={14} />Confirmer</a> : null}
                {r.status !== 'annulé' ? <a className="ghost" href={mailto(r, 'cancel')} onClick={() => setStatus(r, 'annulé')}><X size={14} />Refuser</a> : null}
                <a className="ghost" href={mailto(r, 'reply')}><Mail size={14} />Répondre</a>
                <button className="ghost adm-danger" onClick={() => remove(r)} aria-label="Supprimer"><Trash2 size={14} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
