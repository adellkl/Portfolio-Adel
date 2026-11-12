'use client';
/* Questions fréquentes — accordéon inspiré du composant FaqSection (variante « accordion ») fourni par Adel,
   réécrit sans Motion ni CSS Modules : ouverture en hauteur (grid 0fr → 1fr), réponse qui glisse et se défloute,
   « + » qui tourne en croix, flèches / Début / Fin pour passer d'une question à l'autre, carte de contact en bas. */
import { useId, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { FAQ } from '@/lib/faq';

function onListKeyDown(e: KeyboardEvent<HTMLElement>) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
  const triggers = [...e.currentTarget.querySelectorAll<HTMLElement>('[data-faq-trigger]')];
  const i = triggers.indexOf(document.activeElement as HTMLElement);
  if (i < 0) return;
  e.preventDefault();
  const n = e.key === 'Home' ? 0 : e.key === 'End' ? triggers.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + triggers.length) % triggers.length;
  triggers[n].focus();
}

export function FaqSection({ n, id = 'faq' }: { n: string; id?: string }) {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="block" id={id}>
      <div className="wrap">
        <div className="eyebrow reveal"><span className="mono">{n}</span>Questions fréquentes</div>
        <h2 className="reveal" style={{ '--d': '.08s' } as CSSProperties}>Avant de se lancer, <span className="muted">les réponses aux questions qu&apos;on me pose le plus.</span></h2>
        <div className="fq reveal" style={{ '--d': '.16s' } as CSSProperties}>
          <ul className="fq-list" onKeyDown={onListKeyDown}>
            {FAQ.map((item, i) => {
              const isOpen = open === i, q = `${uid}-q${i}`, a = `${uid}-a${i}`;
              return (
                <li className={`fq-item${isOpen ? ' open' : ''}`} key={item.question}>
                  <h3 className="fq-h">
                    <button type="button" id={q} className="fq-trigger" data-faq-trigger="" aria-expanded={isOpen} aria-controls={a} onClick={() => setOpen(isOpen ? null : i)}>
                      <span className="fq-n mono">{String(i + 1).padStart(2, '0')}</span>
                      <span className="fq-q">{item.question}</span>
                      <span className="fq-icon"><Plus size={18} strokeWidth={1.75} aria-hidden="true" /></span>
                    </button>
                  </h3>
                  <div id={a} role="region" aria-labelledby={q} className="fq-panel" inert={!isOpen}>
                    <div><p className="fq-a">{item.answer}</p></div>
                  </div>
                </li>
              );
            })}
          </ul>
          <a className="fq-contact" href="/rendez-vous">
            <span className="fq-contact-text"><span>Une autre question ?</span><span>Réservez un appel de 15 minutes, j&apos;y réponds directement.</span></span>
            <ArrowRight className="fq-contact-arrow" size={18} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
