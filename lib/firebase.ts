/**
 * @module firebase
 * @description Inicializacao centralizada do Firebase.
 *
 * Configuracao carregada por prioridade:
 * 1. NEXT_PUBLIC_FIREBASE_* (Vercel/producao)
 * 2. firebase-applet-config.json (dev local)
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';
import { createLogger } from './logger';

const firebaseLogger = createLogger('Firebase');

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _functions: Functions | null = null;
let _initialized = false;
let _initError: Error | null = null;

function readEnvConfig(): { config: Record<string, string>; databaseId: string } | null {
  const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;
  const projectId = env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'];
  const appId = env['NEXT_PUBLIC_FIREBASE_APP_ID'];
  const apiKey = env['NEXT_PUBLIC_FIREBASE_API_KEY'];
  if (!apiKey || !projectId || !appId) return null;

  const config: Record<string, string> = { projectId, appId, apiKey };
  const authDomain = env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'];
  const storageBucket = env['NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'];
  const senderId = env['NEXT_PUBLIC_FIREBASE_SENDER_ID'];
  const measurementId = env['NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'];
  if (authDomain) config.authDomain = authDomain;
  if (storageBucket) config.storageBucket = storageBucket;
  if (senderId) config.messagingSenderId = senderId;
  if (measurementId) config.measurementId = measurementId;

  return {
    config,
    databaseId: env['NEXT_PUBLIC_FIREBASE_DATABASE_ID'] || '(default)',
  };
}

function initFromConfig(config: Record<string, string>, databaseId: string) {
  _app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
  _auth = getAuth(_app);
  _db = getFirestore(_app, databaseId);
  _functions = getFunctions(_app, 'us-central1');
  _initialized = true;
  firebaseLogger.info('Firebase initialized', { projectId: config.projectId, databaseId });
}

// Inicializacao sincrona (env vars ou arquivo local)
function tryInitSync() {
  const envResult = readEnvConfig();
  if (envResult) {
    initFromConfig(envResult.config, envResult.databaseId);
    return;
  }

  // Fallback: arquivo JSON local (import estatico — Next.js empacota no build)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const json = require('../firebase-applet-config.json');
    if (json?.projectId && json?.appId) {
      initFromConfig(json, json.firestoreDatabaseId || '(default)');
      return;
    }
  } catch {
    // Arquivo nao existe — esperado em producao sem env vars
  }

  _initError = new Error(
    'Firebase nao configurado. Defina NEXT_PUBLIC_FIREBASE_* nas variaveis de ambiente.'
  );
}

tryInitSync();

if (!_initialized) {
  throw _initError || new Error('Firebase nao inicializado.');
}

export const app: FirebaseApp = _app!;
export const auth: Auth = _auth!;
export const db: Firestore = _db!;
export const functions: Functions = _functions!;

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
