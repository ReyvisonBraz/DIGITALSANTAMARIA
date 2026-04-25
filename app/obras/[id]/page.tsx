'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  HardHat, 
  MapPin, 
  Calendar, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Users, 
  FileText,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useToast } from '@/lib/toast-context';
import { cn } from '@/lib/utils';

// Mock data matching works in parent page
const worksDetailed = [
  {
    id: 1,
    title: 'Recapeamento da Av. Central',
    category: 'Infraestrutura',
    progress: 85,
    status: 'Em andamento',
    date: 'Jun 2026 - Out 2026',
    investment: 'R$ 2.450.000,00',
    location: 'Trecho: Praça da Matriz até Rua das Palmeiras',
    company: 'Construtora Caminhos do Sul Ltda.',
    supervisor: 'Eng. Roberto Silva (CREA 123456)',
    description: 'Recuperação asfáltica completa com fresagem do pavimento antigo, aplicação de nova camada de CBUQ e sinalização horizontal térmica de alta durabilidade.',
    benefits: [
      'Redução de 40% no tempo de deslocamento local',
      'Melhoria na drenagem pluvial nas bordas da pista',
      'Valorização dos imóveis comerciais adjacentes'
    ],
    timeline: [
      { step: 'Licitação e Contratação', date: 'Maio 2026', done: true },
      { step: 'Fresagem e Preparo', date: 'Junho 2026', done: true },
      { step: 'Aplicação de Massa Asfáltica', date: 'Julho 2026', done: true },
      { step: 'Sinalização e Acabamento', date: 'Agosto 2026', done: false }
    ],
    images: [
      'https://picsum.photos/seed/road1/800/400',
      'https://picsum.photos/seed/road2/800/400'
    ]
  },
  {
    id: 2,
    title: 'Construção da Unidade de Saúde Norte',
    category: 'Saúde',
    progress: 30,
    status: 'Em andamento',
    date: 'Jan 2026 - Abr 2027',
    investment: 'R$ 8.900.000,00',
    location: 'Rua Principal do Setor Norte, s/n',
    company: 'Alpha Engenharia Civil S.A.',
    supervisor: 'Arq. Mariana Lemos (CAU 789012)',
    description: 'Construção de uma UBS padrão Porte III, com capacidade para 4 equipes de Saúde da Família, farmácia distrital e setor de vacinação ampliado.',
    benefits: [
      'Capacidade de 12.000 atendimentos/mês',
      'Setor de odontologia com 6 consultórios completos',
      'Auditório para educação em saúde comunitária'
    ],
    timeline: [
      { step: 'Terraplanagem e Fundação', date: 'Janeiro 2026', done: true },
      { step: 'Estrutura e Alvenaria', date: 'Março 2026', done: true },
      { step: 'Instalações Hidrossanitárias', date: 'Abril 2026', done: false },
      { step: 'Acabamentos e Equipamentos', date: 'Outubro 2026', done: false }
    ],
    images: [
      'https://picsum.photos/seed/hospital1/800/400',
      'https://picsum.photos/seed/hospital2/800/400'
    ]
  },
  {
    id: 3,
    title: 'Nova Ciclovia Bairro Alvorada',
    category: 'Mobilidade',
    progress: 100,
    status: 'Concluído',
    date: 'Mar 2026 - Jul 2026',
    investment: 'R$ 650.000,00',
    location: 'Interligação entre Parque Sul e Terminal Alvorada',
    company: 'Mobilidade Urbana Obras S/S',
    supervisor: 'Eng. Paulo Mendes (CREA 456789)',
    description: 'Implementação de 4.5km de ciclovia bidirecional protegida, com iluminação solar dedicada e bicicletários públicos.',
    benefits: [
      'Incentivo ao transporte não poluente',
      'Segurança física para ciclistas e pedestres',
      'Conexão intermodal com o transporte coletivo'
    ],
    timeline: [
      { step: 'Projetos e Aprovações', date: 'Fevereiro 2026', done: true },
      { step: 'Execução de Guia e Sarjeta', date: 'Março 2026', done: true },
      { step: 'Pavimentação e Pintura', date: 'Junho 2026', done: true },
      { step: 'Entrega Oficial', date: 'Julho 2026', done: true }
    ],
    images: [
      'https://picsum.photos/seed/bike1/800/400',
      'https://picsum.photos/seed/bike2/800/400'
    ]
  }
];

