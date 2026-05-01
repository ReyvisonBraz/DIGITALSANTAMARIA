import type { Timestamp } from 'firebase/firestore';

export type PetitionStatus = 'active' | 'achieved' | 'official_reply' | 'closed';

export interface Petition {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorPhotoURL: string | null;
  title: string;
  description: string;
  category: string;
  goal: number;
  signaturesCount: number;
  status: PetitionStatus;
  officialReply: string | null;
  coverImageURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PetitionSignature {
  id: string;
  petitionId: string;
  userId: string;
  userName: string;
  createdAt: Timestamp;
}

export type CreatePetitionInput = Pick<
  Petition,
  'title' | 'description' | 'category' | 'goal'
>;
