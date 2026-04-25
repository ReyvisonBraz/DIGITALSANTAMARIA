# 10 — Módulo Gestão Admin: Painel com Roles Reais + Firestore

---

## Arquivo: `features/gestao/hooks/useAdminData.ts` (NOVO)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type { Report } from '@/types/report.types';
import type { Demand } from '@/types/demand.types';

/**
 * Hook que escuta em tempo real (onSnapshot) os relatos e demandas pendentes.
 * Atualiza automaticamente quando um cidadão envia novo relato/demanda.
 */
export function useAdminData() {
  const [reports, setReports] = useState<Report[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let reportsLoaded = false;
    let demandsLoaded = false;

    const checkReady = () => {
      if (reportsLoaded && demandsLoaded) setLoading(false);
    };

    // Listener em tempo real para relatos pendentes
    const reportsQuery = query(
      collection(db, 'reports'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc')
    );

    const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Report));
      setReports(data);
      reportsLoaded = true;
      checkReady();
    });

    // Listener em tempo real para demandas pendentes
    const demandsQuery = query(
      collection(db, 'demands'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'asc')
    );

    const unsubDemands = onSnapshot(demandsQuery, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Demand));
      setDemands(data);
      demandsLoaded = true;
      checkReady();
    });

    // Cleanup: cancela os listeners ao desmontar
    return () => {
      unsubReports();
      unsubDemands();
    };
  }, []);

  // Métricas calculadas dos dados reais
  const metrics = {
    pendingReports: reports.length,
    pendingDemands: demands.length,
    total: reports.length + demands.length,
  };

  return { reports, demands, metrics, loading };
}
```

---

## Arquivo: `features/gestao/StatusUpdater.tsx` (NOVO)

```typescript
'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { updateReportStatus } from '@/services/reports.service';
import { updateDemandStatus } from '@/services/demands.service';
import { useAuth } from '@/lib/contexts/auth-context';
import { useToast } from '@/lib/contexts/toast-context';
import type { Report } from '@/types/report.types';
import type { Demand } from '@/types/demand.types';

type Item = (Report & { _type: 'report' }) | (Demand & { _type: 'demand' });

interface StatusUpdaterProps {
  item: Item;
  onUpdated: () => void;
}

/**
 * Painel inline para admin/clerk atualizar status de um relato ou demanda.
 * Persiste mudança no Firestore e registra o clerk responsável.
 */
