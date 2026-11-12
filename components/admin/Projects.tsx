'use client';
/* Projets : liste (ordre, publication), import des projets actuels, ajout / édition / suppression. */
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { deleteObject, listAll, ref } from 'firebase/storage';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { db, refreshSite, storage } from '@/lib/firebase-client';
import { PROJECTS, type Project } from '@/lib/projects';
import { projectHref } from '@/lib/site';
import ProjectEditor, { type Draft } from './ProjectEditor';
import { fromStored, toStored } from '@/lib/project-codec';

type Row = Draft & { order: number; published: boolean };

export default function Projects() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => onSnapshot(collection(db(), 'projects'),
    snap => setRows(snap.docs.map(d => fromStored(d.data(), d.id) as Row).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))),
    e => setError(e.message)), []);

  if (editing) {
    const nextOrder = rows?.length ? Math.max(...rows.map(r => r.order ?? 0)) + 1 : 1;
    return <ProjectEditor initial={editing === 'new' ? null : editing} nextOrder={nextOrder} existing={rows?.map(r => r.slug) ?? []} onClose={() => setEditing(null)} />;
  }

  const importCurrent = async () => {
    setBusy(true);
    const b = writeBatch(db());
    PROJECTS.forEach((p: Project, i) => b.set(doc(db(), 'projects', p.slug), toStored({ ...p, order: i + 1, published: true })));
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
    if (!confirm(`Supprimer le projet « ${r.title} » ? Sa page disparaîtra du site et ses photos envoyées seront effacées.`)) return;
    await deleteDoc(doc(db(), 'projects', r.slug));
    refreshSite();
    // Photos envoyées depuis le dashboard (les captures d'origine du site restent dans le code)
    try { const all = await listAll(ref(storage(), `projets/${r.slug}`)); await Promise.all(all.items.map(deleteObject)); } catch { /* rien à supprimer */ }
  };

  return (
    <section>
      <div className="adm-head">
        <div><h1>Projets</h1><p className="adm-muted">Les projets publiés apparaissent sur le site (accueil, études de cas, à propos) dès l&apos;enregistrement.</p></div>
        <button className="btn-lime" onClick={() => setEditing('new')}><Plus size={16} />Nouveau projet</button>
      </div>
      {error ? <p className="adm-err">{error}</p> : null}
      {!rows ? <p className="adm-muted">Chargement…</p> : !rows.length ? (
        <div className="adm-empty panel">
          <p>Aucun projet dans la base. Le site affiche pour l&apos;instant les 5 projets du code.</p>
          <button className="ghost" onClick={importCurrent} disabled={busy}>{busy ? 'Import…' : 'Importer les 5 projets actuels'}</button>
        </div>
      ) : (
        <ul className="adm-list">
          {rows.map((r, i) => (
            <li key={r.slug} className={`adm-proj panel${r.published ? '' : ' off'}`}>
              <div className="adm-order">
                <button aria-label="Monter" onClick={() => move(i, -1)} disabled={!i}><ArrowUp size={14} /></button>
                <button aria-label="Descendre" onClick={() => move(i, 1)} disabled={i === rows.length - 1}><ArrowDown size={14} /></button>
              </div>
              <div className="adm-proj-main">
                <span className="mono">{`${r.id || '—'} · ${r.category || 'Sans catégorie'} · ${r.year || ''}`}</span>
                <b>{r.title}</b>
                <span className="adm-muted">{r.tagline}</span>
              </div>
              <span className={`adm-pub${r.published ? ' on' : ''}`}>{r.published ? 'Publié' : 'Brouillon'}</span>
              <div className="adm-rdv-act">
                <button className="ghost" onClick={() => togglePublish(r)}>{r.published ? <><EyeOff size={14} />Masquer</> : <><Eye size={14} />Publier</>}</button>
                {r.published ? <a className="ghost" href={projectHref(r.slug)} target="_blank" rel="noopener">Voir</a> : null}
                <button className="ghost" onClick={() => setEditing(r)}><Pencil size={14} />Modifier</button>
                <button className="ghost adm-danger" onClick={() => remove(r)} aria-label="Supprimer"><Trash2 size={14} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
