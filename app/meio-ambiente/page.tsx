'use client';

import React, { useState } from 'react';
import { 
  Trees, 
  Trash2, 
  Leaf, 
  AlertTriangle, 
  Calendar, 
  Droplets, 
  Wind, 
  Sun,
  MapPin,
  ChevronRight,
  Info,
  Camera,
  Heart,
  Search,
  Zap,
  TrendingUp,
  CloudSun,
  Bell,
  Thermometer,
  CloudRain,
  Activity,
  ArrowRight,
  Clock,
  Recycle,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';

export default function MeioAmbientePage() {
  const { toast } = useToast();
  const [address, setAddress] = useState('');
  const [activeMetric, setActiveMetric] = useState<string | null>('Ar');

  const collectionDays = [
    { type: 'Orgânico', days: 'Seg, Qua, Sex', time: 'Noturno (19h)', color: 'bg-emerald-500', icon: Trash2 },
    { type: 'Reciclável', days: 'Terça-feira', time: 'Diurno (08h)', color: 'bg-blue-500', icon: Recycle },
    { type: 'Cata-Treco', days: 'Setor Norte - Sáb', time: 'Agendamento', color: 'bg-orange-500', icon: Zap }
  ];

  const metrics = [
     { id: 'Ar', label: 'Qualidade do Ar', val: '84', status: 'Excelente', color: 'text-emerald-500', icon: Wind },
     { id: 'UV', label: 'Índice UV', val: '4', status: 'Moderado', color: 'text-amber-500', icon: Sun },
     { id: 'Ruído', label: 'Nível Sonoro', val: '52', status: 'Baixo', color: 'text-blue-500', icon: Activity },
  ];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-12 bg-background">
      
      {/* Eco-Intelligence Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
         <div className="lg:col-span-12 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
               <div className="space-y-4 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                     <Globe className="w-4 h-4" />
                     Vigilância Climática Municipal
                  </div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-main tracking-tighter uppercase leading-[0.85]">Meio <br /> <span className="text-emerald-500">Ambiente.</span></h1>
                  <p className="text-base md:text-xl font-medium text-text-muted font-ui max-w-2xl leading-relaxed">
                     Ecossistema de dados ambientais em tempo real. Monitore a saúde do seu bairro e participe ativamente da preservação municipal.
                  </p>
               </div>

               {/* Live Sensor Widget */}
               <div className="bg-white p-8 rounded-[3.5rem] border-2 border-border shadow-xl flex gap-10 min-w-[320px] relative overflow-hidden group">
                  <div className="flex flex-col justify-between relative z-10">
                     <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Status do Ar</span>
                        <div className="flex items-center gap-2">
                           <p className="text-4xl font-black text-emerald-500 tracking-tighter tabular-nums leading-none">84/100</p>
                           <TrendingUp className="w-4 h-4 text-emerald-500" />
                        </div>
                     </div>
                     <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                        Ver Mapa de Sensores
                        <ArrowRight size={12} />
                     </button>
                  </div>
                  <div className="w-24 h-24 bg-surface rounded-[2rem] border-2 border-border flex items-center justify-center relative">
                     <CloudSun className="w-12 h-12 text-emerald-500 animate-pulse" />
                     <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <Trees className="absolute -right-6 -bottom-6 w-32 h-32 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform" />
               </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {metrics.map((item) => (
                  <button 
                     key={item.id}
                     onClick={() => setActiveMetric(item.id)}
                     className={cn(
                        "p-6 rounded-[2.5rem] border-2 transition-all flex items-center gap-5 text-left group",
                        activeMetric === item.id ? "bg-white border-emerald-500 shadow-lg" : "bg-white border-border hover:border-emerald-200"
                     )}
                  >
                     <div className={cn("w-14 h-14 rounded-2xl bg-surface flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner border border-border/50", item.color)}>
                        <item.icon size={28} />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{item.label}</p>
                        <p className="text-xl font-black text-text-main tabular-nums leading-none">{item.val}</p>
                        <p className={cn("text-[9px] font-black uppercase tracking-tighter opacity-60", item.color)}>{item.status}</p>
                     </div>
                  </button>
               ))}
               <div className="p-6 bg-emerald-600 rounded-[2.5rem] text-white flex items-center justify-between group cursor-pointer hover:brightness-110 transition-all border-4 border-white/10 shadow-xl">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Cobertura Verde</p>
                     <p className="text-2xl font-black tabular-nums leading-none">22.4%</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur shadow-inner">
                     <Trees size={24} />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Waste Logistics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         <main className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 md:p-14 rounded-[4rem] border-2 border-border shadow-sm space-y-10 group overflow-hidden relative">
               <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                  <div className="space-y-2 text-center md:text-left">
                     <h2 className="text-3xl md:text-4xl font-black text-text-main uppercase tracking-tighter flex items-center justify-center md:justify-start gap-4 leading-none">
                        <Trash2 className="w-10 h-10 text-emerald-500" />
                        Logística de <br/> Resíduos Urbano.
                     </h2>
                     <p className="text-text-muted font-ui font-medium opacity-70">Rastreabilidade e agenda inteligente da sua região.</p>
                  </div>
                  
                  <div className="relative w-full md:w-80">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-emerald-500 transition-colors" />
                     <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Busca por Logradouro..."
                        className="w-full bg-surface border-2 border-border p-5 pl-14 rounded-2xl outline-none focus:border-emerald-500 transition-all font-black text-sm placeholder:opacity-50 shadow-inner"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {collectionDays.map((col, idx) => (
                    <div key={idx} className="p-8 rounded-[3rem] bg-white border-2 border-border hover:border-emerald-500 transition-all group/card flex flex-col gap-6 shadow-sm hover:shadow-xl group">
                       <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover/card:scale-110", col.color)}>
                          <col.icon size={24} />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-xl font-black text-text-main uppercase italic leading-none">{col.type}</h4>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{col.days}</p>
                          <div className="flex items-center gap-2 mt-2 py-2 border-t border-border/50">
                             <Clock size={12} className="text-text-muted" />
                             <span className="text-[9px] font-bold text-text-muted uppercase leading-none">{col.time}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-border/50 relative z-10">
                  <button 
                     onClick={() => toast('Registrando para receber alertas SMS/Push...', 'success')}
                     className="flex-grow py-5 bg-text-main text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                  >
                     <Bell className="w-5 h-5" />
                     Ativar Notificação de Proximidade
                  </button>
                  <button className="px-10 py-5 bg-surface border-2 border-border rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-text-muted hover:border-primary transition-all">
                     Ver Rota
                  </button>
               </div>

               <Globe className="absolute -right-20 -bottom-20 w-80 h-80 opacity-[0.02] -rotate-12 pointer-events-none group-hover:scale-110 transition-transform" />
            </div>
         </main>

         {/* Eco-Sidebar */}
         <aside className="lg:col-span-4 space-y-8">
            <div className="bg-emerald-600 p-8 md:p-10 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden group shadow-3xl border-2 border-white/5">
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur shadow-inner">
                         <Trees size={32} />
                      </div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Muda de <br/> Cidadania.</h3>
                   </div>
                   <p className="text-xs font-ui font-medium italic opacity-70 leading-relaxed">Solicite o plantio em frente ao seu imóvel ou adote um jardim público para manutenção colaborativa.</p>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2">
                         <span>Meta de Plantio 2026</span>
                         <span>72%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="w-[72%] h-full bg-white shadow-[0_0_10px_white]" />
                      </div>
                   </div>
                   <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl">Quero Adotar</button>
                </div>
                <Leaf className="absolute -right-12 -top-12 w-48 h-48 opacity-[0.05] rotate-45" />
            </div>

            <div className="bg-white p-8 rounded-[3rem] border-2 border-border space-y-6 shadow-sm">
               <div className="flex items-center gap-3">
                  <Info className="w-6 h-6 text-emerald-500" />
                  <h4 className="font-black text-text-main uppercase text-sm tracking-tight italic leading-none">Dica Sustentável</h4>
               </div>
               <p className="text-xs font-ui font-medium text-text-muted leading-relaxed italic border-l-2 border-emerald-500/20 pl-4">
                  Descarte de eletrônicos possui coleta especial domiciliar sob agendamento prévio no DSM Empregos (MEI).
               </p>
               <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Manual de Descarte</button>
            </div>
         </aside>
      </div>

      {/* Environmental Response Center */}
      <section className="bg-rose-50 p-10 md:p-16 rounded-[4rem] border-4 border-white shadow-3xl space-y-10 relative overflow-hidden group">
         <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
            <div className="space-y-4 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-500/20">
                  <AlertTriangle size={14} />
                  Canal de Resposta Rápida
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-rose-600 tracking-tighter uppercase leading-[0.9]">Centro de <br/> Eco-Denúncia.</h2>
               <p className="text-base text-text-muted font-ui font-medium leading-relaxed max-w-xl">
                  O Digital Santa Maria protege nossa fauna e flora. Reporte crimes ambientais, descarte irregular de resíduos químicos ou queimadas com geolocalização instantânea.
               </p>
            </div>
            
            <div className="w-full md:w-auto flex flex-col gap-4">
               <button 
                  onClick={() => toast('Iniciando protocolo de eco-denúncia...', 'info')}
                  className="bg-rose-600 text-white px-12 py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-rose-700 transition-all flex items-center justify-center gap-4"
               >
                  <Camera size={24} />
                  Reportar Agora
                  <ChevronRight size={20} />
               </button>
               <div className="flex justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-rose-500 rounded-full" />
                     <span className="text-[9px] font-black text-rose-600 uppercase">Anonimato Garantido</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-rose-500 rounded-full" />
                     <span className="text-[9px] font-black text-rose-600 uppercase">Integrado ao DigitalID</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {[
               { label: 'Poluição Sonora', desc: 'Acima do volume permitido.' },
               { label: 'Abandono Animal', desc: 'Maus tratos ou descarte.' },
               { label: 'Queimadas', desc: 'Fumaça em áreas urbanas.' },
               { label: 'Poda irregular', desc: 'Corte sem autorização.' }
            ].map((item, i) => (
               <div key={i} className="p-6 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-rose-200 hover:bg-white transition-all cursor-pointer group/item flex flex-col gap-4">
                  <AlertTriangle className="w-6 h-6 text-rose-500 group-hover/item:scale-110 transition-transform" />
                  <div className="space-y-1">
                     <h4 className="text-xs font-black text-rose-700 uppercase italic leading-none">{item.label}</h4>
                     <p className="text-[9px] font-bold text-text-muted italic leading-none uppercase">{item.desc}</p>
                  </div>
               </div>
            ))}
         </div>
         
         <Zap className="absolute -left-16 -top-16 w-80 h-80 text-rose-500 opacity-[0.03] -rotate-12 pointer-events-none group-hover:scale-105 transition-transform duration-[10s]" />
      </section>

    </div>
  );
}
