'use client';
/* Dashboard d'Adel : connexion Firebase Auth (compte présent dans la collection « admins »),
   panneau latéral (vue d'ensemble, rendez-vous, projets, ajouter un projet).
   Les rendez-vous et les projets sont écoutés ici, une fois, puis partagés entre les vues. */
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { ArrowRight, CalendarDays, ExternalLink, FolderKanban, LayoutDashboard, LogOut, Plus } from 'lucide-react';
import { firebaseEnabled } from '@/lib/firebase';
import { auth, db, type Appointment } from '@/lib/firebase-client';
import { fromStored } from '@/lib/project-codec';
import { galleryImage } from '@/components/visuals';
import Logo from '@/components/Logo';
import { LEGAL } from '@/lib/site';
import Appointments, { longDate, today, type AppointmentRow } from './Appointments';
import Projects, { type ProjectRow } from './Projects';
import ProjectEditor from './ProjectEditor';

type Tab = 'apercu' | 'rdv' | 'projets' | 'nouveau';

export default function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = vérification en cours
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!firebaseEnabled) return;
    return onAuthStateChanged(auth(), async u => {
      setUser(u); setIsAdmin(null);
      if (!u) return;
      try { setIsAdmin((await getDoc(doc(db(), 'admins', u.uid))).exists()); }
      catch { setIsAdmin(false); }
    });
  }, []);

  if (!firebaseEnabled) return <Shell><Notice title="Firebase n'est pas configuré">Ajoutez les variables <code>NEXT_PUBLIC_FIREBASE_*</code> dans <code>.env.local</code> (et sur Vercel), puis relancez le site.</Notice></Shell>;
  if (user === undefined || (user && isAdmin === null)) return <Shell><p className="adm-muted">Chargement…</p></Shell>;
  if (!user) return <Shell><Login /></Shell>;
  if (!isAdmin) return (
    <Shell>
      <Notice title="Ce compte n'a pas accès au dashboard">
        Ajoutez un document <code>admins/{user.uid}</code> dans Firestore (console Firebase), puis rechargez la page.
        <button className="ghost" style={{ marginTop: 16 }} onClick={() => signOut(auth())}>Se déconnecter</button>
      </Notice>
    </Shell>
  );
  return <Dashboard user={user} />;
}

function Dashboard({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>('apercu');
  const [rdv, setRdv] = useState<AppointmentRow[] | null>(null);
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const a = onSnapshot(collection(db(), 'appointments'),
      snap => setRdv(snap.docs.map(d => ({ ...(d.data() as Appointment), id: d.id })).sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time))),
      e => setError(e.message));
    const p = onSnapshot(collection(db(), 'projects'),
      snap => setProjects(snap.docs.map(d => fromStored(d.data(), d.id) as ProjectRow).sort((x, y) => (x.order ?? 99) - (y.order ?? 99))),
      e => setError(e.message));
    return () => { a(); p(); };
  }, []);

  const t = today();
  const toHandle = rdv?.filter(r => r.status === 'nouveau' && r.date >= t).length ?? 0;
  const go = (k: Tab) => { setTab(k); window.scrollTo({ top: 0 }); };
  const nextOrder = projects?.length ? Math.max(...projects.map(p => p.order ?? 0)) + 1 : 1;

  const items: [Tab, string, ReactNode, number?][] = [
    ['apercu', 'Vue d\'ensemble', <LayoutDashboard key="a" size={16} strokeWidth={1.6} />],
    ['rdv', 'Rendez-vous', <CalendarDays key="r" size={16} strokeWidth={1.6} />, toHandle],
    ['projets', 'Projets', <FolderKanban key="p" size={16} strokeWidth={1.6} />, projects?.length],
  ];

  return (
    <div className="adm adm-layout">
      <aside className="adm-side">
        <div className="adm-brand"><Logo size={20} /><span>Dashboard</span></div>
        <div className="adm-tabs" role="navigation" aria-label="Sections">
          <span className="adm-side-label mono">GESTION</span>
          {items.map(([k, label, icon, n]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => go(k)} aria-current={tab === k ? 'page' : undefined}>
              {icon}<span>{label}</span>{n ? <em className={k === 'rdv' ? 'hot' : ''}>{n}</em> : null}
            </button>
          ))}
          <button className={`adm-side-new${tab === 'nouveau' ? ' on' : ''}`} onClick={() => go('nouveau')}><Plus size={16} strokeWidth={1.8} /><span>Ajouter un projet</span></button>
        </div>
        <div className="adm-user">
          <span className="adm-me" title={user.email ?? ''}><i>{(user.email ?? '?')[0].toUpperCase()}</i><span>{user.email}</span></span>
          <a className="adm-side-link" href="/" target="_blank" rel="noopener"><ExternalLink size={15} strokeWidth={1.6} /><span>Voir le site</span></a>
          <button className="adm-side-link" onClick={() => signOut(auth())}><LogOut size={15} strokeWidth={1.6} /><span>Déconnexion</span></button>
        </div>
      </aside>

      <main className="adm-main">
        {tab === 'apercu' ? <Overview rdv={rdv} projects={projects} go={go} /> : null}
        {tab === 'rdv' ? <Appointments rows={rdv} error={error} /> : null}
        {tab === 'projets' ? <Projects rows={projects} error={error} onNew={() => go('nouveau')} /> : null}
        {tab === 'nouveau' ? <ProjectEditor initial={null} nextOrder={nextOrder} existing={projects?.map(p => p.slug) ?? []} onClose={() => go('projets')} /> : null}
      </main>
    </div>
  );
}

