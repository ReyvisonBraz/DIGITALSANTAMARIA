'use client';

import { useState } from 'react';
import { Clock, FileText, Loader2, Search } from 'lucide-react';
import { getDemandByProtocol } from '@/services/demands.service';
import DemandTimeline from '@/features/ouvidoria/DemandTimeline';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { formatDate } from '@/lib/utils/formatters';
import type { Demand, DemandStatus, DemandType } from '@/types';

const statusLabel: Record<DemandStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em análise',
  solved: 'Resolvida',
  rejected: 'Recusada',
};

const typeLabel: Record<DemandType, string> = {
  reclamacao: 'Reclamação',
  sugestao: 'Solicitação',
  denuncia: 'Denúncia',
  elogio: 'Elogio',
};

export default function ProtocolSearch() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [protocolId, setProtocolId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Demand | null>(null);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = protocolId.trim();
    if (!search) return;

    setLoading(true);
    setResult(null);
    try {
      const demand = await getDemandByProtocol(search, user?.uid);
      if (!demand) {
        toast('Protocolo nao encontrado.', 'error');
        return;
      }
      setResult(demand);
    } catch {
      toast('Não foi possível consultar o protocolo agora.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="civic-card p-4 md:p-6">
        <label className="block space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-text-muted">Numero do protocolo</span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={protocolId}
              onChange={(event) => setProtocolId(event.target.value)}
              placeholder="Ex: OUV-2026-ABC123"
              className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 font-mono text-sm font-bold uppercase text-text-main outline-none transition focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Consultar
            </button>
          </div>
        </label>
      </form>

      {result && (
        <article className="civic-card p-4 md:p-6">
          <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-text-muted">Protocolo</p>
              <h3 className="mt-1 break-all font-mono text-lg font-black text-primary md:text-2xl">
                {result.protocolId}
              </h3>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-amber-800">
              <Clock className="h-4 w-4" />
              {statusLabel[result.status]}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-surface p-4">
              <p className="text-xs font-black uppercase tracking-widest text-text-muted">Assunto</p>
              <p className="mt-1 text-sm font-bold text-text-main">{result.subject}</p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="text-xs font-black uppercase tracking-widest text-text-muted">Tipo</p>
              <p className="mt-1 text-sm font-bold text-text-main">{typeLabel[result.type]}</p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="text-xs font-black uppercase tracking-widest text-text-muted">Criado em</p>
              <p className="mt-1 text-sm font-bold text-text-main">{formatDate(result.createdAt)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
              <FileText className="h-4 w-4 text-primary" />
              Descrição
            </div>
            <p className="mt-3 text-sm font-medium leading-6 text-text-muted">{result.content.text}</p>
          </div>

          <div className="mt-5">
            <DemandTimeline
              demand={result}
              allowCitizenReply
              currentUserId={user?.uid}
              currentUserName={user?.displayName || user?.email || undefined}
            />
          </div>
        </article>
      )}
    </div>
  );
}
