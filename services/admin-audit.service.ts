import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CreateAdminAuditLogInput } from '@/types';

const COLLECTION = 'admin_audit_logs';

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
    console.warn('[admin-audit] Falha ao registrar auditoria', error);
  }
}
