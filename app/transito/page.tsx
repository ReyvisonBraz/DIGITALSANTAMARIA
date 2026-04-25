'use client';

import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  Bus, 
  Zap, 
  ShieldAlert, 
  Clock, 
  Map as MapIcon, 
  ChevronRight,
  TrendingUp,
  Info,
  Car,
  Wifi,
  Search,
  Plus,
  ArrowRight,
  ParkingCircle,
  CreditCard,
  Camera,
  Activity,
  Filter,
  Layers,
  LocateFixed,
  Maximize2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import SidePanel from '@/components/ui/SidePanel';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';

const busLines = [
  { id: '101', name: 'Circular Centro', status: 'Normal', delay: '0 min', color: 'bg-primary' },
  { id: '205', name: 'Vila Nova / Terminal', status: 'Atrasado', delay: '8 min', color: 'bg-amber-500' },
  { id: '310', name: 'Sul Expresso', status: 'Normal', delay: '2 min', color: 'bg-primary' },
  { id: '440', name: 'Jardim Alvorada', status: 'Normal', delay: '0 min', color: 'bg-primary' }
];

const trafficAlerts = [
  { id: 1, title: 'Acidente Grave', location: 'Av. Brasil, esq c/ Rua 7', severity: 'urgent', desc: 'Trânsito bloqueado sentido Centro. Use rotas alternativas.' },
  { id: 2, title: 'Obras de Pavimentação', location: 'Rua das Palmeiras', severity: 'warning', desc: 'Meia pista liberada. Lentidão no local.' }
];

const cameras = [
    { id: '1', name: 'Câmera 04 - Av. Central', location: 'Centro', image: 'https://picsum.photos/seed/trans_cam1/800/600' },
    { id: '2', name: 'Câmera 12 - Trevo Sul', location: 'Bairro Sul', image: 'https://picsum.photos/seed/trans_cam2/800/600' },
];

