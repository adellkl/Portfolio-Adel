'use client';
/* Palette de commandes ⌘K (bindCmdk de main.js). La liste est rendue en HTML
   comme dans le prototype (<div class="grp"> dans <ul>). */
import { useEffect } from 'react';
import { $, $$, copyEmail, leaveTo, reduceMotion } from '@/lib/dom';
import { CMDK_NAV, projectHref } from '@/lib/site';
import { PROJECTS } from '@/lib/projects';

type Item = { g: string; n: string; k: string; href?: string; act?: () => void };

export default function CommandPalette() {
  useEffect(() => {
    const bg = $('#cmdk')!, input = $<HTMLInputElement>('#cmdInput')!, list = $('#cmdList')!;
    const items: Item[] = [
      ...CMDK_NAV.map(([n, href, k]) => ({ g: 'Navigation', n, href, k })),
      ...PROJECTS.map(p => ({ g: 'Études de cas', n: `${p.title} — ${p.tagline}`, href: projectHref(p.slug), k: p.id })),
      { g: 'Actions', n: 'Copier mon email', act: copyEmail, k: '⌘ C' },
    ];
    let act = 0, shown = items;
    const render = () => {
      if (!shown.length) { list.innerHTML = '<div class="empty">Aucun résultat</div>'; return; }
      let g = '';
      list.innerHTML = shown.map((it, i) => {
        const head = it.g !== g ? `<div class="grp">${g = it.g}</div>` : '';
        return `${head}<li class="${i === act ? 'act' : ''}" data-i="${i}">${it.n}<span class="mono">${it.k}</span></li>`;
      }).join('');
      $('li.act', list)?.scrollIntoView({ block: 'nearest' });
    };
    let focusT: ReturnType<typeof setTimeout> | undefined;
    const open = () => { bg.classList.add('open'); bg.setAttribute('aria-hidden', 'false'); input.value = ''; shown = items; act = 0; render(); focusT = setTimeout(() => input.focus(), 30); };
    const close = () => { bg.classList.remove('open'); bg.setAttribute('aria-hidden', 'true'); };
    const go = (i: number) => {
      const it = shown[i]; if (!it) return; close();
      if (it.act) return it.act();
      const url = new URL(it.href!, location.href);
      if (url.pathname === location.pathname && url.search === location.search && url.hash) $(url.hash)?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' });
      else leaveTo(url.href, 250);
    };
    const btns = $$('[data-cmdk]');
    btns.forEach(b => b.addEventListener('click', open));
    const onBg = (e: MouseEvent) => { if (e.target === bg) close(); const li = (e.target as Element).closest<HTMLElement>('li'); if (li) go(+li.dataset.i!); };
    bg.addEventListener('click', onBg);
    const onInput = () => { const q = input.value.toLowerCase(); shown = items.filter(i => i.n.toLowerCase().includes(q)); act = 0; render(); };
    input.addEventListener('input', onInput);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (bg.classList.contains('open')) close(); else open(); return; }
      if (!bg.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown') { e.preventDefault(); act = Math.min(act + 1, shown.length - 1); render(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); act = Math.max(act - 1, 0); render(); }
      if (e.key === 'Enter') { e.preventDefault(); go(act); }
    };
    addEventListener('keydown', onKey);
    return () => {
      clearTimeout(focusT);
      btns.forEach(b => b.removeEventListener('click', open));
      bg.removeEventListener('click', onBg);
      input.removeEventListener('input', onInput);
      removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="cmdk-bg" id="cmdk" aria-hidden="true"><div className="cmdk" role="dialog" aria-label="Palette de commandes">
      <input id="cmdInput" placeholder="Rechercher une page, un projet…" autoComplete="off" /><ul id="cmdList"></ul>
    </div></div>
  );
}
