import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { appointmentConverter, healthUnitConverter } from '@/lib/firebase/converters';
import { tryCreateNotification } from '@/services/notifications.service';
import type { Appointment, AppointmentStatus, CreateAppointmentInput, HealthUnit } from '@/types';

const APPOINTMENTS_COL = 'appointments';
const HEALTH_UNITS_COL = 'health_units';

const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: 'agendada',
  confirmed: 'confirmada',
  completed: 'concluida',
  cancelled: 'cancelada',
};

export async function createAppointment(
  input: CreateAppointmentInput & { userId: string; userName: string }
): Promise<string> {
  const docRef = await addDoc(collection(db, APPOINTMENTS_COL), {
    userId: input.userId,
    userName: input.userName,
    unitId: input.unitId,
    unitName: input.unitName,
    specialty: input.specialty,
    date: input.date,
    time: input.time,
    status: 'scheduled',
    notes: input.notes || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getAppointmentsByUser(userId: string): Promise<Appointment[]> {
  const ref = collection(db, APPOINTMENTS_COL).withConverter(appointmentConverter);
  const q = query(ref, where('userId', '==', userId), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function getAllAppointments(): Promise<Appointment[]> {
  const ref = collection(db, APPOINTMENTS_COL).withConverter(appointmentConverter);
  const q = query(ref, orderBy('date', 'desc'), orderBy('time', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<void> {
  const ref = doc(db, APPOINTMENTS_COL, id);
  const snap = await getDoc(ref);
  const appointment = snap.exists() ? ({ id: snap.id, ...snap.data() } as Appointment) : null;

  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });

  if (appointment) {
    await tryCreateNotification({
      recipientId: appointment.userId,
      kind: 'appointment_update',
      tone: status === 'cancelled' ? 'alert' : 'success',
      title: 'Consulta atualizada',
      message: `Sua consulta em ${appointment.unitName} foi ${APPOINTMENT_STATUS_LABEL[status]}.`,
      href: '/perfil',
      source: { type: 'appointment', id },
    });
  }
}

export async function getHealthUnits(): Promise<HealthUnit[]> {
  const ref = collection(db, HEALTH_UNITS_COL).withConverter(healthUnitConverter);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data());
}

export async function createHealthUnit(
  input: Omit<HealthUnit, 'id' | 'updatedAt'>,
): Promise<string> {
  const docRef = await addDoc(collection(db, HEALTH_UNITS_COL), {
    ...input,
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateHealthUnit(
  id: string,
  input: Omit<HealthUnit, 'id' | 'updatedAt'>,
): Promise<void> {
  await updateDoc(doc(db, HEALTH_UNITS_COL, id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}