export default function TransitoPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'movimento' | 'logistica' | 'fines'>('movimento');
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      
      {/* Mobility Control Center Sidebar */}
      <aside className="w-full md:w-[450px] lg:w-[500px] bg-white border-r-2 border-border flex flex-col z-40 relative shadow-2xl">
         
         <div className="p-8 space-y-8 border-b-2 border-border bg-white sticky top-0 z-20">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">
                     <Navigation className="w-3.5 h-3.5" />
                     Mobilidade Inteligente
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] font-black text-green-500 uppercase leading-none">
                     <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                     Sistema Online
                  </div>
               </div>
               <h1 className="text-4xl lg:text-5xl font-black text-text-main tracking-tighter uppercase leading-[0.85]">Mover <br/> <span className="text-primary">Santa Maria.</span></h1>
            </div>

            {/* Main Tabs Navigation */}
            <div className="flex p-1.5 bg-surface rounded-[2rem] border-2 border-border shadow-inner">
               {(['movimento', 'logistica', 'fines'] as const).map((tab) => (
                  <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={cn(
                        "flex-1 py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all relative overflow-hidden",
                        activeTab === tab ? "bg-white text-primary shadow-xl border border-primary/10" : "text-text-muted hover:text-text-main"
                     )}
                  >
                     <span className="relative z-10">
                        {tab === 'movimento' ? 'Trânsito' : tab === 'logistica' ? 'Transporte' : 'Multas'}
                     </span>
                     {activeTab === tab && (
                        <motion.div layoutId="tab-pill" className="absolute inset-0 bg-primary/5" />
                     )}
                  </button>
               ))}
            </div>
         </div>

         <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar bg-surface/30">
            
            <AnimatePresence mode="wait">
               {activeTab === 'movimento' && (
                  <motion.div 
                     key="movimento"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 10 }}
                     className="space-y-10"
                  >
                     {/* Parking Widget */}
                     <div className="bg-primary p-8 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden group shadow-2xl">
                        <div className="relative z-10 flex flex-col gap-6">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur shadow-inner">
                                 <ParkingCircle className="w-8 h-8" />
                              </div>
                              <div className="space-y-0.5">
                                 <h3 className="text-2xl font-black uppercase leading-none">Estacionar Digital.</h3>
                                 <p className="text-[10px] opacity-60 font-ui font-medium">Seu DigitalID possui R$ 24,50 em bônus.</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <button className="flex-1 py-4 bg-white text-primary rounded-2xl font-black text-[9px] uppercase tracking-widest hover:brightness-95 transition-all shadow-xl">Ativar Agora</button>
                              <button className="flex-1 py-4 bg-white/10 border border-white/20 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white/20 transition-all">+ Saldo</button>
                           </div>
                        </div>
                        <Car className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.08] rotate-12 group-hover:scale-110 transition-transform" />
                     </div>

                     {/* Traffic Alerts */}
                     <div className="space-y-6">
                        <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2 px-2">
                           <AlertTriangle className="w-4 h-4 text-primary" />
                           Painel de Ocorrências
                        </h3>
                        <div className="space-y-4">
                           {trafficAlerts.map(alert => (
                              <div key={alert.id} className={cn(
                                 "bg-white p-6 rounded-[2.5rem] border-2 transition-all group relative overflow-hidden",
                                 alert.severity === 'urgent' ? "border-rose-500/20 shadow-rose-500/5 shadow-xl" : "border-amber-500/20 shadow-amber-500/5 shadow-xl"
                              )}>
                                 <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                       <h4 className="text-lg font-black text-text-main uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{alert.title}</h4>
                                       <p className="text-[9px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                          <MapPin className="w-3.5 h-3.5 text-primary" />
                                          {alert.location}
                                       </p>
                                    </div>
                                    <div className={cn(
                                       "w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12",
                                       alert.severity === 'urgent' ? "bg-rose-500" : "bg-amber-500"
                                    )}>
                                       <AlertTriangle size={20} />
                                    </div>
                                 </div>
                                 <p className="text-xs font-ui font-medium text-text-muted leading-relaxed">{alert.desc}</p>
                                 <button className="mt-4 text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                                    Ver Detalhes do Perímetro
                                    <ArrowRight size={10} />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'logistica' && (
                  <motion.div 
                     key="logistica"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 10 }}
                     className="space-y-10"
                  >
                     <div className="bg-text-main p-8 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden shadow-2xl group">
                        <div className="relative z-10 space-y-4">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur shadow-inner">
                                 <Bus className="w-8 h-8 text-primary" />
                              </div>
                              <div className="space-y-0.5">
                                 <h3 className="text-2xl font-black tracking-tighter leading-none uppercase">Trânsito <br/> Inteligente.</h3>
                              </div>
                           </div>
                           <p className="text-xs font-ui font-medium opacity-60">Linha 101 - Circular Centro está a 4 minutos do seu ponto favorito.</p>
                        </div>
                        <Activity className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.05] group-hover:scale-110 transition-transform pointer-events-none" />
                     </div>

                     <div className="space-y-5">
                        <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2 px-2">
                           <Clock className="w-4 h-4 text-primary" />
                           Linhas & Horários
                        </h3>
                        <div className="space-y-3">
                           {busLines.map(line => (
                              <div key={line.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-border hover:border-primary group cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow-xl">
                                 <div className="flex items-center gap-5">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform", line.color)}>
                                       {line.id}
                                    </div>
                                    <div className="space-y-0.5">
                                       <h4 className="text-lg font-black text-text-main uppercase leading-tight group-hover:text-primary transition-colors tracking-tight">{line.name}</h4>
                                       <div className={cn(
                                          "flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest",
                                          line.status === 'Normal' ? 'text-green-600' : 'text-amber-600'
                                       )}>
                                          {line.status === 'Normal' ? <Wifi className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                                          {line.status === 'Normal' ? 'Em horário' : `Retardo: ${line.delay}`}
                                       </div>
                                    </div>
                                 </div>
                                 <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'fines' && (
                  <motion.div 
                     key="fines"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 10 }}
                     className="space-y-10"
                  >
                     <div className="bg-rose-50 p-8 rounded-[3.5rem] border-2 border-rose-200 border-dashed space-y-6 relative overflow-hidden group">
                        <div className="flex items-center gap-4 relative z-10">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-rose-200 shadow-inner text-rose-500">
                              <ShieldAlert className="w-8 h-8" />
                           </div>
                           <div className="space-y-0.5">
                              <h3 className="text-2xl font-black text-rose-600 uppercase tracking-tighter italic leading-none">Infrações Ativas.</h3>
                              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Veículo: ABC-1234</p>
                           </div>
                        </div>
                        <p className="text-xs font-ui font-medium text-text-muted leading-relaxed relative z-10">
                           Você possui <strong>01</strong> infração pendente relacionada a excesso de velocidade registrada em 04/11/2026.
                        </p>
                        <button className="relative z-10 w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-rose-700 transition-all flex items-center justify-center gap-3">
                           <CreditCard size={16} />
                           Pagar com 20% de Desconto
                        </button>
                     </div>

                     <div className="bg-white p-8 rounded-[3rem] border-2 border-border space-y-4">
                        <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                           <Info className="w-4 h-4 text-primary" />
                           Educação para o Trânsito
                        </h4>
                        <p className="text-xs font-ui font-medium text-text-muted leading-relaxed border-l-2 border-primary/20 pl-4">
                           Dirigir de forma defensiva reduz o risco em até 80%. Mantenha seu DigitalID Score alto para garantir benefícios no IPVA.
                        </p>
                        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                           Manual do Condutor DSM
                           <ArrowRight size={10} />
                        </button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

         </div>
      </aside>

      {/* Mobility Radar View (Main View) */}
      <section className="flex-grow relative bg-slate-900 overflow-hidden">
         <div className="absolute inset-0 z-0">
            <Image 
               src="https://picsum.photos/seed/trafficgrid/1920/1080" 
               alt="Grid de Mobilidade" 
               fill 
               className="object-cover grayscale contrast-150 brightness-50 opacity-40 group-hover:scale-105 transition-transform duration-[60s]"
               referrerPolicy="no-referrer"
            />
            {/* Tech Layers */}
            <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Simulated Live Bus Tracking */}
            <motion.div 
               animate={{ x: [0, 150, 80, 0], y: [0, 40, 90, 0] }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="absolute top-1/2 left-1/3 z-10"
            >
               <div className="relative group cursor-pointer">
                  <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                  <div className="bg-primary text-white p-3 rounded-2xl shadow-2xl border-2 border-white/50 group-hover:scale-110 transition-transform">
                     <Bus size={24} />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-black/80 backdrop-blur border border-white/10 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 pointer-events-none">
                     <p className="text-[10px] font-black text-primary uppercase whitespace-nowrap">LINHA 101 // BUS_42</p>
                     <p className="text-[8px] font-bold text-white/50 uppercase leading-none mt-1">CAPACIDADE: 62% // 40KM/H</p>
                  </div>
               </div>
            </motion.div>

            {/* Simulated Incident Marker */}
            <div className="absolute top-1/4 left-2/3 z-10">
               <div className="relative group cursor-pointer">
                  <div className="absolute -inset-4 bg-rose-500/20 rounded-full animate-ping" />
                  <div className="bg-rose-600 text-white p-3 rounded-full shadow-2xl border-2 border-white/50 animate-bounce-slow">
                     <AlertTriangle size={24} />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black/80 backdrop-blur border border-white/10 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 pointer-events-none">
                     <p className="text-[10px] font-black text-rose-500 uppercase whitespace-nowrap underline decoration-rose-500/30 underline-offset-4">ACIDENTE_GRAVE // SETOR_NOSTE</p>
                     <p className="text-[8px] font-bold text-white/50 uppercase leading-none mt-1">BLOQUEIO TOTAL // USE ROTA SETOR_OESTE</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Overlay Controls */}
         <div className="absolute top-10 right-10 z-20 flex flex-col gap-4">
            <div className="bg-black/60 backdrop-blur-xl p-8 rounded-[3.5rem] border border-white/10 shadow-3xl space-y-6 max-w-xs">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <Camera className="w-4 h-4 text-primary" />
                     Live Viewpoint
                  </h4>
                  <Maximize2 size={12} className="text-white/40 cursor-pointer hover:text-white" />
               </div>
               
               <div className="h-40 bg-black rounded-3xl overflow-hidden relative border border-white/10 shadow-inner group cursor-pointer" onClick={() => setSelectedCamera('1')}>
                  <Image 
                     src="https://picsum.photos/seed/trafficview/400/300" 
                     alt="Monitoring" 
                     fill 
                     className="object-cover opacity-60 grayscale brightness-75 group-hover:scale-110 transition-transform duration-[20s]"
                     referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[8px] font-mono font-black text-white uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur">CAM_FIXED_04 // ACTIVE</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Plus className="text-white w-10 h-10" />
                  </div>
               </div>
               <p className="text-[9px] font-ui font-medium text-white/40 leading-snug">Av. Central, Sentido Sul. Transmissão prioritária de fluxo veicular.</p>
            </div>

            <div className="bg-black/60 backdrop-blur-xl p-4 rounded-3xl border border-white/10 flex flex-col gap-4">
               {[
                 { icon: Search, label: 'Busca' },
                 { icon: Layers, label: 'Camadas' },
                 { icon: LocateFixed, label: 'Recalibrar' },
               ].map((tool, i) => (
                  <button key={i} className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all shadow-inner group">
                     <tool.icon size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
               ))}
               <div className="w-full h-[1px] bg-white/10" />
               <button 
                  onClick={() => toast('Iniciando protocolo de reparo asfáltico (Ciclo de 48h)...', 'info')}
                  className="p-4 bg-primary hover:bg-primary/80 text-white rounded-2xl shadow-2xl animate-pulse group"
               >
                  <AlertCircle size={24} className="group-hover:scale-110 transition-transform" />
               </button>
            </div>
         </div>

         {/* Bottom Status Bar Grid */}
         <div className="absolute bottom-10 left-10 right-10 z-20 flex flex-col md:flex-row items-end justify-between gap-8 pointer-events-none">
            <div className="pointer-events-auto bg-black/60 backdrop-blur-xl p-6 rounded-[3rem] border border-white/10 flex items-center gap-8 shadow-4xl animate-in fade-in slide-in-from-bottom duration-700">
               <div className="flex items-center gap-4 pr-8 border-r border-white/10">
                  <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl">
                     <TrendingUp size={28} />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">Status da Cidade</p>
                     <p className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Fluxo Moderado</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Vel. Sistêmica</span>
                     <p className="text-xl font-black text-white leading-none">42.8 km/h</p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Veículos Ativos</span>
                     <p className="text-xl font-black text-white leading-none">8,420</p>
                  </div>
               </div>
            </div>

            <div className="pointer-events-auto flex gap-4">
               <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-5 border-2 border-primary/20">
                  <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/10">
                     <Filter size={24} />
                  </div>
                  <div className="space-y-0.5 text-right hidden sm:block">
                     <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">Filtros de Map</p>
                     <p className="text-sm font-black text-text-main uppercase leading-none">Vigilância Total</p>
                  </div>
                  <ChevronRight size={20} className="text-text-muted" />
               </div>
            </div>
         </div>

      </section>

      {/* SidePanel: Detailed Live Feed */}
      <SidePanel
         isOpen={!!selectedCamera}
         onClose={() => setSelectedCamera(null)}
         title="Monitoramento DSM"
      >
         {selectedCamera && (
            <div className="p-8 space-y-10">
               <div className="relative aspect-video rounded-[3rem] overflow-hidden border-4 border-text-main shadow-4xl group">
                  <Image 
                     src={cameras.find(c => c.id === selectedCamera)?.image || ""} 
                     alt="Camera Feed" 
                     fill 
                     className="object-cover"
                     referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 flex items-center gap-3 bg-rose-600 px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest animate-pulse border-2 border-white/20">
                     <div className="w-2 h-2 bg-white rounded-full" />
                     STREAMING_ACTIVE
                  </div>
                  <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-mono text-white/80 border border-white/10">
                     UTC: {new Date().toLocaleTimeString()}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">
                        NÓ_SENSORIAL_04
                     </div>
                     <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter leading-none">
                        {cameras.find(c => c.id === selectedCamera)?.name}
                     </h3>
                     <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
                        <MapPin size={14} className="text-primary" />
                        {cameras.find(c => c.id === selectedCamera)?.location} — Setor Central
                     </div>
                  </div>
                  <p className="text-sm font-ui font-medium text-text-muted leading-relaxed border-l-4 border-surface pl-6">
                     Utilize este canal para verificar a ocupação das faixas e planejar sua rota em conformidade com o Plano Municipal de Mobilidade 2026.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-surface rounded-[2.5rem] border-2 border-border space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Ocupação G1</span>
                        <TrendingUp size={12} className="text-emerald-500" />
                     </div>
                     <div className="text-2xl font-black text-text-main tabular-nums leading-none">42%</div>
                  </div>
                  <div className="p-5 bg-surface rounded-[2.5rem] border-2 border-border space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Delay_Hops</span>
                        <Activity size={12} className="text-primary" />
                     </div>
                     <div className="text-2xl font-black text-text-main tabular-nums leading-none">12ms</div>
                  </div>
               </div>

               <button 
                  onClick={() => toast('Relatório de infraestrutura rodoviária aberto. Descreva o problema.', 'info')}
                  className="w-full bg-text-main text-white py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
               >
                  Relatar Problema Local
                  <ShieldAlert className="w-5 h-5" />
               </button>
            </div>
         )}
      </SidePanel>
    </div>
  );
}
