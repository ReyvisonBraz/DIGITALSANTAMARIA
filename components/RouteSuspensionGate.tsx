'use client';

import { usePathname } from 'next/navigation';
import { isRouteSuspended } from '@/lib/constants/feature-status';
import ComingSoon from '@/components/ui/ComingSoon';

/**
 * Intercepta o acesso a rotas suspensas para a fase 2.
 *
 * Se a rota atual está na lista de SUSPENDED_ROUTES, renderiza a tela
 * "Em breve" no lugar da página — sem montar o conteúdo real (e sem
 * disparar buscas no Firestore). Caso contrário, renderiza a página normal.
 */
export default function RouteSuspensionGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname && isRouteSuspended(pathname)) {
    return <ComingSoon route={pathname} />;
  }

  return <>{children}</>;
}
