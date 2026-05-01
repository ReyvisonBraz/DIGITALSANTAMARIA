import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { appointmentConverter, healthUnitConverter } from '@/lib/firebase/converters';
import type { Appointment, CreateAppointmentInput, HealthUnit } from '@/types';

const APPOINTMENTS_COL = 'appointments';
const HEALTH_UNITS_COL = 'health_units';

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

export async function getHealthUnits(): Promise<HealthUnit[]> {
  const ref = collection(db, HEALTH_UNITS_COL).withConverter(healthUnitConverter);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data());
}
