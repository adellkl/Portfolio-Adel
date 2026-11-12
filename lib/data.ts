/* Lecture des projets côté serveur (pages publiques, sitemap, images de partage).
   Firestore (collection « projects », projets publiés, triés par `order`) si Firebase est configuré,
   sinon les projets du code (lib/projects.ts). En cas d'erreur Firestore, on retombe aussi sur le code. */
import 'server-only';
import { cache } from 'react';
import { collection, connectFirestoreEmulator, getDocs, getFirestore, query, where } from 'firebase/firestore/lite';
import { firebaseApp, firebaseEnabled, useEmulators } from './firebase';
import { PROJECTS, type Project } from './projects';
import { fromStored } from './project-codec';

export type StoredProject = Project & { order?: number; published?: boolean };

let emulatorWired = false;
function db() {
  const d = getFirestore(firebaseApp());
  if (useEmulators && !emulatorWired) { connectFirestoreEmulator(d, '127.0.0.1', 8080); emulatorWired = true; }
  return d;
}

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!firebaseEnabled) return PROJECTS;
  try {
    const snap = await getDocs(query(collection(db(), 'projects'), where('published', '==', true)));
    if (snap.empty) return PROJECTS; // base vide : tant que rien n'est importé, on garde le contenu actuel
    return snap.docs.map(d => fromStored(d.data(), d.id))
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  } catch (e) {
    console.error('Firestore indisponible, projets du code utilisés :', (e as Error).message);
    return PROJECTS;
  }
});

export async function getProject(slug: string) {
  const all = await getProjects();
  const idx = all.findIndex(p => p.slug === slug);
  return idx < 0 ? null : { p: all[idx], next: all[(idx + 1) % all.length] };
}
