'use client';
/* Nav : fond au scroll + lien courant (bindNav / chrome de main.js). Barre de lecture retirée à la demande d'Adel. */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { $ } from '@/lib/dom';
import Logo from '@/components/Logo';

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const home = isHome ? '' : '/';
  const page = pathname.startsWith('/projets/') ? 'projet' : pathname.split('/').pop();
  const cur = (p: string) => (page === p ? 'cur' : undefined);

  useEffect(() => {
    const nav = $('#nav')!;
    const on = () => { nav.classList.toggle('scrolled', scrollY > 10); };
    addEventListener('scroll', on, { passive: true }); on();
    return () => removeEventListener('scroll', on);
  }, [pathname]);

  return (
    <nav id="nav"><div className="wrap">
      <a href={home || '#'} className="logo" aria-label="Accueil">
        <Logo size={20} />
        Adel Loukal
      </a>
      <div className="links">
        <a href={`${home}#projets`} data-page="projet" className={cur('projet')}>Projets</a>
        <a href="/apropos" data-page="apropos" className={cur('apropos')}>À propos</a>
        <a href="/services" data-page="services" className={cur('services')}>Services</a>
        <button className="kbd-btn" data-cmdk="" aria-label="Ouvrir la palette de commandes">Rechercher <kbd>⌘K</kbd></button>
        <a href={`${home}#contact`} className="pill-white">Me contacter</a>
      </div>
    </div></nav>
  );
}
