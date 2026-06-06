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
import { createLogger } from '@/lib/logger';
import type { CreateNotificationInput, Notification } from '@/types';

const COLLECTION = 'notifications';
const FEED_LIMIT = 30;
const log = createLogger('NotificationsService');

export async function createNotification(input: CreateNotificationInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    read: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function tryCreateNotification(input: CreateNotificationInput): Promise<void> {
  try {
    await createNotification(input);
  } catch (error) {
    log.warn('Notification creation skipped', {
      recipientId: input.recipientId,
      kind: input.kind,
      sourceType: input.source?.type,
      sourceId: input.source?.id,
    }, error);
  }
}

export function listenToUserNotifications(
  userId: string,
  onChange: (notifications: Notification[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  const ref = collection(db, COLLECTION).withConverter(notificationConverter);
  const q = query(
    ref,
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(FEED_LIMIT),
  );
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
