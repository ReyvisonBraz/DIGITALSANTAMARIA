import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { demandConverter } from '@/lib/firebase/converters';
import { generateDemandProtocolId } from '@/lib/utils/protocol';
import { createNotification } from '@/services/notifications.service';
import type { Demand, CreateDemandInput, DemandStatus, AdminAction, NotificationTone } from '@/types';

const COLLECTION = 'demands';

const STATUS_LABEL: Record<DemandStatus, string> = {
  pending: 'pendente',
  analyzing: 'em análise',
  solved: 'resolvida',
  rejected: 'recusada',
};

const STATUS_TONE: Record<DemandStatus, NotificationTone> = {
  pending: 'update',
  analyzing: 'update',
  solved: 'success',
  rejected: 'alert',
};

export async function createDemand(
  input: CreateDemandInput & { authorId: string }
): Promise<{ id: string; protocolId: string }> {
  const protocolId = generateDemandProtocolId();
  const docRef = await addDoc(collection(db, COLLECTION), {
    protocolId,
    authorId: input.isAnonymous ? '' : input.authorId,
    authorName: input.isAnonymous ? 'Anônimo' : null,
    type: input.type,
    category: input.category,
    subject: input.subject,
    status: 'pending',
    content: {
      text: input.text,
      mediaFiles: [],
      location: input.location || null,
    },
    adminAction: null,
    isAnonymous: input.isAnonymous,
    consent: input.consent,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, protocolId };
}

export async function getDemandByProtocol(protocolId: string): Promise<Demand | null> {
  const ref = collection(db, COLLECTION).withConverter(demandConverter);
  const q = query(ref, where('protocolId', '==', protocolId));
  const snap = await getDocs(q);
  return snap.empty ? null : snap.docs[0].data();
}

export async function getDemandsByUser(userId: string): Promise<Demand[]> {
  const ref = collection(db, COLLECTION).withConverter(demandConverter);
  const q = query(ref, where('authorId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function getAllDemands(): Promise<Demand[]> {
  const ref = collection(db, COLLECTION).withConverter(demandConverter);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function updateDemandStatus(
  id: string,
  status: DemandStatus,
  adminAction: Omit<AdminAction, 'updatedAt'>
): Promise<void> {
  const ref = doc(db, COLLECTION, id).withConverter(demandConverter);
  const snap = await getDoc(ref);
  const demand = snap.exists() ? snap.data() : null;

  await updateDoc(doc(db, COLLECTION, id), {
    status,
    adminAction: {
      ...adminAction,
      updatedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });

  if (demand && !demand.isAnonymous && demand.authorId) {
    await createNotification({
      recipientId: demand.authorId,
      kind: 'demand_update',
      tone: STATUS_TONE[status],
      title: `Solicitação ${STATUS_LABEL[status]}`,
      message: adminAction.response?.trim() || `Sua solicitação "${demand.subject}" foi atualizada para ${STATUS_LABEL[status]}.`,
      href: '/perfil',
      source: { type: 'demand', id, protocol: demand.protocolId },
    });
  }
}
