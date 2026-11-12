'use client';
/* Projets : liste (ordre, publication), import des projets actuels, ajout / édition / suppression. */
import { useState } from 'react';
import { deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { ArrowDown, ArrowUp, ExternalLink, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { db, refreshSite, storage } from '@/lib/firebase-client';
import { PROJECTS, type Project } from '@/lib/projects';
import { projectHref } from '@/lib/site';
import ProjectEditor, { type Draft } from './ProjectEditor';
import { toStored } from '@/lib/project-codec';
import { galleryImage } from '@/components/visuals';
import { askConfirm } from './Confirm';

export type ProjectRow = Draft & { order: number; published: boolean };
type Row = ProjectRow;

export default function Projects({ rows, error: loadError, onNew }: { rows: Row[] | null; error: string; onNew: () => void }) {
  const [editing, setEditing] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setError] = useState('');
  const error = loadError || actionError;

  if (editing) {
    const nextOrder = rows?.length ? Math.max(...rows.map(r => r.order ?? 0)) + 1 : 1;
    return <ProjectEditor initial={editing} nextOrder={nextOrder} existing={rows?.map(r => r.slug) ?? []} onClose={() => setEditing(null)} />;
  }

  const importCurrent = async () => {
    setBusy(true);
    const b = writeBatch(db());
    PROJECTS.forEach((p: Project, i) => b.set(doc(db(), 'projects', p.slug), toStored({ ...p, order: i + 1, published: true })));
    await b.commit().then(refreshSite).catch(e => setError(e.message));
    setBusy(false);
  };
  // Projets ajoutés dans le code mais pas encore dans la base (ex. un nouveau projet) : placés à leur rang du code
  const missing = rows?.length ? PROJECTS.filter(p => !rows.some(r => r.slug === p.slug)) : [];
  const syncMissing = async () => {
    if (!rows) return;
    setBusy(true); setError('');
    const placed = [...rows.map(r => ({ slug: r.slug, order: r.order ?? 99, isNew: false }))];
    missing.forEach(p => {
      const i = PROJECTS.indexOf(p);
      const after = [...PROJECTS.slice(0, i)].reverse().map(q => placed.find(x => x.slug === q.slug)).find(Boolean);
      const before = PROJECTS.slice(i + 1).map(q => placed.find(x => x.slug === q.slug)).find(Boolean);
      const order = after && before ? (after.order + before.order) / 2 : after ? after.order + 1 : before ? before.order - 1 : placed.length + 1;
      placed.push({ slug: p.slug, order, isNew: true });
    });
    // Ordre 1, 2, 3… et identifiants PRJ-01… recalculés pour tous
    placed.sort((a, b) => a.order - b.order);
    const b = writeBatch(db());
    placed.forEach((x, i) => {
      const id = `PRJ-${String(i + 1).padStart(2, '0')}`;
      if (x.isNew) b.set(doc(db(), 'projects', x.slug), toStored({ ...PROJECTS.find(p => p.slug === x.slug)!, id, order: i + 1, published: true }));
      else b.update(doc(db(), 'projects', x.slug), { order: i + 1, id });
    });
    await b.commit().then(refreshSite).catch(e => setError(e.message));
    setBusy(false);
  };
  const move = async (i: number, dir: -1 | 1) => {
    if (!rows) return;
    const a = rows[i], c = rows[i + dir]; if (!c) return;
    const b = writeBatch(db());
    b.update(doc(db(), 'projects', a.slug), { order: c.order });
    b.update(doc(db(), 'projects', c.slug), { order: a.order });
    await b.commit(); refreshSite();
  };
  const togglePublish = (r: Row) => updateDoc(doc(db(), 'projects', r.slug), { published: !r.published }).then(refreshSite);
  const remove = async (r: Row) => {
    if (!await askConfirm({ title: `Supprimer « ${r.title} » ?`, text: 'Sa page disparaîtra du site et les photos envoyées depuis le dashboard seront effacées. Cette action est définitive.', confirm: 'Supprimer le projet' })) return;
    await deleteDoc(doc(db(), 'projects', r.slug));
    refreshSite();
    // Photos envoyées depuis le dashboard (les captures d'origine du site restent dans le code)
    try { const all = await listAll(ref(storage(), `projets/${r.slug}`)); await Promise.all(all.items.map(deleteObject)); } catch { /* rien à supprimer */ }
  };

  return (
    <section>
      <div className="adm-head">
        <div><h1>Projets</h1><p className="adm-muted">Les projets publiés apparaissent sur le site (accueil, études de cas, à propos) dès l&apos;enregistrement.</p></div>
        <button className="btn-lime adm-cta" onClick={onNew}><Plus size={16} />Ajouter un projet</button>
      </div>
      {error ? <p className="adm-err">{error}</p> : null}
      {missing.length ? (
        <div className="adm-sync panel">
          <p><b>{missing.length > 1 ? `${missing.length} nouveaux projets` : 'Un nouveau projet'}</b>{` du code ${missing.length > 1 ? 'ne sont' : 'n\'est'} pas encore sur le site : ${missing.map(p => p.title).join(', ')}.`}</p>
          <button className="btn-lime" onClick={syncMissing} disabled={busy}><Plus size={15} />{busy ? 'Ajout…' : missing.length > 1 ? 'Les ajouter' : 'L\'ajouter'}</button>
        </div>
      ) : null}
      {!rows ? <p className="adm-muted">Chargement…</p> : !rows.length ? (
        <div className="adm-empty panel">
          <p>Aucun projet dans la base. Le site affiche pour l&apos;instant les {PROJECTS.length} projets du code.</p>
          <button className="ghost" onClick={importCurrent} disabled={busy}>{busy ? 'Import…' : `Importer les ${PROJECTS.length} projets actuels`}</button>
        </div>
      ) : (
        <ul className="adm-cards">
          {rows.map((r, i) => (
            <li key={r.slug} className={`adm-pcard panel${r.published ? '' : ' off'}`}>
              <button className="adm-pcover" onClick={() => setEditing(r)} aria-label={`Modifier ${r.title}`}>
                {r.gallery?.length
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={galleryImage(r)} alt="" loading="lazy" />
                  : <span className="adm-pcover-empty">Pas encore de photo</span>}
                <span className={`adm-pub${r.published ? ' on' : ''}`}>{r.published ? 'Publié' : 'Brouillon'}</span>
              </button>
              <div className="adm-pbody">
                <span className="mono">{`${r.id || '—'} · ${r.category || 'Sans catégorie'} · ${r.year || ''}`}</span>
                <b>{r.title}</b>
                <p>{r.tagline}</p>
              </div>
              <div className="adm-pact">
                <div className="adm-order">
                  <button aria-label="Monter" title="Monter" onClick={() => move(i, -1)} disabled={!i}><ArrowUp size={14} /></button>
                  <button aria-label="Descendre" title="Descendre" onClick={() => move(i, 1)} disabled={i === rows.length - 1}><ArrowDown size={14} /></button>
                </div>
                <div className="adm-pact-r">
                  <button className="adm-icon" onClick={() => togglePublish(r)} title={r.published ? 'Masquer du site' : 'Publier'} aria-label={r.published ? 'Masquer du site' : 'Publier'}>{r.published ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  {r.published ? <a className="adm-icon" href={projectHref(r.slug)} target="_blank" rel="noopener" title="Voir sur le site" aria-label="Voir sur le site"><ExternalLink size={15} /></a> : null}
                  <button className="adm-icon adm-danger" onClick={() => remove(r)} title="Supprimer" aria-label="Supprimer"><Trash2 size={15} /></button>
                  <button className="ghost" onClick={() => setEditing(r)}><Pencil size={14} />Modifier</button>
                </div>
              </div>
            </li>
          ))}
          <li><button className="adm-padd" onClick={onNew}><Plus size={22} strokeWidth={1.5} /><b>Ajouter un projet</b><span>Textes, photos, charte graphique</span></button></li>
        </ul>
      )}
    </section>
  );
}
