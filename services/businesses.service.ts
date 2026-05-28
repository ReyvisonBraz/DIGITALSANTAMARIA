import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createContentService } from '@/services/content.service';
import type { Business } from '@/types';

const COLLECTION = 'businesses';
const factory = createContentService<Business>(COLLECTION);

export type RegisterBusinessInput = Pick<
  Business,
  'title' | 'description' | 'category' | 'address' | 'phone' | 'whatsapp' | 'hours'
> & {
  ownerId: string;
  ownerName: string;
};

/** Cidadão cadastra seu próprio negócio — entra como pending_approval. */
export async function registerBusiness(input: RegisterBusinessInput): Promise<string> {
  return factory.create({
    title: input.title,
    description: input.description,
    status: 'pending_approval',
    category: input.category,
    address: input.address,
    phone: input.phone,
    whatsapp: input.whatsapp,
    hours: input.hours,
    imageURL: null,
    isOpen: true,
    lat: null,
    lng: null,
    ownerId: input.ownerId,
    ownerName: input.ownerName,
    reviewNote: null,
  });
}

/** Dono edita o próprio negócio (sem mudar status nem ownerId). */
export async function updateOwnedBusiness(
  id: string,
  patch: Partial<Pick<Business, 'title' | 'description' | 'category' | 'address' | 'phone' | 'whatsapp' | 'hours' | 'isOpen'>>,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

/** Admin aprova um cadastro pendente — vira public no /comercio. */
export async function approveBusiness(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    status: 'published',
    reviewNote: null,
    updatedAt: serverTimestamp(),
  });
}

/** Admin reprova com motivo opcional — fica visível pro dono no painel. */
export async function rejectBusiness(id: string, note?: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    status: 'archived',
    reviewNote: note?.trim() || null,
    updatedAt: serverTimestamp(),
  });
}

/** Lista negócios pendentes para o painel de moderação. */
export async function listPendingBusinesses(): Promise<Business[]> {
  const ref = collection(db, COLLECTION);
  const q = query(
    ref,
    where('status', '==', 'pending_approval'),
    where('deletedAt', '==', null),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Business);
}

/** Stream em tempo real dos negócios de um cidadão (qualquer status). */
export function listenToOwnedBusinesses(
  ownerId: string,
  onChange: (businesses: Business[]) => void,
): () => void {
  const ref = collection(db, COLLECTION);
  const q = query(
    ref,
    where('ownerId', '==', ownerId),
    where('deletedAt', '==', null),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Business));
  });
}
