/* Sous le hero de l'accueil : les technos de mes projets, en deux bandeaux qui défilent en sens opposé
   (logo, nom, rôle ; survol → projets où je l'ai utilisée). Voir components/about/Stack.tsx. */
import type { Project } from '@/lib/projects';
import Stack from '@/components/about/Stack';

export default function Marquee({ projects }: { projects: Project[] }) {
  return (
    <div className="strip">
      <small>Les outils de mes projets</small>
      <Stack projects={projects} />
    </div>
  );
}
