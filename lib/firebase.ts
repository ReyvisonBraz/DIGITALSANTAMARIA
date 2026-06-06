/**
 * @module firebase
 * @description Inicialização centralizada do Firebase para o Digital Santa Maria.
 *
 * Configuração carregada por prioridade:
 * 1. Variáveis de ambiente `NEXT_PUBLIC_FIREBASE_*` (.env.local)
 * 2. Arquivo `firebase-applet-config.json` (fallback)
 *
 * Exporta:
 * - `app` — Instância do Firebase App (singleton)
 * - `auth` — Instância do Firebase Auth
 * - `db` — Instância do Firestore (com database ID customizado)
 * - `FirestoreError` — Classe de erro customizada para operações Firestore
 * - `handleFirestoreError` — Handler centralizado de erros Firestore
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { createLogger } from './logger';
import fireaseConfig from '../firebase-applet-config.json';

const firebaseLogger = createLogger('Firebase');

function getFirebaseConfig() {
  const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;

  const projectId = env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'];
  const appId = env['NEXT_PUBLIC_FIREBASE_APP_ID'];
  const apiKey = env['NEXT_PUBLIC_FIREBASE_API_KEY'];
  const authDomain = env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'];
  const databaseId = env['NEXT_PUBLIC_FIREBASE_DATABASE_ID'] || '(default)';
  const storageBucket = env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'];
  const messagingSenderId = env['NEXT_PUBLIC_FIREBASE_SENDER_ID'];
  const measurementId = env['NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'] || '';

  if (apiKey && projectId && appId) {
    return { config: { projectId, appId, apiKey, authDomain, storageBucket, messagingSenderId, measurementId }, databaseId };
  }

  if (fireaseConfig?.projectId && fireaseConfig?.appId) {
    return { config: fireaseConfig, databaseId: fireaseConfig.firestoreDatabaseId || '(default)' };
  }

  throw new Error(
    'Firebase não configurado. Defina NEXT_PUBLIC_FIREBASE_* no .env.local ' +
    'ou preencha firebase-applet-config.json'
  );
}

const { config, databaseId } = getFirebaseConfig();

export const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app, databaseId);
export const functions = getFunctions(app, 'us-central1');

firebaseLogger.info('Firebase initialized', {
  projectId: config.projectId,
  databaseId,
});

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
  const authInfo = {
    userId: userId || auth.currentUser?.uid || 'anonymous',
    email: auth.currentUser?.email || '',
    emailVerified: auth.currentUser?.emailVerified || false,
    isAnonymous: auth.currentUser?.isAnonymous || true,
    providerInfo: auth.currentUser?.providerData.map(p => ({
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
