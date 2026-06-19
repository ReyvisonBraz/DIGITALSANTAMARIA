'use client';

import { useState } from 'react';
import { Check, Contrast, ListChecks, Minus, Moon, Plus, RotateCcw, Sun, Type, X } from 'lucide-react';
import { useAccessibility } from '@/lib/accessibility-context';
import { cn } from '@/lib/utils';
import type { AccessibilityColorMode } from '@/types';

const MODES: Array<{
  value: AccessibilityColorMode;
  label: string;
  description: string;
  icon: typeof Sun;
}> = [
  {
    value: 'default',
    label: 'Padrao',
    description: 'Visual claro usado na maior parte do portal.',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Noturno',
    description: 'Reduz brilho e deixa a leitura mais confortavel.',
    icon: Moon,
  },
  {
    value: 'high-contrast',
    label: 'Alto contraste',
    description: 'Prioriza leitura com contraste forte.',
    icon: Contrast,
  },
];

export default function AccessibilitySetup() {
  const {
    isReady,
    isSetupOpen,
    colorMode,
    contentMode,
    fontSize,
    setColorMode,
    setContentMode,
    increaseFontSize,
    decreaseFontSize,
    resetAccessibility,
    completeAccessibilitySetup,
    closeAccessibilitySetup,
  } = useAccessibility();
  const [step, setStep] = useState<1 | 2>(1);

  if (!isReady || !isSetupOpen) return null;

  const finish = () => {
    completeAccessibilitySetup();
    setStep(1);
  };

  const useDefault = () => {
    resetAccessibility();
    completeAccessibilitySetup();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-text-main/45 px-4 py-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="accessibility-setup-title">
      <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-[0_32px_90px_rgba(20,34,74,0.24)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-surface/95 p-5 backdrop-blur-xl md:p-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">Ajuste inicial</p>
            <h2 id="accessibility-setup-title" className="mt-2 text-2xl md:text-3xl">
              Deixe o portal confortavel para voce
            </h2>
          </div>
          <button
            type="button"
            onClick={closeAccessibilitySetup}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container text-text-muted transition hover:border-primary hover:text-primary"
            aria-label="Fechar ajuste de acessibilidade"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="border-b border-border p-5 md:p-6 lg:border-b-0 lg:border-r">
            <div className="mb-5 flex items-center gap-2">
              <StepPill active={step === 1} label="1" />
              <div className="h-px flex-1 bg-border" />
              <StepPill active={step === 2} label="2" />
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl">Escolha o visual</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    Selecione o modo que facilita sua leitura neste dispositivo.
                  </p>
                </div>

                <div className="grid gap-3">
                  {MODES.map((mode) => (
                    <ModeButton
                      key={mode.value}
                      active={colorMode === mode.value}
                      mode={mode}
                      onClick={() => setColorMode(mode.value)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl">Ajuste sua leitura</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    Escolha entre mais contexto ou uma tela mais direta, com menos texto.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setContentMode('complete')}
                    className={cn(
                      'rounded-xl border p-4 text-left transition',
                      contentMode === 'complete' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-main hover:border-primary/50'
                    )}
                    aria-pressed={contentMode === 'complete'}
                  >
                    <Type className="mb-3 h-5 w-5" />
                    <span className="block text-sm font-bold">Completo</span>
                    <span className="mt-1 block text-xs leading-relaxed text-text-muted">Mais explicações e contexto.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentMode('essential')}
                    className={cn(
                      'rounded-xl border p-4 text-left transition',
                      contentMode === 'essential' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-main hover:border-primary/50'
                    )}
                    aria-pressed={contentMode === 'essential'}
                  >
                    <ListChecks className="mb-3 h-5 w-5" />
                    <span className="block text-sm font-bold">Essencial</span>
                    <span className="mt-1 block text-xs leading-relaxed text-text-muted">Palavras-chave e ações diretas.</span>
                  </button>
                </div>

                <SetupControl
                  icon={Type}
                  label="Texto"
                  value={`${Math.round((fontSize / 16) * 100)}%`}
                  onDecrease={decreaseFontSize}
                  onIncrease={increaseFontSize}
                />
              </div>
            )}
          </section>

          <section className="bg-surface-container p-5 md:p-6">
            <PreviewCard />
          </section>
        </div>

        <div className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-border bg-surface/95 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between md:p-6">
          <button
            type="button"
            onClick={useDefault}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 text-xs font-bold uppercase tracking-[0.16em] text-text-muted transition hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Usar padrao
          </button>

          <div className="flex flex-col gap-3 sm:flex-row">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-xs font-bold uppercase tracking-[0.16em] text-text-muted transition hover:border-primary hover:text-primary"
              >
                Voltar
              </button>
            )}
            {step === 1 ? (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(26,86,196,0.22)] transition hover:bg-primary-dark"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_14px_28px_rgba(26,86,196,0.22)] transition hover:bg-primary-dark"
              >
                <Check className="h-4 w-4" />
                Confirmar ajuste
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPill({ active, label }: { active: boolean; label: string }) {
  return (
    <span className={cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold',
      active ? 'border-primary bg-primary text-white' : 'border-border bg-surface text-text-muted'
    )}>
      {label}
    </span>
  );
}

function ModeButton({
  active,
  mode,
  onClick,
}: {
  active: boolean;
  mode: (typeof MODES)[number];
  onClick: () => void;
}) {
  const Icon = mode.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-20 w-full items-start gap-3 rounded-xl border p-3 text-left transition',
        active ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-border bg-surface text-text-main hover:border-primary/50'
      )}
      aria-pressed={active}
    >
      <span className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
        active ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
      )}>
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-sm font-bold">{mode.label}</span>
        <span className="mt-1 block text-xs leading-relaxed text-text-muted">{mode.description}</span>
      </span>
    </button>
  );
}

function SetupControl({
  icon: Icon,
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  icon: typeof Type;
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-text-main">
          <Icon className="h-4 w-4 text-primary" />
          {label}
        </span>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{value}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onDecrease}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface-container text-text-main transition hover:border-primary hover:text-primary"
          aria-label={`Diminuir ${label.toLowerCase()}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onIncrease}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface-container text-text-main transition hover:border-primary hover:text-primary"
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-4 shadow-soft">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Previa
          </span>
          <h3 className="mt-3 text-2xl">Solicitar servico</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            Confira se voce consegue ler, tocar e preencher tudo com facilidade.
          </p>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-text-main">
          <Check className="h-4 w-4" />
        </span>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Titulo</span>
          <span className="block rounded-xl border border-border bg-surface-container px-3 py-3 text-sm text-text-main">
            Iluminacao na minha rua
          </span>
        </label>

        <div className="rounded-xl border border-border bg-surface-container p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-text-main">Status do protocolo</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              Em analise
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            A equipe acompanha o pedido e responde pelo painel.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="min-h-11 rounded-xl bg-primary px-3 text-xs font-bold uppercase tracking-[0.14em] text-white">
            Enviar
          </button>
          <button type="button" className="min-h-11 rounded-xl border border-border bg-surface px-3 text-xs font-bold uppercase tracking-[0.14em] text-text-main">
            Ver detalhe
          </button>
        </div>
      </div>
    </div>
  );
}
