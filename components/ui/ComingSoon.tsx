'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { getFeatureStatus } from '@/lib/constants/feature-status';

interface ComingSoonProps {
  /** Rota suspensa (usada para buscar rótulo/descrição em feature-status). */
  route: string;
}

/**
 * Tela "Em breve" exibida quando o cidadão acessa diretamente uma rota
 * suspensa para a fase 2. Não é um erro — é uma feature ainda não publicada.
 */
export default function ComingSoon({ route }: ComingSoonProps) {
  const feature = getFeatureStatus(route);
  const label = feature?.label ?? 'Esta área';

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <Clock className="h-8 w-8" />
      </span>

      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-primary">
          <Sparkles className="h-3 w-3" />
          Em breve
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-main" style={{ fontFamily: 'var(--font-display)' }}>
          {label} chega na próxima fase
        </h1>
        <p className="mx-auto max-w-md text-sm font-medium leading-6 text-text-muted">
          Estamos lançando o Conecta Santa Maria por etapas, começando pelos
          canais essenciais de atendimento. Esta área será ativada em breve.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="action-button-primary group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Voltar ao início
        </Link>
        <Link href="/ouvidoria" className="action-button-secondary">
          Abrir solicitação
        </Link>
      </div>
    </div>
  );
}
