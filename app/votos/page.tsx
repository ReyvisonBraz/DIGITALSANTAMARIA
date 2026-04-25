'use client';

import React, { useState, useMemo } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown,
  MapPin, 
  ChevronRight, 
  MessageSquare, 
  Clock,
  Gavel,
  Info,
  ShieldCheck,
  TrendingUp,
  Scale,
  Users,
  Eye,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import SidePanel from '@/components/ui/SidePanel';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/lib/toast-context';

// Mock de Projetos de Lei (Legislativo Municipal)
const bills = [
  {
    id: 'pl-2024-001',
    title: 'Programa Bairro Seguro 24h',
    category: 'Segurança',
    author: 'Câmara Municipal',
    createdAt: '2024-10-15',
    status: 'Em Votação',
    description: 'Implementação de câmeras de monitoramento inteligente e iluminação LED em todos os parques e praças do Setor 01.',
    impact: 'Redução estimada de 30% nas ocorrências noturnas e aumento da ocupação de espaços públicos por famílias.',
    votesFor: 1240,
    votesAgainst: 85,
    budget: 'R$ 2.500.000,00',
    image: 'https://picsum.photos/seed/safety/600/340'
  },
  {
    id: 'pl-2024-002',
    title: 'Redução da Taxa de Lixo para Recicladores',
    category: 'Meio Ambiente',
    author: 'Executivo Municipal',
    createdAt: '2024-10-18',
    status: 'Em Votação',
    description: 'Concessão de desconto de até 50% na taxa de lixo para condomínios que implementarem coleta seletiva rigorosa.',
    impact: 'Incentivo à economia circular e redução da carga nos aterros sanitários municipais.',
    votesFor: 890,
    votesAgainst: 210,
    budget: 'Isenção Fiscal',
    image: 'https://picsum.photos/seed/environment/600/340'
  },
  {
    id: 'pl-2024-003',
    title: 'Expansão da Ciclovia Norte-Sul',
    category: 'Mobilidade',
    author: 'Câmara Municipal',
    createdAt: '2024-10-20',
    status: 'Discussão',
    description: 'Criação de 15km de ciclovias protegidas conectando os bairros periféricos ao centro comercial e terminal de ônibus.',
    impact: 'Melhoria na fluidez do trânsito e alternativa sustentável para o deslocamento diário de trabalhadores.',
    votesFor: 1560,
    votesAgainst: 450,
    budget: 'R$ 4.200.000,00',
    image: 'https://picsum.photos/seed/mobility/600/340'
  }
];

