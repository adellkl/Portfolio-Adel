# Déploiement, domaine et outils Google

Ce document décrit la mise en ligne de **adelloukal.fr** : hébergement, DNS, variables d'environnement, Google Search Console, Tag Manager et Analytics. Rien de secret ici : les identifiants listés sont publics (ils apparaissent dans le code de la page).

## Vue d'ensemble

| Élément | Service | Réglage |
|---|---|---|
| Nom de domaine | Gandi (registrar et DNS LiveDNS) | `adelloukal.fr`, expire le 19/11/2027 |
| Hébergement | Vercel, projet `portfolio-adel` | déploiement automatique à chaque push sur `main` |
| Adresse officielle | — | `https://adelloukal.fr` (le `www` redirige en 308) |
| Données (projets, rendez-vous) | Firebase `portfolio-39116` | voir le README |
| Référencement | Google Search Console | propriété de domaine `adelloukal.fr` (vérifiée par DNS) |
| Balises | Google Tag Manager | conteneur `GTM-PNKDB8PF` |
| Mesure d'audience | Google Analytics 4 | flux Web `G-QWGNR2P5BL`, chargé par Tag Manager |

## DNS chez Gandi

Gandi → Nom de domaine → `adelloukal.fr` → Enregistrements DNS. Une sauvegarde de la zone d'origine existe (bouton « Restaurer »).

| Nom | Type | Valeur | Rôle |
|---|---|---|---|
| `@` | A | `76.76.21.21` | site sur Vercel |
| `www` | CNAME | `cname.vercel-dns.com.` | `www` sur Vercel (redirigé vers `adelloukal.fr`) |
| `@` | TXT | `google-site-verification=E0WdBuIaUjGYKGUFE_ZfN6nLA2h5usBfDSqopv8fuZE` | preuve de propriété Search Console — **ne pas supprimer** |
| `@` | MX, TXT (SPF), `_dmarc`, `gm*._domainkey`, SRV, `webmail` | valeurs Gandi | e-mail Gandi — **ne pas toucher** |

Vérifier depuis un terminal :

```bash
dig +short A adelloukal.fr          # 76.76.21.21
dig +short CNAME www.adelloukal.fr  # cname.vercel-dns.com.
dig +short TXT adelloukal.fr        # contient google-site-verification=…
```

## Vercel

- Domaines du projet : `adelloukal.fr` (principal) et `www.adelloukal.fr` (redirection 308 vers `adelloukal.fr`). Le certificat HTTPS est émis et renouvelé automatiquement par Vercel.
- Variables d'environnement (Production) :
  - `NEXT_PUBLIC_SITE_URL=https://adelloukal.fr` : adresse utilisée pour le sitemap, le robots.txt, les liens canoniques, les aperçus de partage et les données structurées ;
  - `NEXT_PUBLIC_FIREBASE_*` : configuration web Firebase (voir le README) ;
  - `NEXT_PUBLIC_GTM_ID` (facultatif) : autre conteneur Tag Manager ; vide = `GTM-PNKDB8PF`. Mettre une valeur vide (`NEXT_PUBLIC_GTM_ID=`) désactive toute mesure.
- Une variable `NEXT_PUBLIC_*` est intégrée au moment du build : après l'avoir modifiée, il faut **redéployer**.

## Mesure d'audience et consentement (CNIL)

- Le code est dans `app/layout.tsx` (mode consentement Google + chargement de Tag Manager) et `components/chrome/Consent.tsx` (bandeau).
- Par défaut tout est **refusé** : aucun cookie Analytics n'est déposé tant que le visiteur n'a pas cliqué « Accepter ».
- Le choix est gardé 6 mois dans le navigateur (`localStorage`, clé `consent-analytics`) ; le lien « Gérer les cookies » du pied de page rouvre le bandeau.
- Pas de bandeau ni de mesure sur le dashboard `/admin`.
- La page `/confidentialite` décrit tout cela ; la mettre à jour si on ajoute un autre outil.

## Google Tag Manager (`GTM-PNKDB8PF`)

Le conteneur (publié) contient une **balise Google** `G-QWGNR2P5BL`, déclenchée sur toutes les pages. Tag Manager respecte le mode consentement envoyé par le site : sans accord, GA4 n'enregistre rien de nominatif et ne dépose pas de cookie.

Ajouter une balise : Tag Manager → Espace de travail → Balises → Nouvelle → **Prévisualiser** (vérifie sur le site) → **Envoyer** (publie).

## Google Analytics 4

- Flux Web `G-QWGNR2P5BL`, chargé par la balise Google du conteneur Tag Manager (compte Google d'Adel qui gère Tag Manager).
- À régler dans Analytics → Administration → Collecte et conservation des données : conservation **14 mois** (sinon 2 mois par défaut) ; désactiver les partages de données facultatifs.
- Une seconde propriété, « Adel Loukal » / `G-73FKGB47CQ`, a été créée par erreur depuis un autre compte Google : elle n'est pas utilisée et peut être supprimée.
- Les visites apparaissent dans Rapports → Temps réel (en acceptant le bandeau sur le site).

## Google Search Console

- Propriété de **domaine** `adelloukal.fr` (couvre `www`, `http` et `https`), vérifiée par l'enregistrement TXT ci-dessus.
- Sitemap envoyé : `https://adelloukal.fr/sitemap.xml` (généré par `app/sitemap.ts`, mis à jour à chaque déploiement).
- `https://adelloukal.fr/robots.txt` autorise tout sauf `/admin`, `/api` et `/_next`.

## Vérifications après un déploiement

```bash
curl -sI https://adelloukal.fr | head -1                 # HTTP/2 200
curl -sI https://www.adelloukal.fr | grep -i location    # → https://adelloukal.fr/
curl -s https://adelloukal.fr/sitemap.xml | grep -c '<loc>https://adelloukal.fr'
curl -s https://adelloukal.fr | grep -o 'GTM-PNKDB8PF' | head -1
```

## En cas de problème

- **Site injoignable** : vérifier les DNS (`dig`) et l'état du domaine dans Vercel (Settings → Domains).
- **E-mail cassé** : comparer la zone avec la sauvegarde Gandi ; seuls `@ A`, `www CNAME` et le TXT Google ont été modifiés.
- **Search Console « non validé »** : le TXT Google a été supprimé ; le remettre.
- **Aucune donnée Analytics** : vérifier que Tag Manager est publié, puis accepter le bandeau et ouvrir Rapports → Temps réel.
