'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Share2, 
  Heart, 
  Music, 
  Palette, 
  Theater, 
  Utensils, 
  ChevronRight,
  Info,
  BadgeCheck,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { useToast } from '@/lib/toast-context';
import { cn } from '@/lib/utils';

// Mock data matching events in parent page
const eventsDetailed = [
  {
    id: 1,
    title: 'Festival de Inverno 2026',
    category: 'Música',
    date: '25 Jul - 30 Jul',
    time: '18:00 - 23:00',
    location: 'Praça da Matriz, Centro',
    description: 'O tradicional Festival de Inverno chega à sua 15ª edição trazendo o melhor do jazz, bossa nova e música instrumental. Com palcos espalhados pela praça e uma vila gastronômica exclusiva, o evento é o ponto alto do calendário cultural da nossa cidade.',
    image: 'https://picsum.photos/seed/jazz_det/1200/600',
    icon: Music,
    attendees: 1240,
    price: 'Entrada Gratuita',
    organizer: 'Secretaria de Cultura e Turismo',
    tags: ['Jazz', 'Gastronomia', 'Família', 'Ar Livre']
  },
  {
    id: 2,
    title: 'Feira do Livro Municipal',
    category: 'Cultura',
    date: '10 Ago - 15 Ago',
    time: '09:00 - 20:00',
    location: 'Centro de Convenções Municipal',
    description: 'Uma imersão no mundo das letras. A feira contará com mais de 50 expositores, palestras com autores nacionais, oficinas de escrita criativa e um espaço dedicado exclusivamente à literatura infantil.',
    image: 'https://picsum.photos/seed/books_det/1200/600',
    icon: Palette,
    attendees: 850,
    price: 'Acesso Livre',
    organizer: 'Biblioteca Municipal Central',
    tags: ['Literatura', 'Oficinas', 'Educação', 'Debates']
  },
  {
    id: 3,
    title: 'Circuito Gastronômico',
    category: 'Gastronomia',
    date: 'Hoje',
    time: '11:00 - 22:00',
    location: 'Rua das Flores (Trecho Interditado)',
    description: 'Os sabores da nossa terra em destaque. Mais de 20 chefs locais apresentam pratos exclusivos utilizando ingredientes da agricultura familiar da nossa região. Música ao vivo e espaço kids disponível.',
    image: 'https://picsum.photos/seed/food_det/1200/600',
    icon: Utensils,
    attendees: 3200,
    price: 'Consumo no Local',
    organizer: 'Associação de Bares e Restaurantes',
    tags: ['Gourmet', 'Street Food', 'Música', 'Artesanato']
  },
  {
    id: 4,
    title: 'Mostra de Teatro de Rua',
    category: 'Teatro',
    date: 'Amanhã',
    time: '16:00',
    location: 'Parque das Árvores - Palco Anfiteatro',
    description: 'A arte que ocupa as ruas. Grandes companhias teatrais apresentam espetáculos que misturam circo, drama e comédia, interagindo diretamente com o público em um dos cenários mais bonitos da cidade.',
    image: 'https://picsum.photos/seed/theater_det/1200/600',
    icon: Theater,
    attendees: 420,
    price: 'Contribuição Voluntária',
    organizer: 'Coletivo de Artes Cênicas',
    tags: ['Performance', 'Interação', 'Circo', 'Gratuito']
  }
];

