import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '@/lib/firebase';
import { petitionConverter } from '@/lib/firebase/converters';
import type { CreatePetitionInput, Petition, PetitionStatus } from '@/types';

const PETITIONS_COL = 'petitions';
const SIGNATURES_COL = 'petition_signatures';

export async function createPetition(
  input: CreatePetitionInput & { creatorId: string; creatorName: string },
): Promise<string> {
  const docRef = await addDoc(collection(db, PETITIONS_COL), {
    creatorId: input.creatorId,
    creatorName: input.creatorName,
    creatorPhotoURL: null,
    title: input.title,
    description: input.description,
    category: input.category,
    goal: input.goal,
    signaturesCount: 0,
    status: 'active',
    officialReply: null,
    coverImageURL: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getActivePetitions(): Promise<Petition[]> {
  const ref = collection(db, PETITIONS_COL).withConverter(petitionConverter);
  const q = query(ref, where('status', '==', 'active'));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data())
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
      const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
      return bTime - aTime;
    });
}

export async function getAllPetitions(): Promise<Petition[]> {
  const ref = collection(db, PETITIONS_COL).withConverter(petitionConverter);
  const snap = await getDocs(ref);
  return snap.docs
    .map((d) => d.data())
    .sort((a, b) => {
      const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0;
      const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0;
      return bTime - aTime;
    });
}

export async function getPetitionById(id: string): Promise<Petition | null> {
  const ref = doc(db, PETITIONS_COL, id).withConverter(petitionConverter);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updatePetitionAdmin(
  id: string,
  input: {
    status: PetitionStatus;
    officialReply?: string | null;
  },
): Promise<void> {
  const ref = doc(db, PETITIONS_COL, id);
  await updateDoc(ref, {
    status: input.status,
    officialReply: input.officialReply || null,
    updatedAt: serverTimestamp(),
  });
}

export async function signPetition(petitionId: string, userName: string): Promise<void> {
  const callable = httpsCallable<
    { petitionId: string; userName?: string },
    { success: boolean }
  >(functions, 'signPetitionCallable');

  await callable({
    petitionId,
    userName: userName || 'Cidadao',
  });
}

export async function hasUserSigned(petitionId: string, userId: string): Promise<boolean> {
  const signatureId = `${petitionId}_${userId}`;
  const snap = await getDoc(doc(db, SIGNATURES_COL, signatureId));
  return snap.exists();
}
