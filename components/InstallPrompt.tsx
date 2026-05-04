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
import { Download, X } from 'lucide-react';

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

  /** Intercepta o evento beforeinstallprompt para exibir UI customizada */
  useEffect(() => {
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
    <div className="fixed bottom-24 md:bottom-6 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-border p-4 w-80">
        <div className="flex items-start gap-3">
          {/* Ícone */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-main">
              Instale o App
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              Instale o Digital Santa Maria na tela inicial do seu dispositivo para acesso mais rápido.
            </p>

            {/* Ações */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="flex-1 px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                aria-label="Instalar aplicativo"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main transition-colors"
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
