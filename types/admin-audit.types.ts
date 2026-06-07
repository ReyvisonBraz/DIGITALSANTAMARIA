import type { Timestamp } from 'firebase/firestore';

export type AdminAuditAction =
  | 'content_status_changed'
  | 'content_archived'
  | 'content_created'
  | 'content_updated'
  | 'queue_status_changed'
  | 'user_role_changed';

export interface AdminAuditLog {
  id: string;
  action: AdminAuditAction;
  collectionName: string;
  documentId: string;
  actorId: string;
  actorName: string;
  previousValue: unknown;
  nextValue: unknown;
  note: string | null;
  createdAt: Timestamp;
}

export type CreateAdminAuditLogInput = Omit<AdminAuditLog, 'id' | 'createdAt'>;
