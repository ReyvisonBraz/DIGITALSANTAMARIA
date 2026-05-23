import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { userConverter } from '@/lib/firebase/converters';
import type { UserProfile } from '@/types';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, 'users', uid).withConverter(userConverter);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(db, 'users').withConverter(userConverter));
  return snap.docs
    .map((item) => item.data())
    .sort((a, b) => (a.displayName || a.email || '').localeCompare(b.displayName || b.email || ''));
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'neighborhood' | 'phone'>>
): Promise<void> {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function updateUserProfileByAdmin(
  uid: string,
  data: Partial<Pick<UserProfile, 'displayName' | 'neighborhood' | 'phone'>>
): Promise<void> {
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
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
