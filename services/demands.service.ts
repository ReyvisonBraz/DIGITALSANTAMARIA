import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  writeBatch,
  runTransaction,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { demandConverter } from '@/lib/firebase/converters';
import { generateDemandProtocolId } from '@/lib/utils/protocol';
import { tryCreateNotification } from '@/services/notifications.service';
import type {
  Demand,
  CreateDemandInput,
  DemandMessage,
  DemandMessageAuthorRole,
  DemandStatus,
  AdminAction,
  NotificationTone,
} from '@/types';

const COLLECTION = 'demands';
const MESSAGES_COLLECTION = 'demand_messages';
const PROTOCOL_TIMEOUT_MS = 12_000;

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
  input: CreateDemandInput & { authorId: string; authorName: string }
): Promise<{ id: string }> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    authorId: input.isAnonymous ? '' : input.authorId,
    authorName: input.isAnonymous ? 'Anônimo' : input.authorName || 'Cidadão',
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
  return { id: docRef.id };
}

/**
 * Aguarda o protocolId real gerado pela Cloud Function (onDemandCreated).
 * Se a CF falhar ou demorar mais que PROTOCOL_TIMEOUT_MS, gera fallback local.
 */
export function waitForDemandProtocol(
  demandId: string,
  onProtocol: (protocolId: string) => void,
): () => void {
  const ref = doc(db, COLLECTION, demandId);
  let resolved = false;

  const timeoutId = setTimeout(() => {
    if (resolved) return;
    resolved = true;
    unsubscribe();
    onProtocol(generateDemandProtocolId());
  }, PROTOCOL_TIMEOUT_MS);

  const unsubscribe = onSnapshot(
    ref,
    (snap) => {
      if (resolved) return;
      const data = snap.data() as { protocolId?: string } | undefined;
      if (data?.protocolId) {
        resolved = true;
        clearTimeout(timeoutId);
        onProtocol(data.protocolId);
        unsubscribe();
      }
    },
    () => {
      // on error: fallback immediately
      clearTimeout(timeoutId);
    },
  );

  return () => {
    clearTimeout(timeoutId);
    unsubscribe();
  };
}

