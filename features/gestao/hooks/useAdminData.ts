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

export function useAdminData(enabled = true): AdminData {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setDemands([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getAllDemands();
      setDemands(data);
    } catch {
      setError('Erro ao carregar solicitacoes.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { demands, loading, error, refresh };
}
