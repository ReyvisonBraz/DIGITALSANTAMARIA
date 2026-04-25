'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AlertBanner from '@/components/AlertBanner';
import { 
  Briefcase, 
  Store, 
  Users, 
  Activity, 
  Megaphone,
  ArrowRight,
  AlertCircle,
  DollarSign,
  Navigation,
  School,
  Zap,
  Award,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  ChevronRight,
  Target,
  Sparkles,
  ShieldCheck,
  Radar,
  Wind,
  Search,
  Bell,
  Heart,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Radio,
  FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import GlobalStatsModal from '@/components/GlobalStatsModal';
import SearchModal from '@/components/SearchModal';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userStats = {
    points: 1250,
    score: 842,
    level: 'Cidadão Elite',
    impact: '82%',
    activeProtocols: 3
  };

  const dashboardModules = [
    { icon: Briefcase, label: 'Emprego', href: '/empregos', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Activity, label: 'Saúde', href: '/saude', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Navigation, label: 'Trânsito', href: '/transito', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: ShieldCheck, label: 'Segurança', href: '/seguranca', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { icon: DollarSign, label: 'Tributos', href: '/tributos', color: 'text-amber-600', bg: 'bg-amber-600/10' },
    { icon: School, label: 'Educação', href: '/educacao', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col w-full min-h-screen bg-background pb-24 md:pb-12 overflow-x-hidden">
      
      {/* Dynamic Security & Alert Header */}
      <AlertBanner 
        message="VIGILÂNCIA METEOROLÓGICA: Previsão de ventos fortes nível 2 nas próximas 6h. Estacionamento em áreas abertas não recomendado."
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-12 py-8 md:py-12 space-y-12 md:space-y-16">
        
        {/* Civic Control Dashboard Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
           
            {/* Primary User Module */}
            <div className="lg:col-span-8 bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl group transition-all duration-500">
               <div className="relative z-10 flex flex-col justify-between h-full gap-8">
                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl border-2 border-white/10 p-1 backdrop-blur-sm group-hover:scale-105 transition-transform">
                           <Image 
                              src={user?.photoURL || "https://picsum.photos/seed/user_civic/200/200"} 
                              alt="User" 
                              width={80} 
                              height={80} 
                              className="rounded-xl object-cover w-full h-full"
                           />
                        </div>
                        <div className="space-y-0.5">
                           <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-none font-display">
                              Olá, {user?.displayName?.split(' ')[0] || 'Cidadão'}.
                           </h2>
                           <div className="flex items-center gap-3">
                              <div className="px-2.5 py-0.5 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">
                                 {userStats.level}
                              </div>
                              <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">{userStats.points} DigitalPoints</span>
                           </div>
                        </div>
                     </div>
                     
                     <p className="text-lg md:text-xl font-medium text-slate-300 max-w-xl leading-relaxed border-l-2 border-primary/30 pl-6">
                        Seu ecossistema urbano centralizado. Gerencie sua vida pública com precisão através do DigitalID.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <button onClick={() => router.push('/ouvidoria')} className="bg-primary p-5 rounded-3xl flex flex-col gap-3 text-left shadow-lg hover:brightness-110 active:scale-95 transition-all">
                        <Megaphone size={20} className="text-white/90" />
                        <div className="space-y-0.5">
                           <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Solicitação</span>
                           <p className="text-base font-bold tracking-tight">Nova Voz</p>
                        </div>
                     </button>
                     <button onClick={() => setIsStatsOpen(true)} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex flex-col gap-3 text-left hover:bg-white/10 active:scale-95 transition-all">
                        <Radar size={20} className="text-white/70" />
                        <div className="space-y-0.5">
                           <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Radar Urbano</span>
                           <p className="text-base font-bold tracking-tight">Minha Gestão</p>
                        </div>
                     </button>
                     <button onClick={() => toast('Sincronizando protocolos ativos com o DigitalID...', 'info')} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex flex-col gap-3 text-left hover:bg-white/10 active:scale-95 transition-all">
                        <Activity size={20} className="text-white/70" />
                        <div className="space-y-0.5">
                           <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Protocolos</span>
                           <p className="text-base font-bold tracking-tight">{userStats.activeProtocols} Ativos</p>
                        </div>
                     </button>
                  </div>
               </div>
               <Zap className="deco-fade absolute -right-8 -bottom-8 w-64 h-64 text-white -rotate-12 pointer-events-none" />
            </div>

           {/* DigitalID Score Module */}
           <div className="lg:col-span-4 bg-white rounded-[3rem] border border-border p-8 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-primary shadow-inner">
                       <Award size={24} />
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">DigitalID Score</p>
                       <p className="text-2xl font-bold text-text-main tracking-tight leading-none tabular-nums group-hover:text-primary transition-colors">{userStats.score}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <p className="text-sm font-medium text-text-muted leading-relaxed">Seu impacto social está 12% acima da média do bairro.</p>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '84%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="h-full bg-primary"
                       />
                    </div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">Nível Master: +158 pts para Platina</p>
                 </div>
              </div>

              <div className="mt-8 space-y-4">
                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-2">
                       <span className="text-[8px] font-black text-text-muted uppercase">Transparência</span>
                       <span className="text-[10px] font-black text-emerald-500 uppercase">Confiável</span>
                    </div>
                    <div className="p-4 bg-surface rounded-2xl border border-border flex items-center justify-between group-hover:bg-primary/5 transition-all cursor-pointer">
                       <div className="flex items-center gap-3">
                          <ShieldCheck className="text-primary" size={18} />
                          <span className="text-xs font-black uppercase">Conquistas Ativas</span>
                       </div>
                       <ChevronRight size={16} className="text-text-muted" />
                    </div>
                 </div>
              </div>
              <Activity className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.02] -rotate-12 pointer-events-none" />
           </div>
        </section>

        {/* City Pulse Metrics Grid */}
        <section className="space-y-8">
           <div className="flex items-center justify-between px-4">
              <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                 Cidade em Tempo Real
              </h3>
              <button 
                 onClick={() => setIsStatsOpen(true)}
                 className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
              >
                 Ver Radar Global
              </button>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                 { label: 'Trânsito', val: 'Fluído', icon: Navigation, color: 'text-blue-500', trend: '-8%' },
                 { label: 'Ar (PM2.5)', val: '84/100', icon: Wind, color: 'text-emerald-500', trend: 'Estável' },
                 { label: 'Segurança', val: 'Vigilante', icon: Radar, color: 'text-rose-500', trend: 'Auditado' },
                 { label: 'Obras', val: '14 Ativas', icon: Zap, color: 'text-amber-500', trend: '+2' },
              ].map((metric, i) => (
                 <div key={i} className="bg-white p-5 md:p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-3 group hover:border-primary/50 transition-all">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100", metric.color)}>
                       <metric.icon size={18} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">{metric.label}</p>
                       <p className="text-lg font-bold text-text-main tracking-tight leading-none">{metric.val}</p>
                       <p className={cn("text-[10px] font-bold mt-1", metric.color)}>{metric.trend}</p>
                    </div>
                 </div>
              ))}
           </div>
        </section>

         {/* Core Services Navigation Grid */}
         <section className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-6">
               <div className="space-y-1.5 px-2">
                  <h2 className="text-3xl md:text-5xl font-bold text-text-main tracking-tight leading-none">Hub de <span className="text-primary">Acesso.</span></h2>
                  <p className="text-text-muted font-medium text-lg">Serviços municipais ao seu alcance.</p>
               </div>
               <div className="relative w-full md:w-[420px] group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/70 group-focus-within:text-primary transition-colors" />
                  <input 
                     type="text" 
                     placeholder="Buscar serviços..." 
                     className="w-full bg-slate-50 border border-slate-200 p-5 pl-14 rounded-2xl outline-none focus:border-primary focus:bg-white transition-all font-medium placeholder:text-text-muted/60 shadow-inner"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
               {dashboardModules.map((module, i) => (
                  <button 
                     key={i}
                     onClick={() => router.push(module.href)}
                     className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-primary hover:shadow-xl transition-all flex flex-col items-center text-center gap-6 relative overflow-hidden"
                  >
                     <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform", module.bg, module.color)}>
                        <module.icon size={32} />
                     </div>
                     <div className="space-y-1 relative z-10">
                        <h3 className="text-xl font-bold text-text-main tracking-tight group-hover:text-primary transition-colors leading-none">{module.label}</h3>
                        <p className="text-sm font-medium text-text-muted">Acessar terminal</p>
                     </div>
                  </button>
               ))}
            </div>
         </section>

        {/* Civic Engagement Widgets */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
           {/* Active Petition */}
           <div className="bg-orange-50 p-10 md:p-16 rounded-[4rem] lg:rounded-[5.5rem] border-4 border-white shadow-3xl space-y-10 relative overflow-hidden group">
              <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
                 <div className="space-y-6 flex-grow text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600/10 text-orange-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-600/20">
                       <Users size={14} />
                       Democracia Colaborativa
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-orange-700 tracking-tighter uppercase leading-[0.9]">Causa <br/> <span className="text-orange-600">SM.</span></h3>
                    <div className="space-y-4">
                       <h4 className="text-xl font-black text-text-main leading-tight uppercase tracking-tight">Nova Ciclovia: Setor Oeste</h4>
                       <p className="text-base font-ui font-medium text-orange-900/60 leading-relaxed border-l-4 border-orange-500/20 pl-6">
                          Estamos a 840 assinaturas de tornar o projeto de ciclovia sustentável uma pauta obrigatória.
                       </p>
                    </div>
                 </div>
                 <div className="w-full md:w-32 h-32 bg-white rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-orange-100 shadow-2xl shrink-0 group-hover:rotate-12 transition-transform">
                    <span className="text-3xl font-black text-orange-600 tracking-tighter leading-none">89%</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-text-muted mt-1 opacity-60">Status</span>
                 </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                 <div className="h-3 w-full bg-white rounded-full border border-orange-100 shadow-inner overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       whileInView={{ width: '89%' }}
                       className="h-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                    />
                 </div>
                 <button 
                  onClick={() => toast('Assinatura processada com sucesso (+50 DigitalPoints).', 'success')}
                  className="w-full py-6 bg-orange-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-orange-600/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4 group/btn"
                 >
                    Assinar Agora
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                 </button>
              </div>
              <Target className="absolute -right-16 -bottom-16 w-80 h-80 opacity-[0.03] text-orange-700 pointer-events-none" />
           </div>

           {/* Hot Services Grid */}
           <div className="bg-slate-50 p-8 md:p-12 rounded-[3rem] border border-slate-200 border-dashed space-y-8">
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                 <h3 className="text-lg font-bold text-text-main flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Feed de Inteligência
                 </h3>
                 <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Recentes</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                 {[
                    { label: 'Novo Alerta de Clima', desc: 'Previsão de geada no Setor Sul amanhã.', time: '14m', icon: Radio, color: 'text-amber-600' },
                    { label: 'Saúde: Checkup Anual', desc: 'Sua janela de agendamento está aberta.', time: '1h', icon: Heart, color: 'text-emerald-600' },
                    { label: 'Educação: Kit Escolar', desc: 'Retirada disponível no Polo Central.', time: '3h', icon: FileText, color: 'text-orange-600' },
                    { label: 'Vaga Recomendada', desc: 'Nova oportunidade compatível com seu perfil.', time: '6h', icon: Briefcase, color: 'text-primary' }
                 ].map((act, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/50 transition-all group flex items-center justify-between cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className={cn("w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", act.color)}>
                             <act.icon size={16} />
                          </div>
                          <div className="space-y-0.5">
                             <h4 className="text-sm font-bold text-text-main leading-none">{act.label}</h4>
                             <p className="text-xs text-text-muted font-medium leading-none">{act.desc}</p>
                          </div>
                       </div>
                       <span className="text-[10px] font-bold text-text-muted/50 uppercase tracking-tight">{act.time}</span>
                    </div>
                 ))}
              </div>
              
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-md">Ver Painel Completo</button>
           </div>
        </section>

        {/* Global Stats Section Link */}
        <section className="bg-white p-12 md:p-20 rounded-[4rem] lg:rounded-[6rem] border-2 border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-12 group overflow-hidden relative">
           <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-center md:text-left">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary border-4 border-white shadow-4xl shrink-0 group-hover:rotate-12 transition-transform">
                 <Target className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <div className="space-y-4">
                 <h3 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-[0.9]">Transparência <br className="hidden md:block"/> <span className="text-primary">Absoluta.</span></h3>
                 <p className="text-lg md:text-xl font-ui font-medium text-text-muted max-w-xl leading-relaxed opacity-70">
                    Acompanhe cada centavo investido. O Digital Radar audita a aplicação dos impostos em tempo real para um governo 100% aberto.
                 </p>
              </div>
           </div>
           <button 
              onClick={() => setIsStatsOpen(true)}
              className="bg-text-main text-white px-14 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-4xl flex items-center gap-4 hover:bg-primary transition-all group/btn w-full md:w-auto justify-center"
           >
              Acessar Radar
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
           </button>
           <Radar className="absolute -left-16 -bottom-16 w-96 h-96 opacity-[0.02] text-text-main animate-slow-spin" />
        </section>

      </main>

      <GlobalStatsModal 
        isOpen={isStatsOpen} 
        onClose={() => setIsStatsOpen(false)} 
      />

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
}
