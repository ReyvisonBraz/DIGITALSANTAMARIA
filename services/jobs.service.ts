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
import { jobConverter, jobApplicationConverter } from '@/lib/firebase/converters';
import type { Job, JobApplication, CreateApplicationInput } from '@/types';

const JOBS_COL = 'jobs';
const APPLICATIONS_COL = 'job_applications';

export async function getActiveJobs(): Promise<Job[]> {
  const ref = collection(db, JOBS_COL).withConverter(jobConverter);
  const q = query(
    ref,
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function applyForJob(
  input: CreateApplicationInput & {
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
  }
): Promise<string> {
  const docRef = await addDoc(collection(db, APPLICATIONS_COL), {
    jobId: input.jobId,
    jobTitle: input.jobTitle,
    applicantId: input.applicantId,
    applicantName: input.applicantName,
    applicantEmail: input.applicantEmail,
    coverLetter: input.coverLetter || null,
    status: 'applied',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function hasUserApplied(jobId: string, userId: string): Promise<boolean> {
  const ref = collection(db, APPLICATIONS_COL);
  const q = query(ref, where('jobId', '==', jobId), where('applicantId', '==', userId));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getUserApplications(userId: string): Promise<JobApplication[]> {
  const ref = collection(db, APPLICATIONS_COL).withConverter(jobApplicationConverter);
  const q = query(ref, where('applicantId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}
