import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import type {
  UserProfile,
  Report,
  Demand,
  Petition,
  PetitionSignature,
  Appointment,
  HealthUnit,
  Job,
  JobApplication,
  Notification,
} from '@/types';

function converter<T extends { id: string }>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): Record<string, unknown> {
      const { id, ...rest } = data as Record<string, unknown>;
      return rest;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return { id: snapshot.id, ...snapshot.data() } as T;
    },
  };
}

export const userConverter = converter<UserProfile>();
export const reportConverter = converter<Report>();
export const demandConverter = converter<Demand>();
export const petitionConverter = converter<Petition>();
export const petitionSignatureConverter = converter<PetitionSignature>();
export const appointmentConverter = converter<Appointment>();
export const healthUnitConverter = converter<HealthUnit>();
export const jobConverter = converter<Job>();
export const jobApplicationConverter = converter<JobApplication>();
export const notificationConverter = converter<Notification>();
