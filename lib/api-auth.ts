import { NextRequest } from 'next/server';

/**
 * Extrai e verifica o Firebase ID token de requests para API routes.
 * Suporta token via cookie (firebase-auth-token) ou header (Authorization: Bearer).
 *
 * Retorna o uid do usuario ou null se nao autenticado/valido.
 */
export function getAuthToken(request: NextRequest): string | null {
  // Cookie (setado pelo auth-context)
  const cookieToken = request.cookies.get('firebase-auth-token')?.value;

  // Header Authorization: Bearer <token>
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const token = cookieToken || headerToken;
  if (!token) return null;

  // Decodifica JWT e verifica expiracao
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8'),
    );
    if (!payload.sub) return null;
    if (payload.exp * 1000 < Date.now()) return null;
    return token;
  } catch {
    return null;
  }
}

/**
 * Retorna o uid do Firebase Auth ou null.
 */
export function getAuthUserId(request: NextRequest): string | null {
  const token = getAuthToken(request);
  if (!token) return null;
  try {
    const parts = token.split('.');
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8'),
    );
    return payload.sub || null;
  } catch {
    return null;
  }
}
