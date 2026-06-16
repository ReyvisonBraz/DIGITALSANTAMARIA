import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { emergencyAlertConverter } from '@/lib/firebase/converters';
import { tryCreateNotification } from '@/services/notifications.service';
import { generateProtocolId } from '@/lib/utils/protocol';
import { byCreatedAtDesc } from '@/lib/utils/sort';
import type {
  CreateEmergencyAlertInput,
  EmergencyAlert,
  EmergencyAlertStatus,
} from '@/types';

const COLLECTION = 'emergency_alerts';

const EMERGENCY_STATUS_LABEL: Record<EmergencyAlertStatus, string> = {
  active: 'ativo',
  in_progress: 'em atendimento',
  resolved: 'resolvido',
  cancelled: 'cancelado',
};

export async function createEmergencyAlert(
  input: CreateEmergencyAlertInput & {
    userId: string;
    userName: string;
    userEmail: string;
  },
): Promise<string> {
  const protocol = generateProtocolId('SEG');
  await addDoc(collection(db, COLLECTION), {
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    type: input.type,
    description: input.description,
    location: input.location,
    status: 'active',
    protocol,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return protocol;
}

export async function getAllEmergencyAlerts(max = 200): Promise<EmergencyAlert[]> {
  const ref = collection(db, COLLECTION).withConverter(emergencyAlertConverter);
  const q = query(ref, orderBy('createdAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((document) => document.data());
}

export async function getEmergencyAlertsByUser(userId: string): Promise<EmergencyAlert[]> {
  const ref = collection(db, COLLECTION).withConverter(emergencyAlertConverter);
  const q = query(ref, where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs
    .map((document) => document.data())
    .sort(byCreatedAtDesc);
}

export async function updateEmergencyAlertStatus(
  id: string,
  status: EmergencyAlertStatus,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  const alert = snap.exists() ? ({ id: snap.id, ...snap.data() } as EmergencyAlert) : null;

  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });

  if (alert) {
    await tryCreateNotification({
      recipientId: alert.userId,
      kind: 'emergency_update',
      tone: status === 'resolved' ? 'success' : (status === 'cancelled' ? 'alert' : 'update'),
      title: 'Alerta de segurança atualizado',
      message: `O alerta ${alert.protocol} está ${EMERGENCY_STATUS_LABEL[status]}.`,
      href: '/seguranca',
      source: { type: 'emergency', id, protocol: alert.protocol },
    });
  }
}
