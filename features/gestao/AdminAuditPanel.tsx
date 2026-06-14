'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, Clock3, Database, FilePenLine, Filter, Loader2, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { getAdminAuditLogs } from '@/services/admin-audit.service';
import { formatDate } from '@/lib/utils/formatters';
import type { AdminAuditAction, AdminAuditLog } from '@/types';

const ACTION_LABEL: Record<AdminAuditAction, string> = {
  content_status_changed: 'Status alterado',
  content_archived: 'Arquivado',
  content_created: 'Criado',
  content_updated: 'Atualizado',
  queue_status_changed: 'Fila atualizada',
  user_role_changed: 'Permissao alterada',
};

const ACTION_META: Record<AdminAuditAction, { icon: typeof ShieldCheck; className: string }> = {
  content_status_changed: { icon: ShieldCheck, className: 'border-blue-200 bg-blue-50 text-blue-800' },
  content_archived: { icon: Archive, className: 'border-rose-200 bg-rose-50 text-rose-800' },
  content_created: { icon: FilePenLine, className: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
  content_updated: { icon: FilePenLine, className: 'border-amber-200 bg-amber-50 text-amber-800' },
  queue_status_changed: { icon: Filter, className: 'border-purple-200 bg-purple-50 text-purple-800' },
  user_role_changed: { icon: ShieldCheck, className: 'border-slate-200 bg-slate-50 text-slate-800' },
};

function stringifyValue(value: unknown) {
  if (value === null || value === undefined || value === '') return 'vazio';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function buildSearchText(log: AdminAuditLog) {
  return [
    ACTION_LABEL[log.action],
    log.action,
    log.collectionName,
    log.documentId,
    log.actorName,
    log.actorId,
    stringifyValue(log.previousValue),
    stringifyValue(log.nextValue),
    log.note,
  ].join(' ').toLowerCase();
}

export default function AdminAuditPanel() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<AdminAuditAction | 'all'>('all');
  const [collectionFilter, setCollectionFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLogs(await getAdminAuditLogs(150));
    } catch {
      setError('Não foi possível carregar a auditoria administrativa.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const collections = useMemo(() => {
    return Array.from(new Set(logs.map((log) => log.collectionName))).sort();
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesSearch = !search || buildSearchText(log).includes(search);
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesCollection = collectionFilter === 'all' || log.collectionName === collectionFilter;
      return matchesSearch && matchesAction && matchesCollection;
    });
  }, [actionFilter, collectionFilter, logs, searchTerm]);

  return (
    <section className="space-y-5">
      <div className="glass-panel p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Auditoria</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-text-main">Histórico administrativo</h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-text-muted">
              Ultimas acoes sensiveis registradas pelo painel: publicacoes, arquivamentos, aprovacoes e mudancas de status.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px]">
          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Busca</span>
            <span className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por gestor, documento, coleção ou nota"
                className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm font-bold outline-none focus:border-primary"
              />
            </span>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Ação</span>
            <select
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value as AdminAuditAction | 'all')}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              <option value="all">Todas</option>
              {Object.entries(ACTION_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">Coleção</span>
            <select
              value={collectionFilter}
              onChange={(event) => setCollectionFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-bold outline-none focus:border-primary"
            >
              <option value="all">Todas</option>
              {collections.map((collectionName) => (
                <option key={collectionName} value={collectionName}>{collectionName}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-3 text-xs font-bold text-text-muted">
          Mostrando {filteredLogs.length} de {logs.length} registros carregados.
        </p>
      </div>

      {loading ? (
        <div className="glass-panel flex min-h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <EmptyState title="Auditoria indisponivel" description={error} />
      ) : filteredLogs.length === 0 ? (
        <EmptyState title="Nenhum registro encontrado" description="Ajuste os filtros ou atualize a lista." />
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const meta = ACTION_META[log.action];
            const Icon = meta.icon;
            return (
              <article key={log.id} data-testid="audit-log-card" className="civic-card p-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl border ${meta.className}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${meta.className}`}>
                        {ACTION_LABEL[log.action]}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted">
                        <Database className="h-3 w-3" />
                        {log.collectionName}
                      </span>
                    </div>
                    <h3 className="mt-2 break-all font-mono text-sm font-black text-primary">{log.documentId}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
                      <span className="font-bold text-text-main">{log.actorName || 'Gestor'}</span>
                      {' alterou '}
                      <span className="font-mono text-xs">{stringifyValue(log.previousValue)}</span>
                      {' para '}
                      <span className="font-mono text-xs">{stringifyValue(log.nextValue)}</span>.
                    </p>
                    {log.note && (
                      <p className="mt-3 rounded-xl border border-border bg-surface p-3 text-sm font-medium leading-6 text-text-muted">
                        {log.note}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted lg:justify-end">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
