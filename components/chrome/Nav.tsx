'use client';
/* Nav : fond au scroll + lien courant (bindNav / chrome de main.js). Barre de lecture retirée à la demande d'Adel.
   Mobile (≤ 640 px) : menu burger plein écran, rendu hors de <nav> (le backdrop-filter de la nav
   ferait sinon de la nav le repère des éléments fixes). */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import { $ } from '@/lib/dom';
import Logo from '@/components/Logo';

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const home = isHome ? '' : '/';
  const page = pathname.startsWith('/projets/') ? 'projet' : pathname.split('/').pop();
  const cur = (p: string) => (page === p ? 'cur' : undefined);
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const nav = $('#nav');
    if (!nav) return;
    const on = () => { nav.classList.toggle('scrolled', scrollY > 10); };
    addEventListener('scroll', on, { passive: true }); on();
    return () => removeEventListener('scroll', on);
  }, [pathname]);

  /* Menu : verrouillage du scroll, Échap, fermeture au changement de page ou en passant sur grand écran */
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('menu-open', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); burger.current?.focus(); } };
    const mq = matchMedia('(min-width: 641px)');
    const onMq = () => { if (mq.matches) setOpen(false); };
    addEventListener('keydown', onKey); mq.addEventListener('change', onMq);
    return () => { removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq); html.classList.remove('menu-open'); };
  }, [open]);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false); }
  const hidden = pathname.startsWith('/admin'); // le dashboard a sa propre barre

  // Ferme avant la navigation (le verrou de scroll doit sauter avant le défilement vers une ancre)
  const close = () => { document.documentElement.classList.remove('menu-open'); setOpen(false); };

  const items: [string, string, string | undefined][] = [
    ['Projets', `${home}#projets`, cur('projet')], ['À propos', '/apropos', cur('apropos')], ['Services', '/services', cur('services')],
    ['Rendez-vous', '/rendez-vous', cur('rendez-vous')], ['Contact', `${home}#contact`, undefined],
  ];

  if (hidden) return null;
  return (
    <>
      <nav id="nav" className={open ? 'nav-open' : undefined}><div className="wrap">
        <a href={home || '#'} className="logo" aria-label="Accueil" onClick={close}>
          <Logo size={20} />
          Adel Loukal
        </a>
        <div className="links">
          <a href={`${home}#projets`} data-page="projet" className={cur('projet')}>Projets</a>
          <a href="/apropos" data-page="apropos" className={cur('apropos')}>À propos</a>
          <a href="/services" data-page="services" className={cur('services')}>Services</a>
          <button className="kbd-btn" data-cmdk="" aria-label="Ouvrir la palette de commandes">Rechercher <kbd>⌘K</kbd></button>
          <a href={`${home}#contact`} className="pill-white" onClick={close}>Me contacter</a>
          <button ref={burger} type="button" className={`burger${open ? ' on' : ''}`} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open} aria-controls="mnav" onClick={() => setOpen(o => !o)}><i></i><i></i></button>
        </div>
      </div></nav>

      <div id="mnav" className={`mnav${open ? ' open' : ''}`} aria-hidden={!open} inert={!open}>
        <ul>
          {items.map(([label, href, c], i) => (
            <li key={label} style={{ '--i': i } as CSSProperties}>
              <a href={href} className={c} onClick={close}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{label}</a>
            </li>
          ))}
        </ul>
        <div className="mnav-foot" style={{ '--i': items.length } as CSSProperties}>
          <a href="/rendez-vous" className="btn-lime" onClick={close}>Réserver un appel</a>
          <button type="button" className="ghost" data-copy="">Copier mon email</button>
        </div>
      </div>
    </>
  );
}
