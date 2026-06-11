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
    'Firebase nao configurado. Defina NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID e NEXT_PUBLIC_FIREBASE_APP_ID nas variaveis de ambiente (.env.local ou Vercel dashboard).'
  );
}

const config: Record<string, string> = { projectId, appId, apiKey };

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

export class FirestoreError extends Error {
  public operationType: string;
  public path: string | null;
  public authInfo: Record<string, unknown>;

  constructor(
    message: string,
    operationType: string,
    path: string | null = null,
    authInfo: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = 'FirestoreError';
    this.operationType = operationType;
    this.path = path;
    this.authInfo = authInfo;
  }
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

export function handleFirestoreError(
  error: unknown,
  operation: FirestoreErrorInfo['operationType'],
  path: string | null = null,
  userId?: string
): never {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const a = auth;
  const authInfo = {
    userId: userId || a.currentUser?.uid || 'anonymous',
    email: a.currentUser?.email || '',
    emailVerified: a.currentUser?.emailVerified || false,
    isAnonymous: a.currentUser?.isAnonymous || true,
    providerInfo: a.currentUser?.providerData.map(p => ({
      providerId: p.providerId,
      displayName: p.displayName || '',
      email: p.email || '',
    })) || [],
  };

  firebaseLogger.error(`Firestore ${operation} failed`, {
    path: path || undefined,
    operation,
    ...authInfo,
  }, error);

  if (errorMessage.includes('insufficient permissions')) {
    throw new FirestoreError(errorMessage, operation, path, authInfo);
  }

  throw error;
}
