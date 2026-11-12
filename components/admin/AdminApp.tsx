'use client';
/* Dashboard d'Adel : connexion Firebase Auth (compte présent dans la collection « admins »),
   puis deux onglets : rendez-vous et projets. */
import { useEffect, useState, type FormEvent } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { CalendarDays, FolderKanban, LogOut, ExternalLink } from 'lucide-react';
import { firebaseEnabled } from '@/lib/firebase';
import { auth, db } from '@/lib/firebase-client';
import Logo from '@/components/Logo';
import Appointments from './Appointments';
import Projects from './Projects';

type Tab = 'rdv' | 'projets';

export default function AdminApp() {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = vérification en cours
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>('rdv');
  const [newCount, setNewCount] = useState(0);

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

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-brand"><Logo size={20} /><span>Dashboard</span></div>
        <nav className="adm-tabs" aria-label="Sections">
          <button className={tab === 'rdv' ? 'on' : ''} onClick={() => setTab('rdv')}><CalendarDays size={16} strokeWidth={1.6} />Rendez-vous{newCount ? <em>{newCount}</em> : null}</button>
          <button className={tab === 'projets' ? 'on' : ''} onClick={() => setTab('projets')}><FolderKanban size={16} strokeWidth={1.6} />Projets</button>
        </nav>
        <div className="adm-user">
          <a className="ghost" href="/" target="_blank" rel="noopener"><ExternalLink size={14} strokeWidth={1.6} />Voir le site</a>
          <button className="ghost" onClick={() => signOut(auth())} title={user.email ?? ''}><LogOut size={14} strokeWidth={1.6} />Déconnexion</button>
        </div>
      </header>
      <main className="adm-main">
        <div style={{ display: tab === 'rdv' ? 'block' : 'none' }}><Appointments onNewCount={setNewCount} /></div>
        {tab === 'projets' ? <Projects /> : null}
      </main>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="adm adm-center"><div className="adm-card panel"><div className="adm-brand" style={{ marginBottom: 24 }}><Logo size={20} /><span>Dashboard</span></div>{children}</div></div>;
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
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
    try { await sendPasswordResetEmail(auth(), email.trim()); setMsg({ ok: true, text: 'Si ce compte existe, un lien de réinitialisation vient d\'être envoyé.' }); }
    catch { setMsg({ ok: true, text: 'Si ce compte existe, un lien de réinitialisation vient d\'être envoyé.' }); }
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
