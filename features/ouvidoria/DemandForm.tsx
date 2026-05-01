'use client';

import { useState } from 'react';
import { Send, ChevronRight, ArrowLeft, CheckCircle2, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { createDemand } from '@/services/demands.service';
import { useToast } from '@/lib/toast-context';
import { createLogger } from '@/lib/logger';
import type { DemandType, DemandCategory } from '@/types';

const log = createLogger('DemandForm');

interface DemandFormProps {
  onSuccess: () => void;
}

export default function DemandForm({ onSuccess }: DemandFormProps) {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Reclamação' as string,
    subject: '',
    message: '',
    isAnonymous: false,
    consent: false,
  });

  const typeMap: Record<string, DemandType> = {
    'Reclamação': 'reclamacao',
    'Sugestão': 'sugestao',
    'Denúncia': 'denuncia',
    'Elogio': 'elogio',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      if (step === 1 && (!formData.type || !formData.subject)) {
        toast('Complete os campos de identificação.', 'error');
        return;
      }
      if (step === 2 && !formData.message) {
        toast('O detalhamento é obrigatório.', 'error');
        return;
      }
      setStep(step + 1);
      return;
    }
    if (!formData.consent) {
      toast('Aceite os termos para protocolar.', 'error');
      return;
    }
    if (!user && !formData.isAnonymous) {
      await login();
      return;
    }
    setLoading(true);
    try {
      await createDemand({
        type: typeMap[formData.type] || 'reclamacao',
        category: 'outros' as DemandCategory,
        subject: formData.subject,
        text: formData.message,
        isAnonymous: formData.isAnonymous,
        consent: formData.consent,
        authorId: user?.uid || '',
      });
      log.info('Demand created', { type: formData.type, subject: formData.subject });
      onSuccess();
    } catch (err) {
      log.error('Failed to create demand', {}, err);
      toast('Erro ao enviar manifestação.', 'error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="min-h-[300px]">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Natureza do Chamado</label>
                <div className="relative">
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-surface border-2 border-border p-6 rounded-3xl font-black uppercase text-xs focus:border-primary outline-none transition-all shadow-inner appearance-none"
                  >
                    <option>Reclamação</option>
                    <option>Sugestão</option>
                    <option>Denúncia</option>
                    <option>Elogio</option>
                  </select>
                  <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary rotate-90 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Secretaria de Destino</label>
                <input
                  placeholder="Ex: Infraestrutura, Saúde, Educação..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-surface border-2 border-border p-6 rounded-3xl font-black uppercase text-xs focus:border-primary outline-none transition-all shadow-inner placeholder:opacity-30"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Memorial Descritivo</label>
              <textarea
                rows={8}
                placeholder="Descreva o incidente ou sugestão com precisão (local, data, envolvidos)..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-surface border-2 border-border p-8 rounded-[2.5rem] font-black text-xs focus:border-primary outline-none transition-all shadow-inner resize-none font-ui placeholder:opacity-30"
              />
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="flex flex-col gap-6 p-8 bg-surface rounded-[3rem] border-2 border-border border-dashed shadow-inner">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className={cn(
                  'w-7 h-7 rounded-lg border-2 border-border flex items-center justify-center transition-all',
                  formData.isAnonymous ? 'bg-primary border-primary text-white' : 'bg-white'
                )}>
                  {formData.isAnonymous && <CheckCircle2 size={16} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                />
                <span className="text-xs font-black text-text-main uppercase tracking-tight">Desejo que esta manifestação seja ANÔNIMA</span>
              </label>
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className={cn(
                  'w-7 h-7 mt-1 rounded-lg border-2 border-border flex items-center justify-center transition-all shrink-0',
                  formData.consent ? 'bg-primary border-primary text-white' : 'bg-white'
                )}>
                  {formData.consent && <CheckCircle2 size={16} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                />
                <span className="text-xs font-medium text-text-muted font-ui leading-relaxed">
                  Aceito os termos do Marco Civil e da LGPD para tratamento dos meus dados.
                </span>
              </label>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-6">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="w-1/3 bg-surface border-2 border-border text-text-muted py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:border-text-muted transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            'flex-1 bg-primary text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-3xl flex items-center justify-center gap-4 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50',
            step === 3 && 'bg-text-main'
          )}
        >
          {loading ? 'Enviando...' : step < 3 ? 'Próximo' : 'Protocolar'}
          {step < 3 ? <ChevronRight className="w-6 h-6" /> : <Send className="w-6 h-6" />}
        </button>
      </div>
    </form>
  );
}
