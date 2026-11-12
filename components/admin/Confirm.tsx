'use client';
/* Fenêtre de confirmation du dashboard (remplace confirm() du navigateur).
   askConfirm({...}) renvoie une promesse : true si l'action est confirmée. <ConfirmHost /> est monté une fois. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle, LogOut } from 'lucide-react';

type Options = { title: string; text?: ReactNode; confirm: string; tone?: 'danger' | 'neutral' };
type Pending = Options & { resolve: (ok: boolean) => void };

let open: ((p: Pending) => void) | null = null;

export function askConfirm(o: Options): Promise<boolean> {
  return new Promise(resolve => (open ? open({ ...o, resolve }) : resolve(window.confirm(o.title))));
}

export function ConfirmHost() {
  const [p, setP] = useState<Pending | null>(null);
  const [shown, setShown] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number>(0);

  useEffect(() => {
    open = next => { clearTimeout(timer.current); setP(next); requestAnimationFrame(() => requestAnimationFrame(() => setShown(true))); };
    return () => { open = null; clearTimeout(timer.current); };
  }, []);

  const close = (ok: boolean) => {
    if (!p) return;
    p.resolve(ok); setShown(false);
    timer.current = window.setTimeout(() => setP(null), 220);
  };

  useEffect(() => {
    if (!p) return;
    const prev = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); close(false); } };
    addEventListener('keydown', key);
    return () => { removeEventListener('keydown', key); prev?.focus?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  if (!p) return null;
  const danger = p.tone !== 'neutral';
  return (
    <div className={`adm-confirm${shown ? ' open' : ''}`} onMouseDown={e => { if (e.target === e.currentTarget) close(false); }}>
      <div className="adm-confirm-box panel" role="alertdialog" aria-modal="true" aria-labelledby="adm-confirm-t" aria-describedby={p.text ? 'adm-confirm-d' : undefined}>
        <span className={`adm-confirm-ic${danger ? ' danger' : ''}`} aria-hidden="true">{danger ? <AlertTriangle size={18} strokeWidth={1.6} /> : <LogOut size={18} strokeWidth={1.6} />}</span>
        <h2 id="adm-confirm-t">{p.title}</h2>
        {p.text ? <p id="adm-confirm-d">{p.text}</p> : null}
        <div className="adm-confirm-act">
          <button ref={cancelRef} type="button" className="ghost" onClick={() => close(false)}>Annuler</button>
          <button type="button" className={danger ? 'adm-btn-danger' : 'btn-lime'} onClick={() => close(true)}>{p.confirm}</button>
        </div>
      </div>
    </div>
  );
}
