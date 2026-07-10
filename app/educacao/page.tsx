'use client';

import React, { useMemo, useState } from 'react';
import { 
  School, 
  BookOpen, 
  MapPin, 
  GraduationCap, 
  Search, 
  Bus, 
  Utensils, 
  Calendar, 
  FileText, 
  ChevronRight, 
  ArrowRight,
  Download,
  Info,
  Clock,
  Sparkles,
  Bell,
  Star,
  Award,
  Library,
  Users,
  Target,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import Modal from '@/components/ui/Modal';
import { useContent } from '@/lib/hooks/use-content';
import type { EducationSchool } from '@/types';
import type { Timestamp } from 'firebase/firestore';
import DevBanner from '@/components/ui/DevBanner';

const schools = [
  {
    id: '1',
    name: 'Escola Municipal Prof. João Silva',
    type: 'Ensino Fundamental I',
    address: 'Rua das Flores, 123 - Centro',
    status: 'Vagas Abertas',
    rating: 4.8,
    ideb: 6.2,
    image: null
  },
  {
    id: '2',
    name: 'CMEI Pequeno Príncipe',
    type: 'Educação Infantil',
    address: 'Av. Brasil, 450 - Vila Nova',
    status: 'Fila de Espera',
    rating: 4.9,
    ideb: 7.1,
    image: null
  },
  {
    id: '3',
    name: 'Escola Municipal Amélia Costa',
    type: 'Ensino Fundamental II',
    address: 'Rua Paraná, 89 - Bairro Sul',
    status: 'Vagas Abertas',
    rating: 4.5,
    ideb: 5.8,
    image: null
  }
];

export default function EducacaoPage() {
  const { toast } = useToast();
  const { data: educationSchools } = useContent<EducationSchool>('education_schools');
  const [selectedSchool, setSelectedSchool] = useState<EducationSchool | null>(null);
  const [activeTab, setActiveTab] = useState<'academy' | 'dashboard' | 'resources'>('academy');
  const [schoolSearch, setSchoolSearch] = useState('');

  const fallbackSchools = useMemo<EducationSchool[]>(() => schools.map((school) => ({
    id: school.id,
    title: school.name,
    description: school.type,
    status: 'published' as const,
    createdAt: { seconds: 0, nanoseconds: 0 } as Timestamp,
    updatedAt: { seconds: 0, nanoseconds: 0 } as Timestamp,
    deletedAt: null,
    type: school.type,
    address: school.address,
    availabilityStatus: school.status,
    rating: school.rating,
    ideb: school.ideb,
    imageURL: school.image,
  })), []);

  const usingFallbackSchools = educationSchools.length === 0;
  const visibleSchools = usingFallbackSchools ? fallbackSchools : educationSchools;
  const filteredSchools = useMemo(() => {
    const search = schoolSearch.trim().toLowerCase();
    if (!search) return visibleSchools;
    return visibleSchools.filter((school) => [
      school.title,
      school.description,
      school.type,
      school.address,
      school.availabilityStatus,
    ].join(' ').toLowerCase().includes(search));
  }, [schoolSearch, visibleSchools]);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-12 bg-background">
      
      {/* Academy Hero Section */}
      <section className="ring-highlight-dark relative overflow-hidden rounded-[2rem] md:rounded-[2rem] bg-gradient-to-br from-primary-dark via-primary to-primary-dark animate-drift text-white p-10 md:p-16 lg:p-24 shadow-[0_30px_80px_rgba(14,58,140,0.32)] flex flex-col md:flex-row items-center justify-between group">
         <div aria-hidden className="hero-grid-overlay" />
         <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-80 w-80 rounded-full bg-secondary/25 blur-3xl" />
         <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
         <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
         <div className="relative z-10 max-w-3xl text-center md:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] border border-white/20 backdrop-blur-sm">
               <Award className="w-4 h-4 text-accent" />
               Excelência pública municipal
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
               Educação que <span className="text-accent">transforma</span>
            </h1>
            <p className="text-lg md:text-2xl font-medium opacity-90 max-w-2xl leading-relaxed border-l-2 border-white/30 pl-8">
               A jornada acadêmica do seu filho em um só lugar — do ensino fundamental à mentoria profissional, com matrícula e acompanhamento online.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
               <Link
                 href="/educacao/matricula"
                 className="bg-white text-primary px-10 py-4 rounded-2xl font-semibold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
               >
                  Matrícula online
               </Link>
               <Link
                 href="/perfil"
                 className="bg-white/10 text-white border border-white/20 px-9 py-4 rounded-2xl font-semibold text-sm shadow-lg backdrop-blur hover:bg-white/20 transition-all shrink-0"
               >
                  Portal do aluno
               </Link>
            </div>
         </div>
         <div className="relative mt-16 md:mt-0 hidden xl:block">
            <div className="w-[450px] h-[450px] bg-white/5 rounded-full absolute -inset-20 animate-floaty border-2 border-white/10" />
            <div className="w-96 h-96 relative z-10 rotate-12 group-hover:rotate-0 transition-all duration-1000">
               <BookOpen className="w-full h-full opacity-10" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="w-48 h-48 opacity-20" />
               </div>
            </div>
         </div>
         <Zap className="absolute -left-12 -bottom-12 w-80 h-80 opacity-[0.03] text-white -rotate-12" />
      </section>

      {/* Navigation Sub-Menu */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-4 rounded-[2rem] border-2 border-border shadow-inner">
         <div className="flex p-1.5 bg-surface rounded-[2.5rem] w-full md:w-auto">
            {(['academy', 'dashboard', 'resources'] as const).map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={activeTab === tab}
                  aria-label={`Alternar para aba ${tab === 'academy' ? 'Unidades' : tab === 'dashboard' ? 'Portal' : 'Recursos'}`}
                  className={cn(
                     "flex-1 md:flex-none flex items-center gap-3 px-8 py-4 rounded-[2rem] font-semibold text-[11px] uppercase tracking-widest transition-all relative overflow-hidden",
                     activeTab === tab ? "bg-white text-primary shadow-xl border border-primary/10" : "text-text-muted hover:text-text-main"
                  )}
               >
                  {tab === 'academy' && <Library className="w-4 h-4" />}
                  {tab === 'dashboard' && <Calendar className="w-4 h-4" />}
                  {tab === 'resources' && <Sparkles className="w-4 h-4" />}
                  <span className="relative z-10">{tab === 'academy' ? 'Unidades' : tab === 'dashboard' ? 'Portal' : 'Recursos'}</span>
               </button>
            ))}
         </div>
         <div className="flex items-center gap-6 px-8">
            <div className="text-right">
               <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest leading-none mb-1">Status de Rede</p>
               <p className="text-xs font-semibold text-green-500 uppercase">100% Operacional</p>
            </div>
            <div className="w-1.5 h-10 bg-border/50 rounded-full" />
            <Users className="w-6 h-6 text-primary opacity-50" />
         </div>
      </div>

      <AnimatePresence mode="wait">
         {activeTab === 'academy' && (
            <motion.section 
               key="academy"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-12"
            >
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                  <div className="space-y-3">
                     <h2 className="text-3xl md:text-5xl font-semibold text-text-main tracking-tight leading-[1.02]" style={{ fontFamily: 'var(--font-display)' }}>Nossa <span className="text-primary">rede</span></h2>
                     <p className="text-text-muted font-medium text-lg opacity-80 max-w-xl leading-relaxed">
                        Unidades de ensino municipais avaliadas e integradas em um só painel de acompanhamento.
                     </p>
                  </div>
                  <div className="relative w-full lg:w-[450px] group">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted group-focus-within:text-primary transition-colors" />
                     <input 
                        type="text" 
                        value={schoolSearch}
                        onChange={(event) => setSchoolSearch(event.target.value)}
                        placeholder="Buscar unidade por geolocalização ou nome..." 
                        className="w-full bg-surface border-2 border-border p-6 pl-16 rounded-[2rem] outline-none focus:border-primary transition-all font-semibold placeholder:opacity-40 shadow-inner"
                     />
                  </div>
               </div>

               {usingFallbackSchools && (
                 <DevBanner
                   title="Dados escolares demonstrativos"
                   description="A rede de ensino abaixo usa exemplos ate que a Secretaria de Educacao publique unidades, IDEB e avaliacoes reais no painel administrativo."
                 />
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredSchools.map((school) => (
                    <motion.article 
                      key={school.id}
                      whileHover={{ y: -10 }}
                      className="bg-white rounded-[2rem] border-2 border-border shadow-sm overflow-hidden group hover:border-primary transition-all flex flex-col relative"
                    >
                       <div className="relative h-64 overflow-hidden">
                          {school.imageURL ? (
                            <Image
                              src={school.imageURL}
                              alt={school.title}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-[2s] brightness-90 group-hover:brightness-100"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                              <School className="h-20 w-20 opacity-40" />
                            </div>
                          )}
                          <div className="absolute top-8 left-8">
                             <div className="px-5 py-2.5 bg-white/95 rounded-full text-[11px] font-semibold uppercase tracking-widest shadow-2xl border-2 border-border flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", school.availabilityStatus === 'Vagas Abertas' ? 'bg-green-500' : 'bg-primary')} />
                                {school.availabilityStatus}
                             </div>
                          </div>
                          <div className="absolute bottom-6 right-6">
                             <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-3">
                                <Target className="w-5 h-5 text-primary" />
                                <div className="text-right">
                                   <p className="text-[11px] font-semibold uppercase tracking-widest opacity-60">IDEB</p>
                                   <p className="text-base font-semibold tabular-nums leading-none">{school.ideb}</p>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="p-10 space-y-8 flex-grow flex flex-col">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-primary border border-border">
                                   <School className="w-5 h-5" />
                                </div>
                                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-widest leading-none">{school.type}</span>
                             </div>
                             <h3 className="text-2xl font-semibold text-text-main tracking-tight leading-snug group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-display)' }}>{school.title}</h3>
                             <p className="text-sm font-medium text-text-muted flex items-center gap-3 leading-relaxed border-l-2 border-primary/20 pl-4">
                                {school.address}
                             </p>
                          </div>

                          <div className="pt-8 mt-auto border-t border-border flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-primary fill-primary" />
                                <span className="text-xl font-semibold text-text-main tabular-nums">{school.rating}</span>
                                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-widest ml-2">Avaliação Parental</span>
                             </div>
                              <button 
                                onClick={() => setSelectedSchool(school)}
                                aria-label={`Ver detalhes de ${school.title}`}
                                className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-Tactile active:scale-90 group/btn"
                              >
                                <ChevronRight className="w-8 h-8 group-hover/btn:translate-x-1.5 transition-transform" />
                             </button>
                          </div>
                       </div>
                    </motion.article>
                  ))}
               </div>
            </motion.section>
         )}

         {activeTab === 'dashboard' && (
            <motion.section 
               key="dashboard"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-8"
            >
<div className="lg:col-span-12">
                   <div className="bg-white p-8 rounded-[2rem] border-2 border-border space-y-4 shadow-sm">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                            <Calendar className="w-7 h-7" />
                         </div>
                         <div className="space-y-0.5">
                            <h4 className="text-xl font-semibold text-text-main tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Acompanhamento escolar</h4>
                            <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Conecte-se com a secretaria de educação</p>
                         </div>
                      </div>
                      <p className="text-sm font-medium text-text-muted leading-relaxed opacity-80">
                         O portal do aluno exibirá notas, frequência, cardápio e transporte escolar quando a Secretaria de Educação publicar os dados no painel administrativo.
                         Por enquanto, você já pode buscar unidades e fazer matrícula online.
                      </p>
                      <Link
                        href="/educacao/matricula"
                        className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                      >
                        Fazer matrícula
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                   </div>
                </div>
               {/* Quick Student Status Panel */}
               <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="ring-highlight-dark bg-gradient-to-br from-primary to-primary-dark p-8 rounded-[2rem] text-white space-y-6 relative overflow-hidden group shadow-[0_20px_50px_rgba(26,86,196,0.28)]">
                     <div aria-hidden className="hero-grid-overlay" />
                     <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur shadow-inner">
                              <Users className="w-7 h-7 text-primary" />
                           </div>
                           <div className="space-y-0.5">
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-60">Aluno conectado</h4>
                              <p className="text-2xl font-semibold tracking-tight leading-none" style={{ fontFamily: 'var(--font-display)' }}>Matheus Silva</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                              <span className="text-[11px] font-semibold opacity-40 uppercase block mb-1">Média Global</span>
                              <span className="text-xl font-semibold text-green-400">8.4</span>
                           </div>
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                              <span className="text-[11px] font-semibold opacity-40 uppercase block mb-1">Frequência</span>
                              <span className="text-xl font-semibold">94%</span>
                           </div>
                        </div>
                     </div>
                     <Star className="absolute -right-10 -bottom-10 w-48 h-48 opacity-[0.03] rotate-12" />
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] border-2 border-border shadow-sm flex flex-col justify-between group hover:border-primary transition-all">
                     <div className="flex items-center justify-between">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary border border-border">
                           <Utensils size={28} />
                        </div>
                        <span className="text-[11px] font-semibold text-green-500 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                           Servindo Agora
                        </span>
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xl font-semibold text-text-main leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Alimentação escolar</h4>
                        <p className="text-xs font-medium text-text-muted leading-relaxed">Cardápio: feijoada light, salada mix e suco</p>
                     </div>
                     <button className="text-[11px] font-semibold text-primary uppercase tracking-widest hover:underline text-left">Ver Cardápio Completo</button>
                  </div>

                  <div className="bg-white p-8 rounded-[2rem] border-2 border-border shadow-sm flex flex-col justify-between group hover:border-primary transition-all">
                     <div className="flex items-center justify-between">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-primary border border-border">
                           <Bus size={28} />
                        </div>
                        <div className="text-right">
                           <p className="text-xl font-semibold text-text-main leading-none tabular-nums">08:15</p>
                           <p className="text-[11px] font-semibold text-primary uppercase tracking-widest">Chegada Ônibus</p>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xl font-semibold text-text-main leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Transporte escolar</h4>
                        <p className="text-xs font-medium text-text-muted leading-relaxed">Linha #04 está cruzando a Av. Central.</p>
                     </div>
                     <button className="text-[11px] font-semibold text-primary uppercase tracking-widest hover:underline text-left">Rastrear em Tempo Real</button>
                  </div>
               </div>

               {/* Educational Resources & Support */}
               <div className="lg:col-span-8 bg-surface p-10 md:p-14 rounded-[2rem] border-2 border-border space-y-10 border-dashed group relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                     <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-semibold text-text-main tracking-tight leading-[1.0]" style={{ fontFamily: 'var(--font-display)' }}>Portfólio de serviços</h2>
                        <p className="text-lg text-text-muted font-medium leading-relaxed max-w-xl opacity-75">
                           Acesse documentações oficiais, solicite transferências ou baixe kits escolares digitais diretamente aqui.
                        </p>
                     </div>
                     <button className="bg-primary text-white px-10 py-5 rounded-[2rem] font-semibold text-sm shadow-2xl hover:bg-primary transition-all flex items-center gap-4 group/btn">
                        Ir à ouvidoria
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
                     </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                     {[
                        { label: 'Passe Livre Digital', desc: 'Emissão de QR Code para transporte gratuito.', icon: Zap },
                        { label: 'Matrícula 2026', desc: 'Renovação automática em 1 clique.', icon: FileText },
                        { label: 'Cursos Extras', desc: 'Aulas de programação e artes no Setor de Apoio.', icon: Sparkles },
                        { label: 'Manual Pedagógico', desc: 'Diretrizes curriculares do ano letivo vigente.', icon: BookOpen }
                     ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2rem] border-2 border-border shadow-sm hover:border-primary transition-all group/item flex gap-6 items-center">
                           <div className="w-16 h-16 rounded-[1.5rem] bg-surface flex items-center justify-center text-primary border-2 border-border group-hover/item:scale-110 transition-transform shadow-inner">
                              <item.icon size={24} />
                           </div>
                           <div className="space-y-0.5">
                              <h4 className="text-lg font-semibold text-text-main tracking-tight group-hover/item:text-primary transition-colors leading-snug" style={{ fontFamily: 'var(--font-display)' }}>{item.label}</h4>
                              <p className="text-xs font-medium text-text-muted opacity-70 leading-relaxed">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <BookOpen className="absolute -right-20 -bottom-20 w-96 h-96 opacity-[0.02] -rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-[60s]" />
               </div>

               {/* Right Promotion Card */}
               <div className="ring-highlight-dark lg:col-span-4 bg-gradient-to-br from-primary via-primary-dark to-primary p-10 rounded-[2rem] text-white space-y-10 relative overflow-hidden group shadow-[0_24px_60px_rgba(14,58,140,0.30)]">
                  <div aria-hidden className="hero-grid-overlay" />
                  <div className="relative z-10 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur shadow-inner">
                           <GraduationCap size={42} />
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-display)' }}>Mentoria digital</h3>
                     </div>
                     <p className="text-base font-ui font-medium opacity-80 leading-relaxed">Conectamos profissionais veteranos da cidade com jovens estudantes para direcionamento de carreira e cidadania.</p>
                     
                     <div className="p-6 bg-white/10 rounded-3xl border border-white/20 space-y-4">
                        <div className="flex items-center gap-3">
                           <Users size={20} className="text-accent" />
                           <span className="text-xs font-semibold uppercase tracking-widest">425 Mentores Ativos</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="w-[85%] h-full bg-white shadow-[0_0_15px_white]" />
                        </div>
                     </div>

                     <button className="w-full py-5 bg-white text-primary rounded-[2rem] font-semibold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-2xl">Quero Participar</button>
                  </div>
                  <Target className="absolute -right-12 -top-12 w-64 h-64 opacity-[0.05] rotate-12" />
               </div>
            </motion.section>
         )}

         {activeTab === 'resources' && (
            <motion.section 
               key="resources"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="space-y-12"
            >
               <div className="bg-surface p-12 md:p-20 rounded-[2rem] border-2 border-border border-dashed flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group shadow-inner">
                  <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-center md:text-left">
                     <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-primary border-4 border-border shadow-2xl shrink-0 group-hover:rotate-12 transition-transform">
                        <Library className="w-12 h-12 md:w-16 md:h-16" />
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-4xl md:text-6xl font-semibold text-text-main tracking-tight leading-[1.0]" style={{ fontFamily: 'var(--font-display)' }}>Biblioteca <span className="text-primary">universal</span></h4>
                        <p className="text-lg md:text-xl font-medium text-text-muted max-w-2xl leading-relaxed opacity-75">
                           Acesso direto a mais de 50.000 títulos digitais e acervos históricos do município, gratuitos para todos os cidadãos.
                        </p>
                     </div>
                  </div>
                  <button 
                     onClick={() => toast('Sincronizando acervo digital para seu dispositivo...', 'info')}
                     className="bg-primary text-white px-14 py-6 rounded-[2.5rem] font-semibold text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center gap-4 hover:bg-primary transition-all group/btn"
                  >
                     Acessar Acervo
                     <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1.5 transition-transform" />
                  </button>
                  <Sparkles className="absolute -right-16 -bottom-16 w-96 h-96 opacity-[0.03] text-primary animate-slow-spin" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                     { label: 'E-Books Infantis', meta: '2,400 títulos', icon: BookOpen },
                     { label: 'Acadêmicos', meta: 'Dissertações Locais', icon: GraduationCap },
                     { label: 'Audiobooks', meta: 'Acessibilidade Total', icon: Users },
                     { label: 'Multimídia', meta: 'Acervo Histórico', icon: Library }
                  ].map((item, i) => (
                     <div key={i} className="bg-white p-8 rounded-[2rem] border-2 border-border shadow-sm hover:border-primary transition-all group flex flex-col items-center text-center gap-6">
                        <div className="w-20 h-20 bg-surface rounded-[1.8rem] flex items-center justify-center text-primary border-2 border-border group-hover:scale-110 transition-transform shadow-inner">
                           <item.icon size={32} />
                        </div>
                        <div className="space-y-1">
                           <h5 className="text-base font-semibold text-text-main leading-snug tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{item.label}</h5>
                           <p className="text-[11px] font-bold text-primary uppercase tracking-[0.14em]">{item.meta}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.section>
         )}
      </AnimatePresence>

      {/* Modal: School Technical Dossier */}
      <Modal 
        isOpen={!!selectedSchool} 
        onClose={() => setSelectedSchool(null)}
        title="Dossiê de Performance"
      >
        {selectedSchool && (
          <div className="space-y-8 p-4">
             <div className="relative h-56 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl group">
                {selectedSchool.imageURL ? (
                  <Image
                    src={selectedSchool.imageURL}
                    alt={selectedSchool.title}
                    fill
                    sizes="(min-width: 768px) 420px, 100vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-[5s]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                    <School className="h-16 w-16 opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                   <p className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-80 mb-1">Unidade #{selectedSchool.id}</p>
                   <h3 className="text-3xl font-semibold leading-[1.05] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{selectedSchool.title}</h3>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-surface rounded-3xl border-2 border-border flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="text-[11px] font-semibold uppercase text-text-muted tracking-widest">Performance IDEB</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-semibold text-text-main tabular-nums">{selectedSchool.ideb}</span>
                      <span className="text-[11px] font-semibold text-green-500">↑ 4.2%</span>
                   </div>
                </div>
                <div className="p-6 bg-surface rounded-3xl border-2 border-border flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-[11px] font-semibold uppercase text-text-muted tracking-widest">Status de Vagas</span>
                   </div>
                   <div className="flex items-baseline gap-2">
                      <span className={cn("text-xl font-semibold uppercase leading-none", selectedSchool.availabilityStatus === 'Vagas Abertas' ? 'text-green-600' : 'text-primary')}>
                         {selectedSchool.availabilityStatus}
                      </span>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <div className="p-6 bg-white border-2 border-border rounded-3xl flex items-center gap-5">
                   <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary border border-blue-100">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Localização Geográfica</p>
                      <p className="text-sm font-semibold text-text-main uppercase">{selectedSchool.address}</p>
                   </div>
                </div>
                <div className="p-6 bg-white border-2 border-border rounded-3xl flex items-center gap-5">
                   <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary border border-blue-100">
                      <Clock size={24} />
                   </div>
                   <div>
                      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Operação Pedagógica</p>
                      <p className="text-sm font-semibold text-text-main uppercase">07:00 — 18:30 (Seg~Sex)</p>
                   </div>
                </div>
             </div>

             <div className="flex flex-col gap-4 pt-6">
                <button 
                  onClick={() => toast('Solicitação de transferência gerada com sucesso.', 'success')}
                  className="w-full bg-primary text-white py-5 rounded-3xl font-semibold text-sm shadow-2xl hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                   Solicitar transferência
                   <ArrowRight size={20} />
                </button>
                <button className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.14em] hover:underline">Políticas de matrícula 2026</button>
             </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
