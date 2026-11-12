'use client';
/* Étude de cas : visuel principal joué après l'arrivée du cadre + sommaire actif */
import { useEffect } from 'react';
import { $, $$, countUp, playTerm, reduceMotion } from '@/lib/dom';

export default function ProjectRuntime() {
  useEffect(() => {
    const shot = $('.p-shot');
    const t = setTimeout(() => { if (!shot) return; shot.classList.add('in'); $$('[data-count]', shot).forEach(countUp); $$('.term', shot).forEach(playTerm); }, reduceMotion() ? 0 : 900);
    const tocLinks = $$('#toc a');
    const tocObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tocLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }),
      { rootMargin: '-40% 0px -55% 0px' });
    $$('.chapter').forEach(s => tocObs.observe(s));
    return () => { clearTimeout(t); tocObs.disconnect(); };
  }, []);
  return null;
}
