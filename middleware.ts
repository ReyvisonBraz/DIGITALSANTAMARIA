import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de proteção server-side para rotas administrativas.
 *
 * Verifica a existencia de cookie com Firebase ID token antes de servir
 * o bundle JS do painel de gestão. Decodifica o JWT para validar payload
 * e expiracao.
 */

const ADMIN_ROUTES = ['/gestao'];

function decodeJwtPayload(token: string): { exp?: number; sub?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get('firebase-auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const payload = decodeJwtPayload(token);
    if (!payload?.sub || !payload?.exp) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Verifica expiracao
    if (payload.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/gestao/:path*'],
};
