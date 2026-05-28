import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notificationConverter } from '@/lib/firebase/converters';
import type { CreateNotificationInput, Notification } from '@/types';

const COLLECTION = 'notifications';
const FEED_LIMIT = 30;

export async function createNotification(input: CreateNotificationInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    read: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export function listenToUserNotifications(
  userId: string,
  onChange: (notifications: Notification[]) => void,
): () => void {
  const ref = collection(db, COLLECTION).withConverter(notificationConverter);
  const q = query(
    ref,
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(FEED_LIMIT),
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => d.data()));
  });
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { read: true });
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const ref = collection(db, COLLECTION).withConverter(notificationConverter);
  const q = query(ref, where('recipientId', '==', userId), where('read', '==', false));
  const snap = await getDocs(q);
  if (snap.empty) return;
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
  await batch.commit();
}
