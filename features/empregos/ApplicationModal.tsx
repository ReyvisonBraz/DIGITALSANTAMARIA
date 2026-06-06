'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/lib/auth-context';
import { applyForJob, hasUserApplied } from '@/services/jobs.service';
import { useToast } from '@/lib/toast-context';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
}

export default function ApplicationModal({ isOpen, onClose, jobId, jobTitle }: ApplicationModalProps) {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      try {
        await login();
      } catch (error) {
        toast(error instanceof Error ? error.message : 'Nao foi possivel iniciar o login.', 'error');
      }
      return;
    }

    setLoading(true);
    try {
      const alreadyApplied = await hasUserApplied(jobId, user.uid);
      if (alreadyApplied) {
        toast('Voce ja se candidatou a esta vaga.', 'error');
        return;
      }
      await applyForJob({
        jobId,
        jobTitle,
        applicantId: user.uid,
        applicantName: user.displayName || 'Candidato',
        applicantEmail: user.email || '',
        coverLetter: coverLetter || undefined,
      });
      setSuccess(true);
      toast('Candidatura enviada com sucesso.', 'success');
    } catch {
      toast('Erro ao se candidatar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidatar-se">
      <div className="space-y-6 p-2">
        {success ? (
          <div className="flex flex-col items-center space-y-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black uppercase text-text-main">Candidatura enviada</h3>
            <p className="font-ui text-sm text-text-muted">A empresa analisara seu perfil e entrara em contato.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-text-muted">
                Carta de apresentacao (opcional)
              </label>
              <textarea
                rows={6}
                placeholder="Conte um pouco sobre voce e por que se interessa pela vaga..."
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                className="font-ui w-full resize-none rounded-xl border-2 border-border bg-surface p-4 font-bold shadow-inner outline-none transition-all placeholder:opacity-30 focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-tactile flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? 'Enviando...' : 'Enviar candidatura'}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
