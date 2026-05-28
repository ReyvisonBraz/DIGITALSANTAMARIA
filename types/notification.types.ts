import type { Timestamp } from 'firebase/firestore';

export type NotificationKind = 'demand_update' | 'report_update' | 'petition_update' | 'system';

export type NotificationTone = 'success' | 'alert' | 'update';

export interface NotificationSource {
  type: 'demand' | 'report' | 'petition';
  id: string;
  protocol?: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  kind: NotificationKind;
  tone: NotificationTone;
  title: string;
  message: string;
  href: string;
  read: boolean;
  source?: NotificationSource;
  createdAt: Timestamp;
}

export type CreateNotificationInput = Omit<Notification, 'id' | 'createdAt' | 'read'>;
