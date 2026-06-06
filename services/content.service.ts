import {
  collection, doc, addDoc, getDocs, getDoc, updateDoc,
  query, where, orderBy, limit, serverTimestamp, Timestamp,
  type FirestoreDataConverter, type QueryConstraint, type WhereFilterOp,
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
 * const events = await worksService.list(['status', '==', 'published']);
 * ```
 */

interface ContentService<T extends { id: string }> {
  list: (filters?: [string, WhereFilterOp, unknown][], max?: number) => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  create: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => Promise<string>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  archive: (id: string) => Promise<void>;
}

export function createContentService<T extends { id: string; status: ContentStatus; createdAt: Timestamp; updatedAt: Timestamp; deletedAt: Timestamp | null }>(
  collectionName: string,
  converter?: FirestoreDataConverter<T>,
): ContentService<T> {
  const col = collection(db, collectionName).withConverter(converter || ({} as FirestoreDataConverter<T>));

  async function list(filters?: [string, WhereFilterOp, unknown][], max = 50): Promise<T[]> {
    const baseConstraints: QueryConstraint[] = [
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(max),
    ];

    if (filters && filters.length > 0) {
      const filterConstraints: QueryConstraint[] = filters.map(([f, op, v]) => where(f, op, v));
      const q = query(collection(db, collectionName), ...filterConstraints, ...baseConstraints);
      const snap = await getDocs(q);
      return snap.docs
        .map(d => ({ ...d.data() as object, id: d.id } as unknown as T))
        .filter((item) => !item.deletedAt);
    }

    const q = query(col, ...baseConstraints);
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ ...d.data() as object, id: d.id } as unknown as T))
      .filter((item) => !item.deletedAt);
  }

  async function getById(id: string): Promise<T | null> {
    const ref = doc(db, collectionName, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as T;
    if (data.deletedAt) return null;
    return data;
  }

  async function create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      status: (data.status || 'published') as ContentStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      deletedAt: null,
    });
    return docRef.id;
  }

  async function update(id: string, data: Partial<T>): Promise<void> {
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }

  async function archive(id: string): Promise<void> {
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, { deletedAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  return { list, getById, create, update, archive };
}