export function StatusUpdater({ item, onUpdated }: StatusUpdaterProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    if (!user) return;
    if (!response.trim()) {
      toast('A resposta ao cidadão é obrigatória', 'error');
      return;
    }

    setLoading(true);
    try {
      if (item._type === 'report') {
        await updateReportStatus(
          item.id,
          newStatus as Report['status'],
          response,
          user.uid
        );
      } else {
        await updateDemandStatus(
          item.id,
          newStatus as Demand['status'],
          response,
          user.uid,
          user.displayName ?? 'Admin'
        );
      }

      toast(`Status atualizado para: ${newStatus}`, 'success');
      onUpdated();
    } catch (err) {
      console.error('[StatusUpdater] Erro:', err);
      toast('Falha ao atualizar. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-surface-low rounded-xl border border-outline/20 space-y-3"
    >
      {/* Informações do item */}
      <div>
        <p className="text-xs font-ui font-semibold text-text-muted uppercase tracking-wide mb-1">
          {item._type === 'report' ? `Relato ${item.protocol}` : `Demanda ${(item as Demand).protocolId}`}
        </p>
        <p className="text-sm font-ui text-text-main">
          {item._type === 'report' ? item.title : (item as Demand).subject}
        </p>
        <p className="text-xs text-text-muted font-ui mt-1 line-clamp-2">
          {item._type === 'report' ? item.description : (item as Demand).content.text}
        </p>
      </div>

      {/* Campo de resposta */}
      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Resposta oficial ao cidadão (obrigatório)..."
        rows={3}
        maxLength={500}
        className="w-full px-3 py-2 bg-white border-2 border-outline/30 rounded-lg text-sm font-ui text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
      />

      {/* Botões de ação */}
      <div className="flex gap-2">
        <button
          onClick={() => handleUpdate('in_review')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 text-white rounded-lg text-xs font-ui font-bold disabled:opacity-50"
        >
          <Search className="w-3.5 h-3.5" />
          Em Análise
        </button>
        <button
          onClick={() => handleUpdate('resolved')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 text-white rounded-lg text-xs font-ui font-bold disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          Resolver
        </button>
        <button
          onClick={() => handleUpdate('rejected')}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500 text-white rounded-lg text-xs font-ui font-bold disabled:opacity-50"
        >
          <XCircle className="w-3.5 h-3.5" />
          Indeferir
        </button>
      </div>
    </motion.div>
  );
}
```

---

## Arquivo: `features/gestao/MetricsDashboard.tsx` (NOVO)

```typescript
'use client';

import { ClipboardList, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricsDashboardProps {
  pendingReports: number;
  pendingDemands: number;
  total: number;
}

/**
 * Cards de métricas do painel admin com dados reais do Firestore.
 * Valores atualizados em tempo real via onSnapshot.
 */
export function MetricsDashboard({ pendingReports, pendingDemands, total }: MetricsDashboardProps) {
  const metrics = [
    {
      label: 'Relatos Pendentes',
      value: pendingReports,
      icon: ClipboardList,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      label: 'Demandas (Ouvidoria)',
      value: pendingDemands,
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      label: 'Total na Fila',
      value: total,
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`p-3 rounded-xl border-2 ${m.bg} ${m.border}`}
        >
          <m.icon className={`w-5 h-5 ${m.color} mb-1`} />
          <p className={`text-2xl font-display font-black ${m.color}`}>{m.value}</p>
          <p className="text-xs text-text-muted font-ui leading-tight">{m.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
```

---

## Atualização Completa: `app/gestao/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useAuthGuard } from '@/lib/hooks/use-auth-guard';
import { useAdminData } from '@/features/gestao/hooks/useAdminData';
import { MetricsDashboard } from '@/features/gestao/MetricsDashboard';
import { StatusUpdater } from '@/features/gestao/StatusUpdater';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Report } from '@/types/report.types';
import type { Demand } from '@/types/demand.types';

export default function GestaoPage() {
  // ─── Proteção de rota — exige role clerk ou admin ───
  const { authorized, loading: authLoading } = useAuthGuard('clerk');

  // ─── Dados em tempo real do Firestore ───
  const { reports, demands, metrics, loading: dataLoading } = useAdminData();

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'demands'>('reports');

  if (authLoading) return <Skeleton variant="page" />;
  if (!authorized) return null;

  const loading = dataLoading;

  return (
    <main className="flex flex-col gap-4 p-4 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-black text-text-main uppercase tracking-tight">
          Centro de Governança
        </h1>
        <p className="text-sm text-text-muted font-ui">
          Dados em tempo real · atualização automática
        </p>
      </div>

      {/* Métricas */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-surface-med animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <MetricsDashboard
          pendingReports={metrics.pendingReports}
          pendingDemands={metrics.pendingDemands}
          total={metrics.total}
        />
      )}

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border-2 border-outline/20">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2.5 text-sm font-ui font-semibold transition-colors ${
            activeTab === 'reports' ? 'bg-primary text-white' : 'bg-white text-text-muted'
          }`}
        >
          Relatos ({metrics.pendingReports})
        </button>
        <button
          onClick={() => setActiveTab('demands')}
          className={`flex-1 py-2.5 text-sm font-ui font-semibold transition-colors ${
            activeTab === 'demands' ? 'bg-primary text-white' : 'bg-white text-text-muted'
          }`}
        >
          Ouvidoria ({metrics.pendingDemands})
        </button>
      </div>

      {/* Lista de itens */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {activeTab === 'reports' &&
            reports.map((report) => (
              <div key={report.id}>
                <button
                  onClick={() =>
                    setSelectedItem(selectedItem === report.id ? null : report.id)
                  }
                  className="w-full p-4 bg-white border-2 border-outline/20 rounded-xl text-left hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-ui font-semibold text-text-main">
                        {report.title}
                      </p>
                      <p className="text-xs text-text-muted font-ui mt-0.5">
                        {report.protocol} · {report.reporterName}
                      </p>
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-ui shrink-0">
                      Pendente
                    </span>
                  </div>
                </button>

                {selectedItem === report.id && (
                  <StatusUpdater
                    item={{ ...report, _type: 'report' }}
                    onUpdated={() => setSelectedItem(null)}
                  />
                )}
              </div>
            ))}

          {activeTab === 'demands' &&
            demands.map((demand) => (
              <div key={demand.id}>
                <button
                  onClick={() =>
                    setSelectedItem(selectedItem === demand.id ? null : demand.id)
                  }
                  className="w-full p-4 bg-white border-2 border-outline/20 rounded-xl text-left hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-ui font-semibold text-text-main">
                        {demand.subject}
                      </p>
                      <p className="text-xs text-text-muted font-ui mt-0.5">
                        {demand.protocolId} · {demand.authorName}
                      </p>
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-ui shrink-0">
                      Pendente
                    </span>
                  </div>
                </button>

                {selectedItem === demand.id && (
                  <StatusUpdater
                    item={{ ...demand, _type: 'demand' }}
                    onUpdated={() => setSelectedItem(null)}
                  />
                )}
              </div>
            ))}

          {/* Estado vazio */}
          {activeTab === 'reports' && reports.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-sm font-ui">Nenhum relato pendente</p>
            </div>
          )}
          {activeTab === 'demands' && demands.length === 0 && (
            <div className="text-center py-12 text-text-muted">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-sm font-ui">Nenhuma demanda pendente</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
```
