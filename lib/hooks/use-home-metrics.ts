'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HomeMetrics {
  eventsCount: number;
  noticesCount: number;
  loading: boolean;
  error: string | null;
}

const PUBLISHED_FILTERS = [
  where('status', '==', 'published'),
] as const;

async function countCollection(name: string): Promise<number> {
  try {
    const ref = collection(db, name);
    const q = query(ref, ...PUBLISHED_FILTERS);
    const snap = await getDocs(q);
    return snap.docs.filter((docSnap) => !docSnap.data().deletedAt).length;
  } catch {
    return 0;
  }
}

/**
 * Busca contagens de eventos e avisos publicados para exibição na homepage.
 * Filtra por status `published` e exclui documentos marcados como `deletedAt`.
 *
 * @returns Objeto com `eventsCount`, `noticesCount` e `loading`.
 */
export function useHomeMetrics(): HomeMetrics {
  const [metrics, setMetrics] = useState<Omit<HomeMetrics, 'loading' | 'error'>>({
    eventsCount: 0,
    noticesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([countCollection('events'), countCollection('notices')])
      .then(([eventsCount, noticesCount]) => {
        if (!cancelled) setMetrics({ eventsCount, noticesCount });
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar métricas');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...metrics, loading, error };
}
