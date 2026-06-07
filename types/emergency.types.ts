import type { Timestamp } from 'firebase/firestore';

export type EmergencyAlertType = 'panic' | 'violence' | 'fire' | 'medical' | 'flood' | 'other';

export type EmergencyAlertStatus = 'active' | 'in_progress' | 'resolved' | 'cancelled';

export interface EmergencyAlert {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: EmergencyAlertType;
  description: string;
  location: string;
  status: EmergencyAlertStatus;
  protocol: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateEmergencyAlertInput = Pick<
  EmergencyAlert,
  'type' | 'description' | 'location'
>;
