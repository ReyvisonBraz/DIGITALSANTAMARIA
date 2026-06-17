/**
 * @module InstallPrompt
 * @description Componente PWA que exibe prompt de instalação do app na tela inicial.
 *
 * Funciona interceptando o evento `beforeinstallprompt` do browser,
 * que é disparado quando o app atende os critérios de instalação PWA.
 * O prompt aparece como um card flutuante no canto inferior direito.
 *
 * Nota: Este componente deve estar dentro dos providers (ToastProvider, etc.)
 * para ter acesso ao contexto da aplicação.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';

// ─── Tipos ──────────────────────────────────────────────────────────

/**
 * Interface para o evento `beforeinstallprompt` do browser.
 * Não é um tipo padrão do TypeScript, precisa ser declarado manualmente.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
 */
interface BeforeInstallPromptEvent extends Event {
  /** Exibe o prompt de instalação ao usuário */
  prompt(): Promise<void>;
  /** Resultado da escolha do usuário */
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// ─── Componente ─────────────────────────────────────────────────────

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      })
      .catch(() => {
        // Development-only cleanup should never affect app usage.
      });
  }, []);

  /** Intercepta o evento beforeinstallprompt para exibir UI customizada */
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  /** Dispara o prompt nativo de instalação do browser */
  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === 'accepted') {
      setShow(false);
    }

    // O prompt só pode ser usado uma vez
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  /** Dispensa o prompt sem instalar */
  const handleDismiss = useCallback(() => {
    setDismissed(true);
    setShow(false);
  }, []);

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-24 right-3 z-50 max-w-[calc(100vw-1.5rem)] animate-in slide-in-from-bottom-4 fade-in duration-300 md:bottom-6 md:right-24">
      <div className="w-[21rem] max-w-full rounded-2xl border-2 border-border bg-white p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          {/* Ícone */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Download className="h-5 w-5 text-primary" />
          </div>

          {/* Conteúdo */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text-main">
              Instale o App
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              Instale o Conecta Santa Maria na tela inicial do seu dispositivo para acesso mais rápido.
            </p>

            {/* Ações */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <button
                onClick={handleInstall}
                className="min-h-9 w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary-dark"
                aria-label="Instalar aplicativo"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="min-h-9 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold text-text-muted transition-colors hover:bg-surface hover:text-text-main"
                aria-label="Dispensar prompt de instalação"
              >
                Agora não
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
