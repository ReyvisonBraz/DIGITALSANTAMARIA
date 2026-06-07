import type { Timestamp } from 'firebase/firestore';
import type { GeoLocation, StorageFile } from './common.types';

export type DemandType = 'reclamacao' | 'sugestao' | 'denuncia' | 'elogio';

export type DemandStatus = 'pending' | 'analyzing' | 'solved' | 'rejected';

export type DemandCategory =
  | 'infraestrutura'
  | 'saude'
  | 'educacao'
  | 'seguranca'
  | 'meio_ambiente'
  | 'transporte'
  | 'tributos'
  | 'outros';

export interface AdminAction {
  clerkId: string;
  clerkName: string;
  response: string;
  updatedAt: Timestamp;
}

export interface Demand {
  id: string;
  protocolId: string;
  authorId: string;
  authorName: string | null;
  type: DemandType;
  category: DemandCategory;
  subject: string;
  status: DemandStatus;
  content: {
    text: string;
    mediaFiles: StorageFile[];
    location: GeoLocation | null;
  };
  adminAction: AdminAction | null;
  isAnonymous: boolean;
  consent: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type DemandMessageAuthorRole = 'citizen' | 'staff' | 'system';

export interface DemandMessage {
  id: string;
  demandId: string;
  authorId: string;
  authorName: string;
  authorRole: DemandMessageAuthorRole;
  message: string;
  createdAt: Timestamp;
}

export type CreateDemandInput = {
  type: DemandType;
  category: DemandCategory;
  subject: string;
  text: string;
  location?: GeoLocation;
  mediaFiles?: File[];
  isAnonymous: boolean;
  consent: boolean;
};
