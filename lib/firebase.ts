/**
 * @module firebase
 * @description Inicializacao centralizada do Firebase.
 *
 * Configuracao carregada por prioridade:
 * 1. NEXT_PUBLIC_FIREBASE_* (Vercel/producao) — acesso estatico para inline no client bundle
 * 2. firebase-applet-config.json (dev local — import ESM estatico)
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import firebaseConfig from '../firebase-applet-config.json';
import { createLogger } from './logger';

const firebaseLogger = createLogger('Firebase');

function buildConfig(): { config: Record<string, string>; databaseId: string } {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (apiKey && projectId && appId) {
    const config: Record<string, string> = { projectId, appId, apiKey };
    const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const senderId = process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID;
    const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
    if (authDomain) config.authDomain = authDomain;
    if (storageBucket) config.storageBucket = storageBucket;
    if (senderId) config.messagingSenderId = senderId;
    if (measurementId) config.measurementId = measurementId;

    return {
      config,
      databaseId: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || '(default)',
    };
  }

  if (firebaseConfig?.projectId && firebaseConfig?.appId) {
    return {
      config: firebaseConfig as unknown as Record<string, string>,
      databaseId: (firebaseConfig as Record<string, unknown>).firestoreDatabaseId as string || '(default)',
    };
  }

  throw new Error(
    'Firebase nao configurado. Defina NEXT_PUBLIC_FIREBASE_* nas variaveis de ambiente ou forneça firebase-applet-config.json.'
  );
}

const { config, databaseId } = buildConfig();

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
