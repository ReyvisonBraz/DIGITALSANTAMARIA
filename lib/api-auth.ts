import { NextRequest } from 'next/server';

/**
 * Decodifica o payload de um Firebase ID token sem verificação criptográfica.
 * Valida apenas estrutura e expiração — adequado para API Routes do Next.js
 * onde a validação completa ocorre no Firebase Admin (Cloud Functions).
 */
function decodeFirebaseToken(token: string): { sub?: string; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    if (!payload.sub) return null;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extrai o Firebase ID token de um request.
 * Suporta cookie (firebase-auth-token) ou header (Authorization: Bearer <token>).
 *
 * Retorna o token decodificado ou null se ausente, inválido ou expirado.
 */
export function getAuthToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('firebase-auth-token')?.value;
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken || headerToken;
  if (!token) return null;
  return decodeFirebaseToken(token) ? token : null;
}

/**
 * Retorna o uid do usuário autenticado ou null se o token for inválido/ausente.
 * Reutiliza a decodificação de getAuthToken para evitar parsing duplo do JWT.
 */
export function getAuthUserId(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('firebase-auth-token')?.value;
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken || headerToken;
  if (!token) return null;
  return decodeFirebaseToken(token)?.sub ?? null;
}
