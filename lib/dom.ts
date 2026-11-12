/* Comportements partagés (port de reference/main.js) — client uniquement */
import { EMAIL } from './site';

export const reduceMotion = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => typeof window !== 'undefined' && matchMedia('(pointer: fine)').matches;

export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s) as T | null;
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* Compteurs */
export function countUp(el: HTMLElement) {
  if (el.dataset.done) return; el.dataset.done = '1';
  const end = +(el.dataset.count || 0), suf = el.dataset.suffix || '', dur = reduceMotion() ? 0 : 1600, t0 = performance.now();
  const dec = (String(end).split('.')[1] || '').length;
  const fmt = (n: number) => {
    const s = dec ? n.toFixed(dec).replace('.', ',') : Math.round(n);
    return el.dataset.sep ? Number(Math.round(n)).toLocaleString('fr-FR') : s;
  };
  const f = (t: number) => {
    const p = Math.min(1, (t - t0) / (dur || 1)), e = 1 - Math.pow(1 - p, 4);
    el.textContent = fmt(end * e) + suf; if (p < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

/* Terminal qui s'écrit ligne par ligne */
export function playTerm(term: Element) {
  const reduce = reduceMotion();
  $$('.row', term).forEach((r, i) => setTimeout(() => r.classList.add('on'), reduce ? 0 : 300 + i * 420));
}

/* Apparition au scroll : l'observateur est (re)créé à chaque arrivée sur une route */
let io: IntersectionObserver | null = null;
export function createRevealObserver() {
  io?.disconnect();
  const obs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target as HTMLElement;
    t.classList.add('in');
    $$('[data-count]', t).forEach(countUp);
    if (t.matches('[data-count]')) countUp(t);
    $$('.term', t).forEach(playTerm);
    obs.unobserve(t);
  }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  io = obs;
  return obs;
}
export function observeReveals(root: ParentNode = document) {
  if (!io) return;
  $$('.reveal', root).forEach(el => { if (!el.classList.contains('in')) io!.observe(el); });
}
export function releaseRevealObserver(obs: IntersectionObserver) {
  obs.disconnect();
  if (io === obs) io = null;
}

/* Navigation avec transition de sortie (fournie par MotionRuntime) */
type Navigator = (href: string, delay: number) => void;
let navigator_: Navigator | null = null;
export function setNavigator(fn: Navigator | null) { navigator_ = fn; }
/** Ajoute .leaving puis change de page après `delay` ms */
export function leaveTo(href: string, delay: number) {
  if (navigator_) navigator_(href, delay);
  else { document.body.classList.add('leaving'); setTimeout(() => location.href = href, delay); }
}

/* Navigation commune (raccourcis, quiz) — navTo de interactions.js */
export function navTo(href: string) {
  const url = new URL(href, location.href);
  const same = url.pathname.replace(/\/$/, '/index.html') === location.pathname.replace(/\/$/, '/index.html') && url.search === location.search;
  if (same && url.hash) { $(url.hash)?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' }); return; }
  leaveTo(url.href, reduceMotion() ? 0 : 250);
}

/* Toast */
type ToastEl = HTMLDivElement & { _h?: ReturnType<typeof setTimeout> };
export function toast(msg: string) {
  let t = $<ToastEl>('#toast');
  if (!t) {
    t = document.createElement('div') as ToastEl; t.id = 'toast';
    t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translate(-50%,16px);opacity:0;z-index:120;background:var(--obsidian);box-shadow:rgba(255,255,255,.04) 0 0 0 1px inset,rgba(0,0,0,.6) 0 0 0 1px;border-radius:6px;padding:10px 14px;font-size:13px;color:var(--mist);transition:opacity .25s,transform .35s var(--ease)';
    document.body.appendChild(t);
  }
  const el = t;
  el.textContent = '✓ ' + msg;
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translate(-50%,0)'; });
  clearTimeout(el._h); el._h = setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translate(-50%,16px)'; }, 2200);
}

export function copyEmail() {
  navigator.clipboard?.writeText(EMAIL).catch(() => {});
  toast('Email copié dans le presse-papiers');
}
