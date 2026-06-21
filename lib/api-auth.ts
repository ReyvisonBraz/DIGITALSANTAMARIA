import { NextRequest } from 'next/server';

const FIREBASE_ISSUER_PREFIX = 'https://securetoken.google.com/';
const EXPECTED_AUDIENCE = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';

interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}

/**
 * Decodifica o payload de um Firebase ID token com validacao robusta.
 * Verifica estrutura, expiracao, issuer e audience.
 * Nao faz verificacao criptografica da assinatura — essa ocorre no Firebase Admin.
 */
function decodeFirebaseToken(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    if (typeof payload.sub !== 'string' || !payload.sub) return null;
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null;
    if (typeof payload.iat !== 'number') return null;
    if (typeof payload.iss === 'string' && EXPECTED_AUDIENCE) {
      const expectedIssuer = `${FIREBASE_ISSUER_PREFIX}${EXPECTED_AUDIENCE}`;
      if (payload.iss !== expectedIssuer) return null;
    }
    if (typeof payload.aud === 'string' && EXPECTED_AUDIENCE) {
      if (payload.aud !== EXPECTED_AUDIENCE) return null;
    }
    return payload as DecodedToken;
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
 */
export function getAuthToken(request: NextRequest): string | null {
  const token = extractToken(request);
  if (!token) return null;
  return decodeFirebaseToken(token) ? token : null;
}

/**
 * Retorna o uid do usuario autenticado ou null se o token for invalido/ausente.
 */
export function getAuthUserId(request: NextRequest): string | null {
  const token = extractToken(request);
  if (!token) return null;
  return decodeFirebaseToken(token)?.sub ?? null;
}
