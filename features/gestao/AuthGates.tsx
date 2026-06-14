'use client';

import { AlertCircle, Copy } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

// ─── LoginGate ────────────────────────────────────────────────────────────────

interface LoginGateProps {
  authError: string | null;
  loginError: string | null;
  onLogin: () => void;
}

export function LoginGate({ authError, loginError, onLogin }: LoginGateProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="h-12 w-12 text-primary" />
      <h1 className="mt-4 text-3xl font-semibold tracking-normal text-text-main">Painel de Gestão</h1>
      <p className="mt-3 text-base font-medium leading-7 text-text-muted">
        Entre com uma conta autorizada para acessar solicitações, relatos e cadastros administrativos.
      </p>
      <button type="button" onClick={onLogin} className="action-button-primary mt-6">
        Entrar
      </button>
      {(loginError || authError) && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
          {loginError || authError}
        </p>
      )}
    </div>
  );
}

// ─── RestrictedGate ───────────────────────────────────────────────────────────

export function RestrictedGate() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="mt-5 text-3xl font-semibold tracking-normal text-text-main">Acesso restrito</h1>
      <p className="mt-3 text-base font-medium leading-7 text-text-muted">
        Sua conta não tem permissão para acessar o painel administrativo.
      </p>
    </div>
  );
}

// ─── CopyProtocolButton ───────────────────────────────────────────────────────

export function CopyProtocolButton({ protocol }: { protocol: string }) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(protocol);
      toast('Protocolo copiado.', 'success');
    } catch {
      toast('Não foi possível copiar o protocolo.', 'error');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted transition hover:border-primary hover:text-primary"
      title="Copiar protocolo"
    >
      <Copy className="h-3.5 w-3.5" />
      Copiar
    </button>
  );
}
