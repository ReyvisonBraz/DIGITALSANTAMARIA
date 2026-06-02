import {
  collection, doc, addDoc, getDocs, getDoc, updateDoc, onSnapshot,
  query, where, orderBy, limit, serverTimestamp, Timestamp,
  type QueryConstraint, type WhereFilterOp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContentStatus } from '@/types';

/**
 * Serviço genérico de conteúdo — CRUD padronizado para qualquer coleção.
 *
 * Cada módulo do sistema (obras, eventos, avisos, etc.) usa esta factory
 * para criar operações Firestore tipadas sem repetir código.
 *
 * Uso:
 * ```ts
 * const worksService = createContentService<Work>('works');
 * const events = await worksService.list([['status', '==', 'published']]);
 * ```
 */

interface ContentService<T extends { id: string }> {
  list: (filters?: [string, WhereFilterOp, unknown][], max?: number) => Promise<T[]>;
  listen: (
    onData: (items: T[]) => void,
    onError: (err: Error) => void,
    filters?: [string, WhereFilterOp, unknown][],
    max?: number,
  ) => () => void;
  getById: (id: string) => Promise<T | null>;
  create: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => Promise<string>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  archive: (id: string) => Promise<void>;
}

type ContentDoc = {
  id: string;
  status: ContentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
};

export function createContentService<T extends ContentDoc>(
  collectionName: string,
): ContentService<T> {
  const col = collection(db, collectionName);

  function buildConstraints(
    filters?: [string, WhereFilterOp, unknown][],
    max = 50,
  ): QueryConstraint[] {
    return [
      ...(filters?.map(([f, op, v]) => where(f, op, v)) ?? []),
      where('deletedAt', '==', null),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(max),
    ];
  }

  async function list(
    filters?: [string, WhereFilterOp, unknown][],
    max = 50,
  ): Promise<T[]> {
    const snap = await getDocs(query(col, ...buildConstraints(filters, max)));
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as T);
  }

  function listen(
    onData: (items: T[]) => void,
    onError: (err: Error) => void,
    filters?: [string, WhereFilterOp, unknown][],
    max = 50,
  ): () => void {
    return onSnapshot(
      query(col, ...buildConstraints(filters, max)),
      (snap) => onData(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as T)),
      onError,
    );
  }

  async function getById(id: string): Promise<T | null> {
    const snap = await getDoc(doc(db, collectionName, id));
    if (!snap.exists()) return null;
    const data = { ...snap.data(), id: snap.id } as T;
    return data.deletedAt ? null : data;
  }

  async function create(
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<string> {
    const docRef = await addDoc(col, {
      ...data,
      status: (data.status || 'published') as ContentStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null,
    });
    return docRef.id;
  }

  async function update(id: string, data: Partial<T>): Promise<void> {
    await updateDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async function archive(id: string): Promise<void> {
    await updateDoc(doc(db, collectionName, id), {
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  return { list, listen, getById, create, update, archive };
}
