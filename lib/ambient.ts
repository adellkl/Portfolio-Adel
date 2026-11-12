/* Musique d'ambiance du site (navigateur uniquement).
   Par défaut, une nappe douce générée en direct avec Web Audio : accords lents, basse, carillon discret
   et réverbération. Aucun fichier à charger, aucun droit d'auteur. Pour utiliser un morceau à la place,
   renseigner MUSIC.src dans lib/site.ts (ex. '/audio/ambiance.mp3' dans public/).
   Un seul moteur pour tout le site : il survit aux changements de page. */
import { MUSIC } from './site';

type Listener = (on: boolean) => void;
const KEY = 'music';
const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

// Ré majeur, lent et lumineux : Dmaj9 → Bm9 → Gmaj9 → Em9 (notes MIDI)
const CHORDS = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 57, 59], [52, 55, 59, 62, 66]];
const BELLS = [74, 76, 78, 81, 83, 86];
const BAR = 9; // secondes par accord

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let bus: AudioNode | null = null;
let audioEl: HTMLAudioElement | null = null;
let timers: number[] = [];
let playing = false;
let step = 0;
const listeners = new Set<Listener>();

export const isPlaying = () => playing;
export const onChange = (l: Listener) => { listeners.add(l); return () => { listeners.delete(l); }; };
const emit = () => listeners.forEach(l => l(playing));

export function wanted() { try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; } }
/** Le visiteur a-t-il déjà fait un choix explicite (bouton ou bandeau) ? */
export function chosen() { try { return localStorage.getItem(KEY) !== null; } catch { return false; } }
/** Le navigateur autorise-t-il le son sans geste ? (Firefox l'indique ; ailleurs on attend le 1er geste) */
export function autoplayAllowed() {
  const n = navigator as Navigator & { getAutoplayPolicy?: (t: string) => string };
  try { return n.getAutoplayPolicy?.('audiocontext') === 'allowed'; } catch { return false; }
}
export function remember(on: boolean) { try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* stockage indisponible */ } }

function impulse(c: AudioContext, seconds: number) {
  const len = Math.floor(c.sampleRate * seconds), buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  }
  return buf;
}

function setup() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
  if (MUSIC.src) {
    audioEl = new Audio(MUSIC.src); audioEl.loop = true; audioEl.crossOrigin = 'anonymous';
    ctx.createMediaElementSource(audioEl).connect(master);
    return;
  }
  const verb = ctx.createConvolver(); verb.buffer = impulse(ctx, 4);
  const wet = ctx.createGain(); wet.gain.value = .55;
  const dry = ctx.createGain(); dry.gain.value = .6;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; lp.Q.value = .3;
  lp.connect(dry).connect(master); lp.connect(verb).connect(wet).connect(master);
  bus = lp;
}

function voice(freq: number, t: number, dur: number, peak: number, type: OscillatorType, detune = 0) {
  if (!ctx || !bus) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq; o.detune.value = detune;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + dur * .35);
  g.gain.setValueAtTime(peak, t + dur * .6);
  g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(g).connect(bus); o.start(t); o.stop(t + dur + .1);
}

function chord() {
  if (!ctx || document.hidden) return; // onglet caché : pas d'accords empilés au retour
  const t = ctx.currentTime + .05, dur = BAR + 4; // les accords se chevauchent
  const notes = CHORDS[step++ % CHORDS.length];
  voice(mtof(notes[0] - 12), t, dur, .05, 'sine');
  notes.forEach((n, i) => {
    voice(mtof(n), t + i * .12, dur, .018, 'sine', -5);
    voice(mtof(n), t + i * .12, dur, .009, 'triangle', 6);
  });
}

function bell() {
  if (!ctx || !bus) return;
  const t = ctx.currentTime + .05, f = mtof(BELLS[Math.floor(Math.random() * BELLS.length)]);
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.012, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + 3.5);
  o.connect(g).connect(bus); o.start(t); o.stop(t + 3.6);
}

function schedule() {
  chord();
  timers.push(window.setInterval(chord, BAR * 1000));
  const nextBell = () => timers.push(window.setTimeout(() => { if (playing && !document.hidden) bell(); nextBell(); }, 2500 + Math.random() * 4500));
  nextBell();
}
function clear() { timers.forEach(t => { clearInterval(t); clearTimeout(t); }); timers = []; }

export const running = () => ctx?.state === 'running';

export async function play(save = true) {
  if (!ctx) setup();
  if (!ctx || !master) return;
  if (!playing) {
    playing = true; emit(); if (save) remember(true);
    if (!audioEl) schedule();
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(MUSIC.volume, now + 3);
  }
  // Peut échouer hors d'un geste valide (iOS) : on réessaiera au geste suivant
  await ctx.resume().catch(() => {});
  if (audioEl) await audioEl.play().catch(() => {});
}

export function pause(save = true) {
  if (!playing || !ctx || !master) return;
  playing = false; emit(); if (save) remember(false);
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 1.2);
  clear();
  window.setTimeout(() => { if (!playing) { audioEl?.pause(); ctx?.suspend().catch(() => {}); } }, 1300);
}

export const toggle = () => (playing ? pause() : play());

/* Onglet caché : on suspend (batterie), on reprend au retour */
let hiddenPaused = false;
export function onVisibility() {
  if (!ctx) return;
  if (document.hidden && playing) { hiddenPaused = true; ctx.suspend().catch(() => {}); audioEl?.pause(); }
  else if (!document.hidden && hiddenPaused) { hiddenPaused = false; ctx.resume().catch(() => {}); audioEl?.play().catch(() => {}); }
}
