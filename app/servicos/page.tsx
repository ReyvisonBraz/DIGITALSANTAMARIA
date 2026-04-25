'use client';

import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  School, 
  Car, 
  Briefcase, 
  DollarSign, 
  HardHat, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Vote, 
  Search,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';

const serviceCategories = [
  {
    id: 'cidadao',
    name: 'Cidadania & Voz',
    description: 'Participe ativamente das decisões e melhorias da sua cidade.',
    services: [
      { id: 'relatar', name: 'Zeladoria Urbano', desc: 'Relate buracos, luz apagada ou entulho.', icon: MessageSquare, href: '/relatar', color: 'text-primary' },
      { id: 'peticoes', name: 'Voz do Bairro', desc: 'Crie e apoie petições populares.', icon: FileText, href: '/peticoes', color: 'text-tertiary' },
      { id: 'votos', name: 'Orçamento Público', desc: 'Vote nas prioridades de investimento.', icon: Vote, href: '/votos', color: 'text-primary' },
      { id: 'comunidade', name: 'Rede de Vizinhos', desc: 'Grupos de WhatsApp oficiais do bairro.', icon: Users, href: '/comunidade', color: 'text-blue-500' },
    ]
  },
  {
    id: 'saude-edu',
    name: 'Saúde & Educação',
    description: 'Agendamentos médicos, matrículas e calendário escolar.',
    services: [
      { id: 'saude', name: 'Saúde Fácil', desc: 'Consultas, exames e rede de clínicas.', icon: Heart, href: '/saude', color: 'text-accent-danger' },
      { id: 'edu', name: 'Educação 2026', desc: 'Matrículas, transferências e notas.', icon: School, href: '/educacao', color: 'text-primary' },
    ]
  },
  {
    id: 'trabalho-tributo',
    name: 'Trabalho & Tributos',
    description: 'Impostos municipais e oportunidades de carreira.',
    services: [
      { id: 'empregos', name: 'Banco de Empregos', desc: 'Vagas locais e cadastro de currículo.', icon: Briefcase, href: '/empregos', color: 'text-orange-500' },
      { id: 'tributos', name: 'Portal Fiscal', desc: 'IPTU, ISS e parcelamento de débitos.', icon: DollarSign, href: '/tributos', color: 'text-green-600' },
    ]
  },
  {
    id: 'cidade-infra',
    name: 'Cidade & Infra',
    description: 'Acompanhamento de obras e mobilidade urbana.',
    services: [
      { id: 'transito', name: 'Mobilidade Digital', desc: 'Linhas de ônibus e alertas de trânsito.', icon: Car, href: '/transito', color: 'text-blue-600' },
      { id: 'obras', name: 'Fiscalize Obras', desc: 'Transparência em gastos e prazos.', icon: HardHat, href: '/obras', color: 'text-amber-600' },
      { id: 'eventos', name: 'Cultura & Lazer', desc: 'Agenda oficial de eventos da cidade.', icon: Calendar, href: '/eventos', color: 'text-primary' },
    ]
  }
];

