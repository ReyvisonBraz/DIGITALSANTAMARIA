'use client';

import React, { useState } from 'react';
import { 
  Store, 
  ShoppingBag, 
  Star, 
  MapPin, 
  Search, 
  Filter, 
  ChevronRight, 
  Tag, 
  TrendingUp, 
  Clock, 
  Phone, 
  Globe,
  Share2,
  Heart,
  Zap,
  Info,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import SidePanel from '@/components/ui/SidePanel';
import Modal from '@/components/ui/Modal';

const shops = [
  {
    id: '1',
    name: 'Padaria Bella Vista',
    category: 'Restaurantes',
    address: 'Rua Principal, 120 - Centro',
    rating: 4.9,
    reviews: 128,
    image: 'https://picsum.photos/seed/bakery/800/400',
    tags: ['Tradicional', 'Pães Artesanais']
  },
  {
    id: '2',
    name: 'Tech & Games Store',
    category: 'Serviços',
    address: 'Shopping Center - 2º Piso',
    rating: 4.7,
    reviews: 85,
    image: 'https://picsum.photos/seed/techstore/800/400',
    tags: ['Informática', 'Acessórios']
  },
  {
    id: '3',
    name: 'Pet Shop Amigo Fiel',
    category: 'Serviços',
    address: 'Av. das Nações, 500 - Vila Nova',
    rating: 4.8,
    reviews: 210,
    image: 'https://picsum.photos/seed/petshop/800/400',
    tags: ['Banho & Tosa', 'Rações']
  },
  {
    id: '4',
    name: 'Farmácia Vida Longa',
    category: 'Farmácias',
    address: 'Rua da Saúde, 45 - Centro',
    rating: 4.6,
    reviews: 432,
    image: 'https://picsum.photos/seed/pharmacy/800/400',
    tags: ['24 Horas', 'Medicamentos']
  },
  {
    id: '5',
    name: 'Mercado do Bairro',
    category: 'Mercados',
    address: 'Rua dos Pomares, 22 - Vila Nova',
    rating: 4.5,
    reviews: 156,
    image: 'https://picsum.photos/seed/market/800/400',
    tags: ['Hortifruti', 'Pronta Entrega']
  }
];

export default function ComercioPage() {
  const { toast } = useToast();
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const categories = ['Todos', 'Restaurantes', 'Farmácias', 'Mercados', 'Serviços'];
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredShops = shops.filter(s => 
    selectedCategory === 'Todos' || s.category === selectedCategory
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      
      {/* Sidebar: List of Merchants */}
      <aside className="w-full md:w-[400px] lg:w-[480px] bg-white border-r-2 border-border flex flex-col z-40 relative shadow-2xl">
         
         {/* Sidebar Header */}
         <div className="p-6 md:p-8 space-y-6 border-b-2 border-border bg-white sticky top-0 z-20">
            <div className="space-y-1">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest border border-primary/20">
                  <Store className="w-3 h-3" />
                  Economia Local
               </div>
               <h1 className="text-3xl font-black text-text-main tracking-tighter uppercase leading-none">Comércio <br/> <span className="text-primary">Local.</span></h1>
            </div>

            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
               <input 
                  placeholder="O que você precisa hoje?"
                  className="w-full bg-surface border-2 border-border p-4 pl-12 rounded-2xl text-xs font-bold italic focus:border-primary outline-none transition-all shadow-inner"
               />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
               {categories.map((cat) => (
                  <button 
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={cn(
                        "flex-none px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border-2",
                        selectedCategory === cat 
                           ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                           : "bg-white border-border text-text-muted hover:border-primary/50"
                     )}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         {/* Merchant List */}
         <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar bg-surface/30">
            {filteredShops.map((shop) => (
               <motion.div 
                  key={shop.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedShop(shop)}
                  className="bg-white p-4 rounded-3xl border-2 border-border hover:border-primary hover:shadow-xl transition-all cursor-pointer group flex gap-4"
               >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] overflow-hidden shrink-0 shadow-md">
                     <Image 
                        src={shop.image} 
                        alt={shop.name} 
                        width={100} 
                        height={100} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                     />
                  </div>
                  <div className="flex-grow py-1 flex flex-col justify-between">
                     <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{shop.category}</span>
                           <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-3 h-3 fill-yellow-500" />
                              <span className="text-[10px] font-black">{shop.rating}</span>
                           </div>
                        </div>
                        <h3 className="text-sm md:text-base font-black text-text-main uppercase leading-tight group-hover:text-primary transition-colors">{shop.name}</h3>
                     </div>
                     <p className="text-[10px] font-ui font-medium text-text-muted flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-primary" />
                        {shop.address}
                     </p>
                  </div>
               </motion.div>
            ))}
            
            {/* Promotion Card in Sidebar */}
            <div className="p-8 bg-text-main rounded-[2.5rem] text-white space-y-4 mt-8 relative overflow-hidden group shadow-2xl">
               <h4 className="text-xl font-black uppercase italic leading-tight relative z-10">Selo Digital <br/> Santa Maria.</h4>
               <p className="text-[10px] opacity-60 font-ui font-medium italic relative z-10">Lojas com este selo garantem benefícios exclusivos para cidadãos registrados.</p>
               <button className="w-full py-4 bg-white text-text-main rounded-xl font-black text-[9px] uppercase tracking-widest relative z-10 hover:brightness-95 transition-all">Saber Mais</button>
               <Store className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
            </div>
         </div>
      </aside>

      {/* Main Content: Map View */}
      <section className="flex-grow relative bg-slate-200">
         <div className="absolute inset-0 z-0">
            <Image 
               src="https://picsum.photos/seed/map/1920/1080" 
               alt="Mapa da Cidade" 
               fill 
               className="object-cover grayscale contrast-125"
               referrerPolicy="no-referrer"
            />
            
            {/* Mock Map Markers */}
            <div className="absolute top-1/3 left-1/3 group cursor-pointer">
               <div className="bg-primary text-white p-4 rounded-full shadow-2xl border-4 border-white animate-bounce-slow">
                  <Store className="w-6 h-6" />
               </div>
               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white p-3 rounded-2xl shadow-2xl border-2 border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <p className="text-xs font-black text-text-main uppercase italic">Padaria Bella Vista</p>
               </div>
            </div>

            <div className="absolute top-1/2 left-2/3 group cursor-pointer">
               <div className="bg-tertiary text-white p-4 rounded-full shadow-2xl border-4 border-white animate-pulse">
                  <Tag className="w-6 h-6" />
               </div>
               <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white p-3 rounded-2xl shadow-2xl border-2 border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <p className="text-xs font-black text-text-main uppercase italic">Promotion: 20% OFF</p>
               </div>
            </div>
         </div>

         {/* Map Controls */}
         <div className="absolute bottom-8 right-8 flex flex-col gap-3 z-10">
            <div className="bg-white rounded-2xl border-2 border-border shadow-2xl flex flex-col overflow-hidden">
               <button className="p-4 hover:bg-surface border-b-2 border-border transition-colors"><Plus className="w-6 h-6 text-primary" /></button>
               <button className="p-4 hover:bg-surface transition-colors"><ChevronRight className="w-6 h-6 text-primary rotate-90" /></button>
            </div>
            <button className="p-4 bg-primary text-white rounded-2xl shadow-2xl hover:scale-105 transition-transform active:scale-95">
               <MapPin className="w-6 h-6" />
            </button>
         </div>

         {/* Map Overlay Detail Card (Optional) */}
         <AnimatePresence>
            {selectedShop && (
               <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="absolute bottom-8 left-8 right-8 md:right-auto md:w-[400px] z-20"
               >
                  <div className="bg-white p-6 rounded-[2.5rem] border-2 border-primary shadow-2xl flex items-center gap-6 relative overflow-hidden group">
                     <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shrink-0 border-2 border-border shadow-lg">
                        <Image src={selectedShop.image} alt={selectedShop.name} fill className="object-cover" />
                     </div>
                     <div className="flex-grow space-y-3">
                        <div>
                           <h4 className="text-xl font-black text-text-main uppercase italic tracking-tight">{selectedShop.name}</h4>
                           <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest italic">{selectedShop.address}</p>
                        </div>
                        <div className="flex gap-2">
                           <button 
                              onClick={() => setSelectedShop(null)}
                              className="px-6 py-2.5 bg-surface border-2 border-border rounded-xl text-[9px] font-black uppercase tracking-widest"
                           >
                              Fechar
                           </button>
                           <button 
                              className="flex-grow px-6 py-2.5 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                           >
                              Como Chegar
                           </button>
                        </div>
                     </div>
                     <button 
                        onClick={() => setSelectedShop(null)}
                        className="absolute top-4 right-4 text-text-muted hover:text-rose-500 transition-colors"
                     >
                        <X className="w-5 h-5" />
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

      </section>

      {/* SidePanel: Shop Details */}
      <SidePanel 
        isOpen={!!selectedShop} 
        onClose={() => setSelectedShop(null)}
        title="Loja em Foco"
      >
        {selectedShop && (
          <div className="space-y-8 p-6 md:p-8">
             <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-border shadow-lg">
                <Image src={selectedShop.image} alt={selectedShop.name} fill className="object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-yellow-600 shadow-xl flex items-center gap-2 border border-yellow-200">
                   <Star className="w-5 h-5 fill-yellow-600" />
                   <span className="font-black text-sm tabular-nums">{selectedShop.rating}</span>
                </div>
             </div>

             <div className="space-y-2">
                <div className="inline-flex px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest mb-2">
                   {selectedShop.category}
                </div>
                <h3 className="text-3xl font-black text-text-main tracking-tighter uppercase italic leading-none">{selectedShop.name}</h3>
                <p className="text-sm font-ui font-medium text-text-muted flex items-center gap-1.5 italic">
                   <MapPin className="w-4 h-4 text-primary" /> {selectedShop.address}
                </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => toast('Ligando para o estabelecimento...', 'info')}
                  className="p-5 bg-surface rounded-2xl border-2 border-border flex flex-col items-center gap-2 hover:border-primary transition-all group"
                >
                   <Phone className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Ligar Agora</span>
                </button>
                <button 
                  onClick={() => toast('Abrindo site oficial ou rede social...', 'info')}
                  className="p-5 bg-surface rounded-2xl border-2 border-border flex flex-col items-center gap-2 hover:border-primary transition-all group"
                >
                   <Globe className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Visitar Site</span>
                </button>
             </div>

             <div className="bg-surface p-6 rounded-3xl border-2 border-border border-dashed space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-xs font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Horário de Funcionamento
                   </h4>
                   <span className="text-[9px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Aberto</span>
                </div>
                <div className="space-y-2 text-xs font-bold text-text-muted font-ui italic">
                   <div className="flex justify-between"><span>Segunda - Sexta</span> <span>08:00 — 19:00</span></div>
                   <div className="flex justify-between"><span>Sábado</span> <span>08:00 — 13:00</span></div>
                   <div className="flex justify-between text-rose-500"><span>Domingo</span> <span>Fechado</span></div>
                </div>
             </div>

             <div className="p-6 bg-primary/5 rounded-3xl border-2 border-primary/20 space-y-3">
                <h4 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                   <Zap className="w-4 h-4" />
                   Promoção da Semana
                </h4>
                <p className="text-sm font-black text-text-main uppercase tracking-tight italic leading-tight">
                   Apresente seu DigitalID e ganhe 10% de desconto em qualquer compra acima de R$ 50,00!
                </p>
             </div>

             <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => toast('Estabelecimento adicionado aos seus favoritos!', 'success')}
                  className="p-5 bg-white border-2 border-border rounded-2xl text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-90"
                >
                   <Heart className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => toast('Compartilhando vitrine local...', 'info')}
                  className="p-5 bg-white border-2 border-border rounded-2xl text-text-muted hover:text-primary hover:border-primary transition-all active:scale-90"
                >
                   <Share2 className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => toast('Abrindo rota GPS para o estabelecimento...', 'info')}
                  className="flex-grow btn-tactile bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                >
                   Como chegar
                   <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>
        )}
      </SidePanel>

    </div>
  );
}