export default function EventoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const eventId = Number(params.id);
  const event = eventsDetailed.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-2xl font-black text-text-muted italic uppercase">Evento não encontrado.</h1>
        <button onClick={() => router.push('/eventos')} className="btn-tactile bg-tertiary text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest">
           Voltar para Eventos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      
      {/* Hero Header with Image */}
      <section className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
         <Image 
           src={event.image} 
           alt={event.title} 
           fill 
           className="object-cover"
           referrerPolicy="no-referrer"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
         
         {/* Floating Action Bar (Top) */}
         <div className="absolute top-8 left-0 right-0 z-20 px-6 md:px-12 max-w-7xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => router.back()}
              className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-white hover:bg-white hover:text-tertiary transition-all shadow-2xl active:scale-95"
            >
               <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-3">
               <button 
                onClick={() => toast('Evento favoritado!', 'success')}
                className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-white hover:bg-rose-500 hover:text-white transition-all shadow-2xl active:scale-95"
               >
                  <Heart className="w-6 h-6" />
               </button>
               <button 
                onClick={() => toast('Link copiado!', 'info')}
                className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-white hover:bg-tertiary hover:text-white transition-all shadow-2xl active:scale-95"
               >
                  <Share2 className="w-6 h-6" />
               </button>
            </div>
         </div>

         {/* Hero Title Area */}
         <div className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-12 pb-12 max-w-7xl mx-auto">
            <div className="space-y-4">
               <div className="inline-flex px-4 py-1.5 bg-tertiary text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                  {event.category}
               </div>
               <h1 className="text-4xl md:text-7xl font-black text-text-main tracking-tighter uppercase leading-none italic drop-shadow-sm">
                  {event.title}
               </h1>
            </div>
         </div>
      </section>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* Left Column: Info */}
         <div className="lg:col-span-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-[2rem] border-2 border-border shadow-sm flex items-center gap-4 group hover:border-tertiary transition-all">
                  <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center shrink-0">
                     <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Data</p>
                     <p className="font-black text-sm text-text-main leading-none">{event.date}</p>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-[2rem] border-2 border-border shadow-sm flex items-center gap-4 group hover:border-tertiary transition-all">
                  <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center shrink-0">
                     <Clock className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Horário</p>
                     <p className="font-black text-sm text-text-main leading-none">{event.time}</p>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-[2rem] border-2 border-border shadow-sm flex items-center gap-4 group hover:border-tertiary transition-all">
                  <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center shrink-0">
                     <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Acesso</p>
                     <p className="font-black text-sm text-text-main leading-none">{event.price}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <h2 className="text-2xl font-black text-text-main uppercase italic flex items-center gap-3">
                  <Info className="w-6 h-6 text-tertiary" />
                  Sobre o Evento
               </h2>
               <p className="text-xl font-ui font-medium text-text-muted leading-relaxed opacity-90 max-w-4xl text-justify">
                  {event.description}
               </p>
               <div className="flex flex-wrap gap-3 pt-4">
                  {event.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-surface border-2 border-border rounded-xl text-xs font-black uppercase text-text-muted transition-all hover:border-tertiary hover:text-tertiary cursor-default">
                       #{tag}
                    </span>
                  ))}
               </div>
            </div>

            <div className="p-8 bg-surface rounded-[3rem] border-2 border-border border-dashed flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="p-5 bg-white rounded-[2rem] shadow-xl border-4 border-tertiary/10 text-tertiary rotate-3">
                     <event.icon className="w-10 h-10" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-lg font-black text-text-main uppercase tracking-tight italic">Localização Exata</h3>
                     <p className="text-sm font-ui font-medium text-text-muted">{event.location}</p>
                  </div>
               </div>
               <button 
                onClick={() => toast('Abrindo guia de navegação...', 'info')}
                className="w-full md:w-auto btn-tactile bg-white border-2 border-border text-text-main px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-sm flex items-center justify-center gap-3"
               >
                  Ver no Mapa
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
         </div>

         {/* Right Column: Actions & Stats */}
         <div className="lg:col-span-4 space-y-10">
            <div className="bg-white p-10 rounded-[3.5rem] border-2 border-border border-b-[12px] border-b-tertiary shadow-2xl space-y-8">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-text-main uppercase tracking-tight italic">Sua Presença</h3>
                  <Users className="w-6 h-6 text-tertiary" />
               </div>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden relative shadow-md">
                             <Image src={`https://i.pravatar.cc/150?u=${i+event.id*10}`} fill alt="user" className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                     </div>
                     <span className="text-xs font-black text-text-muted uppercase tracking-widest">{event.attendees} Cidadãos já confirmaram</span>
                  </div>
               </div>

               <div className="space-y-3 pt-4">
                  <button 
                     onClick={() => toast('Sua presença foi registrada com sucesso!', 'success')}
                     className="w-full btn-tactile bg-tertiary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-tertiary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                     <CheckCircle2 className="w-5 h-5" />
                     Quero Ir
                  </button>
                  <p className="text-[10px] text-center font-bold text-text-muted opacity-50 uppercase tracking-widest leading-tight">
                     Confirmação opcional. Ajude a prefeitura a dimensionar a segurança e infraestrutura do local.
                  </p>
               </div>

               <div className="pt-8 border-t border-border space-y-4">
                  <div className="flex items-center gap-3">
                     <BadgeCheck className="w-5 h-5 text-green-500" />
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-wide">Evento Verificado pela Cultura</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <Users className="w-5 h-5 text-blue-500" />
                     <p className="text-xs font-bold font-ui text-text-main">{event.organizer}</p>
                  </div>
               </div>
            </div>

            <div className="bg-text-main p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
               <h4 className="text-lg font-black tracking-tight uppercase leading-tight mb-4 relative z-10 italic">Incentivo Cultural</h4>
               <p className="text-sm font-ui opacity-70 relative z-10 leading-relaxed mb-6">
                  Eventos gratuitos são financiados via Fundo Municipal de Cultura. Avalie a experiência após o evento para nos ajudar a melhorar.
               </p>
               <button 
                onClick={() => toast('Obrigado! Sua prévia de interesse foi enviada aos organizadores.', 'success')}
                className="relative z-10 w-full py-4 text-[10px] font-black uppercase text-tertiary bg-white rounded-xl shadow-xl active:scale-95"
               >
                  Avaliar Organização
               </button>
               <Palette className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:rotate-6 transition-transform" />
            </div>
         </div>
      </main>

    </div>
  );
}
