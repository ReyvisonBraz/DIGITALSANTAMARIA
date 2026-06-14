import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { enrollmentConverter } from '@/lib/firebase/converters';
import { tryCreateNotification } from '@/services/notifications.service';
import { generateProtocolId } from '@/lib/utils/protocol';
import type { CreateEnrollmentInput, Enrollment, EnrollmentStatus } from '@/types/enrollment.types';

const COLLECTION = 'enrollments';

const ENROLLMENT_STATUS_LABEL: Record<EnrollmentStatus, string> = {
  pending: 'pendente',
  approved: 'aprovada',
  rejected: 'rejeitada',
  waiting_list: 'colocada em lista de espera',
};

export async function createEnrollment(
  input: CreateEnrollmentInput & { userId: string }
): Promise<string> {
  const protocol = generateProtocolId('MAT');
  await addDoc(collection(db, COLLECTION), {
    userId: input.userId,
    parentName: input.parentName,
    parentCpf: input.parentCpf,
    studentName: input.studentName,
    studentBirth: input.studentBirth,
    address: input.address,
    cep: input.cep,
    schoolPreference: input.schoolPreference,
    status: 'pending',
    protocol,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return protocol;
}

export async function getAllEnrollments(): Promise<Enrollment[]> {
  const ref = collection(db, COLLECTION).withConverter(enrollmentConverter);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((document) => document.data());
}

export async function getEnrollmentsByUser(userId: string): Promise<Enrollment[]> {
  const ref = collection(db, COLLECTION).withConverter(enrollmentConverter);
  const q = query(ref, where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs
    .map((document) => document.data())
    .sort((a, b) => {
      const aMs = (a.createdAt as unknown as Timestamp)?.toMillis?.() ?? 0;
      const bMs = (b.createdAt as unknown as Timestamp)?.toMillis?.() ?? 0;
      return bMs - aMs;
    });
}

export async function updateEnrollmentStatus(
  id: string,
  status: EnrollmentStatus,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  const enrollment = snap.exists() ? ({ id: snap.id, ...snap.data() } as Enrollment) : null;

  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });

  if (enrollment) {
    await tryCreateNotification({
      recipientId: enrollment.userId,
      kind: 'enrollment_update',
      tone: status === 'approved' ? 'success' : (status === 'rejected' ? 'alert' : 'update'),
      title: 'Matrícula atualizada',
      message: `A solicitação ${enrollment.protocol} foi ${ENROLLMENT_STATUS_LABEL[status]}.`,
      href: '/perfil',
      source: { type: 'enrollment', id, protocol: enrollment.protocol },
    });
  }
}
