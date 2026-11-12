'use client';
/* Hero de l'accueil : glow qui suit la souris, horloge, kanban vivant + glisser-déposer.
   Port du script inline de index.html et de interactions.js §2. Les cartes du kanban
   sont créées et déplacées hors de React (comme dans le prototype). */
import { useEffect, useRef } from 'react';
import SplitTitle from '@/components/SplitTitle';
import { $, $$, finePointer, reduceMotion, toast } from '@/lib/dom';
import { COLORS, type ColorKey } from '@/lib/projects';

const issues: [string, string, ColorKey, string][] = [
  ['MAR-142', 'Badges des réservations non lues', 'coral', 'La Marine'], ['AFC-031', 'Page vidéos YouTube', 'iris', 'Alpha Fight Club'],
  ['LEB-088', 'Rendez-vous d\'essayage', 'green', 'Lebsa Danah'], ['CGP-027', 'Pré-rendu des pages œuvres', 'lav', 'Class Gallery'],
  ['TPP-012', 'Prise de rendez-vous 24h/24', 'teal', 'Test Psychotechnique'], ['MAR-156', 'Traductions anglaises DeepL', 'coral', 'La Marine'],
];

/* Formules du titre (ligne grise) : toutes tiennent sur une ligne à 72 px (< 820 px, mesuré) */
const ROTATE = ['des produits web', 'des sites vitrines', 'des applications', 'des boutiques en ligne', 'des espaces clients', 'des outils sur mesure'];

