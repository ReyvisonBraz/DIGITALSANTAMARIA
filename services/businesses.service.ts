import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createContentService } from '@/services/content.service';
import { tryCreateNotification } from '@/services/notifications.service';
import type { Business } from '@/types';
import { byCreatedAtDesc } from '@/lib/utils/sort';

const COLLECTION = 'businesses';
const factory = createContentService<Business>(COLLECTION);

export type RegisterBusinessInput = Pick<
  Business,
  'title' | 'description' | 'category' | 'address' | 'phone' | 'whatsapp' | 'hours'
> & {
  ownerId: string;
  ownerName: string;
  imageURL?: string | null;
  mapURL?: string | null;
};

/** Cidadão cadastra seu próprio negócio e entra como pending_approval. */
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
    imageURL: input.imageURL ?? null,
    mapURL: input.mapURL ?? null,
    isOpen: true,
    lat: null,
    lng: null,
    ownerId: input.ownerId,
    ownerName: input.ownerName,
    reviewNote: null,
  });
}

/** Dono edita o próprio negócio sem mudar status nem ownerId. */
export async function updateOwnedBusiness(
  id: string,
  patch: Partial<Pick<Business, 'title' | 'description' | 'category' | 'address' | 'phone' | 'whatsapp' | 'hours' | 'isOpen' | 'imageURL' | 'mapURL'>>,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

/** Dono corrige um cadastro reprovado e reenvia para análise da prefeitura. */
export async function resubmitOwnedBusiness(
  id: string,
  patch: Partial<Pick<Business, 'title' | 'description' | 'category' | 'address' | 'phone' | 'whatsapp' | 'hours' | 'isOpen' | 'imageURL' | 'mapURL'>>,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...patch,
    status: 'pending_approval',
    reviewNote: null,
    updatedAt: serverTimestamp(),
  });
}

/** Dono cancela/exclui o próprio cadastro sem remover fisicamente do Firestore. */
export async function deleteOwnedBusiness(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    status: 'archived',
    reviewNote: 'Cancelado pelo proprietário.',
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Admin aprova um cadastro pendente, deixando visível em /comercio. */
export async function approveBusiness(id: string): Promise<void> {
  const business = await factory.getById(id);

  await updateDoc(doc(db, COLLECTION, id), {
    status: 'published',
    reviewNote: null,
    updatedAt: serverTimestamp(),
  });

  if (business?.ownerId) {
    await tryCreateNotification({
      recipientId: business.ownerId,
      kind: 'business_update',
      tone: 'success',
      title: 'Negócio aprovado',
      message: `Seu cadastro "${business.title}" foi aprovado e já está visível em /comércio.`,
      href: '/perfil',
      source: { type: 'business', id },
    });
  }
}

/** Admin reprova com motivo opcional, visivel para o dono no painel. */
export async function rejectBusiness(id: string, note?: string): Promise<void> {
  const business = await factory.getById(id);
  const trimmedNote = note?.trim() || '';

  await updateDoc(doc(db, COLLECTION, id), {
    status: 'archived',
    reviewNote: trimmedNote || null,
    updatedAt: serverTimestamp(),
  });

  if (business?.ownerId) {
    await tryCreateNotification({
      recipientId: business.ownerId,
      kind: 'business_update',
      tone: 'alert',
      title: 'Cadastro não aprovado',
      message: trimmedNote
        ? `"${business.title}" não foi aprovado. Motivo: ${trimmedNote}`
        : `"${business.title}" não foi aprovado pela prefeitura. Veja seu painel para revisar e reenviar.`,
      href: '/perfil',
      source: { type: 'business', id },
    });
  }
}

/** Lista negócios pendentes para o painel de moderação. */
export async function listPendingBusinesses(): Promise<Business[]> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, where('status', '==', 'pending_approval'));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Business)
    .filter((business) => !business.deletedAt)
    .sort(byCreatedAtDesc);
}

/** Stream em tempo real dos negócios de um cidadão, em qualquer status. */
export function listenToOwnedBusinesses(
  ownerId: string,
  onChange: (businesses: Business[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  const ref = collection(db, COLLECTION);
  const q = query(ref, where('ownerId', '==', ownerId));
  return onSnapshot(
    q,
    (snap) => {
      const sorted = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as Business)
        .filter((business) => !business.deletedAt)
        .sort(byCreatedAtDesc);
      onChange(sorted);
    },
    (error) => {
      onError?.(error);
    },
  );
}
