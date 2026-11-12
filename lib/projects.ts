/* =========================================================
   MES PROJETS — source unique du site.
   Chaque projet génère sa carte sur l'accueil + sa page
   /projets/<slug>. Chiffres orientés client : délais, échanges, résultats.
   ========================================================= */
export const COLORS = {teal:'var(--teal)',iris:'var(--iris)',lav:'var(--lav)',green:'var(--green)',coral:'var(--coral)'} as const;
export type ColorKey = keyof typeof COLORS;
export type VisualKey = 'livret' | 'planning' | 'calendar' | 'reservations' | 'catalogue' | 'permis' | 'image';
/** Polices des chartes (chargées sur les pages projet uniquement, components/Charte.tsx) */
export type FontKey = 'geist' | 'figtree' | 'newsreader' | 'schibsted' | 'plexmono' | 'caveat' | 'cormorant' | 'montserrat' | 'roboto' | 'inter' | 'system';
export const lc = (s: string) => s[0].toLowerCase() + s.slice(1);

export type Project = {
  slug: string; id: string; title: string; tagline: string;
  category: string; year: string; period: string; status: string; role: string;
  client: string; url: string; urlLabel: string;
  stack: [string, ColorKey?][];
  visual: VisualKey;
  summary: string;
  /** Contient du HTML de confiance (<strong>) */
  context: string;
  problems: [string, ColorKey, string][];
  approach: [string, string][];
  /** [valeur, suffixe, libellé, préfixe facultatif ex. '+'] */
  results: [number, string, string, string?][];
  /** Galerie bento : 5 captures du site en ligne (public/projets/<slug>/1..5.jpg), « m » = mobile */
  gallery?: [string, 'd' | 'm', string?][]; // [légende, ordinateur/mobile, URL de l'image (sinon /projets/<slug>/<n>.jpg)]
  /** Charte graphique relevée sur le site en ligne et dans le dépôt */
  charte?: { intent: string; fonts: [string, FontKey | string, string][]; colors: [string, string, string][] };
};

