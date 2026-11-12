'use client';
/* Éditeur de projet : tous les champs d'une étude de cas, photos envoyées dans Firebase Storage. */
import { useState, type ReactNode } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { db, refreshSite, storage } from '@/lib/firebase-client';
import { COLORS, type ColorKey, type Project, type VisualKey } from '@/lib/projects';
import { toStored } from '@/lib/project-codec';

export type Draft = Project;
const COLOR_KEYS = Object.keys(COLORS) as ColorKey[];
const STATUSES = ['En ligne', 'En développement', 'Outil privé', 'Terminé'];
const VISUAL_OPTIONS: [VisualKey, string][] = [['image', '1re photo de la galerie'], ['planning', 'Maquette : planning'], ['calendar', 'Maquette : calendrier'], ['reservations', 'Maquette : réservations'], ['catalogue', 'Maquette : catalogue'], ['permis', 'Maquette : téléphone'], ['livret', 'Maquette : livret (téléphone)']];

const slugify = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

const empty = (order: number): Draft & { order: number; published: boolean } => ({
  slug: '', id: `PRJ-${String(order).padStart(2, '0')}`, title: '', tagline: '', category: 'Site vitrine', year: String(new Date().getFullYear()), period: '', status: 'En ligne',
  role: 'Design & développement', client: '', url: '', urlLabel: '', stack: [['Next.js', 'teal']], visual: 'image', summary: '', context: '',
  problems: [['', 'green', ''], ['', 'iris', ''], ['', 'coral', '']], approach: [['', ''], ['', ''], ['', ''], ['', '']], results: [[0, '', ''], [0, '', ''], [0, '', '']],
  gallery: [], charte: { intent: '', fonts: [['Titres', '', ''], ['Texte', '', '']], colors: [['', '#FFFFFF', ''], ['', '#000000', '']] }, order, published: false,
});

