'use client';
/* Lien actif dans la nav sur l'accueil, selon la section visible.
   « Me contacter » (pill-white) est exclu : avec .cur son texte deviendrait blanc sur blanc. */
import { useEffect } from 'react';
import { $$ } from '@/lib/dom';

export default function NavSpy() {
  useEffect(() => {
    const navLinks = $$('.links a[href^="#"]:not(.pill-white)');
    const navObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('cur', a.getAttribute('href') === '#' + e.target.id)); }),
      { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach(s => navObs.observe(s));
    return () => { navObs.disconnect(); navLinks.forEach(a => { if (a.getAttribute('href')?.startsWith('#')) a.classList.remove('cur'); }); };
  }, []);
  return null;
}
