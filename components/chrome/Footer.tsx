'use client';
import { useEffect, useRef } from 'react';
import { LEGAL } from '@/lib/site';

const BUILD_YEAR = 2026;

export default function Footer() {
  const year = useRef<HTMLSpanElement>(null);
  // Année courante côté client (évite un écart d'hydratation)
  useEffect(() => { if (year.current) year.current.textContent = `© ${new Date().getFullYear()} Adel Loukal · Fait main, sans template`; }, []);
  return (
    <footer>
      <div className="wrap">
        <span ref={year}>{`© ${BUILD_YEAR} Adel Loukal · Fait main, sans template`}</span>
        <span className="foot-links"><a href="/#projets">Projets</a><a href="/apropos">À propos</a><a href="/services">Services</a><a href="/rendez-vous">Rendez-vous</a><a href="/#contact">Contact</a></span>
        <span className="mono" style={{ fontSize: 12 }}>Appuyez sur <kbd>⌘K</kbd> pour naviguer</span>
      </div>
      {/* Informations légales de l'entreprise */}
      <div className="wrap foot-legal">
        <span className="mono">{`${LEGAL.company} · ${LEGAL.owner}, EI · SIREN ${LEGAL.siren} · RCS Bobigny`}</span>
        <span className="foot-legal-links"><a href="/mentions-legales">Mentions légales</a><a href="/confidentialite">Confidentialité</a></span>
      </div>
    </footer>
  );
}
