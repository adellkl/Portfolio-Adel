/* Visuels (maquettes d'interface animées). Planning et Calendar : port 1:1 de reference/projects.js ;
   Permis, Reservations et Catalogue reprennent exactement la structure (et le CSS) de livret / prospect.
   Non interactifs : les <button> restent inertes. */
import type { CSSProperties, JSX } from 'react';
import { COLORS, type ColorKey, type VisualKey } from '@/lib/projects';

const v = (o: Record<string, string | number>) => o as CSSProperties;

/* Test Psychotechnique Permis : structure « téléphone » (.viz-mobile) */
export function Permis() {
  return (
    <div className="viz-mobile" data-viz="permis">
      <div className="phone">
        <div className="notch"></div>
        <h6>Centre 2e Chance</h6><div className="sub">Test psychotechnique · Colombes</div>
        <div className="days"><span className="on">Invalidation</span><span>Suspension</span><span>Annulation</span></div>
        {[['Tarif', '80 € tout compris'], ['Paiement', 'sur place'], ['Horaires', '9h–20h · 7j/7'], ['Échec', '2e chance offerte']].map(([a, b], i) =>
          <div className="slot" style={v({ '--i': i })} key={i}>{a}<span>{b}</span></div>)}
        <button className="cta" style={{ width: '100%', border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>Prendre rendez-vous</button>
      </div>
      <div className="mobile-side">
        {([['TPP-01', 'Rendez-vous en ligne 24h/24', 'green', 'Réservation'], ['TPP-02', 'Paiement sur place, sans acompte', 'iris', 'Paiement'], ['TPP-03', 'Avis Google 5,0 / 5', 'lav', 'Confiance']] as [string, string, ColorKey, string][]).map(([id, t, c, l], i) =>
          <div className="card" style={v({ '--i': i })} key={i}><span className="id mono">{id}</span><p>{t}</p><div className="tags"><span className="tag"><i style={{ background: COLORS[c] }}></i>{l}</span></div></div>)}
      </div>
    </div>
  );
}

export function Calendar() {
  return (
    <div className="viz-cal" data-viz="calendar">
      <div className="cal-head"><div><small>Caftan « Nour » · disponibilités</small><b>Juin 2026</b></div><span className="tag"><i style={{ background: 'var(--green)' }}></i>Disponible</span></div>
      <div className="cal">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span className="dn" key={`dn${i}`}>{d}</span>)}
        {Array.from({ length: 30 }, (_, i) => {
          const n = i + 1, busy = [6, 7, 13, 14, 20, 21, 27].includes(n), pick = n === 18;
          return <span className={`d${busy ? ' busy' : ''}${pick ? ' pick' : ''}`} style={v({ '--i': i })} key={i}>{n}</span>;
        })}</div>
      <div className="cal-foot"><span className="mono">ESSAYAGE</span> <span className="cal-when">Jeudi 18 juin · 14:30</span> <button className="pill cal-ok" style={{ marginLeft: 'auto', border: 0, cursor: 'pointer', fontFamily: 'inherit' }}>Confirmer</button></div>
    </div>
  );
}

export function Planning() {
  return (
    <div className="viz-table" data-viz="planning">
      <div className="thead"><span>Jour</span><span>Cours</span><span>Public</span><span>Horaire</span></div>
      {([['Lundi', 'Grappling No-Gi', 'iris', 'Adultes', '20h–22h'], ['Lundi', 'JJB No-Gi', 'green', '6–14 ans', '17h–19h'], ['Mercredi', 'Grappling No-Gi', 'iris', 'Adultes', '20h–22h'], ['Vendredi', 'Compétition', 'coral', 'Adultes', '18h30–20h'], ['Dimanche', 'Open mat', 'lav', 'Tous', '10h–12h']] as [string, string, ColorKey, string, string][])
        .map(([d, c, col, p, h], i) => <div className="tr" style={v({ '--i': i })} key={i}><span className="mono">{d}</span><span>{c}</span><span className="tag"><i style={{ background: COLORS[col] }}></i>{p}</span><span className="mono">{h}</span></div>)}
    </div>
  );
}

/* La Marine : tableau des réservations (structure .viz-table) */
export function Reservations() {
  return (
    <div className="viz-table" data-viz="reservations">
      <div className="thead"><span>Jour</span><span>Réservation</span><span>Statut</span><span>Heure</span></div>
      {([['Vendredi', 'Table · 4 couverts', 'green', 'Confirmée', '19h30'], ['Vendredi', 'Table · 2 couverts', 'iris', 'Nouvelle', '20h00'], ['Samedi', 'Table · 6 couverts', 'green', 'Confirmée', '12h30'], ['Samedi', 'Devis traiteur · mariage', 'lav', 'À rappeler', '—'], ['Dimanche', 'Table · 2 couverts', 'coral', 'Annulée', '13h00']] as [string, string, ColorKey, string, string][])
        .map(([d, c, col, p, h], i) => <div className="tr" style={v({ '--i': i })} key={i}><span className="mono">{d}</span><span>{c}</span><span className="tag"><i style={{ background: COLORS[col] }}></i>{p}</span><span className="mono">{h}</span></div>)}
    </div>
  );
}

/* Class Gallery : extrait du catalogue (structure .viz-table) */
export function Catalogue() {
  return (
    <div className="viz-table" data-viz="catalogue">
      <div className="thead"><span>Artiste</span><span>Œuvre</span><span>Matière</span><span>Statut</span></div>
      {([['Couvert', 'La sieste', 'green', 'Bois', 'Disponible'], ['Couvert', 'L\'Union des cinq', 'green', 'Bois', 'Vendue'], ['Irini', 'Belle de Face', 'iris', 'Peinture', 'Disponible'], ['Irini', 'Tenue de soirée', 'iris', 'Peinture', 'Vendue'], ['Irini', 'Blue Danse', 'iris', 'Peinture', 'Disponible']] as [string, string, ColorKey, string, string][])
        .map(([a, t, col, m, st], i) => <div className="tr" style={v({ '--i': i })} key={i}><span className="mono">{a}</span><span>{t}</span><span className="tag"><i style={{ background: COLORS[col] }}></i>{m}</span><span className="mono">{st}</span></div>)}
    </div>
  );
}

export const VISUALS: Record<VisualKey, () => JSX.Element> = {
  planning: Planning, calendar: Calendar, reservations: Reservations, catalogue: Catalogue, permis: Permis,
};
