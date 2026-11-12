'use client';
/* Runtime global : body.ready, transitions de page, reveals, spot, raccourcis, survols.
   Port de reference/main.js (boot, bindPageLinks, io, bindSpot) et interactions.js §5 */
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { $, $$, copyEmail, createRevealObserver, finePointer, leaveTo, navTo, observeReveals, reduceMotion, releaseRevealObserver, setNavigator, toast } from '@/lib/dom';
import { KEYS } from '@/lib/site';

export default function MotionRuntime({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [gen, setGen] = useState(0);
  const lastPath = useRef<string | null>(null);

  /* Écouteurs globaux, posés une seule fois */
  useEffect(() => {
    const body = document.body;
    const timers = new Set<ReturnType<typeof setTimeout>>();

    setNavigator((href, delay) => {
      const url = new URL(href, location.href);
      body.classList.add('leaving');
      const t = setTimeout(() => {
        timers.delete(t);
        body.classList.remove('ready'); // la page suivante se monte à l'état initial
        if (url.pathname === location.pathname) {
          // même route (query/hash éventuellement différents) : équivalent d'un rechargement.
          // L'URL est mise à jour avant le remontage pour que la page lise la bonne query.
          if (url.href !== location.href) history.pushState(null, '', url.href);
          setGen(g => g + 1);
          requestAnimationFrame(() => {
            const el = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
            if (el) el.scrollIntoView({ behavior: 'instant' }); else window.scrollTo({ top: 0, behavior: 'instant' });
          });
        } else router.push(url.pathname + url.search + url.hash);
      }, delay);
      timers.add(t);
    });

    /* Liens internes : transition de sortie (bindPageLinks) + copie d'email */
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const copy = target?.closest?.('[data-copy]');
      if (copy) { e.preventDefault(); copyEmail(); return; }
      const a = target?.closest?.('a[href]') as HTMLAnchorElement | null; if (!a) return;
      if (e.defaultPrevented) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // ancre locale
      e.preventDefault();
      leaveTo(url.href, reduceMotion() ? 0 : 250);
    };
    document.addEventListener('click', onClick);

    /* Retour / avancer : rejoue l'entrée comme un chargement */
    const onPop = () => { if (location.pathname !== lastPath.current) body.classList.remove('ready', 'leaving'); };
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) body.classList.remove('leaving'); };
    addEventListener('popstate', onPop);
    addEventListener('pageshow', onShow);

    /* Projecteur qui suit la souris (bindSpot, délégué) */
    const onSpot = (e: PointerEvent) => {
      const s = (e.target as Element | null)?.closest?.('.spot') as HTMLElement | null; if (!s) return;
      const r = s.getBoundingClientRect();
      s.style.setProperty('--x', e.clientX - r.left + 'px'); s.style.setProperty('--y', e.clientY - r.top + 'px');
    };
    document.addEventListener('pointermove', onSpot, { passive: true });

    /* Raccourcis clavier (interactions.js §5) */
    let gAt = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as Element | null)?.closest?.('input, textarea, [contenteditable]') || $('#cmdk')?.classList.contains('open')) return;
      const k = e.key.toLowerCase();
      if (k === '/') { e.preventDefault(); $('[data-cmdk]')?.click(); return; }
      if (k === 'g') { gAt = Date.now(); toast('G puis P projets · A à propos · S services · C contact · R rendez-vous'); return; }
      if (Date.now() - gAt < 1500 && KEYS[k]) { gAt = 0; navTo(KEYS[k]); }
    };
    addEventListener('keydown', onKey);

    // Préchargement des pages principales (les études de cas chargent leurs propres polices : pas de préchargement)
    ['/', '/apropos', '/services', '/rendez-vous'].forEach(h => router.prefetch(h));

    return () => {
      setNavigator(null);
      timers.forEach(clearTimeout);
      document.removeEventListener('click', onClick);
      removeEventListener('popstate', onPop);
      removeEventListener('pageshow', onShow);
      document.removeEventListener('pointermove', onSpot);
      removeEventListener('keydown', onKey);
    };
  }, [router]);

  /* Arrivée sur une route : body.ready, reveals, survols */
  useEffect(() => {
    const body = document.body;
    lastPath.current = location.pathname;
    body.classList.remove('leaving');
    let r1 = 0, r2 = 0;
    if (!body.classList.contains('ready')) r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => body.classList.add('ready')); });

    const obs = createRevealObserver();
    observeReveals();

    const off: (() => void)[] = [];
    if (finePointer() && !reduceMotion()) {
      // Légère inclinaison 3D des maquettes
      $$('.shot, .next').forEach(s => {
        const move = (e: PointerEvent) => {
          const r = s.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
          s.style.transform = `perspective(1200px) rotateX(${-py * 4}deg) rotateY(${px * 5}deg) translateY(-4px)`;
        };
        const leave = () => s.style.transform = '';
        s.addEventListener('pointermove', move); s.addEventListener('pointerleave', leave);
        off.push(() => { s.removeEventListener('pointermove', move); s.removeEventListener('pointerleave', leave); });
      });
      // Boutons « magnétiques »
      $$('.btn-lime, .pill-white, .teaser .go').forEach(b => {
        const host = b.classList.contains('go') ? b.closest<HTMLElement>('.teaser')! : b;
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
          b.style.transform = `translate(${dx * .18}px,${dy * .25}px)`;
        };
        const leave = () => b.style.transform = '';
        host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave);
        off.push(() => { host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); b.style.transform = ''; });
      });
    }

    return () => {
      cancelAnimationFrame(r1); cancelAnimationFrame(r2);
      releaseRevealObserver(obs);
      off.forEach(f => f());
    };
  }, [pathname, gen]);

  return <Fragment key={gen}>{children}</Fragment>;
}
