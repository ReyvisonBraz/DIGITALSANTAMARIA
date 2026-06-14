import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { jobConverter, jobApplicationConverter } from '@/lib/firebase/converters';
import { tryCreateNotification } from '@/services/notifications.service';
import type { ApplicationStatus, Job, JobApplication, CreateApplicationInput } from '@/types';
import { byCreatedAtDesc } from '@/lib/utils/sort';

const JOBS_COL = 'jobs';
const APPLICATIONS_COL = 'job_applications';

const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: 'recebida',
  viewed: 'visualizada',
  interview: 'selecionada para entrevista',
  hired: 'aprovada',
  rejected: 'rejeitada',
};

export async function getActiveJobs(): Promise<Job[]> {
  const ref = collection(db, JOBS_COL).withConverter(jobConverter);
  const q = query(ref, where('isActive', '==', true));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data())
    .sort(byCreatedAtDesc);
}

export async function applyForJob(
  input: CreateApplicationInput & {
    applicantId: string;
    applicantName: string;
    applicantEmail: string;
  }
): Promise<string> {
  const applicationId = `${input.jobId}_${input.applicantId}`;
  const ref = doc(db, APPLICATIONS_COL, applicationId);
  await setDoc(ref, {
    jobId: input.jobId,
    jobTitle: input.jobTitle,
    applicantId: input.applicantId,
    applicantName: input.applicantName,
    applicantEmail: input.applicantEmail,
    coverLetter: input.coverLetter || null,
    status: 'applied',
    createdAt: server(),
    updatedAt: server(),
  });
  return applicationId;
}

export async function hasUserApplied(jobId: string, userId: string): Promise<boolean> {
  const ref = collection(db, APPLICATIONS_COL);
  const q = query(ref, where('jobId', '==', jobId), where('applicantId', '==', userId));
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getUserApplications(userId: string): Promise<JobApplication[]> {
  const ref = collection(db, APPLICATIONS_COL).withConverter(jobApplicationConverter);
  const q = query(ref, where('applicantId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => d.data())
    .sort(byCreatedAtDesc);
}

export async function getAllApplications(): Promise<JobApplication[]> {
  const ref = collection(db, APPLICATIONS_COL).withConverter(jobApplicationConverter);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  const ref = doc(db, APPLICATIONS_COL, id);
  const snap = await getDoc(ref);
  const application = snap.exists() ? ({ id: snap.id, ...snap.data() } as JobApplication) : null;

  await updateDoc(ref, {
    status,
    updatedAt: server(),
  });

  if (application) {
    await tryCreateNotification({
      recipientId: application.applicantId,
      kind: 'application_update',
      tone: status === 'rejected' ? 'alert' : 'update',
      title: 'Candidatura atualizada',
      message: `Sua candidatura para ${application.jobTitle} foi ${APPLICATION_STATUS_LABEL[status]}.`,
      href: '/empregos',
      source: { type: 'application', id },
    });
  }
}

export async function getAllJobs(): Promise<Job[]> {
  const ref = collection(db, JOBS_COL).withConverter(jobConverter);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function createJob(
  input: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicationCount'>,
): Promise<string> {
  const docRef = await addDoc(collection(db, JOBS_COL), {
    ...input,
    applicationCount: 0,
    createdAt: server(),
    updatedAt: server(),
  });
  return docRef.id;
}

export async function updateJob(
  id: string,
  input: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'applicationCount'>,
): Promise<void> {
  await updateDoc(doc(db, JOBS_COL, id), {
    ...input,
    updatedAt: server(),
  });
}
