import type { Timestamp } from 'firebase/firestore';
import type { GeoLocation, StorageFile } from './common.types';

export type ReportType = 'infrastructure' | 'environment' | 'security' | 'other';

export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  type: ReportType;
  title: string;
  description: string;
  status: ReportStatus;
  protocol: string;
  location: GeoLocation | null;
  photo: StorageFile | null;
  votes: number;
  isPetition: boolean;
  adminResponse: string | null;
  clerkId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateReportInput = Pick<
  Report,
  'type' | 'title' | 'description' | 'location' | 'isPetition'
> & {
  photoFile?: File;
};
