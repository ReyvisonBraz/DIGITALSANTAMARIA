/**
 * @module toast-context
 * @description Sistema de notificações toast (snackbar) do Digital Santa Maria.
 *
 * Fornece:
 * - Método `toast(message, type)` para exibir notificações temporárias
 * - Suporte a 3 tipos: success, error, info
 * - Auto-remoção após 4 segundos
 * - Remoção manual via botão X
 * - Animações de entrada/saída via framer-motion
 * - Posicionamento responsivo (bottom-center no mobile, bottom-right no desktop)
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 * toast('Salvo com sucesso!', 'success');
 * toast('Erro ao processar', 'error');
 * toast('Processando...', 'info');
 * ```
 */

'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

// ─── Tipos ──────────────────────────────────────────────────────────

/** Tipos visuais de toast */
type ToastType = 'success' | 'error' | 'info';

/** Estrutura interna de um toast */
interface Toast {
  /** Identificador único para animação e remoção */
  id: string;
  /** Mensagem exibida ao usuário */
  message: string;
  /** Tipo visual que determina cor e ícone */
  type: ToastType;
}

/** Interface pública do contexto de toast */
interface ToastContextType {
  /** Exibe um toast com mensagem e tipo opcional (padrão: 'info') */
  toast: (message: string, type?: ToastType) => void;
}

/** Duração em ms antes de auto-remover o toast */
const AUTO_DISMISS_MS = 4000;

/** Mapeamento de tipo para classes CSS de estilo */
const TYPE_STYLES: Record<ToastType, string> = {
  success: 'bg-green-50/95 border-green-200 text-green-800 backdrop-blur',
  error: 'bg-rose-50/95 border-rose-200 text-rose-800 backdrop-blur',
  info: 'bg-white/95 border-border text-text-main backdrop-blur',
};

/** Mapeamento de tipo para componente de ícone */
const TYPE_ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

/** Mapeamento de tipo para classe de cor do ícone */
const ICON_COLORS: Record<ToastType, string> = {
  success: 'text-green-600',
  error: 'text-rose-600',
  info: 'text-primary',
};

// ─── Context ────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  /** Adiciona um novo toast com auto-remoção */
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remoção após timeout
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, AUTO_DISMISS_MS);
  }, []);

  /** Remove um toast específico pelo ID */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Container de toasts — posicionamento responsivo */}
      <div
        className="fixed bottom-24 md:bottom-8 right-0 left-0 md:left-auto md:right-8 z-[200] flex flex-col items-center md:items-end gap-2 pointer-events-none px-4"
        aria-live="polite"
        aria-label="Notificações"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const IconComponent = TYPE_ICONS[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border-2 max-w-sm w-full md:w-auto ${TYPE_STYLES[toast.type]}`}
                role="status"
              >
                <IconComponent className={`w-5 h-5 ${ICON_COLORS[toast.type]} shrink-0`} />

                <p className="text-sm font-bold flex-1">{toast.message}</p>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="opacity-50 hover:opacity-100 transition-opacity p-1"
                  aria-label="Fechar notificação"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────

/**
 * Hook para exibir toasts na aplicação.
 * Deve ser usado dentro de um `ToastProvider`.
 *
 * @throws Error se usado fora do ToastProvider
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
