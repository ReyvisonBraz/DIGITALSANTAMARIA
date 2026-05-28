import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { reportConverter } from '@/lib/firebase/converters';
import { generateProtocolId } from '@/lib/utils/protocol';
import { uploadReportPhoto } from '@/services/storage.service';
import type { Report, CreateReportInput, ReportStatus, StorageFile } from '@/types';

const COLLECTION = 'reports';

export async function createReport(
  input: CreateReportInput & { reporterId: string; reporterName: string }
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

export async function getReportsByUser(userId: string): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, where('reporterId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function getPendingReports(): Promise<Report[]> {
  const ref = collection(db, COLLECTION).withConverter(reportConverter);
  const q = query(ref, where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
  clerkId: string,
  adminResponse?: string
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    status,
    clerkId,
    ...(adminResponse !== undefined && { adminResponse }),
    updatedAt: serverTimestamp(),
  });
}
