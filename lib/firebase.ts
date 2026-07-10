/**
 * @module firebase
 * @description Inicializacao centralizada do Firebase.
 *
 * Configuracao exclusiva via NEXT_PUBLIC_FIREBASE_* (env vars).
 * Next.js faz inline automatico de process.env.NEXT_PUBLIC_* no client bundle.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import { createLogger } from './logger';

const firebaseLogger = createLogger('Firebase');

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

if (!apiKey || !projectId || !appId) {
  throw new Error(
    'Firebase não configurado. Defina NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID e NEXT_PUBLIC_FIREBASE_APP_ID nas variáveis de ambiente (.env.local ou Vercel dashboard).'
  );
}

const config: Record<string, string | undefined> = { projectId, appId, apiKey };

const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const senderId = process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
if (authDomain) config.authDomain = authDomain;
if (storageBucket) config.storageBucket = storageBucket;
if (senderId) config.messagingSenderId = senderId;
if (measurementId) config.measurementId = measurementId;

const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || '(default)';

const app: FirebaseApp = getApps().length === 0 ? initializeApp(config) : getApps()[0];
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app, databaseId);
const functions: Functions = getFunctions(app, 'us-central1');

firebaseLogger.info('Firebase initialized', { projectId: config.projectId, databaseId });

export { app, auth, db, functions };
