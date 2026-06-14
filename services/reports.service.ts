import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { reportConverter } from '@/lib/firebase/converters';
import { generateProtocolId } from '@/lib/utils/protocol';
import { uploadReportPhoto } from '@/services/storage.service';
import { tryCreateNotification } from '@/services/notifications.service';
import { byCreatedAtAsc, byCreatedAtDesc } from '@/lib/utils/sort';
import type {
  CreateReportInput,
  NotificationTone,
  Report,
  ReportMessage,
  ReportMessageAuthorRole,
  ReportStatus,
  StorageFile,
} from '@/types';

const COLLECTION = 'reports';
const MESSAGES_COLLECTION = 'report_messages';
const PROTOCOL_TIMEOUT_MS = 12_000;

const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: 'recebido',
  in_review: 'em análise',
  resolved: 'resolvido',
  rejected: 'recusado',
};

const STATUS_TONE: Record<ReportStatus, NotificationTone> = {
  pending: 'update',
  in_review: 'update',
  resolved: 'success',
  rejected: 'alert',
};

export async function createReport(
  input: CreateReportInput & { reporterId: string; reporterName: string },
): Promise<string> {
  let photo: StorageFile | null = null;
  if (input.photoFile) {
    photo = await uploadReportPhoto(input.reporterId, input.photoFile);
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    reporterId: input.reporterId,
    reporterName: input.reporterName,
    type: input.type,
    title: input.title,
    description: input.description,
    status: 'pending',
    location: input.location || null,
    photo,
    votes: 0,
    isPetition: input.isPetition,
    adminResponse: null,
    clerkId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Aguarda o protocolId real gerado pela Cloud Function (onReportCreated).
 * Se a CF falhar ou demorar, gera fallback local.
 */
export function waitForReportProtocol(
  reportId: string,
  onProtocol: (protocolId: string) => void,
): () => void {
  const ref = doc(db, COLLECTION, reportId);
  let resolved = false;

  const timeoutId = setTimeout(() => {
    if (resolved) return;
    resolved = true;
    unsubscribe();
    onProtocol(generateProtocolId('REP'));
  }, PROTOCOL_TIMEOUT_MS);

  const unsubscribe = onSnapshot(
    ref,
    (snap) => {
      if (resolved) return;
      const data = snap.data() as { protocolId?: string } | undefined;
      if (data?.protocolId) {
        resolved = true;
        clearTimeout(timeoutId);
        onProtocol(data.protocolId);
        unsubscribe();
      }
    },
    () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeoutId);
      onProtocol(generateProtocolId('REP'));
    },
  );

  return () => {
    clearTimeout(timeoutId);
    unsubscribe();
  };
}

