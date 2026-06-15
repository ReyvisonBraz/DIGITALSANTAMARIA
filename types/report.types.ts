import type { Timestamp } from 'firebase/firestore';
import type { GeoLocation, StorageFile } from './common.types';

export type ReportType = 'infrastructure' | 'environment' | 'security' | 'other';

export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'rejected' | 'cancelled';

export type ReportMessageAuthorRole = 'citizen' | 'staff' | 'system';

export interface ReportConversationSummary {
  lastMessageAt: Timestamp;
  lastMessageAuthorName: string;
  lastMessageAuthorRole: ReportMessageAuthorRole;
  unreadByCitizen: boolean;
  unreadByStaff: boolean;
}

export interface ReportCancellation {
  cancelledAt: Timestamp;
  cancelledBy: string;
  reason: string | null;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  type: ReportType;
  title: string;
  description: string;
  status: ReportStatus;
  protocolId: string;
  location: GeoLocation | null;
  photo: StorageFile | null;
  votes: number;
  isPetition: boolean;
  adminResponse: string | null;
  clerkId: string | null;
  cancellation?: ReportCancellation | null;
  conversation?: ReportConversationSummary;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ReportMessage {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  authorRole: ReportMessageAuthorRole;
  message: string;
  createdAt: Timestamp;
}

export type CreateReportInput = Pick<
  Report,
  'type' | 'title' | 'description' | 'location' | 'isPetition'
> & {
  photoFile?: File;
};
