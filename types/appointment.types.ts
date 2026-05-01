import type { Timestamp } from 'firebase/firestore';

export type HealthUnitType = 'upa' | 'clinica' | 'hospital' | 'farmacia' | 'cras';

export type WaitTimeLevel = 'low' | 'medium' | 'high' | 'critical';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

export interface HealthUnit {
  id: string;
  name: string;
  type: HealthUnitType;
  address: string;
  phone: string;
  waitTime: string;
  waitLevel: WaitTimeLevel;
  isOpen: boolean;
  openHours: string;
  specialties: string[];
  updatedAt: Timestamp;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  unitId: string;
  unitName: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateAppointmentInput = Pick<
  Appointment,
  'unitId' | 'unitName' | 'specialty' | 'date' | 'time' | 'notes'
>;
