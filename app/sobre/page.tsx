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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
            <Info className="w-4 h-4" />
            Edição 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter uppercase leading-none">
            Conectando <br /> 
            <span className="text-primary">Pessoas e Cidade.</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-text-muted font-ui leading-relaxed">
            O Digital Santa Maria é a plataforma oficial de serviços inteligentes para Santa Maria do Pará - PA, focada em transparência absoluta, participação ativa e eficiência na zeladoria municipal.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
             <div className="flex items-center gap-2 bg-surface px-6 py-4 rounded-2xl border-2 border-border">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span className="text-sm font-black text-text-main uppercase">100% Open Data</span>
             </div>
             <div className="flex items-center gap-2 bg-surface px-6 py-4 rounded-2xl border-2 border-border">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-sm font-black text-text-main uppercase">LGPD Compliant</span>
             </div>
          </div>
        </div>
        <div className="relative aspect-square order-1 lg:order-2">
           <div className="absolute inset-0 bg-primary/10 rounded-[4rem] rotate-6 scale-95" />
           <div className="absolute inset-0 bg-tertiary/10 rounded-[4rem] -rotate-3 scale-95" />
           <div className="relative w-full h-full rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl shadow-primary/20">
              <Image 
                src="https://picsum.photos/seed/tech/800/800" 
                alt="Innovation" 
                fill 
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
            color: 'bg-text-main'
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3rem] border-2 border-border hover:border-primary transition-all group shadow-sm flex flex-col gap-6">
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", item.color)}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-text-main tracking-tight uppercase">{item.title}</h3>
            <p className="text-sm font-ui font-medium text-text-muted leading-relaxed opacity-80">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Departments */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
           <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase">Quem cuida do Portal?</h2>
           <p className="text-text-muted font-ui">O esforço conjunto de diversas secretarias federais e municipais.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((t, idx) => (
            <div key={idx} className="p-6 bg-surface rounded-2xl border-2 border-border flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all">
               <div className="w-14 h-14 bg-white rounded-xl border-2 border-border flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                  <t.icon className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-text-main uppercase tracking-tight">{t.name}</h4>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{t.role}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-primary p-12 md:p-20 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-3xl">
         <div className="relative z-10 space-y-6 max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Participe da Construção.</h2>
            <p className="text-lg opacity-80 font-ui font-medium">O portal é atualizado semanalmente com base no feedback enviado pelos cidadãos através da Ouvidoria.</p>
            <div className="flex gap-4">
               <button 
                onClick={() => router.push('/ouvidoria')}
                className="bg-white text-primary px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:translate-y-[-2px] transition-all active:scale-95"
               >
                  Enviar Feedback
               </button>
               <button 
                onClick={() => toast('Redirecionando para o Portal de Transparência & APIs Municipais...', 'info')}
                className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
               >
                  Documentação API
               </button>
            </div>
         </div>
         <Code2 className="absolute -right-10 -top-10 w-64 h-64 opacity-10 rotate-12" />
      </section>

    </div>
  );
}
