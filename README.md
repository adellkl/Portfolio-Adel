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
