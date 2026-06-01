'use client';

import { useState, useEffect } from 'react';
import { createContentService } from '@/services/content.service';
import type { ContentStatus } from '@/types';
import type { Timestamp, WhereFilterOp } from 'firebase/firestore';

/**
 * useContent — Hook universal para carregar conteúdo de qualquer coleção
 * em **tempo real** via onSnapshot.
 *
 * Mantém uma assinatura aberta com o Firestore: assim que o admin publica
 * um item novo (ou arquiva um antigo), as páginas atualizam sozinhas
 * sem precisar de F5. Ao desmontar o componente, a assinatura é encerrada
 * automaticamente (cleanup do useEffect).
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
  /**
   * Força o hook a fechar e reabrir a assinatura. Útil como `onRetry`
   * quando uma falha inicial ocorre (ex.: regras de segurança).
   */
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
  const [reconnectNonce, setReconnectNonce] = useState(0);

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const service = createContentService<T>(collectionName);
    return service.listen(
      (items) => {
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      filters,
    );
    // filters é serializado em filtersKey; reconnectNonce dispara reconexão manual via refresh().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, filtersKey, reconnectNonce]);

  return {
    data,
    loading,
    error,
    refresh: () => setReconnectNonce((n) => n + 1),
  };
}
