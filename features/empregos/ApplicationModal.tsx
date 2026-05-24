'use client';

import { useState } from 'react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
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
      await login();
      return;
    }
    setLoading(true);
    try {
      const alreadyApplied = await hasUserApplied(jobId, user.uid);
      if (alreadyApplied) {
        toast('Você já se candidatou a esta vaga!', 'error');
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
      toast('Candidatura enviada com sucesso!', 'success');
    } catch (err) {
      toast('Erro ao se candidatar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidatar-se">
      <div className="space-y-6 p-2">
        {success ? (
          <div className="flex flex-col items-center text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-text-main uppercase">Candidatura Enviada!</h3>
            <p className="text-sm text-text-muted font-ui">A empresa analisará seu perfil e entrará em contato.</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">
                Carta de Apresentação (Opcional)
              </label>
              <textarea
                rows={6}
                placeholder="Conte-nos um pouco sobre você e por que se interessa pela vaga..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full bg-surface border-2 border-border p-4 rounded-xl font-bold focus:border-primary outline-none transition-all shadow-inner resize-none font-ui placeholder:opacity-30"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full btn-tactile bg-primary text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? 'Enviando...' : 'Enviar Candidatura'}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