export async function createDemandMessage(input: {
  demandId: string;
  authorId: string;
  authorName: string;
  authorRole: DemandMessageAuthorRole;
  message: string;
}): Promise<string> {
  const messageRef = doc(collection(db, MESSAGES_COLLECTION));
  const demandRef = doc(db, COLLECTION, input.demandId);
  const batch = writeBatch(db);
  const message = input.message.trim();

  batch.set(messageRef, {
    demandId: input.demandId,
    authorId: input.authorId,
    authorName: input.authorName,
    authorRole: input.authorRole,
    message,
    createdAt: serverTimestamp(),
  });

  batch.update(demandRef, {
    conversation: {
      lastMessageAt: serverTimestamp(),
      lastMessageAuthorName: input.authorName,
      lastMessageAuthorRole: input.authorRole,
      unreadByCitizen: input.authorRole === 'staff',
      unreadByStaff: input.authorRole === 'citizen',
    },
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
  return messageRef.id;
}

function mapDemandMessage(id: string, data: Record<string, unknown>): DemandMessage {
  return {
    id,
    demandId: String(data.demandId || ''),
    authorId: String(data.authorId || ''),
    authorName: String(data.authorName || ''),
    authorRole: (data.authorRole || 'system') as DemandMessageAuthorRole,
    message: String(data.message || ''),
    createdAt: data.createdAt as DemandMessage['createdAt'],
  };
}

export async function getDemandMessages(demandId: string): Promise<DemandMessage[]> {
  const ref = collection(db, MESSAGES_COLLECTION);
  const q = query(ref, where('demandId', '==', demandId), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((docSnap) => mapDemandMessage(docSnap.id, docSnap.data()));
}

export function listenToDemandMessages(
  demandId: string,
  onChange: (messages: DemandMessage[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  const ref = collection(db, MESSAGES_COLLECTION);
  const q = query(ref, where('demandId', '==', demandId), orderBy('createdAt', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      onChange(snap.docs.map((d) => mapDemandMessage(d.id, d.data())));
    },
    (error) => {
      onError?.(error);
    },
  );
}

async function findDemandByProtocol(filters: [string, unknown][]): Promise<Demand | null> {
  const ref = collection(db, COLLECTION).withConverter(demandConverter);
  const q = query(
    ref,
    ...filters.map(([field, value]) => where(field, '==', value)),
  );
  const snap = await getDocs(q);
  return snap.empty ? null : snap.docs[0].data();
}

export async function getDemandByProtocol(protocolId: string, userId?: string): Promise<Demand | null> {
  const normalizedProtocol = protocolId.trim();

  if (userId) {
    const ownedDemand = await findDemandByProtocol([
      ['protocolId', normalizedProtocol],
      ['authorId', userId],
    ]);

    if (ownedDemand) return ownedDemand;
  }

  return findDemandByProtocol([
    ['protocolId', normalizedProtocol],
    ['isAnonymous', true],
  ]);
}

export async function getDemandsByUser(userId: string): Promise<Demand[]> {
  const ref = collection(db, COLLECTION).withConverter(demandConverter);
  const q = query(ref, where('authorId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export function listenToUserDemands(
  userId: string,
  onChange: (demands: Demand[]) => void,
  onError?: (error: unknown) => void,
): () => void {
  const ref = collection(db, COLLECTION).withConverter(demandConverter);
  const q = query(ref, where('authorId', '==', userId), orderBy('createdAt', 'desc'));
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

export async function getAllDemands(): Promise<Demand[]> {
  const ref = collection(db, COLLECTION).withConverter(demandConverter);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function markDemandReadByStaff(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    'conversation.unreadByStaff': false,
    updatedAt: serverTimestamp(),
  });
}

export async function markDemandReadByCitizen(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    'conversation.unreadByCitizen': false,
    updatedAt: serverTimestamp(),
  });
}

export async function updateDemandStatus(
  id: string,
  status: DemandStatus,
  adminAction: Omit<AdminAction, 'updatedAt'>
): Promise<void> {
  const demandRef = doc(db, COLLECTION, id);
  const response = adminAction.response.trim();

  await runTransaction(db, async (tx) => {
    const demandSnap = await tx.get(demandRef);
    if (!demandSnap.exists()) {
      throw new Error('Demand not found');
    }

    const demand = demandSnap.data() as Demand;
    const previousResponse = demand.adminAction?.response?.trim() || '';

    tx.update(demandRef, {
      status,
      adminAction: {
        ...adminAction,
        updatedAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });

    if (response && response !== previousResponse) {
      const msgRef = doc(collection(db, MESSAGES_COLLECTION));
      tx.set(msgRef, {
        demandId: id,
        authorId: adminAction.clerkId,
        authorName: adminAction.clerkName,
        authorRole: 'staff' as const,
        message: response,
        createdAt: serverTimestamp(),
      });

      tx.update(demandRef, {
        conversation: {
          lastMessageAt: serverTimestamp(),
          lastMessageAuthorName: adminAction.clerkName,
          lastMessageAuthorRole: 'staff',
          unreadByCitizen: true,
          unreadByStaff: false,
        },
      });
    }
  });

  // Notificacao fora da transacao (fire-and-forget, nao deve bloquear)
  try {
    const snap = await getDoc(demandRef);
    if (snap.exists()) {
      const d = snap.data() as Demand;
      if (!d.isAnonymous && d.authorId) {
        await tryCreateNotification({
          recipientId: d.authorId,
          kind: 'demand_update',
          tone: STATUS_TONE[status],
          title: `Solicitacao ${STATUS_LABEL[status]}`,
          message: response || `Sua solicitacao "${d.subject}" foi atualizada para ${STATUS_LABEL[status]}.`,
          href: '/perfil',
          source: { type: 'demand', id, protocol: d.protocolId },
        });
      }
    }
  } catch {
    // silencioso
  }
}
