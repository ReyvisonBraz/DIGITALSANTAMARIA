import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createLogger } from '@/lib/logger';
import type { AdminAuditLog, CreateAdminAuditLogInput } from '@/types';

const COLLECTION = 'admin_audit_logs';
const log = createLogger('AdminAuditService');

export async function createAdminAuditLog(input: CreateAdminAuditLogInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function tryCreateAdminAuditLog(input: CreateAdminAuditLogInput): Promise<void> {
  try {
    await createAdminAuditLog(input);
  } catch (error) {
    log.warn('Falha ao registrar auditoria', {}, error);
  }
}

export async function getAdminAuditLogs(max = 100): Promise<AdminAuditLog[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, orderBy('createdAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }) as AdminAuditLog);
}