export async function getReportById(id: string): Promise<Report | null> {
  const ref = doc(db, COLLECTION, id).withConverter(reportConverter);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function createReportMessage(input: {
  reportId: string;
  authorId: string;
  authorName: string;
  authorRole: ReportMessageAuthorRole;
  message: string;
}): Promise<string> {
  const messageRef = doc(collection(db, MESSAGES_COLLECTION));
  const reportRef = doc(db, COLLECTION, input.reportId);
  const batch = writeBatch(db);
  const message = input.message.trim();

  batch.set(messageRef, {
    reportId: input.reportId,
    authorId: input.authorId,
    authorName: input.authorName,
    authorRole: input.authorRole,
    message,
    createdAt: serverTimestamp(),
  });

  batch.update(reportRef, {
    conversation: {
      lastMessageAt: serverTimestamp(),
      lastMessageAuthorName: input.authorName,
      lastMessageAuthorRole: input.authorRole,
      unreadByCitizen: input.authorRole === 'staff',
      unreadByStaff: input.authorRole === 'citizen',
    },
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
  return messageRef.id;
}

function mapReportMessage(id: string, data: Record<string, unknown>): ReportMessage {
  return {
    id,
    reportId: String(data.reportId || ''),
    authorId: String(data.authorId || ''),
    authorName: String(data.authorName || ''),
    authorRole: (data.authorRole || 'system') as ReportMessageAuthorRole,
    message: String(data.message || ''),
    createdAt: data.createdAt as ReportMessage['createdAt'],
  };
}

export async function getReportMessages(reportId: string): Promise<ReportMessage[]> {
  const ref = collection(db, MESSAGES_COLLECTION);
  const q = query(ref, where('reportId', '==', reportId));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => mapReportMessage(docSnap.id, docSnap.data())).sort(byCreatedAtAsc);
}

export function listenToReportMessages(
  reportId: string,
  onChange: (messages: ReportMessage[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  const ref = collection(db, MESSAGES_COLLECTION);
  const q = query(ref, where('reportId', '==', reportId));
  return onSnapshot(
    q,
    (snap) => {
      const sorted = snap.docs.map((d) => mapReportMessage(d.id, d.data())).sort(byCreatedAtAsc);
      onChange(sorted);
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function getReportsByUser(userId: string): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, where('reporterId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data()).sort(byCreatedAtDesc);
}

export function listenToUserReports(
  userId: string,
  onChange: (reports: Report[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  // orderBy removed to avoid composite index requirement — sorted client-side
  const q = query(ref, where('reporterId', '==', userId));
  return onSnapshot(
    q,
    (snap) => {
      const sorted = snap.docs.map((d) => d.data()).sort(byCreatedAtDesc);
      onChange(sorted);
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function getPendingReports(): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, where('status', '==', 'pending'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data()).sort(byCreatedAtDesc);
}

export async function getAllReports(): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function markReportReadByStaff(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    'conversation.unreadByStaff': false,
    updatedAt: serverTimestamp(),
  });
}

export async function markReportReadByCitizen(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    'conversation.unreadByCitizen': false,
    updatedAt: serverTimestamp(),
  });
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
  clerkId: string,
  clerkName: string,
  adminResponse?: string,
): Promise<void> {
  const reportRef = doc(db, COLLECTION, id);
  const response = (adminResponse ?? '').trim();

  await runTransaction(db, async (tx) => {
    const reportSnap = await tx.get(reportRef);
    if (!reportSnap.exists()) {
      throw new Error('Solicitação não encontrada.');
    }

    const report = reportSnap.data() as Report;
    const previousResponse = (report.adminResponse ?? '').trim();

    const updateData: Record<string, unknown> = {
      status,
      clerkId,
      adminResponse: adminResponse ?? null,
      updatedAt: serverTimestamp(),
    };

    tx.update(reportRef, updateData);

    if (response && response !== previousResponse) {
      const msgRef = doc(collection(db, MESSAGES_COLLECTION));
      tx.set(msgRef, {
        reportId: id,
        authorId: clerkId,
        authorName: clerkName,
        authorRole: 'staff' as const,
        message: response,
        createdAt: serverTimestamp(),
      });

      tx.update(reportRef, {
        conversation: {
          lastMessageAt: serverTimestamp(),
          lastMessageAuthorName: clerkName,
          lastMessageAuthorRole: 'staff',
          unreadByCitizen: true,
          unreadByStaff: false,
        },
      });
    }
  });

  // Notificação fora da transação (fire-and-forget)
  try {
    const snap = await getDoc(reportRef);
    if (snap.exists()) {
      const r = snap.data() as Report;
      if (r.reporterId) {
        await tryCreateNotification({
          recipientId: r.reporterId,
          kind: 'report_update',
          tone: STATUS_TONE[status],
          title: `Relato ${STATUS_LABEL[status]}`,
          message: response || `Seu relato "${r.title}" foi atualizado para ${STATUS_LABEL[status]}.`,
          href: '/perfil',
          source: { type: 'report', id, protocol: r.protocolId },
        });
      }
    }
  } catch {
    // silencioso
  }
}

export async function getTopReports(max = 10): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, orderBy('votes', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}
