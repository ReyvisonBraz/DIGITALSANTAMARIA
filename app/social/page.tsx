'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  Home, 
  Users, 
  Calendar, 
  MapPin, 
  FileText, 
  Gift, 
  ChevronRight, 
  Info,
  Clock,
  ShieldCheck,
  Zap,
  HandHelping,
  Smartphone
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';

export default function SocialPage() {
  const { toast } = useToast();

  const services = [
    { title: 'CadÚnico', icon: FileText, desc: 'Consulta e atualização de dados do Governo Federal.', status: 'Atualizado', statusColor: 'text-green-500' },
    { title: 'Bolsa Família', icon: Heart, desc: 'Extrato de pagamentos e calendário municipal.', status: 'Ativo', statusColor: 'text-blue-500' },
    { title: 'Habitação', icon: Home, desc: 'Inscrição e sorteios de programas habitacionais.', status: 'Em análise', statusColor: 'text-orange-500' }
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-8 md:gap-12">
      
      {/* Header with Empathy Design */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
         <div className="space-y-4 md:space-y-6 max-w-2xl text-center md:text-left order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
               <HandHelping className="w-3 h-3" />
               Cuidado Humanizado
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-text-main tracking-tighter uppercase leading-none">Assistência <br /> <span className="text-rose-500">Social.</span></h1>
            <p className="text-base md:text-xl font-medium text-text-muted font-ui leading-relaxed">
               Acesso facilitado a direitos, benefícios e rede de acolhimento para todos os cidadãos em situação de vulnerabilidade.
            </p>
         </div>
         <div className="relative order-1 md:order-2">
            <div className="w-40 h-40 md:w-56 lg:w-64 md:h-56 lg:h-64 bg-rose-100 rounded-full flex items-center justify-center border-4 border-white shadow-2xl relative z-10">
               <Heart className="w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 text-rose-500 animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-rose-200 rounded-full animate-ping opacity-30 scale-110" />
         </div>
      </section>

      {/* Main Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
         {services.map((ser, i) => (
           <motion.div 
             key={i}
             whileHover={{ y: -5 }}
             className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[3.5rem] border-2 border-border shadow-sm flex flex-col justify-between gap-6 md:gap-8 group hover:border-rose-200 transition-all h-full"
           >
              <div className="space-y-4">
                 <div className="w-12 h-12 md:w-14 md:h-14 bg-surface rounded-xl md:rounded-2xl flex items-center justify-center text-rose-500 border-2 border-border group-hover:bg-rose-500 group-hover:text-white transition-all">
                    <ser.icon className="w-6 md:w-7 h-6 md:h-7" />
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-black text-text-main uppercase italic tracking-tighter leading-tight">{ser.title}</h3>
                    <p className="text-[10px] md:text-xs font-ui font-bold text-text-muted leading-relaxed italic">{ser.desc}</p>
                 </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border border-dashed">
                 <span className={cn("text-[8px] md:text-[10px] font-black uppercase tracking-widest", ser.statusColor)}>{ser.status}</span>
                 <button className="text-text-muted hover:text-rose-500 transition-colors">
                    <ChevronRight className="w-5 md:w-6 h-5 md:h-6" />
                 </button>
              </div>
           </motion.div>
         ))}
      </div>

      {/* CRAS Locator Section */}
      <section className="bg-text-main p-8 md:p-14 lg:p-20 rounded-2xl md:rounded-[4rem] text-white flex flex-col lg:flex-row items-center gap-8 md:gap-12 relative overflow-hidden shadow-2xl">
         <div className="relative z-10 flex-1 space-y-4 md:space-y-6 text-center lg:text-left">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-none italic">Rede de Apoio <br/> Próxima a Você.</h2>
            <p className="text-base md:text-lg opacity-70 font-ui font-medium italic">Localize o Centro de Referência de Assistência Social (CRAS) que atende seu bairro e agende um horário para atendimento individual.</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
               <button 
                onClick={() => toast('Buscando CRAS mais próximo baseado no seu GPS...', 'info')}
                className="bg-rose-500 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-black text-[9px] md:text-xs uppercase tracking-widest shadow-xl hover:bg-rose-600 transition-all flex items-center justify-center gap-3"
               >
                  <MapPin className="w-4 h-4" />
                  Localizar Meu CRAS
               </button>
               <button 
                onClick={() => toast('Carregando sistema de agendamento social...', 'info')}
                className="bg-white/10 border-2 border-white/20 px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-white/20 transition-all font-ui font-bold"
               >
                  Agendar Atendimento
               </button>
            </div>
         </div>
         <div className="relative z-10 w-full lg:w-96 aspect-video bg-white/5 rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-md overflow-hidden p-2">
            <div className="w-full h-full bg-slate-200 rounded-xl md:rounded-2xl relative">
                <Image src="https://picsum.photos/seed/map_cras/800/400" fill alt="Map" className="object-cover grayscale contrast-125 opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-6 h-6 md:w-8 md:h-8 bg-rose-500 rounded-full border-2 md:border-4 border-white shadow-xl animate-bounce" />
                </div>
            </div>
         </div>
         <Users className="absolute -right-6 md:-right-10 -bottom-6 md:-bottom-10 w-48 md:w-64 h-48 md:h-64 opacity-5 rotate-12" />
      </section>

      {/* Solidarity Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
         <div className="bg-rose-50 p-8 md:p-12 rounded-2xl md:rounded-[3.5rem] border-2 md:border-4 border-white shadow-xl space-y-6 md:space-y-8 group">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-3xl flex items-center justify-center text-rose-500 border-2 border-rose-100 shadow-sm shrink-0">
               <Gift className="w-7 md:w-8 h-7 md:h-8" />
            </div>
            <div className="space-y-4">
               <h3 className="text-2xl md:text-3xl font-black text-text-main uppercase tracking-tighter leading-none">Banco de Doações</h3>
               <p className="text-xs md:text-sm font-ui font-medium text-text-muted leading-relaxed">
                  Tem móveis, aparelhos ou roupas que não usa mais? Doe para quem precisa. A prefeitura organiza a coleta e distribuição.
               </p>
               <button 
                 onClick={() => toast('Abrindo formulário de oferta de doação...', 'info')}
                 className="btn-tactile bg-rose-500 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-black text-[9px] md:text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
               >
                  Quero Fazer Doação
               </button>
            </div>
         </div>

         <div className="bg-white p-8 md:p-12 rounded-2xl md:rounded-[3.5rem] border-2 border-border shadow-sm flex flex-col justify-between gap-6 md:gap-8 h-auto">
            <div className="space-y-4 text-center sm:text-left">
               <div className="flex items-center justify-center sm:justify-start gap-3">
                  <ShieldCheck className="w-7 md:w-8 h-7 md:h-8 text-rose-500" />
                  <h3 className="text-xl md:text-2xl font-black text-text-main uppercase tracking-tighter">Segurança Alimentar</h3>
               </div>
               <p className="text-xs md:text-sm font-ui font-medium text-text-muted leading-relaxed">
                  Confira o cardápio e locais do Restaurante Popular e Banco de Alimentos. Refeições nutritivas subsidiadas.
               </p>
            </div>
            <div className="space-y-2 md:space-y-3">
               {[
                 { loc: 'Restaurante Central', menu: 'Frango com quiabo e polenta', price: 'R$ 2,00' },
                 { loc: 'Ponto Norte', menu: 'Feijoada light e salada', price: 'R$ 2,00' }
               ].map((res, i) => (
                 <div key={i} className="flex justify-between items-center p-3 md:p-4 bg-surface rounded-xl md:rounded-2xl border-2 border-border border-b-[3px] md:border-b-4 border-b-rose-200">
                    <div className="space-y-0.5">
                       <span className="text-[9px] md:text-[10px] font-black text-rose-800 uppercase italic leading-none">{res.loc}</span>
                       <p className="text-[8px] md:text-[9px] font-bold text-text-muted uppercase tracking-tighter leading-none">{res.menu}</p>
                    </div>
                    <span className="px-2 md:px-3 py-1 bg-rose-500 text-white rounded-lg text-[9px] md:text-[10px] font-black shrink-0">{res.price}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Info Notice */}
      <div className="p-6 md:px-12 md:py-8 bg-surface rounded-2xl md:rounded-[3rem] border-2 border-border border-dashed flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
         <div className="flex items-center gap-4 flex-col md:flex-row">
            <Info className="w-8 h-8 text-rose-500 shrink-0" />
            <p className="text-[9px] md:text-xs font-ui font-bold text-text-muted italic max-w-lg">
               Privacidade de Dados: Suas informações socioeconômicas são tratadas sob sigilo absoluto, acessíveis apenas por assistentes sociais autorizados via Lei Geral de Proteção de Dados (LGPD).
            </p>
         </div>
         <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] font-black text-text-muted uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-border shrink-0">
            <Smartphone className="w-3 md:w-4 h-3 md:h-4 text-rose-500" />
            Central 156 - Opção 4
         </div>
      </div>

    </div>
  );
}
