import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { userConverter } from '@/lib/firebase/converters';
import type { UserProfile } from '@/types';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, 'users', uid).withConverter(userConverter);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'neighborhood' | 'phone'>>
): Promise<void> {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...data, updatedAt: new Date() });
}

export async function createUserProfile(uid: string, data: Omit<UserProfile, 'id'>): Promise<void> {
  const ref = doc(db, 'users', uid).withConverter(userConverter);
  await setDoc(ref, data);
}

export async function getUserRole(uid: string): Promise<'citizen' | 'admin' | 'clerk'> {
  const snap = await getDoc(doc(db, 'admins', uid));
  if (!snap.exists()) return 'citizen';
  const data = snap.data();
  return data.role === 'admin' || data.role === 'clerk' ? data.role : 'citizen';
}
