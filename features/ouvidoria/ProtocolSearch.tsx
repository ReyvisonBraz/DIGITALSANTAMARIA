'use client';

import { useState } from 'react';
import { Search, Clock, Activity, FileText, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { getDemandByProtocol } from '@/services/demands.service';
import { useToast } from '@/lib/toast-context';
import { createLogger } from '@/lib/logger';
import { formatDate, formatRelativeTime } from '@/lib/utils/formatters';
import type { Demand } from '@/types';

const log = createLogger('ProtocolSearch');

export default function ProtocolSearch() {
  const { toast } = useToast();
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Demand | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = searchId.trim();
    if (!id) return;
    setLoading(true);
    setResult(null);
    try {
      const demand = await getDemandByProtocol(id);
      if (demand) {
        setResult(demand);
        log.info('Protocol found', { protocolId: id });
      } else {
        toast('Protocolo não encontrado.', 'error');
        log.warn('Protocol not found', { searchId: id });
      }
    } catch (err) {
      log.error('Search failed', { searchId: id }, err);
      toast('Erro ao buscar protocolo.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleSearch} className="bg-white p-10 md:p-16 rounded-[4rem] md:rounded-[5.5rem] border-2 border-border shadow-4xl space-y-8 relative overflow-hidden">
        <div className="space-y-3 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-none">
            Rastreio <span className="text-primary">Cidadão.</span>
          </h2>
          <p className="text-lg font-ui font-medium text-text-muted opacity-60">Monitore em tempo real o status de sua demanda.</p>
        </div>
        <div className="relative z-10">
          <input
            placeholder="CHAVE DE PROTOCOLO (EX: OUV-2026-ABCDEF)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full h-20 md:h-24 bg-surface border-2 border-border p-8 pr-24 rounded-3xl font-mono text-2xl md:text-3xl font-black text-text-main focus:border-primary outline-none transition-all shadow-inner placeholder:opacity-10 tracking-widest"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 aspect-square bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary/80 transition-all active:scale-95 shadow-3xl group disabled:opacity-50"
          >
            <Search className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <Activity className="absolute -right-16 -top-16 w-80 h-80 opacity-[0.02] text-primary rotate-45 pointer-events-none" />
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 md:p-16 rounded-[4rem] md:rounded-[5.5rem] border-2 border-border border-b-[20px] border-b-amber-500 shadow-4xl space-y-12 overflow-hidden relative"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
            <div className="space-y-3">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] leading-none opacity-60">Protocolo</p>
              <h3 className="text-4xl md:text-5xl font-black text-primary font-mono tracking-tighter underline decoration-double decoration-border underline-offset-[12px]">
                {result.protocolId}
              </h3>
            </div>
            <div className="px-6 py-3 bg-amber-500 text-white rounded-[1.5rem] border-4 border-white text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl">
              <Clock className="w-5 h-5" />
              {result.status.toUpperCase()}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
            <div className="p-6 bg-surface rounded-[2rem] border-2 border-border shadow-inner group hover:border-primary transition-all">
              <span className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50 underline">Assunto</span>
              <span className="text-sm font-black uppercase text-text-main">{result.subject}</span>
            </div>
            <div className="p-6 bg-surface rounded-[2rem] border-2 border-border shadow-inner group hover:border-primary transition-all">
              <span className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50 underline">Data</span>
              <span className="text-sm font-black uppercase text-text-main">{formatDate(result.createdAt)}</span>
            </div>
            <div className="p-6 bg-surface rounded-[2rem] border-2 border-border shadow-inner col-span-2 md:col-span-1 group hover:border-primary transition-all">
              <span className="block text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50 underline">Tipo</span>
              <span className="text-sm font-black uppercase text-text-main">{result.type}</span>
            </div>
          </div>
          <div className="space-y-6 relative z-10">
            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] border-b border-border pb-4 flex items-center gap-3">
              <FileText size={18} className="text-primary" />
              Conteúdo
            </h4>
            <p className="text-sm font-ui text-text-muted leading-relaxed">{result.content.text}</p>
          </div>
          {result.adminAction && (
            <div className="p-6 bg-green-50 rounded-[2rem] border border-green-200 space-y-3">
              <h5 className="text-[10px] font-black text-green-700 uppercase tracking-widest">Resposta da Prefeitura</h5>
              <p className="text-sm font-ui text-green-800">{result.adminAction.response}</p>
              <p className="text-[10px] font-bold text-green-600">Por {result.adminAction.clerkName}</p>
            </div>
          )}
          <Layers className="absolute -left-12 -top-12 w-64 h-64 opacity-[0.02] text-primary rotate-12 pointer-events-none" />
        </motion.div>
      )}
    </div>
  );
}
