'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Music, 
  Palette, 
  Theater, 
  Utensils, 
  ChevronRight, 
  Heart, 
  Share2,
  Clock,
  Search,
  Filter,
  Plus,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';

const events = [
  {
    id: 1,
    title: 'Festival de Inverno 2026',
    category: 'Música',
    date: '25 Jul - 30 Jul',
    time: '18:00 - 23:00',
    location: 'Praça da Matriz',
    description: 'Cinco dias de jazz, MPB e gastronomia local no coração da cidade.',
    image: 'https://picsum.photos/seed/jazz/800/400',
    icon: Music,
    attendees: 1240
  },
  {
    id: 2,
    title: 'Feira do Livro Municipal',
    category: 'Cultura',
    date: '10 Ago - 15 Ago',
    time: '09:00 - 20:00',
    location: 'Centro de Convenções',
    description: 'Encontro de autores regionais, contação de histórias e feira de troca de livros.',
    image: 'https://picsum.photos/seed/books/800/400',
    icon: Palette,
    attendees: 850
  },
  {
    id: 3,
    title: 'Circuito Gastronômico',
    category: 'Gastronomia',
    date: 'Hoje',
    time: '11:00 - 22:00',
    location: 'Rua das Flores',
    description: 'Os melhores restaurantes da cidade com pratos exclusivos em formato street food.',
    image: 'https://picsum.photos/seed/food/800/400',
    icon: Utensils,
    attendees: 3200
  },
  {
    id: 4,
    title: 'Mostra de Teatro de Rua',
    category: 'Teatro',
    date: 'Amanhã',
    time: '16:00',
    location: 'Parque das Árvores',
    description: 'Peças gratuitas para todas as idades ao ar livre.',
    image: 'https://picsum.photos/seed/theater/800/400',
    icon: Theater,
    attendees: 420
  }
];