export default function ProjectEditor({ initial, nextOrder, existing, onClose }: {
  initial: (Draft & { order?: number; published?: boolean }) | null; nextOrder: number; existing: string[]; onClose: () => void;
}) {
  const isNew = !initial;
  const [p, setP] = useState(() => initial ? { ...empty(nextOrder), ...initial, charte: initial.charte ?? empty(0).charte, gallery: initial.gallery ?? [] } : empty(nextOrder));
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof typeof p>(k: K, v: (typeof p)[K]) => setP(prev => ({ ...prev, [k]: v }));
  const setTitle = (v: string) => setP(prev => ({ ...prev, title: v, ...(slugTouched ? {} : { slug: slugify(v) }) }));

  const upload = async (files: FileList | null) => {
    if (!files?.length || !p.slug) { if (!p.slug) setMsg({ ok: false, text: 'Indiquez d\'abord un titre (l\'adresse du projet sert de dossier aux photos).' }); return; }
    setUploading(true); setMsg(null);
    try {
      const added: [string, 'd' | 'm', string][] = [];
      for (const f of [...files].slice(0, 8 - (p.gallery?.length ?? 0))) {
        const r = ref(storage(), `projets/${p.slug}/${Date.now()}-${slugify(f.name.replace(/\.[^.]+$/, ''))}.${(f.name.split('.').pop() || 'jpg').toLowerCase()}`);
        await uploadBytes(r, f, { contentType: f.type, cacheControl: 'public, max-age=31536000, immutable' });
        const img = await new Promise<HTMLImageElement>(res => { const i = new Image(); i.onload = () => res(i); i.src = URL.createObjectURL(f); });
        added.push([f.name.replace(/\.[^.]+$/, ''), img.naturalHeight > img.naturalWidth ? 'm' : 'd', await getDownloadURL(r)]);
      }
      set('gallery', [...(p.gallery ?? []), ...added]);
    } catch (e) { setMsg({ ok: false, text: `Envoi impossible : ${(e as Error).message}` }); }
    setUploading(false);
  };

  const save = async () => {
    const errs = [];
    if (!p.title.trim()) errs.push('le titre');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) errs.push('une adresse valide (lettres minuscules, chiffres, tirets)');
    if (isNew && existing.includes(p.slug)) errs.push('une adresse qui n\'existe pas déjà');
    if (!p.tagline.trim()) errs.push('l\'accroche');
    if (!p.summary.trim()) errs.push('le résumé');
    if (p.visual === 'image' && !p.gallery?.length) errs.push('au moins une photo (ou une maquette comme visuel)');
    if (errs.length) { setMsg({ ok: false, text: `Il manque ${errs.join(', ')}.` }); return; }
    setSaving(true); setMsg(null);
    // Nettoyage : lignes vides retirées
    const clean = {
      ...p,
      stack: p.stack.filter(([n]) => n.trim()),
      problems: p.problems.filter(([t]) => t.trim()),
      approach: p.approach.filter(([t, d]) => t.trim() || d.trim()),
      results: p.results.filter(([, , l]) => l.trim()).map(([v, s, l, pre]) => (pre ? [Number(v) || 0, s, l, pre] : [Number(v) || 0, s, l])),
      charte: p.charte && (p.charte.intent.trim() || p.charte.colors.some(([n]) => n.trim()))
        ? { intent: p.charte.intent, fonts: p.charte.fonts.filter(([, f]) => f.trim()), colors: p.charte.colors.filter(([n]) => n.trim()) } : undefined,
      urlLabel: p.urlLabel || p.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
    } as Project & { order: number; published: boolean };
    try { await setDoc(doc(db(), 'projects', p.slug), { ...toStored(clean), updatedAt: serverTimestamp() }); await refreshSite(); setMsg({ ok: true, text: p.published ? 'Enregistré et publié sur le site.' : 'Enregistré en brouillon.' }); if (isNew) setTimeout(onClose, 700); }
    catch (e) { setMsg({ ok: false, text: `Enregistrement impossible : ${(e as Error).message}` }); }
    setSaving(false);
  };

  const g = p.gallery ?? [];
  const moveImg = (i: number, d: -1 | 1) => { const n = [...g]; [n[i], n[i + d]] = [n[i + d], n[i]]; set('gallery', n); };

  return (
    <section className="adm-editor">
      <div className="adm-head">
        <div>
          <button className="adm-link" onClick={onClose}><ArrowLeft size={14} />Projets</button>
          <h1>{isNew ? 'Nouveau projet' : p.title}</h1>
        </div>
        <div className="adm-rdv-act">
          <label className="adm-switch"><input type="checkbox" checked={p.published} onChange={e => set('published', e.target.checked)} /><span>{p.published ? 'Publié' : 'Brouillon'}</span></label>
          <button className="btn-lime" onClick={save} disabled={saving || uploading}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </div>
      {msg ? <p className={msg.ok ? 'adm-ok' : 'adm-err'}>{msg.text}</p> : null}

      <Group title="Général">
        <Field label="Titre"><input value={p.title} onChange={e => setTitle(e.target.value)} placeholder="Alpha Fight Club" /></Field>
        <Field label="Adresse de la page" hint={`/projets/${p.slug || '…'}`}><input value={p.slug} disabled={!isNew} onChange={e => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} /></Field>
        <Field label="Accroche" wide><input value={p.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Le site d'un club de grappling à Saint-Ouen" /></Field>
        <Field label="Référence"><input value={p.id} onChange={e => set('id', e.target.value)} /></Field>
        <Field label="Catégorie"><input value={p.category} onChange={e => set('category', e.target.value)} /></Field>
        <Field label="Année"><input value={p.year} onChange={e => set('year', e.target.value)} /></Field>
        <Field label="Période"><input value={p.period} onChange={e => set('period', e.target.value)} placeholder="Oct. → nov. 2026" /></Field>
        <Field label="Statut"><select value={p.status} onChange={e => set('status', e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></Field>
        <Field label="Rôle"><input value={p.role} onChange={e => set('role', e.target.value)} /></Field>
        <Field label="Client"><input value={p.client} onChange={e => set('client', e.target.value)} /></Field>
        <Field label="Site en ligne"><input value={p.url} onChange={e => set('url', e.target.value)} placeholder="https://…" /></Field>
        <Field label="Visuel (accueil et en-tête)"><select value={p.visual} onChange={e => set('visual', e.target.value as VisualKey)}>{VISUAL_OPTIONS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
      </Group>

      <Group title="Textes">
        <Field label="Résumé" wide><textarea rows={3} value={p.summary} onChange={e => set('summary', e.target.value)} /></Field>
        <Field label="Contexte" wide hint="Mettez un passage en valeur avec <strong>…</strong>"><textarea rows={4} value={p.context} onChange={e => set('context', e.target.value)} /></Field>
      </Group>

      <Group title="Stack">
        <Rows<[string, ColorKey?]> items={p.stack} onChange={v => set('stack', v)} make={() => ['', 'teal']} render={(r, up) => <>
          <input value={r[0]} onChange={e => up([e.target.value, r[1]])} placeholder="Next.js" />
          <ColorSelect value={r[1]} onChange={c => up([r[0], c])} allowNone />
        </>} />
      </Group>

      <Group title="Enjeux">
        <Rows<[string, ColorKey, string]> items={p.problems} onChange={v => set('problems', v)} make={() => ['', 'green', '']} render={(r, up) => <>
          <input className="grow" value={r[0]} onChange={e => up([e.target.value, r[1], r[2]])} placeholder="Ce qu'il fallait résoudre" />
          <input value={r[2]} onChange={e => up([r[0], r[1], e.target.value])} placeholder="Étiquette" style={{ maxWidth: 140 }} />
          <ColorSelect value={r[1]} onChange={c => up([r[0], c ?? 'green', r[2]])} />
        </>} />
      </Group>

      <Group title="Approche">
        <Rows<[string, string]> items={p.approach} onChange={v => set('approach', v)} make={() => ['', '']} render={(r, up) => <>
          <input value={r[0]} onChange={e => up([e.target.value, r[1]])} placeholder="Titre" style={{ maxWidth: 220 }} />
          <input className="grow" value={r[1]} onChange={e => up([r[0], e.target.value])} placeholder="Ce que j'ai fait" />
        </>} />
      </Group>

      <Group title="En chiffres">
        <Rows<[number, string, string, string?]> items={p.results} onChange={v => set('results', v)} make={() => [0, '', '']} render={(r, up) => <>
          <input value={r[3] ?? ''} onChange={e => up([r[0], r[1], r[2], e.target.value || undefined])} placeholder="+" style={{ maxWidth: 56 }} aria-label="Préfixe" />
          <input type="number" value={r[0]} onChange={e => up([Number(e.target.value), r[1], r[2], r[3]])} style={{ maxWidth: 110 }} aria-label="Valeur" />
          <input value={r[1]} onChange={e => up([r[0], e.target.value, r[2], r[3]])} placeholder=" %" style={{ maxWidth: 70 }} aria-label="Suffixe" />
          <input className="grow" value={r[2]} onChange={e => up([r[0], r[1], e.target.value, r[3]])} placeholder="de réservations en plus" aria-label="Libellé" />
        </>} />
      </Group>

      <Group title="Galerie" hint="5 photos conseillées (captures ordinateur et mobile). La 1re sert de couverture.">
        <div className="adm-gallery">
          {g.map(([label, kind, src], i) => (
            <div className="adm-shot" key={(src ?? '') + i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src || `/projets/${p.slug}/${i + 1}.jpg`} alt="" />
              <input value={label} onChange={e => { const n = [...g]; n[i] = [e.target.value, kind, src]; set('gallery', n); }} aria-label="Légende" />
              <div className="adm-shot-act">
                <select value={kind} onChange={e => { const n = [...g]; n[i] = [label, e.target.value as 'd' | 'm', src]; set('gallery', n); }} aria-label="Format">
                  <option value="d">Ordinateur</option><option value="m">Mobile</option>
                </select>
                <button onClick={() => moveImg(i, -1)} disabled={!i} aria-label="Avant"><ArrowUp size={13} /></button>
                <button onClick={() => moveImg(i, 1)} disabled={i === g.length - 1} aria-label="Après"><ArrowDown size={13} /></button>
                <button onClick={() => set('gallery', g.filter((_, k) => k !== i))} aria-label="Retirer"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          <label className={`adm-drop${uploading ? ' busy' : ''}`}>
            <input type="file" accept="image/*" multiple onChange={e => { upload(e.target.files); e.target.value = ''; }} disabled={uploading} />
            <ImagePlus size={20} strokeWidth={1.5} />{uploading ? 'Envoi…' : 'Ajouter des photos'}
          </label>
        </div>
      </Group>

      <Group title="Charte graphique">
        <Field label="Intention" wide><textarea rows={2} value={p.charte?.intent ?? ''} onChange={e => set('charte', { ...p.charte!, intent: e.target.value })} placeholder="Une direction artistique…" /></Field>
        <span className="adm-sub">Typographies</span>
        <Rows<[string, string, string]> items={p.charte!.fonts} onChange={v => set('charte', { ...p.charte!, fonts: v })} make={() => ['', '', '']} render={(r, up) => <>
          <input value={r[0]} onChange={e => up([e.target.value, r[1], r[2]])} placeholder="Titres" style={{ maxWidth: 140 }} />
          <input value={r[1]} onChange={e => up([r[0], e.target.value, r[2]])} placeholder="Nom de la police" style={{ maxWidth: 200 }} />
          <input className="grow" value={r[2]} onChange={e => up([r[0], r[1], e.target.value])} placeholder="Remarque (graisse, usage…)" />
        </>} />
        <span className="adm-sub">Couleurs</span>
        <Rows<[string, string, string]> items={p.charte!.colors} onChange={v => set('charte', { ...p.charte!, colors: v })} make={() => ['', '#FFFFFF', '']} render={(r, up) => <>
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(r[1]) ? r[1] : '#000000'} onChange={e => up([r[0], e.target.value.toUpperCase(), r[2]])} aria-label="Couleur" />
          <input value={r[1]} onChange={e => up([r[0], e.target.value, r[2]])} style={{ maxWidth: 100 }} aria-label="Code" />
          <input value={r[0]} onChange={e => up([e.target.value, r[1], r[2]])} placeholder="Nom" style={{ maxWidth: 160 }} />
          <input className="grow" value={r[2]} onChange={e => up([r[0], r[1], e.target.value])} placeholder="Rôle (fond, accent…)" />
        </>} />
      </Group>

      <div className="adm-foot">
        <button className="ghost" onClick={onClose}>Retour</button>
        <button className="btn-lime" onClick={save} disabled={saving || uploading}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </section>
  );
}

function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return <fieldset className="adm-group panel"><legend>{title}</legend>{hint ? <p className="adm-muted adm-hint">{hint}</p> : null}<div className="adm-grid">{children}</div></fieldset>;
}
function Field({ label, hint, wide, children }: { label: string; hint?: string; wide?: boolean; children: ReactNode }) {
  return <label className={`adm-field${wide ? ' wide' : ''}`}><span>{label}</span>{children}{hint ? <small>{hint}</small> : null}</label>;
}
function ColorSelect({ value, onChange, allowNone }: { value?: ColorKey; onChange: (c: ColorKey) => void; allowNone?: boolean }) {
  return (
    <span className="adm-color">
      <i style={{ background: value ? COLORS[value] : 'transparent' }}></i>
      <select value={value ?? ''} onChange={e => onChange((e.target.value || undefined) as ColorKey)} aria-label="Couleur de l'étiquette">
        {allowNone ? <option value="">Sans</option> : null}
        {COLOR_KEYS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </span>
  );
}
function Rows<T>({ items, onChange, make, render }: { items: T[]; onChange: (v: T[]) => void; make: () => NoInfer<T>; render: (row: T, update: (r: NoInfer<T>) => void) => ReactNode }) {
  return (
    <div className="adm-rows wide">
      {items.map((r, i) => (
        <div className="adm-row" key={i}>
          {render(r, v => { const n = [...items]; n[i] = v; onChange(n); })}
          <button className="adm-x" onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label="Retirer la ligne"><Trash2 size={13} /></button>
        </div>
      ))}
      <button className="adm-add" onClick={() => onChange([...items, make()])}><Plus size={13} />Ajouter</button>
    </div>
  );
}
