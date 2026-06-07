'use client';

import { Loader2, RefreshCw, Search } from 'lucide-react';

interface StatusOption {
  value: string;
  label: string;
}

interface AdminQueueToolbarProps {
  search: string;
  searchPlaceholder: string;
  filter: string;
  allLabel?: string;
  statusOptions: StatusOption[];
  loading: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onRefresh: () => void;
}

interface AdminStatusSummaryProps {
  total: number;
  filter: string;
  statusOptions: StatusOption[];
  counts: Record<string, number>;
  onFilterChange: (value: string) => void;
}

export function AdminQueueToolbar({
  search,
  searchPlaceholder,
  filter,
  allLabel = 'Todos os status',
  statusOptions,
  loading,
  onSearchChange,
  onFilterChange,
  onRefresh,
}: AdminQueueToolbarProps) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto]">
      <label className="relative block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm font-medium outline-none transition focus:border-primary"
        />
      </label>

      <select
        value={filter}
        onChange={(event) => onFilterChange(event.target.value)}
        className="h-11 rounded-xl border border-border bg-white px-3 text-sm font-bold text-text-main outline-none focus:border-primary"
      >
        <option value="all">{allLabel}</option>
        {statusOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-xs font-black uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Atualizar
      </button>
    </div>
  );
}

export function AdminStatusSummary({
  total,
  filter,
  statusOptions,
  counts,
  onFilterChange,
}: AdminStatusSummaryProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onFilterChange('all')}
        className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-widest transition ${
          filter === 'all'
            ? 'admin-choice-active'
            : 'admin-choice-idle'
        }`}
      >
        Todos {total}
      </button>

      {statusOptions.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onFilterChange(item.value)}
          className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-widest transition ${
            filter === item.value
              ? 'admin-choice-active'
              : 'admin-choice-idle'
          }`}
        >
          {item.label} {counts[item.value] || 0}
        </button>
      ))}
    </div>
  );
}
