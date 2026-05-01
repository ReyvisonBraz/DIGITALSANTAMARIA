'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ChevronRight, 
  Search, 
  TrendingUp, 
  Megaphone,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import SidePanel from '@/components/ui/SidePanel';
import CreatePetitionModal from '@/components/CreatePetitionModal';
import SignatureButton from '@/features/peticoes/SignatureButton';
import SignatureProgress from '@/features/peticoes/SignatureProgress';
import { getActivePetitions, getPetitionById } from '@/services/petitions.service';
import type { Petition } from '@/types';

export default function PeticoesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('peticoes');

  useEffect(() => {
    getActivePetitions()
      .then(setPetitions)
      .catch(() => toast('Erro ao carregar petições', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const refreshPetitions = () => {
    getActivePetitions().then(setPetitions);
  };

  const recentReports = [
    { id: '1', title: 'Buraco na Rua das Palmeiras', category: 'Infra', time: 'Há 15 min', votes: 42, color: 'bg-orange-500' },
    { id: '2', title: 'Iluminação Queimada na Praça', category: 'Segurança', time: 'Há 2 horas', votes: 128, color: 'bg-primary' },
    { id: '3', title: 'Lixo Acumulado no Canal', category: 'Ambiente', time: 'Há 5 horas', votes: 34, color: 'bg-green-600' },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10 md:gap-16">
      
      {/* Header & Navigation */}
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-tertiary/20">
                 <Megaphone className="w-3 md:w-4 h-3 md:h-4" />
                 Plataforma de Participação Cidadã
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-text-main tracking-tighter uppercase leading-none">
                Voz do <br className="hidden md:block" /> <span className="text-tertiary">Bairro.</span>
              </h1>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-hover:text-tertiary transition-colors" />
                <input 
                  placeholder="Buscar petição ou relato..."
                  className="w-full sm:w-64 bg-white border-2 border-border p-3.5 pl-10 rounded-xl text-xs font-bold focus:border-tertiary outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="btn-tactile bg-tertiary text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-tertiary/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                 <Sparkles className="w-4 h-4" />
                 Iniciar Projeto
              </button>
           </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden bg-surface p-1.5 rounded-2xl border-2 border-border">
           <button 
             onClick={() => setActiveTab('peticoes')}
             className={cn(
               "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === 'peticoes' ? "bg-white text-tertiary shadow-sm" : "text-text-muted"
             )}
           >
             Petições
           </button>
           <button 
             onClick={() => setActiveTab('relatos')}
             className={cn(
               "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === 'relatos' ? "bg-white text-primary shadow-sm" : "text-text-muted"
             )}
           >
             Relatos Urbanos
           </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14">
        
        {/* LEFT COLUMN: Petitions Feed */}
        <section className={cn(
          "lg:col-span-8 space-y-10 md:space-y-12",
          activeTab !== 'peticoes' && "hidden lg:block"
        )}>
          <div className="flex items-center justify-between border-b-2 border-border pb-6">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-black text-text-main uppercase tracking-tight">Petições em Destaque</h2>
              <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-widest">Temas que precisam do seu apoio hoje</p>
            </div>
            <div className="flex gap-2">
               {['Mobilidade', 'Lazer', 'Saúde'].map(t => (
                 <button 
                  key={t}
                  className="hidden sm:block px-4 py-1.5 bg-surface text-[9px] font-black uppercase tracking-widest rounded-full border border-border hover:border-tertiary transition-colors"
                 >
                   {t}
                 </button>
               ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-tertiary" />
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {petitions.map((p) => (
              <motion.article 
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-sm hover:shadow-2xl hover:border-tertiary/30 transition-all group flex flex-col md:flex-row gap-6 md:gap-10 relative overflow-hidden active:scale-[0.99]"
              >
                {p.coverImageURL && (
                <div className="relative w-full md:w-64 h-48 md:h-52 rounded-2xl md:rounded-[2rem] overflow-hidden shrink-0 shadow-lg">
                   <Image 
                     src={p.coverImageURL} 
                     alt={p.title} 
                     fill 
                     className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                   />
                   <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[8px] font-black uppercase tracking-widest border border-border text-tertiary">
                        {p.category}
                      </span>
                   </div>
                </div>
                )}

                <div className="flex flex-col justify-between flex-grow py-2">
                   <div className="space-y-3">
                      <h3 className="text-lg md:text-2xl font-black text-text-main tracking-tight uppercase leading-tight group-hover:text-tertiary transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-xs md:text-sm font-ui font-medium text-text-muted leading-relaxed line-clamp-2 opacity-80">
                        {p.description}
                      </p>
                   </div>

                   <div className="mt-6 space-y-4">
                      <SignatureProgress current={p.signaturesCount} goal={p.goal} />

                      <div className="flex flex-wrap items-center gap-3">
                         <SignatureButton
                          petitionId={p.id}
                          petitionTitle={p.title}
                          onSign={refreshPetitions}
                         />
                         <button 
                          onClick={() => {
                            getPetitionById(p.id).then(setSelectedPetition);
                          }}
                          className="flex-grow sm:flex-none px-10 py-4 bg-white border-2 border-border text-text-main rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-tertiary/50 transition-all text-center"
                         >
                           Ver Detalhes
                         </button>
                      </div>
                   </div>
                </div>
                
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-tertiary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              </motion.article>
            ))}
          </div>
          )}
        </section>

        {/* RIGHT COLUMN: Reports & Stats */}
        <aside className={cn(
          "lg:col-span-4 space-y-10 md:space-y-12",
          activeTab !== 'relatos' && "hidden lg:block"
        )}>
          
          {/* Recent Reports List */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-border shadow-sm space-y-8">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                   <Megaphone className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-text-main uppercase tracking-tight">Relatos Recentes</h3>
             </div>

             <div className="space-y-4">
                {recentReports.map((report) => (
                  <motion.div 
                    key={report.id}
                    whileHover={{ x: 5 }}
                    className="p-5 bg-surface border-2 border-border border-l-[8px] border-l-primary rounded-2xl hover:border-primary/30 transition-all cursor-pointer group"
                  >
                     <div className="flex justify-between items-start mb-3">
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{report.time}</span>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-border text-[9px] font-black text-primary">
                           <TrendingUp className="w-3 h-3" />
                           {report.votes}
                        </div>
                     </div>
                     <h4 className="font-black text-sm text-text-main uppercase leading-tight group-hover:text-primary transition-colors">{report.title}</h4>
                     <button className="mt-4 flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest">
                        Apoiar agora <ArrowRight className="w-3 h-3" />
                     </button>
                  </motion.div>
                ))}
             </div>

             <button 
              onClick={() => router.push('/relatar')}
              className="w-full py-5 bg-text-main text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Sparkles className="w-4 h-4 text-primary" />
                Novo Relato Urbano
             </button>
          </div>

          {/* Impact Gauge */}
          <div className="bg-text-main p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden group">
             <div className="space-y-1 relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Impacto Cidadão</h4>
                <p className="text-2xl font-black uppercase tracking-tighter leading-none">A Cidade em <br/> Movimento</p>
             </div>

             <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                   <span className="block text-2xl font-black leading-none">124</span>
                   <span className="text-[8px] font-bold uppercase opacity-60">Soluções</span>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                   <span className="block text-2xl font-black leading-none">+15k</span>
                   <span className="text-[8px] font-bold uppercase opacity-60">Vozes</span>
                </div>
             </div>

             <p className="text-[10px] font-ui font-medium opacity-60 leading-relaxed relative z-10 text-center">
                Sua participação ajuda a priorizar o investimento público em tempo real.
             </p>

             {/* Background Decoration */}
             <TrendingUp className="absolute -right-8 -bottom-8 w-40 h-40 opacity-5 rotate-12 group-hover:scale-110 transition-transform" />
          </div>

        </aside>
      </div>

      <CreatePetitionModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <SidePanel 
        isOpen={!!selectedPetition} 
        onClose={() => setSelectedPetition(null)}
        title="Detalhes do Manifesto"
      >
        {selectedPetition && (
          <div className="space-y-8 p-6 md:p-8">
            <div className="space-y-4">
               <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-[9px] font-black uppercase tracking-widest border border-tertiary/20">
                    {selectedPetition.category}
                  </span>
               </div>
               <h3 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">{selectedPetition.title}</h3>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Autor: {selectedPetition.creatorName}</p>
            </div>

            <div className="bg-surface p-6 rounded-3xl border-2 border-border border-dashed font-ui text-sm font-bold text-text-muted leading-relaxed">
               {selectedPetition.description}
            </div>

            <div className="space-y-4">
               <SignatureProgress current={selectedPetition.signaturesCount} goal={selectedPetition.goal} />
            </div>

            <div className="sticky bottom-0 pt-6 bg-background">
              <SignatureButton
                petitionId={selectedPetition.id}
                petitionTitle={selectedPetition.title}
                onSign={() => {
                  getPetitionById(selectedPetition.id).then(setSelectedPetition);
                  refreshPetitions();
                }}
                className="w-full justify-center"
              />
            </div>
          </div>
        )}
      </SidePanel>

    </div>
  );
}
