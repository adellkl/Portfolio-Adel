/* =========================================================
   MES PROJETS — source unique du site.
   Chaque projet génère sa carte sur l'accueil + sa page
   /projets/<slug>. Les chiffres viennent des dépôts Git.
   ========================================================= */
export const COLORS = {teal:'var(--teal)',iris:'var(--iris)',lav:'var(--lav)',green:'var(--green)',coral:'var(--coral)'} as const;
export type ColorKey = keyof typeof COLORS;
export type VisualKey = 'planning' | 'calendar' | 'reservations' | 'catalogue' | 'permis';
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
  results: [number, string, string][];
  /** Section « En action » : capture pleine page du site (défile dans un cadre) ou vidéo MP4 si fournie */
  preview?: { src: string; height: number; video?: string };
};

export const PROJECTS: Project[] = [
  {
    slug:'alpha-fight-club', id:'PRJ-01', title:'Alpha Fight Club', tagline:'Le site d\'un club de grappling à Saint-Ouen',
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
    results:[[11,'','pages'],[26,'','commits en moins de 3 semaines'],[16,'','Next.js, dernière version']],
    preview:{ src:'/projets/alpha-fight-club.jpg', height:7200 },
  },
  {
    slug:'lebsa-danah', id:'PRJ-02', title:'Lebsa Danah', tagline:'Site, boutique et réservations d\'un showroom de caftans',
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
    results:[[91,'','commits'],[16,'','fichiers de tests'],[3,'','canaux de notification']],
    preview:{ src:'/projets/lebsa-danah.jpg', height:4675 },
  },
  {
    slug:'la-marine', id:'PRJ-03', title:'La Marine', tagline:'Le site d\'un restaurant gastronomique sur l\'île de Groix',
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
    results:[[187,'','commits'],[8,'','fonctions serveur Supabase'],[2,'','langues, français et anglais']],
    preview:{ src:'/projets/la-marine.jpg', height:4598 },
  },
  {
    slug:'class-gallery', id:'PRJ-04', title:'Class Gallery', tagline:'Le site et le catalogue d\'une galerie d\'art à Paris',
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
    results:[[140,'+','œuvres au catalogue'],[4,'','artistes permanents'],[2,'','langues, français et anglais']],
    preview:{ src:'/projets/class-gallery.jpg', height:2014 },
  },
  {
    slug:'test-psychotechnique', id:'PRJ-05', title:'Test Psychotechnique Permis', tagline:'La prise de rendez-vous d\'un centre de tests psychotechniques',
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
    results:[[80,' €','tarif unique, tout compris'],[3,'','situations couvertes'],[7,'j/7','ouvert de 9h à 20h']],
    preview:{ src:'/projets/test-psychotechnique.jpg', height:5829 },
  },
];
