'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/types';

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
