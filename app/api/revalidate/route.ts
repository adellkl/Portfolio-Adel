/* Mise à jour immédiate du site après une modification dans le dashboard.
   Appel : POST avec « Authorization: Bearer <jeton Firebase> ».
   Vérification sans clé secrète : le jeton est validé par Firebase Auth, puis l'accès au document
   admins/{uid} est vérifié avec ce même jeton (les règles Firestore n'autorisent que son propriétaire). */
import { revalidatePath } from 'next/cache';
import { firebaseConfig, firebaseEnabled, useEmulators } from '@/lib/firebase';

const AUTH = useEmulators ? 'http://127.0.0.1:9099/identitytoolkit.googleapis.com' : 'https://identitytoolkit.googleapis.com';
const FS = useEmulators ? 'http://127.0.0.1:8080' : 'https://firestore.googleapis.com';

export async function POST(req: Request) {
  if (!firebaseEnabled) return Response.json({ ok: false }, { status: 503 });
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return Response.json({ ok: false }, { status: 401 });

  // 1. Jeton valide → identifiant du compte
  const look = await fetch(`${AUTH}/v1/accounts:lookup?key=${firebaseConfig.apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: token }), cache: 'no-store',
  });
  const uid = look.ok ? (await look.json()).users?.[0]?.localId : null;
  if (!uid) return Response.json({ ok: false }, { status: 401 });

  // 2. Le compte figure dans « admins »
  const admin = await fetch(`${FS}/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/admins/${uid}`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
  });
  if (!admin.ok) return Response.json({ ok: false }, { status: 403 });

  // 3. Toutes les pages (accueil, études de cas, à propos, sitemap…) seront régénérées à la prochaine visite
  revalidatePath('/', 'layout');
  return Response.json({ ok: true });
}
