'use client';

import React from 'react';
import { 
  Info, 
  Target, 
  Users, 
  ShieldCheck, 
  BarChart3, 
  MapPin, 
  Code2, 
  Globe,
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import { useToast } from '@/lib/toast-context';
import { useRouter } from 'next/navigation';

const team = [
  { name: 'Secretaria de Tecnologia', role: 'Infraestrutura & Redes', icon: Globe },
  { name: 'Comunicação Social', role: 'Conteúdo & Transparência', icon: Share2 },
  { name: 'Gabinete do Prefeito', role: 'Gestão Estratégica', icon: MapPin },
];

export default function SobrePage() {
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto min-h-screen p-6 md:p-12 pb-32 gap-20">
      
      {/* Header Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[11px] font-bold uppercase tracking-[0.18em] border border-primary/20">
            <Info className="w-4 h-4" />
            Edição 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-text-main tracking-tight leading-[1.0]" style={{ fontFamily: 'var(--font-display)' }}>
            Conectando <span className="text-gradient">pessoas e cidade</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-text-muted leading-relaxed">
            O Conecta Santa Maria é o portal oficial do cidadão de Santa Maria do Pará — feito para transparência, participação ativa e eficiência nos serviços municipais.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <div className="flex items-center gap-2 bg-surface px-6 py-4 rounded-2xl border border-border">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-text-main">100% dados abertos</span>
             </div>
             <div className="flex items-center gap-2 bg-surface px-6 py-4 rounded-2xl border border-border">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <span className="text-sm font-semibold text-text-main">Conforme a LGPD</span>
             </div>
          </div>
        </div>
        <div className="relative aspect-square order-1 lg:order-2">
           <div className="absolute inset-0 bg-primary/10 rounded-[4rem] rotate-6 scale-95" />
           <div className="absolute inset-0 bg-tertiary/10 rounded-[4rem] -rotate-3 scale-95" />
           <div className="relative w-full h-full rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl shadow-primary/20">
              <Image 
                 src="https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&h=800&fit=crop" 
                 alt="Cidade de Santa Maria do Pará" 
                fill 
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
           </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'Nossa Missão',
            desc: 'Facilitar o acesso a serviços públicos através de uma interface moderna e intuitiva.',
            icon: Target,
            color: 'bg-primary'
          },
          {
            title: 'Nossa Visão',
            desc: 'Ser a cidade mais conectada e transparente do estado até 2028.',
            icon: Globe,
            color: 'bg-tertiary'
          },
          {
            title: 'Cidadania Ativa',
            desc: 'Empoderar o cidadão para que ele seja o fiscal e o propositor da sua própria rua.',
            icon: Users,
            color: 'bg-primary'
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3rem] border-2 border-border hover:border-primary transition-all group shadow-sm flex flex-col gap-6">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", item.color)}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold text-text-main tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{item.title}</h3>
            <p className="text-sm font-medium text-text-muted leading-relaxed opacity-80">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Departments */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
           <h2 className="text-3xl md:text-4xl font-semibold text-text-main tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Quem cuida do portal?</h2>
           <p className="text-text-muted font-medium">O esforço conjunto de diversas secretarias municipais.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((t, idx) => (
            <div key={idx} className="p-6 bg-surface rounded-2xl border-2 border-border flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all">
               <div className="w-14 h-14 bg-white rounded-xl border-2 border-border flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                  <t.icon className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-base font-semibold text-text-main tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>{t.name}</h4>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.18em] mt-0.5">{t.role}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-dark p-12 md:p-20 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-[0_26px_70px_rgba(14,58,140,0.30)] animate-drift">
         <div className="relative z-10 space-y-6 max-w-xl">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.0]" style={{ fontFamily: 'var(--font-display)' }}>Participe da construção</h2>
            <p className="text-lg opacity-85 font-medium leading-relaxed">O portal evolui com base no que os cidadãos enviam pela Ouvidoria. Sua voz molda a próxima versão.</p>
            <div className="flex flex-wrap gap-4">
               <button
                onClick={() => router.push('/ouvidoria')}
                className="bg-white text-primary-dark px-8 py-4 rounded-2xl font-semibold text-sm shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
               >
                  Enviar feedback
               </button>
                <button
                 onClick={() => window.open('https://www.santamariadopara.pa.gov.br/portal-da-transparencia', '_blank', 'noopener,noreferrer')}
                 className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-white/10 transition-all active:scale-95"
                 aria-label="Acessar portal da transparencia municipal"
                >
                   Transparência
                </button>
            </div>
         </div>
         <div aria-hidden className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />
         <Code2 className="absolute -right-10 -top-10 w-64 h-64 opacity-10 rotate-12 animate-floaty" />
      </section>

    </div>
  );
}
