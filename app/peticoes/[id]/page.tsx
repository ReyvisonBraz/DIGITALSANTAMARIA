'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  CalendarDays, 
  ShieldCheck, 
  Share2, 
  PenTool, 
  CheckCircle2, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { useAuth } from '@/lib/auth-context';

export default function PetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [signed, setSigned] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Mock data for the specific petition
  const petition = {
    id: params.id,
    title: 'Reforma Urgente da Praça Raul de Leoni',
    category: 'Infraestrutura',
    author: 'Associação de Moradores do Centro',
    createdAt: '12 Out 2026',
    signatures: 4250,
    goal: 5000,
    description: `A Praça Raul de Leoni encontra-se em estado de abandono. Os brinquedos do parquinho estão enferrujados, a iluminação é precária, o que favorece a insegurança noturna, e o calçamento está destruído em diversos pontos. 
    
    Esta petição visa solicitar à Secretaria de Obras a revitalização completa do espaço, incluindo novos bancos, posteamento em LED e reforma da área recreativa infantil. A praça é o único ponto de lazer de centenas de famílias que vivem no entorno.`,
    impact: 'Melhoria na segurança de 2.000 famílias residentes no entorno e valorização do patrimônio público.',
    updates: [
      { date: '15 Out 2026', title: 'Reunião com a Prefeitura', content: 'A prefeitura acusou o recebimento da proposta via Digital Santa Maria.' }
    ],
    supporters: [
      { name: 'Ana M.', comment: 'Totalmente necessário, a praça está perigosa à noite.' },
      { name: 'Roberto J.', comment: 'Meus filhos não podem brincar lá.' },
      { name: 'Patrícia S.', comment: 'Um descaso com o centro histórico.' }
    ]
  };

  const progress = (petition.signatures / petition.goal) * 100;

  const handleSign = () => {
    if (!user) {
      toast('Você precisa estar logado para assinar uma causa.', 'error');
      return;
    }
    setShowConfirm(true);
  };

  const confirmSignature = () => {
    setSigned(true);
    setShowConfirm(false);
    toast('Assinatura confirmada! Sua voz foi ouvida.', 'success');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-6 md:p-12 pb-32 gap-10">
      
      {/* Navigation & Header */}
      <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group px-4 py-2 border-2 border-border rounded-xl font-black text-[10px] uppercase tracking-widest bg-white"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para Lista
        </button>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => {
               navigator.clipboard.writeText(window.location.href);
               toast('Link copiado!', 'info');
             }}
             className="p-3 bg-white border-2 border-border rounded-xl hover:text-primary transition-all text-text-muted"
           >
              <Share2 className="w-5 h-5" />
           </button>
           <div className="px-5 py-2.5 bg-primary/10 text-primary border-2 border-primary/20 rounded-xl font-black text-[10px] uppercase tracking-widest">
              Gesto em Análise
           </div>
        </div>
      </nav>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          <header className="space-y-6">
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                   <MapPin className="w-4 h-4" />
                   Centro, Petrópolis / RJ
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-[1.1] scale-safe">
                   {petition.title}
                </h1>
             </div>
             
             <div className="flex flex-wrap items-center gap-6 py-6 border-y border-border">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center font-black text-sm uppercase text-primary">AM</div>
                   <div>
                      <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Autor da Proposta</p>
                      <p className="text-xs font-black text-text-main">{petition.author}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-surface border-2 border-border flex items-center justify-center text-text-muted">
                      <CalendarDays className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Publicado em</p>
                      <p className="text-xs font-black text-text-main">{petition.createdAt}</p>
                   </div>
                </div>
             </div>
          </header>

          {/* Description */}
          <section className="space-y-8">
             <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src="https://picsum.photos/seed/park/1200/600" 
                  alt="Evidência" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
             </div>
             
             <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-black text-text-main uppercase tracking-tight flex items-center gap-3">
                  <PenTool className="w-5 h-5 text-primary" />
                  Manifesto Cidadão
                </h3>
                <div className="text-lg font-ui text-text-muted font-medium leading-relaxed mt-4 whitespace-pre-line">
                   {petition.description}
                </div>
             </div>

             <div className="p-8 bg-surface rounded-[2.5rem] border-2 border-border shadow-inner space-y-4">
                <h4 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-primary" />
                   Impacto Esperado
                </h4>
                <p className="text-sm font-ui text-text-muted font-medium leading-relaxed">
                   "{petition.impact}"
                </p>
             </div>
          </section>

          {/* Supporters List */}
          <section className="space-y-6 pt-6">
             <h3 className="text-xl font-black text-text-main uppercase tracking-tight flex items-center gap-3">
               <MessageSquare className="w-5 h-5 text-primary" />
               Apoio da Comunidade
             </h3>
             <div className="space-y-4">
                {petition.supporters.map((supporter, idx) => (
                  <div key={idx} className="p-6 bg-white border-2 border-border rounded-3xl hover:border-primary transition-all shadow-sm">
                     <p className="text-xs font-black text-text-main mb-1 uppercase tracking-tight">{supporter.name}</p>
                     <p className="text-sm font-ui text-text-muted font-medium opacity-80">"{supporter.comment}"</p>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Right Column: Actions & Progress (Sticky) */}
        <div className="lg:col-span-1">
           <div className="sticky top-32 space-y-6">
              <div className="bg-white p-8 md:p-10 rounded-[3.5rem] border-2 border-border border-b-[12px] border-b-primary shadow-2xl space-y-8">
                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <p className="text-3xl font-black text-text-main tracking-tighter leading-none">
                          {petition.signatures.toLocaleString()} <span className="text-sm opacity-40 font-black">APOIOS</span>
                       </p>
                       <p className="text-xs font-black text-primary uppercase tracking-widest">
                          Meta: {petition.goal.toLocaleString()}
                       </p>
                    </div>
                    <div className="w-full h-4 bg-surface rounded-full border border-border overflow-hidden p-1 shadow-inner">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }}
                         className="h-full bg-primary rounded-full shadow-lg"
                       />
                    </div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] text-center pt-1">
                       {Math.round(progress)}% Concluído
                    </p>
                 </div>

                 <div className="space-y-4">
                    {!signed ? (
                      <button 
                        onClick={handleSign}
                        className="w-full btn-tactile bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                      >
                         <CheckCircle2 className="w-5 h-5" />
                         Assinar Manifesto
                      </button>
                    ) : (
                      <div className="w-full bg-green-50 text-green-600 border-2 border-green-200 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3">
                         <CheckCircle2 className="w-5 h-5" />
                         Causa Assinada
                      </div>
                    )}
                    <button className="w-full btn-tactile bg-white border-2 border-border text-text-muted py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                       Ver Lista de Apoiadores
                    </button>
                 </div>

                 <div className="pt-6 border-t border-border/50">
                    <div className="flex items-start gap-3">
                       <ShieldCheck className="w-5 h-5 text-primary shrink-0 transition-animate-pulse" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-text-main uppercase tracking-tight">Assinatura Certificada</p>
                          <p className="text-[8px] font-medium text-text-muted font-ui">Sua identidade é validada via DigitalID para garantir a integridade da consulta pública.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Status Update Card */}
              <div className="bg-text-main p-8 rounded-[3rem] text-white space-y-4 shadow-xl">
                 <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Última Atualização</h4>
                 <div className="space-y-2">
                    <p className="text-sm font-black uppercase tracking-tight">{petition.updates[0].title}</p>
                    <p className="text-xs font-medium font-ui opacity-60 leading-relaxed">
                       "{petition.updates[0].content}"
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-text-main/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-10 rounded-[3.5rem] border-4 border-primary shadow-2xl max-w-md w-full relative"
            >
               <button 
                 onClick={() => setShowConfirm(false)}
                 className="absolute top-6 right-6 p-2 hover:bg-surface rounded-xl transition-all"
               >
                  <ArrowLeft className="w-5 h-5 rotate-90" />
               </button>
               
               <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                     <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-text-main uppercase tracking-tight">Confirmar Apoio</h3>
                     <p className="text-sm font-ui text-text-muted">
                        Ao confirmar, sua assinatura será vinculada permanentemente a este manifesto como prova de interesse público.
                     </p>
                  </div>
                  
                  <div className="w-full p-4 bg-surface rounded-2xl border-2 border-border space-y-2 text-left">
                     <p className="text-[8px] font-black text-text-muted uppercase tracking-widest text-center">Identidade Verificada</p>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-tighter">{user?.displayName || 'Cidadão'}</span>
                        <span className="text-[10px] font-mono opacity-40">ID-2847-XXX</span>
                     </div>
                  </div>

                  <div className="flex gap-4 w-full">
                     <button 
                       onClick={() => setShowConfirm(false)}
                       className="flex-1 py-4 bg-surface text-text-muted rounded-xl font-black text-[10px] uppercase tracking-widest border-2 border-border"
                     >
                        Cancelar
                     </button>
                     <button 
                       onClick={confirmSignature}
                       className="flex-1 py-4 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/30"
                     >
                        Confirmar
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
