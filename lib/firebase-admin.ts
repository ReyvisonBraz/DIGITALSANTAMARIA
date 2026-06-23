import { getApp, getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let db: Firestore | null = null;

function initAdmin(): Firestore {
  if (db) return db;

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  const app: App = getApps().length > 0
    ? getApp()
    : serviceAccountKey
      ? initializeApp({
          credential: cert(JSON.parse(
            Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
          )),
          projectId,
        })
      : initializeApp({ projectId });

  db = getFirestore(app);
  return db;
}

export async function isStaffUid(uid: string): Promise<boolean> {
  try {
    const firestore = initAdmin();
    const snap = await firestore.doc(`admins/${uid}`).get();
    if (!snap.exists) return false;
    const role = snap.data()?.role;
    return role === 'admin' || role === 'clerk';
  } catch {
    return false;
  }
}