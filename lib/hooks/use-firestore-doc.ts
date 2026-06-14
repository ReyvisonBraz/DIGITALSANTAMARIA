/**
 * @module use-firestore-doc
 * @description Hook para carregar e/ou escutar um documento Firestore em tempo real.
 *
 * Suporta dois modos:
 * - **fetch**: Carrega o documento uma vez (padrão)
 * - **subscribe**: Escuta alterações em tempo real via `onSnapshot`
 *
 * @example
 * ```tsx
 * // Fetch único
 * const { data, status } = useFirestoreDoc<UserProfile>(
 *   `users/${userId}`,
 *   userConverter
 * );
 *
 * // Subscription em tempo real
 * const { data, status, refresh } = useFirestoreDoc<Demand>(
 *   `demands/${demandId}`,
 *   demandConverter,
 *   true // subscribe = true
 * );
 * ```
 */

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

// ─── Tipos ──────────────────────────────────────────────────────────

/** Resultado retornado pelo hook */
interface UseDocResult<T> {
  /** Dados do documento (null se não encontrado ou durante loading) */
  data: T | null;
  /** Status atual da operação */
  status: AsyncStatus;
  /** Mensagem de erro, se houver */
  error: string | null;
  /** Força recarregamento do documento (apenas no modo fetch) */
  refresh: () => Promise<void>;
}

// ─── Hook ───────────────────────────────────────────────────────────

/**
 * Carrega ou escuta um documento Firestore com tipagem forte.
 *
 * @param path - Caminho do documento (ex: 'users/abc123')
 * @param converter - Converter Firestore para tipagem do documento
 * @param subscribe - Se `true`, usa `onSnapshot` para atualizações em tempo real
 *
 * @returns Objeto com data, status, error e refresh
 */
export function useFirestoreDoc<T extends { id: string }>(
  path: string,
  converter: FirestoreDataConverter<T>,
  subscribe = false
): UseDocResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  /** Recarrega o documento manualmente (modo fetch) */
  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const ref = doc(db, path).withConverter(converter);
      const snap = await getDoc(ref);
      setData(snap.exists() ? snap.data() : null);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar documento';
      setError(message);
      setStatus('error');
    }
  }, [path, converter]);

  // Modo fetch: carrega uma vez quando path/converter mudam
  useEffect(() => {
    if (subscribe) return;
    refresh();
  }, [subscribe, refresh]);

  // Modo subscribe: escuta alterações em tempo real sem depender de `refresh`
  useEffect(() => {
    if (!subscribe) return;

    setStatus('loading');
    const ref = doc(db, path).withConverter(converter);

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
  }, [path, converter, subscribe]);

  return { data, status, error, refresh };
}
