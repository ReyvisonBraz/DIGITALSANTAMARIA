'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createContentService } from '@/services/content.service';
import type { ContentStatus } from '@/types';
import type { Timestamp, WhereFilterOp } from 'firebase/firestore';

/**
 * Hook universal para carregar conteúdo de qualquer coleção Firestore.
 *
 * Gerencia loading, erro, dados e recarregamento manual.
 *
 * ### Estabilidade de filtros
 * `filters` é serializado via JSON para comparação de dependência. Isso
 * permite passar arrays literais nas chamadas sem causar re-renders
 * infinitos, pois a igualdade é feita por valor, não por referência.
 *
 * @example
 * ```tsx
 * const { data, loading, error, refresh } = useContent<Notice>('notices');
 * const { data } = useContent<Event>('events', [['category', '==', 'cultural']]);
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

  const service = useMemo(() => createContentService<T>(collectionName), [collectionName]);

  /**
   * Serialização por valor: evita re-renders infinitos quando o caller
   * passa um array literal como `[['field', '==', value]]`.
   * A string muda somente quando o conteúdo dos filtros muda de verdade.
   */
  const filtersKey = JSON.stringify(filters ?? null);

  const fetch = useCallback(() => {
    const parsedFilters = filtersKey !== 'null'
      ? (JSON.parse(filtersKey) as [string, WhereFilterOp, unknown][])
      : undefined;
    setLoading(true);
    setError(null);
    service.list(parsedFilters)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar dados'))
      .finally(() => setLoading(false));
  // filtersKey é a representação estável dos filtros por valor
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, service]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refresh: fetch };
}
