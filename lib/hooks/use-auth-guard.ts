'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/types';

/**
 * Hook de proteção de rotas no cliente.
 * Redireciona para `/` se o usuário não estiver autenticado ou não tiver a role exigida.
 * Administradores têm acesso a todas as rotas independentemente da role requerida.
 *
 * @param requiredRole - Role exigida para acessar a rota (opcional).
 * @returns Objeto com `user`, `userRole`, `loading` e `isAuthorized`.
 */
export function useAuthGuard(requiredRole?: UserRole) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/');
      return;
    }
    if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
      router.push('/');
    }
  }, [user, userRole, loading, requiredRole, router]);

  return { user, userRole, loading, isAuthorized: !!user };
}
