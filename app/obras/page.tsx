'use client';

import React, { useState } from 'react';
import { 
  HardHat, 
  MapPin, 
  Calendar, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Construction,
  Info,
  ChevronRight,
  TrendingUp,
  Search,
  Zap,
  Activity,
  ArrowRight,
  Vote,
  Target,
  DollarSign,
  Maximize2,
  Camera,
  Hammer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { useRouter } from 'next/navigation';

const works = [
  {
    id: 1,
    title: 'Recapeamento Crítico da Av. Central',
    category: 'Infraestrutura',
    progress: 85,
    status: 'Em andamento',
    date: 'Jun 2026 - Out 2026',
    investment: 'R$ 2.4M',
    location: 'Setor Sul',
    impact: ['+Segurança', '+Mobilidade'],
    image: 'https://picsum.photos/seed/urban_road/800/400'
  },
  {
    id: 2,
    title: 'Hospital Norte: Fase Estrutural',
    category: 'Saúde',
    progress: 32,
    status: 'Em andamento',
    date: 'Jan 2026 - Abr 2027',
    investment: 'R$ 8.9M',
    location: 'Vila Nova / Norte',
    impact: ['+Saúde', '+Emprego'],
    image: 'https://picsum.photos/seed/urban_build/800/400'
  },
  {
    id: 3,
    title: 'Eco-Ciclovia Alvorada',
    category: 'Mobilidade',
    progress: 100,
    status: 'Concluído',
    date: 'Mar 2026 - Jul 2026',
    investment: 'R$ 650k',
    location: 'Jardim Alvorada',
    impact: ['+Lazer', '+Sustentável'],
    image: 'https://picsum.photos/seed/urban_bike/800/400'
  }
];

export default function ObrasPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [filter, setFilter] = useState('Todas');

  const filteredWorks = filter === 'Todas' ? works : works.filter(w => w.status === filter);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-12 bg-background">
      
      {/* City Evolution Hero */}
      <section className="relative overflow-hidden rounded-[4rem] lg:rounded-[5.5rem] bg-text-main text-white p-10 md:p-20 shadow-4xl flex flex-col md:flex-row items-center justify-between border-4 border-white/10 group">
         <div className="relative z-10 max-w-3xl text-center md:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
               <Activity className="w-4 h-4 text-primary" />
               Evolução Urbana em Tempo Real
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter uppercase">
               Muralha <br/> <span className="text-primary">Urbana.</span>
            </h1>
            <p className="text-lg md:text-2xl font-ui font-medium opacity-80 max-w-2xl leading-relaxed border-l-4 border-primary/30 pl-8">
               Acompanhe a transformação física da nossa cidade. Transparência total em investimentos, prazos e impacto social de cada pilar de concreto.
            </p>
         </div>
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 md:mt-0 w-full md:w-auto">
            <div className="bg-white p-8 rounded-[3rem] text-text-main flex flex-col items-center justify-center gap-2 shadow-2xl group/card hover:scale-105 transition-transform">
               <span className="text-5xl font-black tracking-tighter tabular-nums leading-none">14</span>
               <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">Obras em</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Execução</span>
               </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/10 p-8 rounded-[3rem] text-white flex flex-col items-center justify-center gap-2 shadow-inner group/card hover:scale-105 transition-transform">
               <span className="text-3xl font-black tracking-tighter tabular-nums leading-none">R$ 15.2M</span>
               <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">Investimento</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Ativo</span>
               </div>
            </div>
         </div>
         <Construction className="absolute -right-20 -top-20 w-96 h-96 opacity-[0.05] text-white animate-spin-slow rotate-12" />
      </section>

      {/* Control Navigation & Filter */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white p-6 rounded-[3.5rem] border-2 border-border shadow-inner">
         <div className="flex p-2 bg-surface rounded-[2.5rem] w-full lg:w-auto">
            {['Todas', 'Em andamento', 'Concluído'].map((f) => (
               <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                     "flex-1 md:flex-none px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden",
                     filter === f ? "bg-white text-primary shadow-xl border border-primary/10" : "text-text-muted hover:text-text-main"
                  )}
               >
                  {f}
                  {filter === f && (
                     <motion.div layoutId="filter-pill" className="absolute inset-0 bg-primary/5" />
                  )}
               </button>
            ))}
         </div>
         <div className="relative w-full lg:w-[450px] group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
               type="text" 
               placeholder="Busca tática por bairro, ID ou categoria de intervenção..." 
               className="w-full bg-surface border-2 border-border p-6 pl-16 rounded-[2.5rem] outline-none focus:border-primary transition-all font-black placeholder:opacity-40"
            />
         </div>
      </div>

      {/* Evolution Journal (Works Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {filteredWorks.map((work) => (
          <motion.article 
            key={work.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[4.5rem] border-2 border-border shadow-sm overflow-hidden group hover:border-primary transition-all flex flex-col relative"
          >
            <div className="relative h-72 overflow-hidden">
               <Image 
                 src={work.image} 
                 alt={work.title} 
                 fill 
                 className="object-cover group-hover:scale-110 transition-transform duration-[4s] brightness-90 group-hover:brightness-100" 
                 referrerPolicy="no-referrer"
               />
               <div className="absolute top-8 left-8 flex gap-3">
                  <div className={cn(
                    "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-3xl border-2 border-white backdrop-blur",
                    work.status === 'Concluído' ? "bg-green-500 text-white" : "bg-primary text-white"
                  )}>
                    {work.status}
                  </div>
                  <div className="bg-text-main text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-white/20 backdrop-blur shadow-2xl">
                     ID #{work.id}
                  </div>
               </div>
               
               <div className="absolute bottom-6 right-8 flex gap-2">
                  {work.impact.map((tag, i) => (
                     <div key={i} className="bg-white/95 text-text-main px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl border border-border">
                        {tag}
                     </div>
                  ))}
               </div>
            </div>

            <div className="p-10 space-y-10 flex-grow flex flex-col">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-primary border border-border shadow-inner">
                        <HardHat size={28} />
                     </div>
                     <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{work.category}</span>
                  </div>
                  <h3 className="text-3xl font-black text-text-main tracking-tighter leading-tight uppercase group-hover:text-primary transition-colors">{work.title}</h3>
                  <div className="flex items-center gap-3 text-xs font-bold text-text-muted border-l-4 border-primary/10 pl-6">
                     <MapPin className="w-4 h-4 text-primary" /> {work.location}
                  </div>
               </div>

               <div className="space-y-4 bg-surface p-8 rounded-[3rem] border-2 border-border shadow-inner">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Execução Física</span>
                     </div>
                     <span className="text-2xl font-black text-primary tabular-nums">{work.progress}%</span>
                  </div>
                  <div className="w-full h-4 bg-white rounded-full border-2 border-border p-1 overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       whileInView={{ width: `${work.progress}%` }}
                       transition={{ duration: 1.5, type: 'spring' }}
                       className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.3)]" 
                     />
                  </div>
                  <div className="flex justify-between text-[9px] font-black text-text-muted uppercase tracking-tighter">
                     <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-primary" />
                        Início em Jan/2026
                     </div>
                     <div className="flex items-center gap-2">
                        Previsão Set/2026
                        <Clock size={14} className="text-primary" />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                        <DollarSign size={12} className="text-primary" />
                        Recurso Alocado
                     </p>
                     <p className="font-black text-text-main text-2xl tracking-tighter">{work.investment}</p>
                  </div>
                  <div className="flex items-end justify-end">
                     <div className="flex -space-x-4">
                        {[1, 2, 3].map(i => (
                           <div key={i} className="w-12 h-12 rounded-2xl bg-surface border-4 border-white flex items-center justify-center text-primary shadow-lg ring-2 ring-primary/5">
                              <Hammer size={20} />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 pt-6 mt-auto">
                  <button 
                    onClick={() => toast('Acessando terminal técnico de engenharia (BIM/CAD)...', 'info')}
                    className="flex-grow bg-text-main text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-3xl hover:bg-primary transition-all flex items-center justify-center gap-3 group/btn"
                  >
                    Dossiê Técnico
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => toast('Iniciando transmissão de câmera pública de fiscalização...', 'success')}
                    className="w-20 h-20 bg-surface border-2 border-border rounded-[2.5rem] flex flex-col items-center justify-center text-text-muted hover:text-rose-500 hover:border-rose-200 transition-all shadow-Tactile active:scale-90"
                  >
                    <Camera size={28} />
                    <span className="text-[7px] font-black uppercase mt-1">Live Feed</span>
                  </button>
               </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Digital Choice: Future Projects */}
      <section className="bg-primary p-12 md:p-24 rounded-[5rem] lg:rounded-[7rem] text-white space-y-12 relative overflow-hidden group shadow-4xl border-4 border-white/10">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-6 max-w-2xl text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur shadow-inner">
                  <Vote className="w-4 h-4 text-white" />
                  Democracia em Construção
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">Escolha <br/> <span className="text-rose-200">Digital.</span></h2>
               <p className="text-lg md:text-xl font-ui font-medium opacity-80 leading-relaxed">
                  Para onde a cidade deve avançar? Vote na próxima intervenção do seu bairro ou sugira melhorias diretas via DigitalID.
               </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/20 shadow-4xl text-center space-y-8 w-full md:w-auto min-w-[320px]">
               <div className="space-y-4">
                  <h4 className="text-xl font-black uppercase leading-none">Próxima Parada</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Escolha o foco do seu distrito</p>
               </div>
               <div className="space-y-3">
                  {[
                    { label: 'Revitalização de Praças', votes: 1242 },
                    { label: 'Iluminação em LED 2.0', votes: 854 },
                    { label: 'Painéis Solares Públicos', votes: 210 }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                       <span className="text-xs font-black uppercase">{item.label}</span>
                       <span className="text-[9px] font-black bg-white/20 px-2 py-1 rounded-lg">{item.votes}</span>
                    </div>
                  ))}
               </div>
               <button className="w-full py-5 bg-white text-primary rounded-[2.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:brightness-110 active:scale-95 transition-all">Votar no Bairro</button>
            </div>
         </div>
         <Activity className="absolute -left-20 -bottom-20 w-[600px] h-[600px] opacity-[0.03] text-white" />
      </section>

      {/* Support CTA */}
      <div className="px-10 py-10 bg-surface rounded-[4rem] border-2 border-border border-dashed flex flex-col md:flex-row items-center justify-between gap-10 group">
         <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-primary shadow-inner border border-border shrink-0 group-hover:rotate-12 transition-transform duration-500">
               <Info size={36} />
            </div>
            <div className="space-y-1">
               <h4 className="text-xl font-black text-text-main uppercase leading-none">Canal de Ouvidoria Integrada</h4>
               <p className="text-xs font-ui font-medium text-text-muted max-w-lg">
                  Problemas em obras em andamento? O Digital Radar monitora diários de obra e denúncias de má execução em tempo real.
               </p>
            </div>
         </div>
         <button 
           onClick={() => router.push('/ouvidoria')}
           className="w-full md:w-auto bg-text-main text-white px-14 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all flex items-center gap-4 justify-center"
         >
            Relatar Incidente
            <ChevronRight size={18} />
         </button>
      </div>

    </div>
  );
}
