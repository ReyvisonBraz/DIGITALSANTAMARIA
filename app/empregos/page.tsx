'use client';

import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search, 
  Filter, 
  TrendingUp, 
  GraduationCap, 
  ChevronRight, 
  FileText, 
  Zap,
  Star,
  ArrowRight,
  ShieldCheck,
  Building2,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import Modal from '@/components/ui/Modal';

const jobs = [
  {
    id: '1',
    title: 'Auxiliar Administrativo',
    company: 'Logística Regional S/A',
    location: 'Distrito Industrial',
    salary: 'R$ 2.450,00',
    type: 'CLT - Presencial',
    posted: 'Há 2 horas',
    tags: ['Serviços Gerais', 'Iniciante', 'Ensino Médio'],
    featured: true
  },
  {
    id: '2',
    title: 'Desenvolvedor Full Stack',
    company: 'Startup Tech City',
    location: 'Remoto',
    salary: 'R$ 8.000,00 - R$ 12.000,00',
    type: 'PJ / Home-Office',
    posted: 'Há 5 horas',
    tags: ['Tecnologia', 'Sênior', 'React/Node'],
    featured: false
  },
  {
    id: '3',
    title: 'Vendedor de Loja',
    company: 'Comércio Central Ltda',
    location: 'Centro - Calçadão',
    salary: 'R$ 1.800 + Comissão',
    type: 'CLT',
    posted: 'Há 1 dia',
    tags: ['Serviços Gerais', 'Vendas', 'Experiência'],
    featured: false
  },
  {
    id: '4',
    title: 'Professor de Matemática',
    company: 'Escola Municipal Saber',
    location: 'Bairro Alto',
    salary: 'R$ 3.500,00',
    type: 'Processo Seletivo',
    posted: 'Há 2 dias',
    tags: ['Educação', 'Nível Superior'],
    featured: false
  }
];

