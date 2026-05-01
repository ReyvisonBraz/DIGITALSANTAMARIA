import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'citizen' | 'admin' | 'clerk';

export type Department =
  | 'saude'
  | 'educacao'
  | 'obras'
  | 'transito'
  | 'tributacao'
  | 'social'
  | 'meio_ambiente'
  | 'seguranca'
  | null;

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  department: Department;
  neighborhood: string | null;
  phone: string | null;
  cpfVerified: boolean;
  points: number;
  level: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