export default function EventosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [filter, setFilter] = useState('Todos');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const categories = ['Todos', 'Música', 'Cultura', 'Gastronomia', 'Teatro'];
  const filteredEvents = filter === 'Todos' ? events : events.filter(e => e.category === filter);

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-4 md:p-12 pb-32 gap-8 md:gap-12">
      
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-tertiary/20">
              <Calendar className="w-3 h-3" />
              Calendário 2026
           </div>
           <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-main tracking-tighter uppercase leading-none">Cultura <br /> <span className="text-tertiary">& Eventos.</span></h1>
        </div>
        <div className="flex bg-surface p-1.5 rounded-xl md:rounded-2xl border-2 border-border shadow-inner overflow-x-auto max-w-full no-scrollbar">
           {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setFilter(cat)}
               className={cn(
                "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                filter === cat ? "bg-white text-tertiary shadow-lg border border-tertiary/10" : "text-text-muted hover:text-tertiary"
               )}
             >
               {cat}
             </button>
           ))}
        </div>
      </section>

      {/* Featured Event Card */}
      <section 
        className="relative h-[350px] md:h-[500px] rounded-2xl md:rounded-[3.5rem] overflow-hidden group cursor-pointer border-2 md:border-4 border-white shadow-2xl"
        onClick={() => setSelectedEvent(events[0])}
      >
        <Image 
          src={events[0].image}
          alt={events[0].title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 md:p-10 flex flex-col md:flex-row items-end justify-between gap-6">
           <div className="space-y-3 md:space-y-4 max-w-xl text-white text-center md:text-left">
              <span className="px-4 py-1.5 bg-tertiary text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest inline-block">Destaque do Mês</span>
              <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase leading-none">{events[0].title}</h2>
              <p className="text-base md:text-lg opacity-80 font-ui font-medium line-clamp-2 md:line-clamp-none">A maior celebração cultural do ano está chegando. Garanta seu lugar.</p>
              <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
                 <div className="flex items-center gap-2 text-[9px] md:text-xs font-black uppercase tracking-widest bg-white/20 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl backdrop-blur-md">
                    <MapPin className="w-3 md:w-4 h-3 md:h-4" /> {events[0].location}
                 </div>
                 <div className="flex items-center gap-2 text-[9px] md:text-xs font-black uppercase tracking-widest bg-white/20 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl backdrop-blur-md">
                    <Clock className="w-3 md:w-4 h-3 md:h-4" /> {events[0].date}
                 </div>
              </div>
           </div>
           <button className="bg-white text-tertiary p-4 md:p-6 rounded-xl md:rounded-[2rem] shadow-2xl hover:scale-110 transition-transform hidden md:block">
              <ChevronRight className="w-6 md:w-8 h-6 md:h-8" />
           </button>
        </div>
      </section>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredEvents.map((event) => (
          <motion.article 
            key={event.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl md:rounded-[3rem] border-2 border-border shadow-sm group hover:border-tertiary transition-all flex flex-col h-full overflow-hidden"
          >
            <div className="relative h-48 md:h-56 overflow-hidden">
               <Image 
                 src={event.image} 
                 alt={event.title} 
                 fill 
                 className="object-cover group-hover:scale-110 transition-transform duration-700" 
                 referrerPolicy="no-referrer"
               />
               <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black text-tertiary uppercase tracking-widest border border-border/50">
                    {event.category}
                  </span>
               </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col flex-grow gap-4 md:gap-6">
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-text-main tracking-tight uppercase group-hover:text-tertiary transition-colors leading-none">{event.title}</h3>
                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest py-1">
                     <Calendar className="w-3 md:w-3.5 h-3 md:h-3.5 text-tertiary" /> {event.date}
                     <span className="opacity-30">|</span>
                     <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5 text-tertiary" /> {event.location}
                  </div>
               </div>

               <p className="text-sm font-ui font-medium text-text-muted leading-relaxed opacity-80 h-10 overflow-hidden line-clamp-2">
                 {event.description}
               </p>

               <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                             <Image src={`https://i.pravatar.cc/150?u=${i+event.id}`} fill alt="user" className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                     </div>
                     <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">+{event.attendees} interessados</span>
                  </div>
                  <Link 
                    href={`/eventos/${event.id}`}
                    className="p-3 bg-surface rounded-xl text-tertiary hover:bg-tertiary hover:text-white transition-all active:scale-90"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Info Section */}
      <section className="bg-text-main p-8 md:p-12 rounded-2xl md:rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
         <div className="relative z-10 flex-1 space-y-4 md:space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Promova seu Evento.</h2>
            <p className="text-base md:text-lg opacity-70 font-ui font-medium">Possui um coletivo cultural ou organiza feiras locais? Envie seu release para nossa secretaria de cultura.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <button 
                onClick={() => toast('Redirecionando para o formulário de cadastro de eventos culturais...', 'info')}
                className="btn-tactile bg-white text-text-main px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
               >
                  Quero Divulgar
               </button>
               <button 
                onClick={() => toast('Consultando editais de fomento à cultura abertos...', 'info')}
                className="btn-tactile border-2 border-white/20 px-6 py-3.5 md:px-8 md:py-4 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
               >
                  Editais Abertos
               </button>
            </div>
         </div>
         <Palette className="absolute -right-10 -bottom-10 w-48 h-48 md:w-64 md:h-64 opacity-10 rotate-12" />
      </section>

      {/* Event Details Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Detalhes do Evento"
      >
        {selectedEvent && (
          <div className="space-y-8 p-2">
             <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-border shadow-lg">
                <Image src={selectedEvent.image} alt={selectedEvent.title} fill className="object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-xl text-tertiary shadow-xl">
                   <selectedEvent.icon className="w-6 h-6" />
                </div>
             </div>

             <div className="space-y-4">
                <div className="inline-flex px-3 py-1 bg-surface border border-border rounded-lg text-[10px] font-black text-tertiary uppercase tracking-widest">
                   {selectedEvent.category} • {selectedEvent.attendees} confirmados
                </div>
                <h3 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">{selectedEvent.title}</h3>
                <p className="text-base font-ui font-medium text-text-muted leading-relaxed">{selectedEvent.description}</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface rounded-2xl border-2 border-border space-y-1">
                   <span className="text-[9px] font-black uppercase text-text-muted tracking-widest">Quando</span>
                   <p className="text-sm font-black text-text-main">{selectedEvent.date} às {selectedEvent.time}</p>
                </div>
                <div className="p-4 bg-surface rounded-2xl border-2 border-border space-y-1">
                   <span className="text-[9px] font-black uppercase text-text-muted tracking-widest">Onde</span>
                   <p className="text-sm font-black text-text-main">{selectedEvent.location}</p>
                </div>
             </div>

             <div className="flex gap-4 pt-4">
               <button 
                 onClick={() => toast('Presença confirmada! Notificaremos você 2h antes.', 'success')}
                 className="flex-1 btn-tactile bg-tertiary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
               >
                  <Users className="w-5 h-5" />
                  Confirmar Presença
               </button>
               <button 
                 onClick={() => toast('Salvando no calendário do dispositivo...', 'info')}
                 className="p-5 bg-white border-2 border-border rounded-2xl text-text-muted hover:text-tertiary hover:border-tertiary transition-all active:scale-90"
               >
                  <Plus className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => toast('Link de compartilhamento copiado!', 'info')}
                 className="p-5 bg-white border-2 border-border rounded-2xl text-text-muted hover:text-tertiary hover:border-tertiary transition-all active:scale-90"
               >
                  <Share2 className="w-5 h-5" />
               </button>
            </div>
          </div>
        )}
      </Modal>

      {/* NEW: Space Reservation Quick Access */}
      <section className="bg-surface p-8 md:p-14 rounded-2xl md:rounded-[3.5rem] border-2 border-border border-dashed flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 group">
         <div className="flex items-center gap-4 md:gap-6 text-center lg:text-left flex-col lg:flex-row">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center text-tertiary border-2 border-border shadow-sm group-hover:rotate-12 transition-transform shrink-0">
               <Theater className="w-8 md:w-10 h-8 md:h-10" />
            </div>
            <div className="space-y-1">
               <h3 className="text-xl md:text-2xl font-black text-text-main uppercase tracking-tighter leading-none">Reserva de Espaços Públicos</h3>
               <p className="text-xs md:text-sm font-ui font-medium text-text-muted max-w-lg leading-relaxed">Precisa de um local para seu ensaio ou workshop? Alugue ou solicite auditórios, quadras e centros culturais.</p>
            </div>
         </div>
         <button 
           onClick={() => toast('Carregando mapa de equipamentos culturais disponíveis para reserva...', 'info')}
           className="btn-tactile bg-text-main text-white px-8 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl hover:bg-tertiary transition-all w-full lg:w-auto"
         >
            Consultar Espaços
         </button>
      </section>

    </div>
  );
}
