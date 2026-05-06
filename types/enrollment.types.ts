import type { Timestamp } from 'firebase/firestore';

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'waiting_list';

export interface Enrollment {
  id: string;
  userId: string;
  parentName: string;
  parentCpf: string;
  studentName: string;
  studentBirth: string;
  address: string;
  cep: string;
  schoolPreference: string;
  status: EnrollmentStatus;
  protocol: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateEnrollmentInput = Pick<
  Enrollment,
  'parentName' | 'parentCpf' | 'studentName' | 'studentBirth' | 'address' | 'cep' | 'schoolPreference'
>;
