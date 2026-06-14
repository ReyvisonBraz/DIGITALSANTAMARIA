'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronRight,
  ImagePlus,
  Loader2,
  Megaphone,
  Send,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { createPetition } from '@/services/petitions.service';
import { createLogger } from '@/lib/logger';

const log = createLogger('CreatePetitionModal');

interface CreatePetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const categories = ['Infraestrutura', 'Segurança', 'Cultura', 'Saúde', 'Meio Ambiente'];
const MAX_TITLE = 120;
const MAX_DESC = 5000;
const MAX_COVER_SIZE = 5 * 1024 * 1024;
const ACCEPTED_COVER = ['image/jpeg', 'image/png', 'image/webp'];

export default function CreatePetitionModal({ isOpen, onClose, onCreated }: CreatePetitionModalProps) {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Infraestrutura',
    goal: '500',
    description: '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const resetAndClose = () => {
    setShowSuccess(false);
    setStep(1);
    setFormData({
      title: '',
      category: 'Infraestrutura',
      goal: '500',
      description: '',
    });
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
    onClose();
  };

  const handleCoverChange = (file: File | null) => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    if (!file) {
      setCoverFile(null);
      setCoverPreview(null);
      return;
    }
    if (file.size > MAX_COVER_SIZE) {
      toast('Imagem de capa deve ter no máximo 5MB.', 'error');
      return;
    }
    if (!ACCEPTED_COVER.includes(file.type)) {
      toast('Formato não suportado. Use JPEG, PNG ou WebP.', 'error');
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      try {
        await login();
      } catch (error) {
        log.error('Login failed before petition creation', {}, error);
        toast(error instanceof Error ? error.message : 'Não foi possível iniciar o login.', 'error');
      }
      return;
    }

    const title = formData.title.trim();
    const description = formData.description.trim();
    const goal = parseInt(formData.goal, 10);

    if (!title || !description) {
      toast('Preencha título e descrição.', 'error');
      return;
    }
    if (title.length > MAX_TITLE) {
      toast(`Título deve ter no máximo ${MAX_TITLE} caracteres.`, 'error');
      return;
    }
    if (description.length > MAX_DESC) {
      toast(`Descrição deve ter no máximo ${MAX_DESC} caracteres.`, 'error');
      return;
    }
    if (!Number.isFinite(goal) || goal < 1) {
      toast('Informe uma meta válida (mínimo 1 assinatura).', 'error');
      return;
    }

    setLoading(true);
    try {
      await createPetition({
        title,
        category: formData.category,
        goal,
        description,
        creatorId: user.uid,
        creatorName: user.displayName || user.email || 'Cidadão',
        coverFile,
      });
      log.info('Petition created', { title });
      onCreated?.();
      setShowSuccess(true);
    } catch (err) {
      log.error('Failed to create petition', {}, err);
      toast('Erro ao criar petição.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <label className="block space-y-2">
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">Titulo da causa</span>
              <input
                className="w-full rounded-xl border border-border bg-surface p-4 font-bold shadow-inner outline-none transition focus:border-primary"
                placeholder="Ex: Reforma da Praca Central"
                value={formData.title}
                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                required
              />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-2">
                <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">Categoria</span>
                <select
                  className="h-12 w-full rounded-xl border border-border bg-surface px-3 font-bold shadow-inner outline-none transition focus:border-primary"
                  value={formData.category}
                  onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">Meta desejada</span>
                <span className="relative block">
                  <input
                    type="number"
                    min="1"
                    className="h-12 w-full rounded-xl border border-border bg-surface p-4 pl-12 font-bold shadow-inner outline-none transition focus:border-primary"
                    placeholder="500"
                    value={formData.goal}
                    onChange={(event) => setFormData({ ...formData, goal: event.target.value })}
                  />
                  <Target className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted opacity-50" />
                </span>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">Imagem de capa (opcional)</span>
              <input
                ref={coverInputRef}
                type="file"
                accept={ACCEPTED_COVER.join(',')}
                className="hidden"
                onChange={(event) => handleCoverChange(event.target.files?.[0] || null)}
              />
              {coverPreview ? (
                <div className="group relative h-36 overflow-hidden rounded-xl border-2 border-border">
                  <img src={coverPreview} alt="Preview da capa" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleCoverChange(null)}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-white transition-all hover:border-primary/50"
                >
                  <ImagePlus className="h-5 w-5 text-text-muted" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Adicionar capa</span>
                </button>
              )}
            </label>

            <button
              type="button"
              onClick={nextStep}
              disabled={!formData.title.trim()}
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-50"
            >
              Proxima etapa
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <label className="block space-y-2">
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted">Descrição da proposta</span>
              <textarea
                rows={7}
                className="w-full resize-none rounded-xl border border-border bg-surface p-4 font-medium leading-6 shadow-inner outline-none transition focus:border-primary"
                placeholder="Descreva sua proposta e como ela ajudara a comunidade."
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                required
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex min-h-12 w-16 items-center justify-center rounded-xl border border-border bg-surface text-text-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.description.trim()}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-50"
              >
                Revisar
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Resumo</p>
              <h3 className="mt-2 text-lg font-semibold text-text-main">{formData.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-text-muted">{formData.description}</p>
              <p className="mt-3 text-xs font-bold text-text-muted">
                Categoria: {formData.category} | Meta: {parseInt(formData.goal, 10) || 500} assinaturas
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm font-medium leading-6 text-primary/80">
                Ao publicar, você assume responsabilidade pela veracidade das informações.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex min-h-12 w-16 items-center justify-center rounded-xl border border-border bg-surface text-text-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {loading ? 'Publicando...' : 'Publicar causa'}
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal isOpen={isOpen && !showSuccess} onClose={onClose} title="Propor nova causa">
        <div className="space-y-6 p-2">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Megaphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold uppercase leading-none tracking-normal text-text-main">
                  Manifesto cidadão
                </h3>
                <p className="mt-1 text-xs font-medium text-text-muted">Mobilize sua comunidade.</p>
              </div>
            </div>

            <div className="flex gap-1">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500',
                    item === step ? 'w-8 bg-primary' : item < step ? 'w-4 bg-green-500' : 'w-4 bg-border'
                  )}
                />
              ))}
            </div>
          </div>

          {renderStep()}
        </div>
      </Modal>

      <Modal isOpen={showSuccess} onClose={resetAndClose} title="Peticao publicada">
        <div className="space-y-6 p-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold uppercase tracking-normal text-text-main">Proposta recebida</h3>
            <p className="text-sm font-medium leading-6 text-text-muted">
              Sua petição foi publicada e já pode receber assinaturas.
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white"
          >
            Voltar para peticoes
          </button>
        </div>
      </Modal>
    </>
  );
}
