'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAllDemands } from '@/services/demands.service';
import type { Demand } from '@/types';

interface AdminData {
  demands: Demand[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAdminData(): AdminData {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDemands();
      setDemands(data);
    } catch {
      setError('Erro ao carregar solicitações.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { demands, loading, error, refresh };
}
