/* Brief issu du quiz des services : sauvegardé dans le navigateur (localStorage),
   puis repris pour préremplir la demande d'appel (/rendez-vous) et les e-mails. */
import { TYPES } from './site';

export type Brief = { type: string; recommendation: string; answers: [string, string][]; at: string };
const KEY = 'adel-loukal:brief';

export function saveBrief(b: Brief) {
  try { localStorage.setItem(KEY, JSON.stringify(b)); } catch { /* stockage indisponible : on continue sans */ }
}

export function loadBrief(): Brief | null {
  try {
    const b = JSON.parse(localStorage.getItem(KEY) || 'null') as Brief | null;
    return b && TYPES[b.type] && Array.isArray(b.answers) ? b : null;
  } catch { return null; }
}

export function clearBrief() {
  try { localStorage.removeItem(KEY); } catch { /* rien */ }
}

/** Texte du brief pour un message : recommandation + questions / réponses */
export function briefText(b: Brief) {
  return [`Mes réponses au quiz (recommandation : ${b.recommendation}) :`, ...b.answers.map(([q, a]) => `- ${q} ${a}`)].join('\n');
}
