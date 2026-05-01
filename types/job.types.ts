import type { Timestamp } from 'firebase/firestore';

export type JobType = 'clt' | 'pj' | 'temporario' | 'estagio' | 'voluntario';

export type ApplicationStatus = 'applied' | 'viewed' | 'interview' | 'hired' | 'rejected';

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary: string | null;
  type: JobType;
  location: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  applicationCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateApplicationInput = {
  jobId: string;
  jobTitle: string;
  coverLetter?: string;
};