export default function EmpregosPage() {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'vagas' | 'perfil' | 'servicos'>('vagas');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = ['Serviços Gerais', 'Tecnologia', 'Educação', 'Saúde', 'Indústria'];

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => 
      (selectedCategories.length === 0 || j.tags.some(tag => selectedCategories.includes(tag))) &&
      (search === '' || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, selectedCategories]);

  const handleApply = (id: string, title: string) => {
    setAppliedJobs([...appliedJobs, id]);
    toast(`Candidatura para "${title}" enviada! Seu currículo DigitalID foi anexado automaticamente.`, 'success');
    setSelectedJob(null);
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-10 md:gap-14 bg-background">
      
      {/* Header & Hero */}
      <section className="space-y-8">
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  <Briefcase className="w-4 h-4" />
                  Ecossistema de Oportunidades 2026
               </div>
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-main tracking-tighter uppercase leading-[0.9]">
                  Banco de <br /> <span className="text-primary">Talentos.</span>
               </h1>
               <p className="text-base md:text-xl font-medium text-text-muted font-ui leading-relaxed">
                  Conectamos os melhores profissionais às vagas reais do município. Sua carreira, impulsionada pela infraestrutura municipal.
               </p>
            </div>
            
            {/* Quick Stats Widget */}
            <div className="bg-white p-6 rounded-[2.5rem] border-2 border-border shadow-xl min-w-[280px] space-y-4 hidden md:block">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Mercado Local</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                     <p className="text-2xl font-black text-text-main leading-none">428</p>
                     <p className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none">Vagas Abertas</p>
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-2xl font-black text-primary leading-none">12</p>
                     <p className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none">Contratos Hoje</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Master Search & Tabs */}
         <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-2 rounded-[2rem] md:rounded-full border-2 border-border shadow-2xl transition-all focus-within:border-primary/30">
            <div className="relative flex-grow w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
               <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Cargo, empresa ou palavra-chave..."
                 className="w-full pl-16 pr-6 py-4 bg-transparent outline-none font-bold text-sm md:text-base border-none"
               />
            </div>
            <div className="flex p-1 bg-surface rounded-full border border-border w-full md:w-auto">
               {[
                 { id: 'vagas', label: 'Vagas', icon: Briefcase },
                 { id: 'perfil', label: 'Candidato', icon: GraduationCap },
                 { id: 'servicos', label: 'MEI', icon: Zap },
               ].map(tab => (
                  <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={cn(
                        "flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black text-[9px] uppercase tracking-widest transition-all",
                        activeTab === tab.id ? "bg-primary text-white shadow-lg" : "text-text-muted hover:text-text-main"
                     )}
                  >
                     <tab.icon className="w-3.5 h-3.5" />
                     {tab.label}
                  </button>
               ))}
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* LEFT Side: Filters & Dashboard */}
         <aside className="lg:col-span-3 space-y-8">
            <AnimatePresence mode="wait">
               {activeTab === 'vagas' ? (
                  <motion.div 
                     key="filters"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="bg-white p-8 rounded-[3rem] border-2 border-border shadow-sm space-y-8 sticky top-24"
                  >
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xs font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                              <Filter className="w-4 h-4 text-primary" />
                              Filtros Rápidos
                           </h3>
                           <button 
                              onClick={() => setSelectedCategories([])}
                              className="text-[9px] font-black text-primary uppercase underline underline-offset-2"
                           >
                              Limpar
                           </button>
                        </div>
                        
                        <div className="space-y-4">
                           {categories.map(cat => (
                              <label key={cat} className="flex items-center justify-between cursor-pointer group">
                                 <div className="flex items-center gap-3">
                                    <div className={cn(
                                       "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center",
                                       selectedCategories.includes(cat) ? "bg-primary border-primary" : "border-border bg-surface group-hover:border-primary/50"
                                    )}>
                                       {selectedCategories.includes(cat) && <Zap className="w-3 h-3 text-white fill-white" />}
                                    </div>
                                    <span className={cn(
                                       "text-xs font-bold transition-colors",
                                       selectedCategories.includes(cat) ? "text-text-main italic" : "text-text-muted group-hover:text-primary"
                                    )}>{cat}</span>
                                 </div>
                                 <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={selectedCategories.includes(cat)}
                                    onChange={() => {
                                       if (selectedCategories.includes(cat)) {
                                          setSelectedCategories(selectedCategories.filter(c => c !== cat));
                                       } else {
                                          setSelectedCategories([...selectedCategories, cat]);
                                       }
                                    }}
                                 />
                                 <span className="text-[10px] font-black text-text-muted/50 tabular-nums">
                                    {Math.floor(Math.random() * 50) + 1}
                                 </span>
                              </label>
                           ))}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-border">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Previsão Salarial</label>
                           <div className="space-y-2">
                              <input type="range" className="w-full accent-primary h-1.5 bg-surface rounded-full appearance-none cursor-pointer" />
                              <div className="flex justify-between text-[9px] font-black text-text-muted uppercase">
                                 <span>R$ 1.5k</span>
                                 <span>R$ 15k+</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <button className="w-full py-4 bg-text-main text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl active:scale-95">
                        Aplicar Seleção
                     </button>
                  </motion.div>
               ) : (
                  <motion.div 
                     key="dashboard-side"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="bg-text-main p-8 rounded-[3.5rem] text-white space-y-8 sticky top-24 shadow-3xl"
                  >
                     <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-white/10 border-2 border-white/20 p-1 relative">
                           <div className="absolute -top-2 -right-2 bg-primary p-2 rounded-xl shadow-xl z-10 border-2 border-white">
                              <Zap className="w-3 h-3 text-white fill-white" />
                           </div>
                           <div className="w-full h-full rounded-[1.8rem] bg-white flex items-center justify-center overflow-hidden">
                              <Image 
                                 src="https://picsum.photos/seed/user-pro/200/200" 
                                 alt="Avatar" 
                                 width={100} 
                                 height={100} 
                                 className="object-cover"
                                 referrerPolicy="no-referrer"
                              />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-xl font-black uppercase tracking-tighter">João das Dores</h4>
                           <p className="text-[10px] font-black text-primary uppercase tracking-widest">Cidadão Verificado</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                           <h5 className="text-[10px] font-black uppercase tracking-widest opacity-60">DigitalID Score</h5>
                           <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className="w-4/5 h-full bg-primary" />
                           </div>
                           <p className="text-[9px] font-bold opacity-80 leading-tight">Perfil 80% completo. Adicione o curso de Inglês para bater 95%.</p>
                        </div>

                        <ul className="space-y-1 text-sm">
                           {[
                             { label: 'Candidaturas', count: 4, icon: Star },
                             { label: 'Competências', count: 2, icon: Zap },
                             { label: 'Certificados', count: 12, icon: GraduationCap },
                           ].map((item, idx) => (
                              <li key={idx} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                                 <div className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="font-bold opacity-80">{item.label}</span>
                                 </div>
                                 <span className="font-black tabular-nums">{item.count}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
            
            <div className="p-8 bg-rose-600 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden group border-4 border-white/10 shadow-2xl">
               <div className="relative z-10 flex flex-col gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl w-fit backdrop-blur shadow-inner">
                     <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-xl font-black uppercase italic leading-none">Segurança <br/> Primeiro.</h4>
                     <p className="text-xs font-medium italic opacity-80 leading-relaxed">Suspeite de solicitações de pagamento para processos seletivos.</p>
                  </div>
                  <button className="w-full py-3 bg-white text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl">Denunciar</button>
               </div>
               <ShieldCheck className="absolute -right-8 -top-8 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
            </div>
         </aside>

         {/* RIGHT Side: Listings */}
         <main className="lg:col-span-9 space-y-10">
            <AnimatePresence mode="wait">
               {activeTab === 'vagas' ? (
                  <motion.div 
                     key="job-list"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className="grid grid-cols-1 xl:grid-cols-2 gap-8"
                  >
                     {/* Featured Job Card */}
                     <article className="xl:col-span-2 bg-white rounded-[3.5rem] border-2 border-primary shadow-2xl hover:shadow-3xl transition-all group relative overflow-hidden p-8 md:p-14 flex flex-col md:flex-row items-center gap-10">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 rotate-12 group-hover:rotate-0 transition-all duration-700 pointer-events-none">
                           <Star className="w-48 h-48 text-primary" />
                        </div>
                        
                        <div className="relative z-10 flex-shrink-0">
                           <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center border-4 border-white shadow-2xl group-hover:scale-105 transition-transform">
                              <Building2 className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                           </div>
                        </div>

                        <div className="relative z-10 space-y-6 flex-grow text-center md:text-left">
                           <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                              <span className="px-4 py-1.5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/20">Vaga Oficial</span>
                              <span className="px-4 py-1.5 bg-surface text-text-muted text-[9px] font-black uppercase tracking-widest rounded-full border border-border">Urgente</span>
                           </div>
                           <div className="space-y-4">
                              <h3 className="text-3xl md:text-5xl font-black text-text-main uppercase tracking-tighter leading-none">Diretor de <br/> Estratégia Digital</h3>
                              <p className="text-base text-text-muted font-ui font-medium max-w-2xl leading-relaxed">
                                 Lidere a transformação digital no gabinete municipal. Buscamos profissionais com visão sistêmica e alta capacidade executiva.
                              </p>
                           </div>
                           <div className="flex flex-wrap gap-6 md:gap-10 pt-6 border-t-2 border-border/50 justify-center md:justify-start">
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Remuneração</p>
                                 <p className="text-xl font-black text-text-main tabular-nums leading-none">R$ 12.450/mês</p>
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Setor</p>
                                 <p className="text-xl font-black text-text-main leading-none">Administração</p>
                              </div>
                              <button 
                                onClick={() => setSelectedJob(jobs.find(j => j.featured) || jobs[0])}
                                className="md:ml-auto w-full md:w-auto bg-text-main text-white px-10 py-4 md:py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-primary transition-all hover:translate-y-[-4px]"
                              >
                                Candidatar-se
                              </button>
                           </div>
                        </div>
                     </article>

                     {/* Regular Job Cards */}
                     {filteredJobs.filter(j => !j.featured).map((job, idx) => (
                        <motion.article 
                           key={job.id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: idx * 0.1 }}
                           whileHover={{ y: -8 }}
                           className="bg-white p-8 md:p-10 rounded-[3rem] border-2 border-border shadow-sm hover:border-primary/40 hover:shadow-2xl transition-all group flex flex-col justify-between h-full"
                        >
                           <div className="space-y-6">
                              <div className="flex justify-between items-start">
                                 <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center border-2 border-border group-hover:border-primary/20 transition-colors">
                                    <Briefcase className="w-7 h-7 text-text-muted group-hover:text-primary transition-colors" />
                                 </div>
                                 <span className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-50">{job.posted}</span>
                              </div>

                              <div className="space-y-1">
                                 <h3 className="text-2xl font-black text-text-main uppercase leading-none group-hover:text-primary transition-colors">{job.title}</h3>
                                 <p className="text-[10px] font-black text-primary uppercase tracking-widest">{job.company}</p>
                              </div>

                              <p className="text-xs text-text-muted font-ui font-medium leading-relaxed line-clamp-2">
                                Oportunidade integrada à rede municipal de talentos. Buscamos profissionais comprometidos.
                              </p>

                              <div className="flex flex-wrap gap-2 pt-2">
                                 {job.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-surface border border-border rounded-lg text-[8px] font-black text-text-muted uppercase tracking-tighter">{tag}</span>
                                 ))}
                              </div>
                           </div>

                           <div className="mt-10 flex items-center gap-4 border-t border-border/50 pt-8">
                              <div className="flex-grow space-y-0.5">
                                 <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Base Salarial</p>
                                 <p className="text-lg font-black text-text-main tabular-nums leading-none">{job.salary}</p>
                              </div>
                              <button 
                                 onClick={() => appliedJobs.includes(job.id) ? null : setSelectedJob(job)}
                                 disabled={appliedJobs.includes(job.id)}
                                 className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-tactile active:scale-95",
                                    appliedJobs.includes(job.id) ? "bg-green-500 text-white" : "bg-white border-2 border-border text-text-main hover:border-primary hover:text-primary"
                                 )}
                              >
                                 {appliedJobs.includes(job.id) ? <Zap size={20} className="fill-white" /> : <ChevronRight size={24} />}
                              </button>
                           </div>
                        </motion.article>
                     ))}
                  </motion.div>
               ) : (
                  <motion.div 
                     key="dashboard-content"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="space-y-10"
                  >
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { title: 'Currículo Digital', desc: 'Gerado via Digital Profiler.', icon: FileText, action: 'Exportar PDF' },
                          { title: 'Mentoria Grátis', desc: 'IAs treinadas em RH municipal.', icon: MessageSquare, action: 'Iniciar Chat' },
                          { title: 'Certificações', desc: 'Diplomas de cursos públicos.', icon: GraduationCap, action: 'Ver Diplomas' },
                        ].map((card, idx) => (
                           <div key={idx} className="bg-white p-8 rounded-[3rem] border-2 border-border shadow-sm hover:border-primary transition-all group">
                              <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110">
                                 <card.icon className="w-7 h-7" />
                              </div>
                              <div className="space-y-2 mb-8">
                                 <h4 className="text-xl font-black text-text-main uppercase tracking-tight">{card.title}</h4>
                                 <p className="text-xs font-ui font-medium text-text-muted leading-relaxed">{card.desc}</p>
                              </div>
                              <button className="w-full py-4 bg-surface rounded-2xl font-black text-[10px] uppercase tracking-widest text-text-muted hover:bg-primary hover:text-white transition-all">
                                 {card.action}
                              </button>
                           </div>
                        ))}
                     </div>

                     <div className="bg-surface p-10 md:p-14 rounded-[4rem] border-2 border-border border-dashed space-y-8 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="space-y-4 text-center lg:text-left">
                           <h3 className="text-3xl md:text-5xl font-black text-text-main uppercase tracking-tighter leading-none">Sua trajetória <br/> <span className="text-primary">Evolutiva.</span></h3>
                           <p className="text-base text-text-muted font-ui font-medium max-w-lg leading-relaxed">Mostramos como você se compara aos requisitos das vagas mais competitivas do município.</p>
                        </div>
                        <div className="w-full lg:w-96 h-64 bg-white rounded-[3.5rem] border-2 border-border shadow-2xl p-8 flex items-center justify-center relative overflow-hidden">
                           <TrendingUp className="w-full h-full text-primary opacity-[0.05] absolute inset-0 -scale-x-100" />
                           <div className="relative z-10 text-center space-y-2">
                              <span className="text-7xl font-black text-text-main tracking-tighter leading-none">82%</span>
                              <p className="text-xs font-black text-text-muted uppercase tracking-widest">Match Municipal Médio</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
            
            {/* Banner Publicitário Municipal */}
            <section className="bg-text-main p-10 md:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden shadow-3xl border-2 border-white/5">
               <div className="relative z-10 flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-[3rem] flex items-center justify-center border-2 border-white/20 backdrop-blur-xl shadow-inner">
                     <TrendingUp className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                  </div>
               </div>
               <div className="relative z-10 space-y-8 flex-grow text-center md:text-left">
                  <div className="space-y-4">
                     <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">Elevando seu <br/> <span className="text-primary">Potencial Local.</span></h2>
                     <p className="text-sm md:text-lg opacity-60 font-ui font-medium max-w-xl leading-relaxed mx-auto md:mx-0">O DSM Empregos oferece trilhas de aprendizagem personalizadas para acelerar sua entrada no mercado.</p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                     <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all">Explorar Trilhas</button>
                     <button className="bg-white/10 border-2 border-white/10 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">Contratar via DSM</button>
                  </div>
               </div>
               <Briefcase className="absolute -right-20 -bottom-20 w-80 h-80 opacity-[0.03] -rotate-12 pointer-events-none" />
            </section>
         </main>
      </div>

      {/* Modal: Job Details */}
      <Modal 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)}
        title="Dossiê da Oportunidade"
      >
        {selectedJob && (
          <div className="space-y-10 p-4">
            <div className="flex flex-col items-center text-center gap-6">
               <div className="w-24 h-24 rounded-[2.5rem] bg-surface flex items-center justify-center border-4 border-white shadow-2xl relative">
                  <Briefcase className="w-12 h-12 text-primary" />
                  <div className="absolute -bottom-2 -right-2 bg-text-main p-2 rounded-xl text-white">
                     <Star className="w-4 h-4 fill-white" />
                  </div>
               </div>
               <div className="space-y-1">
                  <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter leading-none">{selectedJob.title}</h3>
                  <div className="flex items-center justify-center gap-3">
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedJob.company}</span>
                     <div className="w-1 h-1 bg-border rounded-full" />
                     <span className="text-[10px] font-bold text-text-muted uppercase">{selectedJob.location}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-surface p-6 rounded-[2rem] border-2 border-border space-y-1">
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block opacity-70">Salário Base</span>
                  <p className="text-xl font-black text-text-main tabular-nums leading-none">{selectedJob.salary}</p>
               </div>
               <div className="bg-surface p-6 rounded-[2rem] border-2 border-border space-y-1">
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block opacity-70">Regime</span>
                  <p className="text-xl font-black text-text-main leading-none">{selectedJob.type}</p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-main">Requisitos & Escopo</h4>
               </div>
               <div className="p-8 bg-surface rounded-[2.5rem] border-2 border-border border-dashed space-y-4">
                  <p className="text-sm font-ui font-medium text-text-muted leading-relaxed">
                    Buscamos profissionais proativos. Oferecemos plano de carreira estruturado, vale alimentação e seguro saúde DigitalCare. Início imediato após validação de documentos no DigitalID.
                  </p>
                  <ul className="flex flex-wrap gap-2">
                     {selectedJob.tags.map((tag: string) => (
                        <li key={tag} className="px-3 py-1 bg-white border border-border rounded-lg text-[9px] font-black text-text-main uppercase">
                           {tag}
                        </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
               <button 
                 onClick={() => handleApply(selectedJob.id, selectedJob.title)}
                 className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-[0_20px_50px_rgba(var(--primary),0.3)] hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-3"
               >
                  Enviar Candidatura DigitalID
                  <ChevronRight size={24} />
               </button>
               <p className="text-[9px] font-bold text-text-muted text-center opacity-60">Seu perfil será validado pelo banco de talentos municipal antes do envio.</p>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