export default function ServicosPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');

  const myProtocols = [
    { id: '2026-X89', title: 'Poda de Árvore', status: 'Em Análise', date: '21 Abr', color: 'text-amber-500' },
    { id: '2026-R12', title: 'Isenção IPTU', status: 'Aprovado', date: '18 Abr', color: 'text-green-500' },
  ];

  const filteredCategories = useMemo(() => {
    let result = serviceCategories;
    if (activeTab !== 'Todos') {
      result = serviceCategories.filter(cat => cat.id === activeTab);
    }
    if (search.length > 0) {
      return result.map(cat => ({
        ...cat,
        services: cat.services.filter(s => 
          s.name.toLowerCase().includes(search.toLowerCase()) || 
          s.desc.toLowerCase().includes(search.toLowerCase())
        )
      })).filter(cat => cat.services.length > 0);
    }
    return result;
  }, [search, activeTab]);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10 md:gap-16 bg-background">
      
      {/* Hero & Identity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         <div className="lg:col-span-8 space-y-6 md:space-y-8">
            <div className="space-y-3">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  <Building2 className="w-4 h-4" />
                  Terminal Integrado de Autoatendimento
               </div>
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-main tracking-tighter uppercase leading-[0.9]">
                  Digital <br /> <span className="text-primary">Santa Maria.</span>
               </h1>
            </div>
            <p className="text-base md:text-xl font-medium text-text-muted font-ui max-w-2xl leading-relaxed">
               Sua interface direta com a administração pública. Resolva pendências, acompanhe obras e participe da gestão da sua cidade em tempo real.
            </p>
            
            <div className="relative w-full max-w-2xl group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted group-focus-within:text-primary transition-colors" />
               <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="O que você precisa resolver hoje?"
                 className="w-full bg-white border-2 border-border p-5 md:p-6 pl-16 md:pl-18 rounded-3xl md:rounded-[2.5rem] text-sm md:text-lg font-bold outline-none focus:border-primary transition-all shadow-2xl shadow-primary/5 placeholder:opacity-50"
               />
               <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-text-main text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-colors hidden md:block">
                  Buscar
               </button>
            </div>
         </div>

         {/* Personal Snapshot Widget */}
         <div className="lg:col-span-4 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-border p-8 shadow-2xl space-y-6 relative overflow-hidden group">
            <div className="flex items-center justify-between relative z-10">
               <h3 className="text-sm font-black text-text-main uppercase tracking-widest">Meu DSM Hub</h3>
               <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-white text-[10px] font-black">JD</div>
               </div>
            </div>

            <div className="space-y-4 relative z-10">
               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-border pb-2">Protocolos Ativos</p>
               {myProtocols.map(protocol => (
                  <div key={protocol.id} className="flex items-center justify-between group/item cursor-pointer">
                     <div className="space-y-0.5">
                        <p className="text-xs font-black text-text-main uppercase group-hover/item:text-primary transition-colors">{protocol.title}</p>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">{protocol.id} • {protocol.date}</p>
                     </div>
                     <span className={cn("text-[9px] font-black uppercase", protocol.color)}>{protocol.status}</span>
                  </div>
               ))}
            </div>

            <button 
               onClick={() => toast('Acessando painel completo de protocolos...', 'info')}
               className="w-full py-4 bg-surface border-2 border-border rounded-2xl font-black text-[10px] uppercase tracking-widest text-text-muted hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2 relative z-10"
            >
               Ver Todos os Pedidos
               <ArrowRight className="w-4 h-4" />
            </button>
            
            <Building2 className="absolute -right-12 -bottom-12 w-48 h-48 opacity-[0.02] -rotate-12 pointer-events-none" />
         </div>
      </section>

      {/* Main Categories Navigation */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-border pb-8">
           <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar py-2">
              {['Todos', 'cidadao', 'saude-edu', 'trabalho-tributo', 'cidade-infra'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-shrink-0 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 whitespace-nowrap",
                    activeTab === tab 
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" 
                      : "text-text-muted hover:text-text-main border-2 border-transparent hover:border-border"
                  )}
                >
                  {tab === 'Todos' ? 'Todos os Setores' : serviceCategories.find(c => c.id === tab)?.name}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest hidden md:flex">
              <Zap className="w-4 h-4 text-primary" />
              Catálogo Atualizado em Tempo Real
           </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCategories.flatMap(cat => cat.services.map(service => (
              <motion.div
                layout
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href={service.href}
                  className="bg-white p-8 rounded-[2.5rem] border-2 border-border shadow-sm hover:shadow-3xl hover:border-primary/40 transition-all group flex flex-col items-start gap-6 relative overflow-hidden h-full group active:scale-[0.97]"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 bg-surface",
                    "border-2 border-transparent group-hover:border-white shadow-xl"
                  )}>
                    <service.icon className={cn("w-7 h-7", service.color)} />
                  </div>
                  
                  <div className="space-y-2">
                     <h3 className="font-black text-lg text-text-main uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {service.name}
                     </h3>
                     <p className="text-[11px] font-medium text-text-muted font-ui leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                        {service.desc}
                     </p>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between w-full border-t border-border/50">
                     <span className="text-[9px] font-black text-text-muted uppercase tracking-widest group-hover:text-primary transition-colors">Acessar</span>
                     <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronRight className="w-4 h-4" />
                     </div>
                  </div>

                  {/* Decorative background number/icon */}
                  <service.icon className="absolute -right-8 -top-8 w-32 h-32 opacity-[0.015] -rotate-12 group-hover:scale-110 group-hover:opacity-[0.03] transition-all" />
                </Link>
              </motion.div>
            )))}
          </AnimatePresence>
        </div>

        {filteredCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
             <div className="p-8 bg-surface rounded-full border-4 border-dashed border-border animate-pulse">
                <Search className="w-16 h-16 text-text-muted/20" />
             </div>
             <div className="space-y-2">
                <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter">Nada encontrado para "{search}"</h3>
                <p className="text-sm text-text-muted font-ui font-medium">Nossa equipe está sempre adicionando novos serviços. Tente outro termo.</p>
             </div>
             <button 
              onClick={() => { setSearch(''); setActiveTab('Todos'); }}
              className="px-8 py-4 bg-text-main text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-primary transition-colors"
             >
               Ver Todos os Serviços
             </button>
          </div>
        )}
      </section>

      {/* Security & Action Footer */}
      <section className="bg-text-main p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)]">
         <div className="space-y-8 relative z-10 text-center lg:text-left flex-1">
            <div className="flex justify-center lg:justify-start gap-4">
               {[ShieldCheck, Zap, Sparkles].map((Icon, idx) => (
                 <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur shadow-inner">
                   <Icon className="w-8 h-8 text-primary" />
                 </div>
               ))}
            </div>
            <div className="space-y-2">
               <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.9] max-w-2xl">Transparência & <br/> <span className="text-primary">Alta Performance.</span></h2>
               <p className="text-sm md:text-lg font-ui opacity-60 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Utilizamos criptografia de ponta e sistemas distribuídos para garantir que cada protocolo seja processado com 100% de integridade e rapidez.
               </p>
            </div>
         </div>
         
         <div className="flex flex-col gap-4 w-full max-w-sm relative z-10">
            <button 
              onClick={() => toast('Sincronizando com seu DigitalID para download...', 'info')}
              className="w-full bg-white text-text-main py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all group flex items-center justify-center gap-3"
            >
               <FileText className="w-5 h-5 text-primary" />
               Carteira de Documentos
            </button>
            <button 
               onClick={() => window.open('/ouvidoria')}
               className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-[0_20px_50px_rgba(var(--primary),0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-3"
            >
               <MessageSquare className="w-5 h-5" />
               Falar com a Prefeitura
            </button>
         </div>

         {/* Background graphic */}
         <Building2 className="absolute -right-32 -bottom-32 w-[500px] h-[500px] opacity-[0.02] -rotate-12 pointer-events-none" />
      </section>

    </div>
  );
}

