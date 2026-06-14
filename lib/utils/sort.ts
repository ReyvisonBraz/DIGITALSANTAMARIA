/**
 * @module sort
 * @description Utilitários de ordenação para documentos Firestore com campo `createdAt`.
 *
 * Os serviços evitam `orderBy()` no Firestore quando combinado com `where()` em
 * campo diferente (exigiria índice composto). A ordenação é feita no cliente
 * usando estas funções.
 *
 * @example
 * ```ts
 * // Mais recentes primeiro (listagens):
 * docs.sort(byCreatedAtDesc);
 *
 * // Mais antigos primeiro (threads de mensagens):
 * messages.sort(byCreatedAtAsc);
 * ```
 */

import type { Timestamp } from 'firebase/firestore';

/** Qualquer documento que possua um campo `createdAt` do Firestore */
interface WithCreatedAt {
  createdAt: Timestamp;
}

/**
 * Comparador: ordena do mais recente para o mais antigo.
 * Use em `.sort()` para listagens onde o item mais novo fica no topo.
 */
export function byCreatedAtDesc<T extends WithCreatedAt>(a: T, b: T): number {
  return b.createdAt.toMillis() - a.createdAt.toMillis();
}

/**
 * Comparador: ordena do mais antigo para o mais recente.
 * Use em `.sort()` para threads de mensagens (ordem cronológica).
 */
export function byCreatedAtAsc<T extends WithCreatedAt>(a: T, b: T): number {
  return a.createdAt.toMillis() - b.createdAt.toMillis();
}

/**
 * Retorna uma nova array ordenada do mais recente ao mais antigo.
 * Não muta o array original.
 */
export function sortByCreatedAtDesc<T extends WithCreatedAt>(items: T[]): T[] {
  return [...items].sort(byCreatedAtDesc);
}

/**
 * Retorna uma nova array ordenada do mais antigo ao mais recente.
 * Não muta o array original.
 */
export function sortByCreatedAtAsc<T extends WithCreatedAt>(items: T[]): T[] {
  return [...items].sort(byCreatedAtAsc);
}
