'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/lib/auth-context';
import { applyForJob } from '@/services/jobs.service';
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
  const pendingSubmit = useRef(false);

  const submitApplication = async () => {
    setLoading(true);
    try {
      await applyForJob({
        jobId,
        jobTitle,
        applicantId: user!.uid,
        applicantName: user!.displayName || user!.email || 'Candidato',
        applicantEmail: user!.email || '',
        coverLetter: coverLetter.trim() || undefined,
      });
      setSuccess(true);
      toast('Candidatura enviada com sucesso.', 'success');
    } catch {
      toast('Erro ao se candidatar. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && pendingSubmit.current) {
      pendingSubmit.current = false;
      submitApplication();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async () => {
    if (!user) {
      pendingSubmit.current = true;
      try {
        await login();
      } catch (error) {
        pendingSubmit.current = false;
        toast(error instanceof Error ? error.message : 'Não foi possível iniciar o login.', 'error');
      }
      return;
    }

    submitApplication();
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
                maxLength={2000}
                placeholder="Conte um pouco sobre você e por que se interessa pela vaga..."
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                className="font-ui w-full resize-none rounded-xl border-2 border-border bg-surface p-4 font-bold shadow-inner outline-none transition-all placeholder:opacity-30 focus:border-primary"
              />
              <p className="text-right text-[10px] font-bold text-text-muted">{coverLetter.length}/2000</p>
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