/* Vue d'ensemble : chiffres clés, prochains rendez-vous, projets */
function Overview({ rdv, projects, go }: { rdv: AppointmentRow[] | null; projects: ProjectRow[] | null; go: (t: Tab) => void }) {
  const t = today();
  const upcoming = rdv?.filter(r => r.date >= t && r.status !== 'annulé') ?? [];
  const toHandle = upcoming.filter(r => r.status === 'nouveau').length;
  const published = projects?.filter(p => p.published).length ?? 0;
  const drafts = (projects?.length ?? 0) - published;
  const hour = new Date().getHours();
  const hello = hour < 5 || hour >= 18 ? 'Bonsoir' : 'Bonjour';
  const name = LEGAL.owner.split(' ')[0];

  const stats: [string, number | string, string, Tab][] = [
    ['À traiter', rdv ? toHandle : '—', 'demandes d\'appel en attente', 'rdv'],
    ['À venir', rdv ? upcoming.length : '—', 'rendez-vous prévus', 'rdv'],
    ['En ligne', projects ? published : '—', 'projets publiés sur le site', 'projets'],
    ['Brouillons', projects ? drafts : '—', 'projets non publiés', 'projets'],
  ];

  return (
    <section className="adm-ov">
      <div className="adm-head">
        <div><span className="mono adm-date">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span><h1>{`${hello}${name ? ' ' + name : ''}.`}</h1>
          <p className="adm-muted">{toHandle ? `${toHandle} demande${toHandle > 1 ? 's' : ''} d'appel à traiter.` : 'Aucune demande en attente.'}</p></div>
        <button className="btn-lime adm-cta" onClick={() => go('nouveau')}><Plus size={16} />Ajouter un projet</button>
      </div>

      <div className="adm-stats">
        {stats.map(([label, value, hint, target]) => (
          <button key={label} className={`adm-stat panel${label === 'À traiter' && toHandle ? ' hot' : ''}`} onClick={() => go(target)}>
            <span className="mono">{label.toUpperCase()}</span><b>{value}</b><span>{hint}</span>
          </button>
        ))}
      </div>

      <div className="adm-ov-grid">
        <div className="adm-box panel">
          <div className="adm-box-head"><h2>Prochains rendez-vous</h2><button className="adm-link" onClick={() => go('rdv')}>Tout voir<ArrowRight size={14} /></button></div>
          {!rdv ? <p className="adm-muted">Chargement…</p> : !upcoming.length ? <p className="adm-muted">Aucun rendez-vous à venir.</p> : (
            <ul className="adm-mini">
              {upcoming.slice(0, 5).map(r => (
                <li key={r.id}>
                  <span className="adm-mini-date"><b>{new Date(`${r.date}T12:00:00`).getDate()}</b><span>{new Date(`${r.date}T12:00:00`).toLocaleDateString('fr-FR', { month: 'short' })}</span></span>
                  <span className="adm-mini-main"><b>{r.name}</b><span>{`${longDate(r.date).split(' ')[0]} · ${r.time}`}</span></span>
                  <span className={`adm-chip st-${r.status === 'confirmé' ? 'ok' : 'new'}`}>{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="adm-box panel">
          <div className="adm-box-head"><h2>Projets</h2><button className="adm-link" onClick={() => go('projets')}>Gérer<ArrowRight size={14} /></button></div>
          {!projects ? <p className="adm-muted">Chargement…</p> : !projects.length ? (
            <p className="adm-muted">Aucun projet dans la base. Ouvrez « Projets » pour importer les 5 projets actuels.</p>
          ) : (
            <ul className="adm-mini">
              {projects.slice(0, 5).map(p => (
                <li key={p.slug}>
                  {p.gallery?.length
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img className="adm-mini-thumb" src={galleryImage(p)} alt="" loading="lazy" />
                    : <span className="adm-mini-thumb" />}
                  <span className="adm-mini-main"><b>{p.title}</b><span>{p.category}</span></span>
                  <span className={`adm-chip${p.published ? ' st-ok' : ''}`}>{p.published ? 'Publié' : 'Brouillon'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="adm adm-center"><div className="adm-card panel"><div className="adm-brand" style={{ marginBottom: 24 }}><Logo size={20} /><span>Dashboard</span></div>{children}</div></div>;
}

function Notice({ title, children }: { title: string; children: ReactNode }) {
  return <div className="adm-notice"><h2>{title}</h2><div className="adm-muted">{children}</div></div>;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    try { await signInWithEmailAndPassword(auth(), email.trim(), password); }
    catch { setMsg({ ok: false, text: 'Identifiants incorrects.' }); }
    setBusy(false);
  };
  const reset = async () => {
    if (!email.trim()) { setMsg({ ok: false, text: 'Indiquez votre e-mail pour recevoir le lien.' }); return; }
    try { await sendPasswordResetEmail(auth(), email.trim()); } catch { /* même réponse, compte existant ou non */ }
    setMsg({ ok: true, text: 'Si ce compte existe, un lien de réinitialisation vient d\'être envoyé.' });
  };

  return (
    <form className="adm-login" onSubmit={submit}>
      <h2>Connexion</h2>
      <input type="email" placeholder="E-mail" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required aria-label="E-mail" />
      <input type="password" placeholder="Mot de passe" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required aria-label="Mot de passe" />
      <button className="btn-lime" type="submit" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</button>
      <button type="button" className="adm-link" onClick={reset}>Mot de passe oublié ?</button>
      {msg ? <p className={msg.ok ? 'adm-ok' : 'adm-err'}>{msg.text}</p> : null}
    </form>
  );
}
