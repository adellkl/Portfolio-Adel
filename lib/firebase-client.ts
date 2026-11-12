'use client';
/* Services Firebase du navigateur (Firestore, Auth, Storage), avec branchement sur les émulateurs en test. */
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseApp, useEmulators } from './firebase';

let _db: Firestore | null = null, _auth: Auth | null = null, _st: FirebaseStorage | null = null;

export function db() {
  if (!_db) { _db = getFirestore(firebaseApp()); if (useEmulators) connectFirestoreEmulator(_db, '127.0.0.1', 8080); }
  return _db;
}
export function auth() {
  if (!_auth) { _auth = getAuth(firebaseApp()); if (useEmulators) connectAuthEmulator(_auth, 'http://127.0.0.1:9099', { disableWarnings: true }); }
  return _auth;
}
export function storage() {
  if (!_st) { _st = getStorage(firebaseApp()); if (useEmulators) connectStorageEmulator(_st, '127.0.0.1', 9199); }
  return _st;
}

/* Rendez-vous : un document par créneau (id = « AAAA-MM-JJ_HH:MM »), doublé d'un verrou public
   sans donnée personnelle dans « slots » pour afficher les créneaux déjà pris. */
export type Appointment = {
  name: string; email: string; message: string; date: string; time: string;
  status: 'nouveau' | 'confirmé' | 'annulé'; brief?: string; createdAt?: { toDate(): Date };
};
export const slotId = (date: string, time: string) => `${date}_${time.replace(':', 'h')}`;

/** Demande au site de se mettre à jour tout de suite (après une modification dans le dashboard) */
export async function refreshSite() {
  try {
    const token = await auth().currentUser?.getIdToken();
    if (token) await fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  } catch { /* au pire, le site se met à jour seul en une minute */ }
}
