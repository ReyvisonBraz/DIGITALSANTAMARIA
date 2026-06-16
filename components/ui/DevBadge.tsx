'use client';

import { Construction, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeatureStatus } from '@/lib/constants/feature-status';

interface DevBadgeProps {
  status: FeatureStatus;
  className?: string;
}

export default function DevBadge({ status, className }: DevBadgeProps) {
  if (status === 'complete') return null;

  const isDevelopment = status === 'in_development';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.12em]',
        isDevelopment
          ? 'bg-amber-100 text-amber-700 border border-amber-300'
          : 'bg-slate-100 text-slate-500 border border-slate-300',
        className,
      )}
      title={isDevelopment ? 'Funcionalidade em desenvolvimento — algumas partes podem estar incompletas' : 'Funcionalidade planejada para fase futura'}
    >
      {isDevelopment ? <Wrench className="h-2.5 w-2.5" /> : <Construction className="h-2.5 w-2.5" />}
      {isDevelopment ? 'Em desenvolvimento' : 'Planejado'}
    </span>
  );
}
