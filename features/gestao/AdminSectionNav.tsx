'use client';

import { BarChart3, FileText, Megaphone, ScrollText, ShieldCheck, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AdminMainSection = 'overview' | 'demands' | 'reports' | 'content' | 'petitions' | 'users' | 'audit';

interface AdminSectionNavProps {
  activeSection: AdminMainSection;
  demandCount: number;
  reportCount: number;
  reportPendingCount: number;
  canManageAdminCatalog: boolean;
  onChange: (section: AdminMainSection) => void;
}

export default function AdminSectionNav({
  activeSection,
  demandCount,
  reportCount,
  reportPendingCount,
  canManageAdminCatalog,
  onChange,
}: AdminSectionNavProps) {
  const items = [
    { value: 'overview' as const, label: 'Visao geral', icon: BarChart3, count: null, restricted: false },
    { value: 'demands' as const, label: 'Solicitacoes', icon: FileText, count: demandCount, restricted: false },
    {
      value: 'reports' as const,
      label: 'Relatos',
      icon: Megaphone,
      count: reportPendingCount > 0 ? `${reportCount} / ${reportPendingCount} novos` : reportCount,
      restricted: false,
    },
    {
      value: 'content' as const,
      label: canManageAdminCatalog ? 'Conteudo' : 'Atendimentos',
      icon: ShieldCheck,
      count: null,
      restricted: false,
    },
    { value: 'petitions' as const, label: 'Peticoes', icon: FileText, count: null, restricted: true },
    { value: 'users' as const, label: 'Usuarios', icon: Users, count: null, restricted: true },
    { value: 'audit' as const, label: 'Auditoria', icon: ScrollText, count: null, restricted: true },
  ].filter((item) => !item.restricted || canManageAdminCatalog);

  return (
    <nav className="glass-panel p-2" aria-label="Secoes do painel administrativo">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                'flex min-h-16 items-center gap-3 rounded-xl border px-3 py-3 text-left transition',
                active
                  ? 'admin-choice-active'
                  : 'admin-choice-idle',
              )}
            >
              <span
                className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center rounded-lg',
                  active ? 'bg-white/20' : 'bg-primary/10 text-primary',
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-black uppercase tracking-widest">{item.label}</span>
                {item.count !== null && (
                  <span className={cn('mt-1 block text-xs font-bold', active ? 'admin-choice-active-muted' : 'text-text-muted')}>
                    {item.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
