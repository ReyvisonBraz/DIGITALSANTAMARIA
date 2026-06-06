'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface HomeMetrics {
  eventsCount: number;
  noticesCount: number;
  loading: boolean;
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

export function useHomeMetrics(): HomeMetrics {
  const [metrics, setMetrics] = useState<Omit<HomeMetrics, 'loading'>>({
    eventsCount: 0,
    noticesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([countCollection('events'), countCollection('notices')])
      .then(([eventsCount, noticesCount]) => {
        if (!cancelled) setMetrics({ eventsCount, noticesCount });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { ...metrics, loading };
}