export default function Hero() {
  const hero = useRef<HTMLElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const board = useRef<HTMLDivElement>(null);

  /* Horloge (client uniquement) */
  useEffect(() => {
    const tick = () => { if (clock.current) clock.current.textContent = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); };
    tick(); const iv = setInterval(tick, 30000);
    return () => clearInterval(iv);
  }, []);

  /* Glow */
  useEffect(() => {
    const el = hero.current!;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px');
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);

  /* Kanban */
  useEffect(() => {
    const reduce = reduceMotion();
    const cols = [0, 1, 2].map(i => $('#k' + i)!), counts = [0, 1, 2].map(i => $('#c' + i)!);
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (f: () => void, ms: number) => { const t = setTimeout(() => { timers.delete(t); f(); }, ms); timers.add(t); };
    const mk = ([id, t, c, l]: (typeof issues)[number]) => {
      const d = document.createElement('div'); d.className = 'card';
      d.innerHTML = `<span class="id mono">${id}</span><p>${t}</p><div class="tags"><span class="tag"><i style="background:${COLORS[c]}"></i>${l}</span></div>`; return d;
    };
    [[0, 1], [2, 3], [4]].forEach((ids, ci) => ids.forEach(i => cols[ci].appendChild(mk(issues[i]))));
    let next = 5, paused = false;
    const upd = () => cols.forEach((c, i) => counts[i].textContent = String(c.children.length)); upd();
    function kanbanStep() {
      [[1, 2], [0, 1]].forEach(([from, to], k) => later(() => {
        const card = cols[from].firstElementChild; if (!card) return;
        card.classList.add('leaving');
        later(() => {
          card.classList.remove('leaving'); card.classList.add('moving'); cols[to].prepend(card);
          later(() => card.classList.remove('moving'), 500);
          if (cols[2].children.length > 3) cols[2].lastElementChild!.remove(); upd();
        }, 350);
      }, k * 700));
      later(() => { const c = mk(issues[next++ % issues.length]); c.classList.add('moving'); cols[0].appendChild(c); upd(); }, 1600);
    }
    const iv = reduce ? undefined : setInterval(() => { if (!paused && !document.hidden) kanbanStep(); }, 3800);

    /* Glisser-déposer (interactions.js §2) */
    const offs: (() => void)[] = [];
    const b = board.current!;
    let ghost: HTMLElement | null = null;
    if (finePointer() && !reduce) {
      type Drag = { card: HTMLElement; x0: number; y0: number; started: boolean; ox?: number; oy?: number; ghost?: HTMLElement };
      let drag: Drag | null = null; let resumeT: ReturnType<typeof setTimeout> | undefined;
      const lists = $$('.cards', b);
      const down = (e: PointerEvent) => {
        const card = (e.target as Element).closest<HTMLElement>('.card'); if (!card || e.button !== 0) return;
        drag = { card, x0: e.clientX, y0: e.clientY, started: false };
        card.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (!drag) return;
        if (!drag.started) {
          if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 5) return;
          const r = drag.card.getBoundingClientRect();
          drag.ox = e.clientX - r.left; drag.oy = e.clientY - r.top;
          drag.ghost = drag.card.cloneNode(true) as HTMLElement; drag.ghost.classList.add('ghost'); drag.ghost.style.width = r.width + 'px';
          document.body.appendChild(drag.ghost); ghost = drag.ghost;
          drag.card.classList.add('placeholder'); drag.started = true;
          paused = true; clearTimeout(resumeT);
        }
        drag.ghost!.style.transform = `translate(${e.clientX - drag.ox!}px,${e.clientY - drag.oy!}px) rotate(2deg)`;
        const list = lists.find(l => { const r = l.parentElement!.getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right; });
        lists.forEach(l => l.parentElement!.classList.toggle('over', l === list));
        if (!list) return;
        const card = drag.card;
        const after = [...list.children].find(c => c !== card && e.clientY < c.getBoundingClientRect().top + (c as HTMLElement).offsetHeight / 2);
        if (after) { if (after.previousElementSibling !== card) list.insertBefore(card, after); }
        else if (list.lastElementChild !== card) list.appendChild(card);
        upd();
      };
      const end = () => {
        if (!drag) return;
        if (drag.started) {
          const r = drag.card.getBoundingClientRect(), g = drag.ghost!;
          g.style.transition = 'transform .25s var(--ease)';
          g.style.transform = `translate(${r.left}px,${r.top}px)`;
          const c = drag.card;
          later(() => { g.remove(); if (ghost === g) ghost = null; c.classList.remove('placeholder'); c.classList.add('moving'); later(() => c.classList.remove('moving'), 500); }, 250);
          lists.forEach(l => l.parentElement!.classList.remove('over'));
          upd();
          if (c.parentElement === lists[2]) toast(`${$('p', c)!.textContent} : livré`);
          resumeT = setTimeout(() => paused = false, 10000);
        }
        drag = null;
      };
      b.addEventListener('pointerdown', down);
      b.addEventListener('pointermove', move);
      b.addEventListener('pointerup', end);
      b.addEventListener('pointercancel', end);
      offs.push(() => {
        clearTimeout(resumeT);
        b.removeEventListener('pointerdown', down); b.removeEventListener('pointermove', move);
        b.removeEventListener('pointerup', end); b.removeEventListener('pointercancel', end);
      });
    }

    return () => {
      clearInterval(iv); timers.forEach(clearTimeout); offs.forEach(f => f());
      ghost?.remove();
      cols.forEach(c => c.replaceChildren()); counts.forEach(c => c.textContent = '');
    };
  }, []);

  return (
    <header className="hero" id="hero" ref={hero}>
      <div className="hero-glow"></div>
      <div className="wrap">
        <div className="status fade" style={{ transitionDelay: '.1s' }}><span className="dot"></span>Disponible pour de nouveaux projets</div>
        <div className="hero-row">
          <SplitTitle text="Je conçois et je code|_des produits web_|de bout en bout." rotate={ROTATE} />
          <div className="hero-side fade" style={{ transitionDelay: '.9s' }}>
            <p>Je crée des sites et applications web modernes, de l&apos;interface visible par vos clients jusqu&apos;aux fonctionnalités qui font fonctionner le projet : réservation, paiement, espace administrateur, comptes utilisateurs ou e-mails automatiques.</p>
            <a href="#projets" className="arrow-link">Voir mes projets <span>→</span></a>
          </div>
        </div>

        <div className="stage">
          <div className="floor"></div>
          <div className="frame">
            <div className="app">
              <aside className="side">
                <div className="ws"><i></i>Studio Adel</div>
                <div className="si"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" /><path d="M9.5 9.5 13 13" stroke="currentColor" strokeWidth="1.3" /></svg>Recherche</div>
                <div className="si"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.3" /></svg>Boîte de réception</div>
                <div className="si on"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h10M2 11h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>Projets en cours</div>
                <div className="sgroup">Projets</div>
                <div className="si"><i style={{ background: 'var(--iris)' }}></i>Alpha Fight Club</div>
                <div className="si"><i style={{ background: 'var(--green)' }}></i>Lebsa Danah</div>
                <div className="si"><i style={{ background: 'var(--coral)' }}></i>La Marine</div>
              </aside>
              <div className="main">
                <div className="bar"><div className="crumbs">Portfolio › <b>Cette semaine</b><span className="hint">↔ glissez une carte</span></div><span className="mono" style={{ fontSize: 12, color: 'var(--ash)' }} id="clock" ref={clock}>--:--</span></div>
                <div className="board" ref={board}>
                  <div className="col"><h5><span className="ring"></span>À faire <em id="c0"></em></h5><div className="cards" id="k0"></div></div>
                  <div className="col"><h5><span className="ring prog"></span>En cours <em id="c1"></em></h5><div className="cards" id="k1"></div></div>
                  <div className="col"><h5><span className="ring done"></span>Livré <em id="c2"></em></h5><div className="cards" id="k2"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
