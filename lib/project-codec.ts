/* Conversion des projets pour Firestore, qui refuse les tableaux imbriqués et les valeurs `undefined` :
   les listes de tuples du code ([nom, couleur]…) deviennent des listes d'objets, et inversement à la lecture. */
import type { ColorKey, FontKey, Project, VisualKey } from './projects';

type Obj = Record<string, unknown>;
const s = (v: unknown) => (typeof v === 'string' ? v : '');
const arr = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(x => x && typeof x === 'object') as Obj[] : []);
/** Retire les `undefined` (refusés par Firestore) */
const strip = <T,>(o: T): T => JSON.parse(JSON.stringify(o));

export function toStored(p: Project & { order?: number; published?: boolean }) {
  return strip({
    ...p,
    stack: p.stack.map(([name, color]) => ({ name, color: color ?? null })),
    problems: p.problems.map(([text, color, label]) => ({ text, color, label })),
    approach: p.approach.map(([title, text]) => ({ title, text })),
    results: p.results.map(([value, suffix, label, prefix]) => ({ value, suffix, label, prefix: prefix ?? '' })),
    gallery: (p.gallery ?? []).map(([label, kind, src]) => ({ label, kind, src: src ?? '' })),
    charte: p.charte ? {
      intent: p.charte.intent,
      fonts: p.charte.fonts.map(([role, family, note]) => ({ role, family, note })),
      colors: p.charte.colors.map(([name, hex, role]) => ({ name, hex, role })),
    } : null,
  });
}

export function fromStored(d: Obj, slug: string): Project & { order?: number; published?: boolean } {
  const charte = d.charte as Obj | null | undefined;
  return {
    slug, id: s(d.id), title: s(d.title), tagline: s(d.tagline), category: s(d.category), year: s(d.year), period: s(d.period),
    status: s(d.status), role: s(d.role), client: s(d.client), url: s(d.url), urlLabel: s(d.urlLabel),
    visual: (s(d.visual) || 'image') as VisualKey, summary: s(d.summary), context: s(d.context),
    stack: arr(d.stack).map(x => [s(x.name), (s(x.color) || undefined) as ColorKey | undefined]),
    problems: arr(d.problems).map(x => [s(x.text), (s(x.color) || 'green') as ColorKey, s(x.label)]),
    approach: arr(d.approach).map(x => [s(x.title), s(x.text)]),
    results: arr(d.results).map(x => { const pre = s(x.prefix); return pre ? [Number(x.value) || 0, s(x.suffix), s(x.label), pre] : [Number(x.value) || 0, s(x.suffix), s(x.label)]; }),
    gallery: arr(d.gallery).map(x => [s(x.label), x.kind === 'm' ? 'm' : 'd', s(x.src) || undefined]),
    charte: charte ? {
      intent: s(charte.intent),
      fonts: arr(charte.fonts).map(x => [s(x.role), s(x.family) as FontKey | string, s(x.note)]),
      colors: arr(charte.colors).map(x => [s(x.name), s(x.hex), s(x.role)]),
    } : undefined,
    order: typeof d.order === 'number' ? d.order : undefined,
    published: d.published === true,
  };
}
