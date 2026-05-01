'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  getDoc,
  onSnapshot,
  type FirestoreDataConverter,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AsyncStatus } from '@/types';

interface UseDocResult<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useFirestoreDoc<T extends { id: string }>(
  path: string,
  converter?: FirestoreDataConverter<T>,
  subscribe = false
): UseDocResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const ref = doc(db, path).withConverter(converter!);
      const snap = await getDoc(ref);
      setData(snap.exists() ? snap.data() : null);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar');
      setStatus('error');
    }
  }, [path, converter]);

  useEffect(() => {
    if (!subscribe) {
      refresh();
      return;
    }
    setStatus('loading');
    const ref = doc(db, path).withConverter(converter!);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setData(snap.exists() ? snap.data() : null);
        setStatus('success');
        setError(null);
      },
      (err) => {
        setError(err.message);
        setStatus('error');
      }
    );
    return unsub;
  }, [path, converter, subscribe, refresh]);

  return { data, status, error, refresh };
}
