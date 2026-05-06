'use client';

import { useState, useEffect, useCallback } from 'react';
import { createContentService } from '@/services/content.service';
import type { ContentStatus } from '@/types';
import type { Timestamp, WhereFilterOp } from 'firebase/firestore';

/**
 * useContent — Hook universal para carregar conteúdo de qualquer coleção.
 *
 * Gerencia automaticamente:
 * - loading / error / data states
 * - Retry em caso de falha
 * - Filtros dinâmicos
 *
 * Uso:
 * ```tsx
 * const { data, loading, error, refresh } = useContent<Work>('works');
 * ```
 */

interface UseContentResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

interface BaseDoc {
  id: string;
  status: ContentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}

export function useContent<T extends BaseDoc>(
  collectionName: string,
  filters?: [string, WhereFilterOp, unknown][],
): UseContentResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = createContentService<T>(collectionName);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    service.list(filters)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar dados'))
      .finally(() => setLoading(false));
  }, [collectionName, JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refresh: fetch };
}