export default function ObraDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const workId = Number(params.id);
  const work = worksDetailed.find(w => w.id === workId);

  if (!work) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-2xl font-black text-text-muted italic uppercase">Obra não encontrada.</h1>
        <button onClick={() => router.push('/obras')} className="btn-tactile bg-primary text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest">
           Voltar para Obras
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto min-h-screen p-6 md:p-12 pb-32 gap-12">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="group flex items-center gap-3 text-text-muted hover:text-primary transition-colors font-black text-xs uppercase tracking-widest"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Voltar ao Painel
      </button>

      {/* Hero Header */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  {work.category}
               </span>
               <span className={cn(
                 "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2",
                 work.status === 'Concluído' ? "bg-green-500 text-white border-green-400" : "bg-white text-text-main border-border"
               )}>
                 {work.status}
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text-main tracking-tighter uppercase italic leading-tight">
               {work.title}
            </h1>
            <p className="flex items-center gap-2 text-text-muted font-ui font-medium">
               <MapPin className="w-5 h-5 text-primary" />
               {work.location}
            </p>
         </div>
         <div className="lg:col-span-4 bg-surface p-8 rounded-[3rem] border-2 border-border border-b-8 border-b-primary shadow-xl space-y-4">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Investimento Público</span>
               <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-black text-text-main tracking-tight">{work.investment}</p>
            <div className="pt-4 border-t border-border">
               <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Empresa Executora</p>
               <p className="font-bold text-sm text-text-main">{work.company}</p>
            </div>
         </div>
      </header>

      {/* Progress & Visuals */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border-2 border-border shadow-sm space-y-6">
               <div className="flex justify-between items-end">
                  <h3 className="text-xl font-black text-text-main uppercase tracking-tight italic">Status da Execução</h3>
                  <span className="text-3xl font-black text-primary">{work.progress}%</span>
               </div>
               <div className="w-full h-4 bg-surface rounded-full p-1 border-2 border-border overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${work.progress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-primary rounded-full shadow-lg"
                  />
               </div>
               <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Data de Início</p>
                     <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-bold text-text-main">{work.date.split(' - ')[0]}</span>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Previsão Entrega</p>
                     <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-bold text-text-main">{work.date.split(' - ')[1]}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-text-main p-10 rounded-[3rem] text-white space-y-6 relative overflow-hidden">
               <h3 className="text-xl font-black uppercase italic tracking-tight relative z-10 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  Fiscalização Técnica
               </h3>
               <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                     <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Responsável Técnico</p>
                     <p className="font-bold text-lg">{work.supervisor}</p>
                  </div>
                  <p className="text-sm font-ui font-medium opacity-70 leading-relaxed text-justify">
                     As medições são realizadas quinzenalmente e validadas pelo setor de auditoria da prefeitura para liberação de empenho financeiro.
                  </p>
               </div>
               <HardHat className="absolute -right-6 -bottom-6 w-48 h-48 opacity-5 rotate-12" />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="relative h-64 lg:h-full min-h-[300px] rounded-[3rem] overflow-hidden border-2 border-border shadow-sm group">
               <Image 
                 src={work.images[0]} 
                 alt="Foto da Obra" 
                 fill 
                 className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="flex items-center gap-3 text-white">
                     <ImageIcon className="w-5 h-5 text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Foto mais recente • Julho 2026</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Details & Timeline */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
               <h3 className="text-2xl font-black text-text-main uppercase italic flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" />
                  Descritivo do Projeto
               </h3>
               <p className="text-lg font-ui font-medium text-text-main leading-relaxed opacity-90 text-justify">
                  {work.description}
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {work.benefits.map((benefit, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-surface rounded-2xl border-2 border-border group hover:border-primary/30 transition-all">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 border-2 border-border shadow-sm group-hover:scale-110 transition-transform">
                          <TrendingUp className="w-5 h-5 text-primary" />
                       </div>
                       <p className="text-xs font-bold font-ui text-text-muted leading-tight">{benefit}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-5">
            <div className="bg-white p-10 rounded-[3rem] border-2 border-border shadow-sm space-y-8">
               <h3 className="text-xl font-black text-text-main uppercase tracking-tight italic flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  Linha do Tempo
               </h3>
               <div className="space-y-8 relative">
                  <div className="absolute left-6 top-0 bottom-4 w-1 bg-surface border-x border-border ml-[-2px]" />
                  {work.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-6 relative">
                       <div className={cn(
                         "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 z-10 border-2 shadow-sm transition-all",
                         item.done ? "bg-green-500 border-green-400 text-white" : "bg-white border-border text-text-muted"
                       )}>
                          {item.done ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-black text-text-main uppercase tracking-tight">{item.step}</p>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{item.date}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Action Footer */}
      <footer className="bg-surface p-12 rounded-[4rem] border-2 border-border border-dashed flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
         <div className="space-y-4">
            <h3 className="text-2xl font-black text-text-main tracking-tighter italic uppercase leading-none">Fiscalização Cidadã</h3>
            <p className="text-sm font-ui font-medium text-text-muted max-w-md">
               Notou algo errado ou fora do cronograma? Envie sua denúncia diretamente para o canal prioritário da zeladoria urbana.
            </p>
         </div>
         <div className="flex gap-4">
            <button 
              onClick={() => toast('Relatório de fiscalização enviado com anexo registrado!', 'success')}
              className="btn-tactile bg-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
               <Users className="w-5 h-5" />
               Auditoria Cidadã
            </button>
         </div>
      </footer>

    </div>
  );
}
