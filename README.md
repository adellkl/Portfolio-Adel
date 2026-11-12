# Adel Loukal — Portfolio

Site portfolio d'Adel Loukal (A.L FRONT), développeur full-stack : projets, services, réservation d'appel et contact.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, pages statiques), React 19, TypeScript
- CSS natif (`app/globals.css`), polices Inter et JetBrains Mono via `next/font`
- Icônes [lucide-react](https://lucide.dev)

## Démarrer

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production
npm run lint
```

## Où modifier le contenu

- `lib/projects.ts` : projets et études de cas
- `lib/site.ts` : e-mail, URL du site, informations légales, disponibilités de réservation
- `lib/faq.ts` : questions fréquentes
- `public/` : photo et captures des projets

## Mise en ligne

Définir la variable d'environnement `NEXT_PUBLIC_SITE_URL` avec le domaine du site (ex. `https://www.mon-domaine.fr`) pour le sitemap, le robots.txt et les balises de partage.

## Dashboard (/admin) et Firebase

Le dashboard permet de gérer les rendez-vous (confirmer, refuser, supprimer) et les projets (ajouter, modifier, publier, masquer, réordonner, supprimer, photos).

- **Sans configuration Firebase**, le site affiche les projets de `lib/projects.ts` et la réservation ouvre seulement la messagerie.
- **Avec Firebase** : les projets publiés viennent de Firestore (collection `projects`), chaque demande de rendez-vous est enregistrée (`appointments`) et le créneau est bloqué (`slots`). Les photos vont dans Storage (`projets/<slug>/`).

Mise en place :

1. Copier `.env.example` en `.env.local` et renseigner la configuration web Firebase (mêmes variables sur Vercel).
2. Activer **Authentication → E-mail/Mot de passe**, créer son compte, puis créer dans Firestore le document `admins/<uid du compte>`.
3. Activer **Storage** (formule Blaze) et déployer les règles : `npx firebase-tools deploy --only firestore:rules,storage`.
4. Dans le dashboard, onglet Projets : « Importer les 5 projets actuels ».

Tests locaux sur les émulateurs (Java requis) :

```bash
npx firebase-tools emulators:start --project demo-portfolio --only auth,firestore,storage
```
