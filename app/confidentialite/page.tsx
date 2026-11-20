import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import LegalPage from '@/components/LegalPage';
import { EMAIL, LEGAL } from '@/lib/site';

export const metadata: Metadata = pageMeta('Politique de confidentialité — Adel Loukal', 'Quelles données le site utilise, pourquoi, et comment exercer vos droits (RGPD).', '/confidentialite');

export default function Confidentialite() {
  return (
    <LegalPage eyebrow="CONFIDENTIALITÉ" title="Vos données,|_simplement expliquées._"
      lede="Ce site ne vend rien, ne piste personne et n'utilise aucun cookie publicitaire ni outil de mesure d'audience." updated="12 novembre 2026"
      sections={[
        ['Responsable du traitement', <p key="r">{`${LEGAL.owner}, ${LEGAL.status}, nom commercial ${LEGAL.company}. Contact : `}<a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>],
        ['Ce que le site ne fait pas', <ul key="n">
          <li>Aucune publicité, aucune revente de données, aucun suivi d&apos;un site à l&apos;autre.</li>
          <li>Aucune mesure d&apos;audience sans votre accord (voir ci-dessous).</li>
          <li>Les polices sont hébergées sur le site lui-même : aucun appel à Google Fonts.</li>
        </ul>],
        ['Mesure d\'audience (Google Analytics)', <p key="a">Si vous cliquez sur « Accepter » dans le bandeau, le site utilise Google Analytics 4, chargé par Google Tag Manager, pour compter les visites et savoir quelles pages sont consultées. Ces statistiques sont anonymisées dans les rapports, conservées au plus 14 mois par Google, et servent uniquement à améliorer le site. Si vous refusez ou n&apos;avez pas encore choisi, aucun cookie d&apos;audience n&apos;est déposé. Votre choix est gardé 6 mois dans votre navigateur ; vous pouvez le changer à tout moment avec le lien « Gérer les cookies » en bas de chaque page. Fournisseur : Google Ireland Limited, avec des transferts encadrés vers les États-Unis (Data Privacy Framework).</p>],
        ['Demandes de contact et de rendez-vous', <p key="c">Quand vous écrivez, votre messagerie s&apos;ouvre avec un message prêt : c&apos;est vous qui l&apos;envoyez. Quand vous réservez un appel, votre demande (nom, e-mail, projet, créneau) est aussi enregistrée dans une base de données Google Firebase, consultable uniquement par moi, pour bloquer le créneau et vous répondre. Ces informations servent uniquement à préparer l&apos;échange. Elles sont conservées le temps de la relation, puis au plus trois ans après le dernier contact.</p>],
        ['Réponses au quiz', <p key="q">Les réponses au quiz des services sont gardées dans votre navigateur (stockage local), pour préremplir votre demande. Elles ne quittent pas votre appareil tant que vous n&apos;envoyez pas de message. Elles sont effacées si vous cliquez sur « Recommencer » ou si vous videz les données du site.</p>],
        ['Hébergement', <p key="h">{`Le site est hébergé par ${LEGAL.host.name} (${LEGAL.host.address}), qui traite des journaux techniques (adresse IP, pages demandées) pour assurer le fonctionnement et la sécurité du service.`}</p>],
        ['Vos droits', <p key="d">Vous pouvez demander l&apos;accès, la rectification ou l&apos;effacement de vos données, ou vous opposer à leur traitement, en écrivant à <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. En cas de désaccord, vous pouvez saisir la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr ↗</a>).</p>],
      ]} />
  );
}
