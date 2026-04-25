# 09 — Módulo Empregos: Vagas Reais + Candidatura Persistida

---

## Arquivo: `services/jobs.service.ts` (NOVO)

```typescript
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type { Job, JobApplication, CreateApplicationInput } from '@/types/job.types';

/**
 * Busca vagas ativas, ordenadas por destaque e data.
 */
export async function getActiveJobs(limitCount = 30): Promise<Job[]> {
  const q = query(
    collection(db, 'jobs'),
    where('isActive', '==', true),
    orderBy('isFeatured', 'desc'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Job));
}

/**
 * Busca as candidaturas de um usuário.
 */
export async function getApplicationsByUser(userId: string): Promise<JobApplication[]> {
  const q = query(
    collection(db, 'job_applications'),
    where('applicantId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as JobApplication));
}

/**
 * Verifica se o usuário já se candidatou a uma vaga.
 */
export async function hasUserApplied(jobId: string, userId: string): Promise<boolean> {
  const q = query(
    collection(db, 'job_applications'),
    where('jobId', '==', jobId),
    where('applicantId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

/**
 * Cria candidatura e incrementa contador de candidaturas na vaga.
 */
export async function applyForJob(
  input: CreateApplicationInput,
  userId: string,
  userName: string,
  userEmail: string
): Promise<string> {
  // Verifica duplicata antes de criar
  const alreadyApplied = await hasUserApplied(input.jobId, userId);
  if (alreadyApplied) {
    throw new Error('Você já se candidatou a esta vaga.');
  }

  // Cria candidatura
  const docRef = await addDoc(collection(db, 'job_applications'), {
    jobId: input.jobId,
    jobTitle: input.jobTitle,
    applicantId: userId,
    applicantName: userName,
    applicantEmail: userEmail,
    coverLetter: input.coverLetter ?? null,
    status: 'applied',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } satisfies Omit<JobApplication, 'id'>);

  // Incrementa contador na vaga (best-effort)
  try {
    await updateDoc(doc(db, 'jobs', input.jobId), {
      applicationCount: increment(1),
    });
  } catch {
    // Falha silenciosa no contador — candidatura foi criada
  }

  return docRef.id;
}
```

---

## Arquivo: `features/empregos/ApplicationModal.tsx` (NOVO)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Briefcase, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/lib/contexts/auth-context';
import { applyForJob, hasUserApplied } from '@/services/jobs.service';
import { useToast } from '@/lib/contexts/toast-context';
import type { Job } from '@/types/job.types';

interface ApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal de candidatura a vaga com persistência no Firestore.
 * Inclui carta de apresentação opcional e verificação de duplicata.
 */
export function ApplicationModal({ job, isOpen, onClose }: ApplicationModalProps) {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verifica candidatura existente ao abrir o modal
  useEffect(() => {
    if (!isOpen || !user) return;

    hasUserApplied(job.id, user.uid)
      .then(setAlreadyApplied)
      .catch(() => {/* silencioso */});
  }, [isOpen, job.id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { login(); return; }

    setLoading(true);
    try {
      await applyForJob(
        {
          jobId: job.id,
          jobTitle: job.title,
          coverLetter: coverLetter || undefined,
        },
        user.uid,
        user.displayName ?? 'Candidato',
        user.email ?? ''
      );
      setSuccess(true);
      toast(`Candidatura para "${job.title}" enviada!`, 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar candidatura';
      toast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCoverLetter('');
    setSuccess(false);
    setAlreadyApplied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-outline/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-text-main text-sm">{job.title}</h3>
                <p className="text-xs text-text-muted font-ui">{job.employerName}</p>
              </div>
            </div>
            <button onClick={handleClose} className="text-text-muted hover:text-text-main">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-5">
            {success || alreadyApplied ? (
              /* Estado de sucesso */
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <p className="font-display font-bold text-text-main">
                  {alreadyApplied && !success ? 'Candidatura Enviada' : 'Candidatura Registrada!'}
                </p>
                <p className="text-sm text-text-muted font-ui">
                  {alreadyApplied && !success
                    ? 'Você já se candidatou a esta vaga anteriormente.'
                    : 'Seu perfil DigitalID foi anexado automaticamente. Aguarde o contato.'}
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-ui font-bold"
                >
                  Fechar
                </button>
              </div>
            ) : (
              /* Formulário de candidatura */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-surface-low rounded-xl border border-outline/20">
                  <p className="text-xs text-text-muted font-ui">
                    Seu perfil DigitalID (nome, e-mail) será enviado automaticamente ao empregador.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-ui font-semibold text-text-main mb-2">
                    Carta de Apresentação
                    <span className="text-text-muted font-normal ml-1">(opcional)</span>
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Por que você é o candidato ideal para esta vaga?"
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-surface-low border-2 border-outline/30 rounded-xl text-sm font-ui text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  <p className="text-xs text-text-muted font-ui mt-1 text-right">
                    {coverLetter.length}/500
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-xl font-ui font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Candidatura DigitalID'
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## Atualização: `app/empregos/page.tsx`

```typescript
// Substituir:
// const jobs = [ ... hardcoded array ... ];
// const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

// Por:
import { useState, useEffect } from 'react';
import { getActiveJobs } from '@/services/jobs.service';
import { ApplicationModal } from '@/features/empregos/ApplicationModal';
import type { Job } from '@/types/job.types';

const [jobs, setJobs] = useState<Job[]>([]);
const [loadingJobs, setLoadingJobs] = useState(true);
const [applicationTarget, setApplicationTarget] = useState<Job | null>(null);

useEffect(() => {
  getActiveJobs().then(setJobs).finally(() => setLoadingJobs(false));
}, []);

// Substituir handleApply:
const handleApplyClick = (job: Job) => {
  setApplicationTarget(job);
};

// Adicionar no JSX:
<ApplicationModal
  job={applicationTarget!}
  isOpen={applicationTarget !== null}
  onClose={() => setApplicationTarget(null)}
/>
```
