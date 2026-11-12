/* Firebase côté navigateur (dashboard, réservation).
   La configuration web n'est pas secrète : elle vient des variables NEXT_PUBLIC_FIREBASE_* (.env.local / Vercel).
   Sans configuration, le site fonctionne avec les données du code (lib/projects.ts) et sans enregistrement des rendez-vous. */
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = !!(firebaseConfig.apiKey && firebaseConfig.projectId);
/** Émulateurs locaux (tests) : NEXT_PUBLIC_FIREBASE_EMULATORS=1 */
export const useEmulators = process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === '1';

export function firebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}