export default function VotosPage() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [votedBills, setVotedBills] = useState<string[]>([]);
  const [isConfirmingVote, setIsConfirmingVote] = useState<any>(null);

  const filteredBills = useMemo(() => {
    return bills.filter(b => selectedCategory === 'Todos' || b.category === selectedCategory);
  }, [selectedCategory]);

  const handleVote = (billId: string, type: 'for' | 'against') => {
    if (votedBills.includes(billId)) {
      toast('Você já votou neste projeto.', 'info');
      return;
    }
    setVotedBills([...votedBills, billId]);
    setIsConfirmingVote(null);
    toast(`Voto ${type === 'for' ? 'favorável' : 'contrário'} registrado!`, 'success');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-full p-6 md:p-12 gap-10">
      
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
        <div className="lg:col-span-2 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
             <Scale className="w-3 h-3" />
             Legislativo Cidadão 2026
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-text-main leading-tight uppercase">
            Participe das <br/> Decisões Locais
          </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
               <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-xl border border-border">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black uppercase">4.5k Votantes</span>
               </div>
               <button 
                onClick={() => toast('Abrindo seu histórico de participação legislativa...', 'info')}
                className="flex items-center gap-2 bg-text-main text-white px-4 py-2 rounded-xl border border-text-main hover:bg-black transition-all shadow-xl active:scale-95"
               >
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest leading-none">Ver Meu Histórico</span>
               </button>
            </div>
        </div>
        <div className="bg-text-main p-8 rounded-3xl text-white flex flex-col justify-between shadow-2xl border-4 border-white/5 relative overflow-hidden group">
           <div className="relative z-10">
              <span className="text-yellow-400 font-black text-xs uppercase tracking-[0.2em] mb-2 block">Seu Impacto</span>
              <p className="text-2xl font-black tracking-tight leading-tight">
                {votedBills.length} Votos <br/> <span className="opacity-60">Registrados</span>
              </p>
           </div>
           <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 justify-start items-center border-b-2 border-border/50">
        <span className="hidden md:block text-[10px] font-black text-text-muted uppercase tracking-widest mr-4">Filtrar Temas:</span>
        {['Todos', 'Segurança', 'Mobilidade', 'Meio Ambiente', 'Saúde'].map((f) => (
          <button 
            key={f} 
            onClick={() => setSelectedCategory(f)}
            className={cn(
              "flex-shrink-0 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 border-2",
              selectedCategory === f 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white border-border text-text-muted hover:border-primary/50"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredBills.map((bill) => (
            <motion.article 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={bill.id} 
              className="bg-white rounded-[2.5rem] border-2 border-border shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:border-primary/30 transition-all"
            >
              <div className="relative aspect-video">
                <Image 
                  src={bill.image} 
                  alt={bill.title} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-5 left-5">
                   <div className="bg-white/95 backdrop-blur px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-primary rounded-xl shadow-lg border-2 border-primary/20">
                      {bill.category}
                   </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                   <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
                     <Gavel className="w-4 h-4 text-primary" />
                     {bill.status}
                   </div>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow gap-6 bg-surface/30">
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl font-black text-text-main leading-tight group-hover:text-primary transition-colors tracking-tight">
                    {bill.title}
                  </h3>
                  <p className="text-xs text-text-muted font-ui font-medium line-clamp-3 leading-relaxed">
                    {bill.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-4 rounded-2xl border-2 border-border shadow-inner">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-1">Apoios</span>
                      <div className="flex items-center gap-1.5 text-green-600">
                         <Users className="w-4 h-4" />
                         <span className="text-lg font-black tracking-tight">{bill.votesFor}</span>
                      </div>
                   </div>
                   <div className="bg-white p-4 rounded-2xl border-2 border-border shadow-inner">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-1">Impacto</span>
                      <div className="flex items-center gap-1.5 text-primary">
                         <TrendingUp className="w-4 h-4" />
                         <span className="text-xs font-black uppercase tracking-tighter">Alto</span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-2 mt-auto">
                   <button 
                      onClick={() => setSelectedBill(bill)}
                      className="flex-1 bg-surface border-2 border-border text-text-muted py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary hover:border-primary transition-all active:scale-95 flex items-center justify-center gap-2 font-ui"
                   >
                     <Eye className="w-4 h-4" />
                     Detalhes
                   </button>
                   <button 
                      onClick={() => setIsConfirmingVote(bill)}
                      disabled={votedBills.includes(bill.id)}
                      className={cn(
                        "flex-[1.5] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2",
                        votedBills.includes(bill.id)
                          ? "bg-green-50 text-green-600 border-2 border-green-200 cursor-default"
                          : "bg-primary text-white hover:bg-primary-dark shadow-primary/20"
                      )}
                   >
                     {votedBills.includes(bill.id) ? (
                        <>
                           <ShieldCheck className="w-4 h-4" />
                           Votado
                        </>
                     ) : (
                        <>
                           <ThumbsUp className="w-4 h-4" />
                           Votar Agora
                        </>
                     )}
                   </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* NEW: Orçamento Participativo Section */}
      <section className="bg-surface p-12 rounded-[4rem] border-2 border-border border-dashed space-y-12">
         <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
               <div className="inline-flex px-3 py-1 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 shadow-lg shadow-primary/20">
                  Aberto para Votação
               </div>
               <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase leading-none">Orçamento Participativo</h2>
               <p className="text-sm font-ui font-medium text-text-muted max-w-xl">Escolha em qual obra ou serviço do seu bairro a prefeitura deve investir o bônus orçamentário anual de R$ 500mil por distrito.</p>
            </div>
            <button className="text-xs font-black text-primary uppercase tracking-[0.2em] border-b-2 border-primary/20 hover:border-primary transition-all pb-1 font-ui">
               Como funciona o OP?
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
               { title: 'Reforma da Praça Central', zone: 'Setor Sul', votes: 450, total: 1000 },
               { title: 'Nova Quadra de Areia', zone: 'Setor Sul', votes: 550, total: 1000 }
            ].map((p, i) => (
               <div key={i} className="bg-white p-8 rounded-3xl border-2 border-border shadow-sm group hover:border-primary transition-all flex flex-col gap-6">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{p.zone}</span>
                        <h4 className="text-xl font-black text-text-main uppercase tracking-tight leading-none">{p.title}</h4>
                     </div>
                     <span className="text-lg font-black text-primary">{Math.round((p.votes / p.total) * 100)}%</span>
                  </div>
                  <div className="w-full h-3 bg-surface rounded-full overflow-hidden border border-border">
                     <div 
                        className="h-full bg-primary group-hover:bg-primary-dark transition-all duration-1000 ease-out shadow-lg" 
                        style={{ width: `${(p.votes / p.total) * 100}%` }}
                     />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-muted font-ui">
                     <span>{p.votes} votos</span>
                     <button 
                       onClick={() => toast('Registrando voto no Orçamento Participativo...', 'success')}
                       className="text-primary hover:underline"
                     >
                        Confirmar Voto
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* SidePanel: Details & Impact */}
      <SidePanel
        isOpen={!!selectedBill}
        onClose={() => setSelectedBill(null)}
        title="Impacto do Projeto"
      >
        {selectedBill && (
          <div className="p-8 space-y-10 pb-20">
            <div className="relative h-64 rounded-3xl overflow-hidden border-4 border-border shadow-2xl">
               <Image src={selectedBill.image} alt={selectedBill.title} fill className="object-cover" referrerPolicy="no-referrer" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-2">{selectedBill.category}</span>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{selectedBill.title}</h2>
               </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                     <Info className="w-4 h-4 text-primary" />
                     Manifesto e Propósito
                  </h4>
                  <p className="text-lg font-ui font-medium text-text-main leading-relaxed opacity-90">
                    {selectedBill.description}
                  </p>
               </div>

               <div className="bg-primary/5 p-6 rounded-3xl border-2 border-primary/10 border-l-[12px] border-l-primary shadow-sm relative overflow-hidden group">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                     <TrendingUp className="w-4 h-4" />
                     Impacto Social Estimado
                  </h4>
                  <p className="text-lg font-black text-text-main tracking-tight leading-tight group-hover:translate-x-1 transition-transform">
                    {selectedBill.impact}
                  </p>
                  <Users className="absolute -right-4 -bottom-4 w-20 h-20 opacity-[0.03] text-primary" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface p-5 rounded-2xl border-2 border-border border-b-6 border-b-primary shadow-inner">
                     <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Orçamento</span>
                     <span className="text-xl font-black text-text-main tracking-tighter">{selectedBill.budget}</span>
                  </div>
                  <div className="bg-surface p-5 rounded-2xl border-2 border-border border-b-6 border-b-tertiary shadow-inner">
                     <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Autor</span>
                     <span className="text-xl font-black text-text-main tracking-tighter">{selectedBill.author}</span>
                  </div>
               </div>
            </div>

            <div className="mt-12 space-y-6 pt-12 border-t-2 border-border">
               <h3 className="text-2xl font-black text-text-main tracking-tight uppercase flex justify-center gap-3">
                  Como você votaria?
               </h3>
               <div className="flex flex-col gap-3">
                  <button 
                     onClick={() => handleVote(selectedBill.id, 'for')}
                     disabled={votedBills.includes(selectedBill.id)}
                     className="w-full btn-tactile bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                     <ThumbsUp className="w-5 h-5" />
                     Sou Favorável ao Projeto
                  </button>
                  <button 
                     onClick={() => handleVote(selectedBill.id, 'against')}
                     disabled={votedBills.includes(selectedBill.id)}
                     className="w-full btn-tactile bg-white border-2 border-border text-text-muted py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-rose-500 hover:text-rose-500 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                     <ThumbsDown className="w-5 h-5" />
                     Contrário à Proposta
                  </button>
               </div>
            </div>
          </div>
        )}
      </SidePanel>

      {/* Modal: Confirm Vote (Mobile-friendly check) */}
      <Modal
        isOpen={!!isConfirmingVote}
        onClose={() => setIsConfirmingVote(null)}
        title="Confirmar Voto Legislativo"
      >
        <div className="p-4 space-y-8">
           <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center border-4 border-primary/20 shadow-inner">
                 <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                 <h3 className="text-2xl font-black text-text-main tracking-tight uppercase leading-none">Identidade Confirmada</h3>
                 <p className="text-sm font-medium text-text-muted font-ui px-4">
                   Seu voto será registrado anonimamente e computado para o relatório oficial de participação cidadã do mês.
                 </p>
              </div>
           </div>

           <div className="bg-surface p-6 rounded-3xl border-2 border-border border-dashed space-y-4">
              <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Projeto Selecionado</span>
                 <p className="text-lg font-black text-text-main tracking-tight leading-tight">{isConfirmingVote?.title}</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 pt-4">
              <button 
                 onClick={() => setIsConfirmingVote(null)}
                 className="btn-tactile bg-white border-2 border-border text-text-muted py-4 rounded-xl font-black text-xs uppercase tracking-widest"
              >
                 Cancelar
              </button>
              <button 
                 onClick={() => handleVote(isConfirmingVote.id, 'for')}
                 className="btn-tactile bg-primary text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                 Confirmar Voto
                 <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </Modal>
    </div>
  );
}

