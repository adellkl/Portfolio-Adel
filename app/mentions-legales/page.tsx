import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import LegalPage from '@/components/LegalPage';
import { EMAIL, LEGAL } from '@/lib/site';

export const metadata: Metadata = pageMeta('Mentions légales — Adel Loukal', `Éditeur, hébergeur et propriété intellectuelle du site ${LEGAL.company}, Adel Loukal, développeur web.`, '/mentions-legales');

export default function MentionsLegales() {
  return (
    <LegalPage eyebrow="MENTIONS LÉGALES" title="Mentions légales|_et informations sur l'éditeur._"
      lede="Les informations prévues par la loi pour la confiance dans l'économie numérique (LCEN)." updated="12 novembre 2026"
      sections={[
        ['Éditeur du site', <dl key="e">
          <div><dt>Nom commercial</dt><dd>{LEGAL.company}</dd></div>
          <div><dt>Exploitant</dt><dd>{`${LEGAL.owner}, ${LEGAL.status}`}</dd></div>
          <div><dt>Immatriculation</dt><dd>{LEGAL.rcs}</dd></div>
          <div><dt>SIREN</dt><dd>{LEGAL.siren}</dd></div>
          <div><dt>Activité</dt><dd>{LEGAL.activity}</dd></div>
          <div><dt>Contact</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
        </dl>],
        ['Directeur de la publication', <p key="d">{`${LEGAL.owner}, en qualité d'exploitant de ${LEGAL.company}.`}</p>],
        ['Hébergement', <dl key="h">
          <div><dt>Hébergeur</dt><dd>{LEGAL.host.name}</dd></div>
          <div><dt>Adresse</dt><dd>{LEGAL.host.address}</dd></div>
          <div><dt>Site</dt><dd><a href={LEGAL.host.url} target="_blank" rel="noopener">vercel.com ↗</a></dd></div>
        </dl>],
        ['Propriété intellectuelle', <p key="p">{`Les textes, le design, le code et les visuels de ce site sont la propriété de ${LEGAL.owner}, sauf mention contraire. Les noms, logos et sites des projets présentés appartiennent à leurs propriétaires respectifs et sont présentés à titre de références. Toute reproduction sans autorisation est interdite.`}</p>],
        ['Liens externes', <p key="l">Le site renvoie vers des sites tiers (projets clients, GitHub, hébergeur). Leur contenu ne relève pas de la responsabilité de l&apos;éditeur.</p>],
        ['Données personnelles', <p key="dp">Le traitement des données est détaillé dans la <a href="/confidentialite">politique de confidentialité</a>.</p>],
      ]} />
  );
}
