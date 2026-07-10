import { NextRequest } from 'next/server';
import { jwtVerify, createRemoteJWKSet, JWTPayload } from 'jose';

const FIREBASE_ISSUER_PREFIX = 'https://securetoken.google.com/';
const EXPECTED_AUDIENCE = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com';

/**
 * Firebase JWKS remote key set for JWT signature verification.
 * Cached automatically by jose after first fetch.
 */
const firebaseJwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));

/**
 * Verifica a assinatura do JWT do Firebase usando jose.
 *
 * Em API Routes (Node.js runtime), podemos usar firebase-admin,
 * mas jose é mais leve e consistente com o middleware.
 */
async function verifyFirebaseToken(token: string): Promise<JWTPayload | null> {
  try {
    if (!EXPECTED_AUDIENCE) return null;

    const issuer = `${FIREBASE_ISSUER_PREFIX}${EXPECTED_AUDIENCE}`;

    const { payload } = await jwtVerify(token, firebaseJwks, {
      issuer,
      audience: EXPECTED_AUDIENCE,
    });

    return payload;
  } catch {
    return null;
  }
}

function extractToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('firebase-auth-token')?.value;
  if (cookieToken) return cookieToken;
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

/**
 * Extrai e valida o Firebase ID token de um request.
 * Suporta cookie (firebase-auth-token) ou header (Authorization: Bearer <token>).
 *
 * Verifica assinatura criptográfica (RS256) contra as chaves públicas do Firebase.
 */
export async function getAuthToken(request: NextRequest): Promise<string | null> {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyFirebaseToken(token);
  return payload ? token : null;
}

/**
 * Retorna o uid do usuario autenticado ou null se o token for invalido/ausente.
 */
export async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const token = extractToken(request);
  if (!token) return null;
  const payload = await verifyFirebaseToken(token);
  return (payload?.sub as string) ?? null;
}
