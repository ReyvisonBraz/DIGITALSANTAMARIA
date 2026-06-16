'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, CircleHelp, Lightbulb, X } from 'lucide-react';
import { getOnboardingGuide, ONBOARDING_VERSION } from '@/lib/constants/onboarding';
import { cn } from '@/lib/utils';

const STORAGE_PREFIX = 'conecta:onboarding';

type OpenReason = 'auto' | 'manual';

export default function GuidedHelp() {
  const pathname = usePathname();
  const guide = useMemo(() => getOnboardingGuide(pathname), [pathname]);
  const [isOpen, setIsOpen] = useState(false);
  const [openReason, setOpenReason] = useState<OpenReason>('manual');
  const [currentStep, setCurrentStep] = useState(0);

  const storageKey = `${STORAGE_PREFIX}:${ONBOARDING_VERSION}:${guide.id}`;
  const isLastStep = currentStep === guide.steps.length - 1;

  useEffect(() => {
    setCurrentStep(0);
    setIsOpen(false);

    const timer = window.setTimeout(() => {
      if (window.localStorage.getItem(storageKey)) return;
      setOpenReason('auto');
      setIsOpen(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const markSeen = useCallback((status: 'completed' | 'later') => {
    window.localStorage.setItem(storageKey, JSON.stringify({
      status,
      guideId: guide.id,
      version: ONBOARDING_VERSION,
      at: new Date().toISOString(),
    }));
  }, [guide.id, storageKey]);

  const openHelp = useCallback(() => {
    setCurrentStep(0);
    setOpenReason('manual');
    setIsOpen(true);
  }, []);

  const closeForLater = useCallback(() => {
    if (openReason === 'auto') {
      markSeen('later');
    }
    setIsOpen(false);
  }, [markSeen, openReason]);

  const finish = useCallback(() => {
    markSeen('completed');
    setIsOpen(false);
  }, [markSeen]);

  const nextStep = useCallback(() => {
    if (isLastStep) {
      finish();
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, guide.steps.length - 1));
  }, [finish, guide.steps.length, isLastStep]);

  const previousStep = useCallback(() => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  }, []);

  const step = guide.steps[currentStep];

  return (
    <>
      <button
        type="button"
        onClick={openHelp}
        className="fixed bottom-28 right-4 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/70 bg-accent text-primary-dark shadow-[0_18px_36px_rgba(20,34,74,0.22)] transition hover:-translate-y-0.5 hover:bg-accent-dark hover:text-white focus:outline-none focus:ring-4 focus:ring-accent/30 md:bottom-6 md:right-6"
        aria-label={`Abrir ajuda: ${guide.title}`}
        title="Ajuda desta tela"
      >
        <CircleHelp className="h-7 w-7" strokeWidth={2.6} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-text-main/55 backdrop-blur-sm"
              aria-hidden="true"
            />

            <div className="fixed inset-0 z-[121] flex items-end justify-center p-3 sm:items-center sm:p-6">
              <motion.section
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-white shadow-[0_32px_90px_rgba(20,34,74,0.28)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="guided-help-title"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary px-5 pb-5 pt-5 text-white sm:px-7 sm:pt-6">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/30 blur-3xl" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
                        <CircleHelp className="h-3.5 w-3.5" />
                        {guide.eyebrow}
                      </span>
                      <h2 id="guided-help-title" className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {guide.title}
                      </h2>
                      <p className="mt-2 text-sm font-medium leading-6 text-white/86">
                        {guide.summary}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={closeForLater}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                      aria-label="Fechar ajuda"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  {guide.primaryAction && (
                    <div className="mb-5 flex gap-3 rounded-2xl border border-accent/40 bg-accent/14 p-4 text-primary-dark">
                      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" />
                      <p className="text-sm font-semibold leading-6">{guide.primaryAction}</p>
                    </div>
                  )}

                  <div className="mb-5 flex items-center gap-2" aria-label={`Passo ${currentStep + 1} de ${guide.steps.length}`}>
                    {guide.steps.map((item, index) => (
                      <button
                        type="button"
                        key={item.title}
                        onClick={() => setCurrentStep(index)}
                        className={cn(
                          'h-2.5 flex-1 rounded-full transition',
                          index <= currentStep ? 'bg-primary' : 'bg-border'
                        )}
                        aria-label={`Ir para passo ${index + 1}: ${item.title}`}
                      />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${guide.id}-${currentStep}`}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ duration: 0.18 }}
                      className="min-h-44 rounded-2xl border border-border bg-surface-container p-5"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Passo {currentStep + 1} de {guide.steps.length}
                      </p>
                      <h3 className="mt-3 text-2xl font-bold tracking-tight text-text-main">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm font-medium leading-7 text-text-muted">
                        {step.body}
                      </p>
                      {step.tip && (
                        <p className="mt-4 rounded-xl border border-primary/15 bg-white p-3 text-xs font-semibold leading-5 text-primary-dark">
                          {step.tip}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-5 grid grid-cols-[auto_1fr] gap-3 sm:flex sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={previousStep}
                      disabled={currentStep === 0}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text-muted transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Voltar passo"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    <div className="flex min-w-0 items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={closeForLater}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl px-3 text-xs font-bold uppercase tracking-[0.14em] text-text-muted transition hover:bg-surface hover:text-text-main"
                      >
                        Ver depois
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-[0_14px_28px_rgba(26,86,196,0.24)] transition hover:bg-primary-dark"
                      >
                        {isLastStep ? 'Entendi' : 'Próximo'}
                        {isLastStep ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
