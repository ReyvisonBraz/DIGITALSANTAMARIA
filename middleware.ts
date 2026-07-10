import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, createRemoteJWKSet } from 'jose';

const PROTECTED_ROUTES = ['/gestao', '/perfil'];
const FIREBASE_ISSUER_PREFIX = 'https://securetoken.google.com/';
const EXPECTED_AUDIENCE = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';
const FIREBASE_JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com';

/**
 * Firebase JWKS remote key set for JWT signature verification.
 * Cached automatically by jose after first fetch.
 */
const firebaseJwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));

/**
 * Verifica a assinatura do JWT do Firebase usando jose (Edge Runtime compatible).
 *
 * Diferença da versão anterior:
 * - Antes: decodificava base64url sem verificar assinatura (inseguro)
 * - Agora: verifica assinatura criptográfica contra as chaves públicas do Firebase
 *
 * O jose biblioteca suporta Edge Runtime do Next.js (sem dependências Node.js).
 */
async function verifyFirebaseToken(token: string) {
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get('firebase-auth-token')?.value;

  if (!token) {
    const url = new URL('/', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  const payload = await verifyFirebaseToken(token);

  if (!payload?.sub) {
    const url = new URL('/', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/gestao/:path*', '/perfil/:path*'],
};
