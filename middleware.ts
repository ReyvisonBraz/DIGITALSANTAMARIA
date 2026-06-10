import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de protecao server-side para rotas administrativas.
 *
 * Verifica a existencia de cookie de sessao Firebase Auth antes de servir
 * o bundle JS do painel de gestao. A protecao real de dados e feita pelas
 * Firestore Security Rules; este middleware previne a exposicao desnecessaria
 * do codigo admin para usuarios nao autenticados.
 */

const ADMIN_ROUTES = ['/gestao'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    const authCookie =
      request.cookies.get('firebase-auth')?.value ||
      request.cookies.get('__session')?.value;

    if (!authCookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/gestao/:path*'],
};
