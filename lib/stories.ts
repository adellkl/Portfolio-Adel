/* Récits courts de l'accueil (section Réalisations), différents de l'étude de cas :
   l'accueil raconte l'histoire côté client (le besoin, l'idée, ce que ça change), sans technique ni chiffres ;
   la page /projets/<slug> garde le détail (contexte, enjeux, approche, chiffres, galerie, charte).
   Un projet ajouté depuis le dashboard sans récit affiche son résumé. */
export type Story = { why: string; how: string; impact: string };

export const STORIES: Record<string, Story> = {
  'mon-livret': {
    why: "Tout est parti d'un constat simple : les hôtes Airbnb passent leurs soirées à répondre aux mêmes messages. Le classeur posé sur la table du salon, personne ne le lit, et il n'est jamais à jour.",
    how: "J'ai imaginé un livret qui s'ouvre d'un simple scan, sans application, pensé comme un séjour : on arrive, on s'installe, on repart. Côté hôte, tout se modifie en quelques minutes et le lien ne change jamais.",
    impact: "Les voyageurs trouvent seuls le code, le Wi-Fi ou l'heure de départ. L'hôte récupère du temps et offre un accueil plus soigné, du simple studio à la conciergerie.",
  },
  'alpha-fight-club': {
    why: "Le club grandissait, mais son premier site ne reflétait ni son ambiance ni son niveau. Les futurs adhérents cherchaient les horaires et les tarifs sans les trouver.",
    how: "On a repensé le site comme le carnet du club : photos en noir et blanc, typographie éditoriale, et l'essentiel (planning, tarifs, inscription) à deux clics de l'accueil.",
    impact: "Un site qui donne envie de pousser la porte du gymnase, et qui met enfin en avant les combattants et le palmarès du club.",
  },
  'lebsa-danah': {
    why: "Le showroom prenait toutes ses réservations par messages : des allers-retours sans fin, et parfois deux clientes intéressées par le même caftan à la même date.",
    how: "J'ai construit une vitrine qui fait rêver et, derrière, un vrai outil de travail : les disponibilités de chaque tenue, un rendez-vous d'essayage guidé, et la gérante prévenue à chaque demande.",
    impact: "Les clientes réservent seules, à toute heure. La gérante passe moins de temps sur son téléphone et plus de temps avec ses clientes.",
  },
  'la-marine': {
    why: "Un restaurant gastronomique ouvert depuis 1985 sur l'île de Groix, avec une activité traiteur, mais un site qui ne donnait ni envie de venir ni la possibilité de réserver.",
    how: "Le site raconte la maison, la carte et l'équipe. Derrière, l'équipe gère tout depuis son propre espace : réservations, carte, événements, bons cadeaux et traductions.",
    impact: "Les réservations arrivent en ligne, les visiteurs étrangers lisent le site en anglais, et l'équipe reste autonome au quotidien, sans dépendre de personne.",
  },
  'class-gallery': {
    why: "Une galerie de la rue Dauphine, quatre artistes permanents et plus d'une centaine d'œuvres, mais aucun moyen de les découvrir avant de passer la porte.",
    how: "J'ai conçu un site sobre, presque blanc, qui s'efface devant les œuvres : chaque pièce a sa propre page, en français et en anglais, prête à être partagée.",
    impact: "Les collectionneurs parcourent le catalogue depuis chez eux, en France comme à l'étranger, et arrivent à la galerie en sachant ce qu'ils viennent voir.",
  },
  'test-psychotechnique': {
    why: "Après une suspension ou une annulation de permis, les conducteurs doivent passer un test rapidement, souvent dans le stress, sans savoir à qui s'adresser.",
    how: "Un site qui rassure en quelques secondes : un tarif clair, la deuxième chance offerte, la psychologue présentée, et un rendez-vous pris en ligne, de jour comme de nuit.",
    impact: "Les conducteurs réservent sans passer un coup de fil, et le centre de Colombes se fait connaître dans toute l'Île-de-France.",
  },
};
