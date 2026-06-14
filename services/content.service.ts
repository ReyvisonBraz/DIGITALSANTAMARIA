import {
  collection, doc, addDoc, getDocs, getDoc, updateDoc,
  query, where, orderBy, limit, serverTimestamp, Timestamp,
  type FirestoreDataConverter, type QueryConstraint, type WhereFilterOp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContentStatus } from '@/types';
import { sortByCreatedAtDesc } from '@/lib/utils/sort';

/**
 * Serviço genérico de conteúdo — CRUD padronizado para qualquer coleção.
 *
 * Cada módulo do sistema (obras, eventos, avisos, etc.) usa esta factory
 * para criar operações Firestore tipadas sem repetir código.
 *
 * Uso:
 * ```ts
 * const worksService = createContentService<Work>('works');
 * const works = await worksService.list(); // retorna publicados, mais recentes primeiro
 * ```
 *
 * Nota sobre índices Firestore:
 * Combinar `where()` num campo com `orderBy()` noutro exige um índice composto
 * que pode não estar implantado. Para evitar esse requisito em todos os módulos,
 * a ordenação por `createdAt` é feita no lado do cliente após a busca.
 */

interface ContentService<T extends { id: string }> {
  list: (filters?: [string, WhereFilterOp, unknown][], max?: number) => Promise<T[]>;
  listAdmin: (max?: number) => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  create: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => Promise<string>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  setStatus: (id: string, status: ContentStatus) => Promise<void>;
  archive: (id: string) => Promise<void>;
}

export function createContentService<T extends {
  id: string;
  status: ContentStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}>(
  collectionName: string,
  converter?: FirestoreDataConverter<T>,
): ContentService<T> {
  const col = converter
    ? collection(db, collectionName).withConverter(converter)
    : collection(db, collectionName);

  /**
   * Lista documentos publicados. Filtros adicionais são opcionais.
   *
   * Não usa orderBy() para evitar a necessidade de índice composto com where().
   * A ordenação por data de criação é aplicada no cliente após a busca.
   */
  async function list(filters?: [string, WhereFilterOp, unknown][], max = 50): Promise<T[]> {
    const constraints: QueryConstraint[] = [
      where('status', '==', 'published'),
      ...(filters ?? []).map(([field, op, value]) => where(field, op, value)),
      limit(max),
    ];

    const q = query(col, ...constraints);
    const snap = await getDocs(q);

    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T));
    const active = docs.filter(item => !item.deletedAt);
    return sortByCreatedAtDesc(active);
  }

  /**
   * Lista todos os documentos (qualquer status) para painéis administrativos.
   * Usa orderBy() puro — sem where() em campo diferente — portanto não exige
   * índice composto.
   */
  async function listAdmin(max = 100): Promise<T[]> {
    const q = query(col, orderBy('createdAt', 'desc'), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as T));
  }

  async function getById(id: string): Promise<T | null> {
    // Usa `doc(col, id)` em vez de `doc(db, collectionName, id)` para que o
    // converter opcional da factory seja aplicado corretamente.
    const ref = doc(col, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = { id: snap.id, ...snap.data() } as unknown as T;
    if (data.deletedAt) return null;
    return data;
  }

  async function create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<string> {
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
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }

  async function setStatus(id: string, status: ContentStatus): Promise<void> {
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, { status, updatedAt: serverTimestamp() });
  }

  async function archive(id: string): Promise<void> {
    const ref = doc(db, collectionName, id);
    await updateDoc(ref, {
      status: 'archived',
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  return { list, listAdmin, getById, create, update, setStatus, archive };
}
