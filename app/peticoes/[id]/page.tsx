'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CalendarDays, 
  ShieldCheck, 
  Share2, 
  PenTool, 
  TrendingUp,
  MessageSquare,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/lib/toast-context';
import SignatureButton from '@/features/peticoes/SignatureButton';
import SignatureProgress from '@/features/peticoes/SignatureProgress';
import { getPetitionById } from '@/services/petitions.service';
import { formatDate } from '@/lib/utils/formatters';
import type { Petition } from '@/types';

export default function PetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    if (!id) return;
    getPetitionById(id)
      .then((data) => {
        if (!data) {
          toast('Petição não encontrada', 'error');
          router.push('/peticoes');
          return;
        }
        setPetition(data);
      })
      .catch(() => toast('Erro ao carregar petição', 'error'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-tertiary" />
      </div>
    );
  }

  if (!petition) return null;

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
              {petition.status === 'active' ? 'Em Andamento' : petition.status}
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
                   <ShieldCheck className="w-4 h-4" />
                   {petition.category}
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tighter uppercase leading-[1.1]">
                   {petition.title}
                </h1>
             </div>
             
             <div className="flex flex-wrap items-center gap-6 py-6 border-y border-border">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center font-black text-sm uppercase text-primary">
                     {petition.creatorName.charAt(0)}
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Autor da Proposta</p>
                      <p className="text-xs font-black text-text-main">{petition.creatorName}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-surface border-2 border-border flex items-center justify-center text-text-muted">
                      <CalendarDays className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Publicado em</p>
                      <p className="text-xs font-black text-text-main">{formatDate(petition.createdAt)}</p>
                   </div>
                </div>
             </div>
          </header>

          {/* Description */}
          <section className="space-y-8">
             {petition.coverImageURL && (
             <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src={petition.coverImageURL} 
                  alt={petition.title} 
                  fill 
                  className="object-cover"
                />
             </div>
             )}
             
             <div>
                <h3 className="text-xl font-black text-text-main uppercase tracking-tight flex items-center gap-3">
                  <PenTool className="w-5 h-5 text-primary" />
                  Manifesto Cidadão
                </h3>
                <div className="text-lg font-ui text-text-muted font-medium leading-relaxed mt-4 whitespace-pre-line">
                   {petition.description}
                </div>
             </div>
          </section>

          {/* Supporters Section */}
          <section className="space-y-6 pt-6">
             <h3 className="text-xl font-black text-text-main uppercase tracking-tight flex items-center gap-3">
               <MessageSquare className="w-5 h-5 text-primary" />
               Apoio da Comunidade
             </h3>
             <p className="text-sm font-ui text-text-muted">
               {petition.signaturesCount} cidadãos já apoiaram esta causa.
             </p>
          </section>
        </div>

        {/* Right Column: Actions & Progress */}
        <div className="lg:col-span-1">
           <div className="sticky top-32 space-y-6">
              <div className="bg-white p-8 md:p-10 rounded-[3.5rem] border-2 border-border border-b-[12px] border-b-primary shadow-2xl space-y-8">
                 <div className="space-y-2">
                    <SignatureProgress current={petition.signaturesCount} goal={petition.goal} />
                 </div>

                 <div className="space-y-4">
                    <SignatureButton
                      petitionId={petition.id}
                      petitionTitle={petition.title}
                      onSign={() => {
                        getPetitionById(petition.id).then(setPetition);
                      }}
                      className="w-full justify-center"
                    />
                 </div>

                 <div className="pt-6 border-t border-border/50">
                    <div className="flex items-start gap-3">
                       <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-text-main uppercase tracking-tight">Assinatura Certificada</p>
                          <p className="text-[8px] font-medium text-text-muted font-ui">Sua identidade é validada via DigitalID para garantir a integridade da consulta pública.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {petition.officialReply && (
              <div className="bg-text-main p-8 rounded-[3rem] text-white space-y-4 shadow-xl">
                 <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Resposta Oficial</h4>
                 <p className="text-sm font-medium font-ui opacity-80 leading-relaxed">
                    {petition.officialReply}
                 </p>
              </div>
              )}
           </div>
        </div>
      </div>

    </div>
  );
}
