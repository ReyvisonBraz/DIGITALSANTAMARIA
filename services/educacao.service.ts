import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateProtocolId } from '@/lib/utils/protocol';
import type { CreateEnrollmentInput } from '@/types/enrollment.types';

const COLLECTION = 'enrollments';

export async function createEnrollment(
  input: CreateEnrollmentInput & { userId: string }
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    userId: input.userId,
    parentName: input.parentName,
    parentCpf: input.parentCpf,
    studentName: input.studentName,
    studentBirth: input.studentBirth,
    address: input.address,
    cep: input.cep,
    schoolPreference: input.schoolPreference,
    status: 'pending',
    protocol: generateProtocolId('MAT'),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}
