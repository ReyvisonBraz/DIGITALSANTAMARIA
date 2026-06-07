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
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { reportConverter } from '@/lib/firebase/converters';
import { generateProtocolId } from '@/lib/utils/protocol';
import { uploadReportPhoto } from '@/services/storage.service';
import { tryCreateNotification } from '@/services/notifications.service';
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

const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: 'recebido',
  in_review: 'em analise',
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
    protocol: generateProtocolId(),
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
  const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
    reportId: input.reportId,
    authorId: input.authorId,
    authorName: input.authorName,
    authorRole: input.authorRole,
    message: input.message.trim(),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
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
  const q = query(ref, where('reportId', '==', reportId), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => mapReportMessage(docSnap.id, docSnap.data()));
}

export async function getReportsByUser(userId: string): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, where('reporterId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export function listenToUserReports(
  userId: string,
  onChange: (reports: Report[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, where('reporterId', '==', userId), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => d.data()));
    },
    (error) => {
      onError?.(error);
    },
  );
}

export async function getPendingReports(): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function getAllReports(): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
  clerkId: string,
  clerkName: string,
  adminResponse?: string,
): Promise<void> {
  const ref = doc(db, COLLECTION, id).withConverter(reportConverter);
  const snap = await getDoc(ref);
  const report = snap.exists() ? snap.data() : null;

  await updateDoc(doc(db, COLLECTION, id), {
    status,
    clerkId,
    ...(adminResponse !== undefined && { adminResponse }),
    updatedAt: serverTimestamp(),
  });

  const response = adminResponse?.trim() || '';
  const previousResponse = report?.adminResponse?.trim() || '';

  if (response && response !== previousResponse) {
    await createReportMessage({
      reportId: id,
      authorId: clerkId,
      authorName: clerkName,
      authorRole: 'staff',
      message: response,
    });
  }

  if (report?.reporterId) {
    await tryCreateNotification({
      recipientId: report.reporterId,
      kind: 'report_update',
      tone: STATUS_TONE[status],
      title: `Relato ${STATUS_LABEL[status]}`,
      message: adminResponse?.trim() || `Seu relato "${report.title}" foi atualizado para ${STATUS_LABEL[status]}.`,
      href: '/perfil',
      source: { type: 'report', id, protocol: report.protocol },
    });
  }
}

export async function getTopReports(max = 10): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, orderBy('votes', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}
