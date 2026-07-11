'use client';

import React, { useState } from 'react';
import { Loader2, PenLine, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { createPetition } from '@/services/petitions.service';
import { cn } from '@/lib/utils';
import type { CreatePetitionInput } from '@/types';
import { useTranslations } from 'next-intl';

interface CreatePetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (petitionId: string) => void;
}

const CATEGORIES = [
  { value: 'infraestrutura', label: 'Infraestrutura' },
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'meio-ambiente', label: 'Meio Ambiente' },
  { value: 'transito', label: 'Trânsito' },
  { value: 'cultura', label: 'Cultura' },
  { value: 'social', label: 'Social' },
  { value: 'outros', label: 'Outros' },
];

const emptyForm: CreatePetitionInput & { coverImageURL?: string } = {
  title: '',
  description: '',
  category: 'infraestrutura',
  goal: 100,
  coverImageURL: '',
};

type FormState = typeof emptyForm;

export default function CreatePetitionModal({ isOpen, onClose, onCreated }: CreatePetitionModalProps) {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const t = useTranslations('peticoes.create');
  const [form, setForm] = useState<FormState>(emptyForm);
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setForm(emptyForm);
    setStep(1);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!user) {
      toast(t('loginPrompt'), 'error');
      return;
    }

    setSubmitting(true);
    try {
      const petitionId = await createPetition({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        goal: form.goal,
        coverImageURL: form.coverImageURL?.trim() || null,
        creatorId: user.uid,
        creatorName: user.displayName || user.email || 'Cidadão',
        creatorPhotoURL: user.photoURL || null,
      });
      toast(t('success'), 'success');
      reset();
      onCreated?.(petitionId);
    } catch {
      toast(t('error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedToStep2 = form.title.trim().length >= 5 && form.goal >= 10;
  const canSubmit = form.description.trim().length >= 20;

  if (!user && isOpen) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title={t('title')}>
        <div className="space-y-6 p-4">
          <p className="text-sm font-medium text-text-muted text-center py-8">
            {t('loginRequired')}
          </p>
          <button
            onClick={async () => { 
              try { await login(); } 
              catch (e) { toast(e instanceof Error ? e.message : t('loginError'), 'error'); } 
            }}
            className="w-full rounded-xl bg-tertiary px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:brightness-110"
          >
            {t('loginGoogle')}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('title')}>
      <div className="space-y-5 p-4">
        {step === 1 ? (
          <>
            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('titleLabel')}</span>
              <input
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder={t('titlePlaceholder')}
                maxLength={120}
                minLength={5}
                required
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none transition focus:border-primary"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('category')}</span>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                required
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none transition focus:border-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('goal')}</span>
              <input
                type="number"
                value={form.goal}
                min={10}
                max={100000}
                required
                onChange={(e) => updateField('goal', Math.max(10, parseInt(e.target.value) || 10))}
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none transition focus:border-primary"
              />
              <span className="text-[11px] font-medium text-text-muted block">
                {t('goalHelper')}
              </span>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('coverImage')}</span>
              <input
                type="url"
                value={form.coverImageURL}
                onChange={(e) => updateField('coverImageURL', e.target.value)}
                placeholder="https://..."
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium outline-none transition focus:border-primary"
              />
            </label>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedToStep2}
              className="w-full rounded-xl bg-tertiary px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('continue')}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('step2')}</span>
              <button onClick={() => setStep(1)} className="text-xs font-bold text-primary hover:underline">
                {t('back')}
              </button>
            </div>

            <label className="space-y-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-text-muted">{t('descriptionLabel')}</span>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={6}
                maxLength={2000}
                placeholder={t('descriptionPlaceholder')}
                className="w-full resize-none rounded-xl border border-border bg-white p-3 text-sm font-medium leading-6 outline-none transition focus:border-primary"
              />
            </label>
            <span className="text-[11px] font-bold text-text-muted block">
              {form.description.trim().length}/2000 {t('characters')}
            </span>

            <div className="rounded-xl border border-border bg-surface p-4 space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-text-muted">{t('summary')}</p>
              <p className="text-sm font-bold text-text-main">{form.title}</p>
              <p className="text-xs font-medium text-text-muted">
                {t('categoryPrefix')}{CATEGORIES.find((c) => c.value === form.category)?.label}
              </p>
              <p className="text-xs font-medium text-text-muted">{t('goalPrefix')}{form.goal} {t('signatures')}</p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-tertiary px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PenLine className="h-4 w-4" />
              )}
              {submitting ? t('creating') : t('publish')}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
