'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createContentService } from '@/services/content.service';
import type { ContentStatus } from '@/types';
import type { Timestamp } from 'firebase/firestore';

/**
 * Hook para carregar um único documento de conteúdo pelo ID.
 *
 * Complementa `useContent` (que carrega listas) com busca pontual por ID,
 * mantendo o mesmo padrão de loading / error / refresh.
 *
 * @example
 * ```tsx
 * const { item, loading, error, refresh } = useContentItem<Event>('events', id);
 * ```
 */

interface UseContentItemResult<T> {
  item: T | null;
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

export function useContentItem<T extends BaseDoc>(
  collectionName: string,
  id: string,
): UseContentItemResult<T> {
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = useMemo(() => createContentService<T>(collectionName), [collectionName]);

  const loadItem = useCallback(() => {
    setLoading(true);
    setError(null);
    service
      .getById(id)
      .then(setItem)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar item'))
      .finally(() => setLoading(false));
  }, [id, service]);

  useEffect(() => { loadItem(); }, [loadItem]);

  return { item, loading, error, refresh: loadItem };
}
