import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';
import { Fragment, type CSSProperties } from 'react';
import SplitTitle from '@/components/SplitTitle';
import Steps from '@/components/services/Steps';
import Quiz from '@/components/services/Quiz';
import CtaBlock from '@/components/CtaBlock';
import { FaqSection } from '@/components/ui/faq-section';
import { getProjects } from '@/lib/data';
import { onlineCount, projectHref } from '@/lib/site';

export const metadata: Metadata = pageMeta('Services — Adel Loukal', 'Sites vitrines, applications web sur mesure, réservation et paiement, espaces clients, e-commerce et refontes : ce que je peux construire pour vous, et comment.', '/services');

const d = (s: string) => ({ '--d': s }) as CSSProperties;

const services: [string, string, string[], [string, string][]][] = [
  ['Sites vitrines modernes et performants', "Un site soigné et rapide qui présente votre activité, vos horaires et vos tarifs, et que vous pouvez faire évoluer facilement.",
    ['Design sur mesure, pensé pour le mobile', 'Contenus séparés du code : planning, tarifs, équipe', 'Photos et vidéos mises en valeur', 'Version anglaise si besoin', 'Référencement local et mise en ligne'],
    [['alpha-fight-club', 'Alpha Fight Club'], ['class-gallery', 'Class Gallery']]],
  ['Applications web sur mesure', "Un outil construit autour de votre métier, avec les écrans, les données et les règles dont vous avez vraiment besoin.",
    ['Analyse du besoin avant de dessiner', 'Base de données et authentification', 'Règles de sécurité côté serveur', 'Tests automatisés', 'Documentation pour la suite'],
    [['mon-livret', 'Mon Livret'], ['lebsa-danah', 'Lebsa Danah'], ['la-marine', 'La Marine']]],
  ['Plateformes de réservation et paiement', "Un site qui affiche vos disponibilités, prend les réservations à toute heure et gère le paiement, sans échange de messages.",
    ['Calendrier de disponibilités', 'Réservation de table ou prise de rendez-vous en ligne', 'Paiement en ligne ou sur place', 'Confirmation automatique par e-mail', 'Protection contre les doublons et le spam'],
    [['la-marine', 'La Marine'], ['lebsa-danah', 'Lebsa Danah'], ['test-psychotechnique', 'Test Psychotechnique Permis']]],
  ['Espaces clients et tableaux de bord administrateurs', "Un espace privé pour gérer vous-même vos contenus, vos réservations et vos demandes, sécurisé côté serveur.",
    ['Connexion sécurisée', 'Gestion de la carte, des événements ou des produits', 'Tableau des réservations et des demandes', 'Notifications par e-mail, WhatsApp ou push', 'Déconnexion automatique et limites de requêtes'],
    [['mon-livret', 'Mon Livret'], ['la-marine', 'La Marine'], ['lebsa-danah', 'Lebsa Danah']]],
  ['E-commerce et intégrations externes', "Une boutique ou un catalogue en ligne, relié aux services dont votre activité a besoin.",
    ['Catalogue avec une page par produit', 'Panier et formulaire de commande', 'E-mails transactionnels', 'Traduction automatique avec DeepL', 'Intégration de YouTube, WhatsApp ou Google'],
    [['lebsa-danah', 'Lebsa Danah'], ['class-gallery', 'Class Gallery']]],
  ['Refonte, maintenance et évolution', "Un site existant repris, modernisé ou amélioré au fil du temps, sans casser ce qui fonctionne.",
    ['Refonte complète sur une technologie récente', 'Redirections des anciennes adresses', 'Corrections et nouvelles fonctionnalités', 'Sécurité et performance', 'Suivi du référencement'],
    [['alpha-fight-club', 'Alpha Fight Club'], ['la-marine', 'La Marine']]],
];


export default async function ServicesPage() {
  const projects = await getProjects();
  // Chiffres parlants pour un client : [valeur, suffixe, libellé, préfixe]
  const counters: [number, string, string, string?][] = [
    [onlineCount(projects), '', 'sites livrés et en ligne'],
    [60, ' %', 'de réservations en plus pour Lebsa Danah', '+'],
    [3, ' sem.', 'maximum pour livrer un site complexe'],
    [1, '', 'seul interlocuteur, du design à la mise en ligne'],
  ];
  const refs = projects.map(p => ({ slug: p.slug, title: p.title, tagline: p.tagline }));
  return (
    <>
      <header className="page-hero" id="top">
        <div className="hero-glow"></div>
        <div className="wrap">
          <div className="eyebrow fade"><span className="mono">SERVICES</span></div>
          <SplitTitle text="Ce que je peux|_construire pour vous._" />
          <p className="lede fade" style={{ transitionDelay: '.6s' }}>Sites vitrines, applications sur mesure, réservation et paiement : un seul interlocuteur, du design à la mise en ligne.</p>
        </div>
      </header>

      {/* ============ SERVICES ============ */}
      <section className="block" style={{ paddingTop: 64 }}>
        <div className="wrap">
          <div className="svc-list" id="svcList">
            {services.map(([t, desc, list, refs], i) => (
              <div className="svc-row reveal" style={d(`${i * .05}s`)} key={t}>
                <div><span className="mono" style={{ fontSize: 12, color: 'var(--ash)' }}>{`0${i + 1}`}</span><h3>{t}</h3><p className="desc">{desc}</p>
                  <p className="ref">Exemple : {refs.map(([s, n], k) => <Fragment key={s}>{k ? ', ' : null}<a href={projectHref(s)}>{n}</a></Fragment>)}</p></div>
                <ul>{list.map(x => <li key={x}>{x}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MÉTHODE ============ */}
      <section className="block" id="methode">
        <div className="wrap">
          <div className="eyebrow reveal"><span className="mono">01</span>Méthode</div>
          <h2 className="reveal" style={d('.08s')}>Une façon de travailler simple et répétable.</h2>
          <div className="process">
            <Steps />
            <div className="counters" id="counters">
              {counters.map(([v, s, l, pre], i) => <div className="panel counter reveal" style={d(`${i * .06}s`)} key={l}><b data-count={v} data-suffix={s} data-prefix={pre}>{`${pre ?? ''}0${s}`}</b><span>{l}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUIZ ============ */}
      <section className="block" id="quiz">
        <div className="wrap">
          <div className="eyebrow reveal"><span className="mono">02</span>Le bon service</div>
          <h2 className="reveal" style={d('.08s')}>Trois questions <span className="muted">pour savoir par où commencer.</span></h2>
          <Quiz projects={refs} />
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <FaqSection n="03" />

      <CtaBlock n="04" />
    </>
  );
}