export const PROJECTS: Project[] = [
  {
    slug:'mon-livret', id:'PRJ-01', title:'Mon Livret', tagline:'Le livret d\'accueil numérique pour les hôtes Airbnb',
    category:'SaaS', year:'2026', period:'Juil. → oct. 2026', status:'En ligne', role:'Conception, design & développement',
    client:'Projet personnel', url:'https://monlivret.eu', urlLabel:'monlivret.eu',
    stack:[['Next.js','teal'],['Firebase','coral'],['Stripe','iris'],['DeepL','lav']],
    visual:'livret',
    summary:"Un SaaS qui remplace le classeur papier des locations saisonnières : chaque logement a son livret en ligne, ouvert par lien ou QR code, avec l'arrivée, le Wi-Fi, les équipements, les bonnes adresses et le départ.",
    context:"Les hôtes Airbnb répondent sans cesse aux mêmes questions : code d'accès, Wi-Fi, plaque de cuisson, heure de départ. Mon Livret centralise tout dans un <strong>livret web propre à chaque logement</strong>, que le voyageur ouvre sur son téléphone sans application, et donne à l'hôte <strong>un espace pour tout gérer</strong>, du studio à la conciergerie.",
    problems:[["Un parcours voyageur clair, en trois temps : arrivée, séjour, départ","green","UX"],["Des abonnements payants fiables, activés uniquement par webhook Stripe signé","iris","Paiement"],["Des conciergeries qui partagent les logements en équipe, avec des droits différents","lav","Business"]],
    approach:[
      ["Le voyageur d'abord","Un livret pensé pour le téléphone : arrivée expliquée dans l'ordre, Wi-Fi dès l'ouverture, équipements, bonnes adresses, contact de l'hôte et liste des gestes avant le départ."],
      ["Un prix selon le parc","Un logement gratuit sans carte bancaire, puis Pro facturé au nombre de logements, avec deux mois offerts à l'année. Les quotas sont contrôlés côté serveur, jamais seulement dans l'interface."],
      ["Un espace pour les conciergeries","Dès dix logements : comptes d'équipe avec des rôles, consignes communes à plusieurs logements, interventions et rapports pour les propriétaires."],
      ["Traductions maîtrisées","Version anglaise traduite avec DeepL, gardée en brouillon jusqu'à relecture par l'hôte. Les codes d'accès et les coordonnées ne sont jamais envoyés au traducteur."],
    ],
    results:[[3,' sem.','de réflexion avant la première ligne de code'],[12,' sem.','de conception et de développement'],[10,' min','pour qu\'un hôte prépare son livret']],
    gallery: [["Accueil", 'd'], ["Le séjour sur le téléphone", 'd'], ["Bonnes adresses et activités", 'd'], ["Accueil sur mobile", 'm'], ["Le livret voyageur sur mobile", 'm']],
    charte: {
      intent: "Un accueil chaleureux et rassurant : un fond lin, un vert forêt presque noir pour le texte et les boutons, et une touche de terracotta pour les mots qui comptent et l'action principale.",
      fonts: [["Titres", "geist", "Geist · grotesque net, graisse 500"], ["Texte et boutons", "figtree", "Figtree · ronde et lisible sur mobile"]],
      colors: [["Lin", "#F8F5F1", "Fond principal"], ["Sable", "#F3EEE8", "Sections et cartes"], ["Forêt", "#1F2925", "Titres et boutons"], ["Sauge", "#5F6863", "Texte"], ["Terracotta", "#B9532F", "Accent et bouton principal"]],
    },
  },
  {
    slug:'alpha-fight-club', id:'PRJ-02', title:'Alpha Fight Club', tagline:'Le site d\'un club de grappling à Saint-Ouen',
    category:'Site associatif', year:'2026', period:'Oct. → nov. 2026', status:'En ligne', role:'Direction artistique & développement',
    client:'Alpha Fight Club, Saint-Ouen', url:'https://www.alphafightclub.com', urlLabel:'alphafightclub.com',
    stack:[['Next.js 16','teal'],['React 19','iris'],['Tailwind 4','lav'],['TypeScript']],
    visual:'planning',
    summary:"La nouvelle version du site d'Alpha Fight Club, club de grappling No-Gi au gymnase Pablo Neruda : planning, tarifs, équipe, combattants, photos et vidéos.",
    context:"Le club avait déjà un premier site en React. Cette version repart de zéro sur Next.js 16 avec une <strong>direction artistique documentaire</strong> : fond encre, papier minéral, touches de cobalt, photos en noir et blanc et légendes façon archive.",
    problems:[["Des informations pratiques (horaires, tarifs, accès) à trouver en deux clics","green","Contenu"],["Mettre en avant les combattants et le palmarès du club","coral","Identité"],["Garder les anciennes adresses sans liens cassés","iris","SEO"]],
    approach:[
      ["Une identité forte","Une direction artistique sobre et documentaire, où chaque photo n'apparaît qu'une seule fois sur le site."],
      ["11 pages claires","Accueil, grappling, planning, tarifs, contact, équipe, combattants, partenaires, photos, vidéos et pages légales."],
      ["Contenu facile à modifier","Planning, tarifs, équipe et palmarès sont des fichiers de données séparés du code."],
      ["Continuité","Les anciennes adresses anglaises redirigent vers les nouvelles, et la page vidéos lit la chaîne YouTube du club."],
    ],
    results:[[3,' sem.','du premier échange à la mise en ligne'],[6,'','échanges avec le club'],[11,'','pages, pensées d\'abord pour le mobile']],
    gallery: [["Accueil", 'd'], ["Planning des cours", 'd'], ["Combattants", 'd'], ["Accueil sur mobile", 'm'], ["Le grappling sur mobile", 'm']],
    charte: {
      intent: "Une direction artistique documentaire : fond encre, papier minéral, touches de cobalt, photos en noir et blanc et légendes en mono, façon archive.",
      fonts: [["Titres", "newsreader", "Newsreader · serif éditorial, graisse 400"], ["Texte", "schibsted", "Schibsted Grotesk · grotesque lisible"], ["Légendes et boutons", "plexmono", "IBM Plex Mono · capitales, esprit archive"], ["Notes manuscrites", "caveat", "Caveat · fiches de séance écrites à la main"]],
      colors: [["Encre", "#161716", "Fond principal"], ["Encre 2", "#1F201F", "Surfaces"], ["Papier", "#E9E5DB", "Cartes et fiches"], ["Plomb", "#5C5A55", "Texte secondaire"], ["Cobalt", "#1747B9", "Accent et boutons"]],
    },
  },
  {
    slug:'lebsa-danah', id:'PRJ-03', title:'Lebsa Danah', tagline:'Site, boutique et réservations d\'un showroom de caftans',
    category:'Site vitrine & réservation', year:'2026', period:'Juin → nov. 2026', status:'En ligne', role:'Design & développement',
    client:'Lebsa Danah, Eaubonne', url:'https://www.lebsadanah.fr', urlLabel:'lebsadanah.fr',
    stack:[['React','teal'],['Supabase','green'],['GSAP','iris'],['PWA']],
    visual:'calendar',
    summary:"Le site du showroom Lebsa Danah, spécialisé dans la location de caftans et de takchitas à Eaubonne : catalogue, boutique, disponibilités, prise de rendez-vous d'essayage et back-office.",
    context:"Le showroom gérait ses réservations par messages. Il fallait un site qui <strong>donne envie</strong> — galerie, savoir-faire, inspiration — et qui <strong>évite les doubles réservations</strong> en montrant les disponibilités de chaque tenue.",
    problems:[["Savoir si un caftan est libre à une date donnée","coral","Dispo"],["Prendre rendez-vous pour un essayage sans échange de messages","iris","Flux"],["Prévenir la gérante immédiatement à chaque demande","lav","Alertes"]],
    approach:[
      ["Vitrine et boutique","Hero vidéo, galerie, savoir-faire et boutique avec panier et filtres, animés au scroll avec GSAP et pensés d'abord pour le mobile."],
      ["Disponibilités en direct","Un vérificateur de disponibilité par tenue et un calendrier relié à Supabase."],
      ["Rendez-vous d'essayage","Un parcours guidé pour choisir la date et le créneau, puis confirmation par email."],
      ["Back-office sécurisé","Espace /admin protégé par Supabase Auth et des règles RLS, notifications par email, WhatsApp et Web Push."],
    ],
    results:[[60,' %','de réservations de créneaux','+'],[3,' sem.','pour mettre en ligne la première version'],[12,'','échanges avec la gérante']],
    gallery: [["Accueil", 'd'], ["Essayage privé", 'd'], ["La collection", 'd'], ["Accueil sur mobile", 'm'], ["La collection sur mobile", 'm']],
    charte: {
      intent: "Une élégance chaleureuse : un serif fin et aéré pour les titres, des tons sable et taupe, et les tenues mises en avant par de grandes photos.",
      fonts: [["Titres", "cormorant", "Cormorant Garamond · light 300, très aéré"], ["Texte et boutons", "inter", "Inter · sobre, petites capitales espacées"]],
      colors: [["Blanc", "#FFFFFF", "Fond principal"], ["Crème", "#F7F4EF", "Surfaces"], ["Sable", "#EFE7DD", "Sections"], ["Taupe", "#A68E79", "Accent et boutons"], ["Brun", "#6E6259", "Texte secondaire"], ["Espresso", "#211D1A", "Titres et texte"]],
    },
  },
  {
    slug:'la-marine', id:'PRJ-04', title:'La Marine', tagline:'Le site d\'un restaurant gastronomique sur l\'île de Groix',
    category:'Site vitrine & réservation', year:'2026', period:'Déc. 2025 → août 2026', status:'En ligne', role:'Design & développement',
    client:'Restaurant La Marine, Île de Groix', url:'https://www.lamarinegroix.com', urlLabel:'lamarinegroix.com',
    stack:[['React','teal'],['Supabase','green'],['GSAP','iris'],['DeepL','lav']],
    visual:'reservations',
    summary:"Le site du restaurant La Marine, sur l'île de Groix : la carte, l'équipe, les événements, le service traiteur, les bons à offrir et la réservation de table, avec un back-office complet.",
    context:"Un restaurant gastronomique ouvert depuis 1985, avec une activité traiteur pour les mariages et les séminaires. Le site devait <strong>donner envie de venir</strong> et <strong>laisser l'équipe tout gérer seule</strong> : réservations, carte, événements, partenaires et traductions.",
    problems:[["Recevoir les réservations de table sans doublons ni spam","coral","Réservations"],["Mettre à jour la carte, les événements et les partenaires sans développeur","iris","Back-office"],["Être trouvé sur « restaurant Groix » et accueillir les visiteurs étrangers","green","SEO"]],
    approach:[
      ["Réservation en ligne","Un formulaire de réservation avec confirmation par email, un calendrier côté admin et des badges pour les demandes non lues."],
      ["Back-office complet","Gestion de la carte, des catégories, des événements, des partenaires, des bons « À offrir » et des traductions."],
      ["Sécurité côté serveur","Connexion admin par fonctions Supabase, déconnexion après 2 h d'inactivité, limites de requêtes et rejet des réservations malformées."],
      ["Bilingue et référencé","Version anglaise traduite avec DeepL depuis l'admin, données structurées Restaurant et FAQ, sitemap et suivi d'audience."],
    ],
    results:[[1,' sem.','de réflexion avant le design'],[3,' sem.','pour la mise en ligne'],[8,' mois','de suivi et d\'évolutions']],
    gallery: [["Accueil", 'd'], ["L'alliance de la tradition", 'd'], ["Hôtels et partenaires", 'd'], ["Accueil sur mobile", 'm'], ["Partenaires sur mobile", 'm']],
    charte: {
      intent: "La gastronomie au bord de la mer : des titres serif avec italiques, des surtitres en capitales espacées couleur ambre, sur un fond pierre très clair.",
      fonts: [["Titres", "cormorant", "Cormorant Garamond · romain et italique"], ["Texte et boutons", "montserrat", "Montserrat · capitales espacées pour les boutons"]],
      colors: [["Pierre", "#FAFAF9", "Fond principal"], ["Encre", "#1C1917", "Titres et texte"], ["Gris pierre", "#57534E", "Texte secondaire"], ["Ambre", "#D97706", "Surtitres et accents"], ["Ambre foncé", "#B45309", "Bouton de réservation"]],
    },
  },
  {
    slug:'class-gallery', id:'PRJ-05', title:'Class Gallery', tagline:'Le site et le catalogue d\'une galerie d\'art à Paris',
    category:'Site vitrine & catalogue', year:'2026', period:'Juin → juil. 2026', status:'En ligne', role:'Design & développement',
    client:'CLASS GALLERY-Paris, Paris 6e', url:'https://www.classgalleryparis.com', urlLabel:'classgalleryparis.com',
    stack:[['React','teal'],['Vite','iris'],['Tailwind CSS','lav'],['Motion']],
    visual:'catalogue',
    summary:"Le site bilingue de CLASS GALLERY-Paris, galerie d'art de la rue Dauphine : artistes permanents, catalogue d'œuvres en bronze, bois, verre et peinture, expositions et contact.",
    context:"La galerie présente quatre artistes permanents et plus de cent quarante œuvres. Le site devait être <strong>un vrai catalogue</strong>, consultable œuvre par œuvre en français et en anglais, et <strong>bien référencé</strong> malgré une application React.",
    problems:[["Présenter plus de 140 œuvres, classées par artiste et par matière","iris","Catalogue"],["Être lisible par Google alors que le site est une application React","green","SEO"],["Recevoir les demandes des visiteurs sans spam","coral","Formulaires"]],
    approach:[
      ["Catalogue structuré","Toutes les œuvres dans un seul fichier de données : titre, dimensions, technique, artiste et disponibilité."],
      ["Une page par œuvre","Des adresses propres, /oeuvres/… et /artistes/…, pour partager et référencer chaque pièce."],
      ["Pré-rendu pour Google","Un script génère le sitemap et pré-rend les pages au moment du build : chaque œuvre est indexable."],
      ["Français et anglais","Routes et contenus traduits, formulaires sécurisés et accès direct à WhatsApp sur mobile."],
    ],
    results:[[2,' sem.','de réalisation'],[140,'+','œuvres au catalogue'],[8,'','échanges avec la galerie']],
    gallery: [["Accueil", 'd'], ["Sélection d'œuvres", 'd'], ["Catalogue des œuvres", 'd'], ["Accueil sur mobile", 'm'], ["Œuvres sur mobile", 'm']],
    charte: {
      intent: "Une galerie blanche : une typographie neutre et une palette en noir et blanc, pour laisser toute la place aux œuvres.",
      fonts: [["Titres", "roboto", "Roboto · semi-gras 600"], ["Texte et libellés", "roboto", "Roboto · regular, capitales espacées pour les catégories"]],
      colors: [["Blanc", "#FFFFFF", "Fond et cartes"], ["Blanc cassé", "#FCFCFC", "Fond de page"], ["Gris clair", "#E5E5E5", "Bordures"], ["Gris", "#737373", "Texte secondaire"], ["Noir", "#0A0A0A", "Titres et texte"]],
    },
  },
  {
    slug:'test-psychotechnique', id:'PRJ-06', title:'Test Psychotechnique Permis', tagline:'La prise de rendez-vous d\'un centre de tests psychotechniques',
    category:'Site vitrine & réservation', year:'2025', period:'2025', status:'En ligne', role:'Design & développement',
    client:'Centre 2e Chance, Colombes', url:'https://test-psychotechnique-permis.com', urlLabel:'test-psychotechnique-permis.com',
    stack:[['Next.js','teal']],
    visual:'permis',
    summary:"Le site du Centre 2e Chance à Colombes, centre agréé de tests psychotechniques pour récupérer son permis : prise de rendez-vous en ligne 24h/24, tarif, FAQ et accès.",
    context:"Après une invalidation, une suspension ou une annulation du permis, il faut passer un test psychotechnique dans un centre agréé. Le site devait <strong>rassurer</strong> des conducteurs souvent pressés et <strong>leur permettre de réserver en quelques clics</strong>, à toute heure.",
    problems:[["Prendre rendez-vous à toute heure, sans appel téléphonique","green","Réservation"],["Expliquer clairement les trois situations : invalidation, suspension, annulation","iris","Contenu"],["Être trouvé depuis toute l'Île-de-France","coral","SEO local"]],
    approach:[
      ["Réservation en ligne","Une prise de rendez-vous ouverte 24h/24, avec paiement sur place et aucun acompte demandé en ligne."],
      ["Une page par situation","Invalidation, suspension et annulation du permis ont chacune leur page et leurs explications."],
      ["Rassurer","Un tarif unique affiché, une deuxième chance offerte en cas d'échec, la psychologue présentée et les avis Google visibles."],
      ["Référencement local","Les départements et villes d'Île-de-France desservis, et l'accès en transports depuis La Défense, le tram T2 et la ligne L."],
    ],
    results:[[10,' jours','du brief à la mise en ligne'],[5,'','échanges avec le centre'],[80,' €','tarif unique, affiché clairement']],
    gallery: [["Accueil", 'd'], ["Le centre de Colombes", 'd'], ["Pourquoi choisir le centre", 'd'], ["Accueil sur mobile", 'm'], ["Les services sur mobile", 'm']],
    charte: {
      intent: "Rassurer et aller vite : la police du système pour un affichage immédiat, du bleu pour l'action et du vert pour les bonnes nouvelles, comme la deuxième chance offerte.",
      fonts: [["Titres et texte", "system", "Police système (SF Pro, Segoe UI, Roboto) · aucun téléchargement"]],
      colors: [["Gris très clair", "#F9FAFB", "Fond principal"], ["Encre", "#111827", "Titres"], ["Ardoise", "#4B5563", "Texte"], ["Bleu", "#2563EB", "Boutons de rendez-vous"], ["Émeraude", "#059669", "Validation et 2e chance"], ["Sarcelle", "#0D9488", "Logo et repères"]],
    },
  },
];
