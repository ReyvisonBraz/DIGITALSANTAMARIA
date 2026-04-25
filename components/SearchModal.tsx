'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, MapPin, Store, Briefcase, Heart, MessageSquare, Calendar, DollarSign, Navigation, School, HardHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  href: string;
  icon: any;
}

const mockResults: SearchResult[] = [
  { id: '1', title: 'Relatar Buraco na Rua', category: 'Zeladoria', href: '/relatar', icon: MessageSquare },
  { id: '2', title: 'Unidade de Saúde Centro', category: 'Saúde', href: '/saude', icon: Heart },
  { id: '3', title: 'Vagas de Analista', category: 'Empregos', href: '/empregos', icon: Briefcase },
  { id: '4', title: 'Mercado Municipal', category: 'Comércio', href: '/comercio', icon: Store },
  { id: '5', title: 'Inscrição Escolar 2026', category: 'Educação', href: '/educacao', icon: School },
  { id: '6', title: 'Segunda Via IPTU', category: 'Tributos', href: '/tributos', icon: DollarSign },
  { id: '7', title: 'Festival de Música', category: 'Cultura', href: '/eventos', icon: Calendar },
  { id: '8', title: 'Horário de Ônibus', category: 'Trânsito', href: '/transito', icon: Navigation },
  { id: '9', title: 'Andamento de Obras', category: 'Transparência', href: '/obras', icon: HardHat },
  { id: '10', title: 'Petição Pavimentação', category: 'Petições', href: '/peticoes', icon: ArrowRight },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todas');

  const filters = ['Todas', 'Protocolos', 'Petições', 'Saúde', 'Cultura'];

  const results = React.useMemo(() => {
    let filtered = mockResults;
    
    if (activeFilter !== 'Todas') {
      filtered = mockResults.filter(r => r.category === activeFilter);
    }

    if (query.length > 1) {
      return filtered.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) || 
        r.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    return activeFilter === 'Todas' ? [] : filtered;
  }, [query, activeFilter]);

  // Bloquear scroll quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-text-main/40 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border-2 border-border overflow-hidden"
      >
        <div className="p-6 border-b-2 border-border">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-6 h-6 text-primary" />
            <input 
              autoFocus
              placeholder="O que você está procurando hoje?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-surface border-2 border-border pl-14 pr-12 py-5 rounded-2xl font-bold text-lg outline-none focus:border-primary transition-all shadow-inner"
            />
            <button 
              onClick={handleClose}
              className="absolute right-4 p-2 hover:bg-border rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>
          
          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
             {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2",
                    activeFilter === f 
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/30" 
                      : "bg-surface border-border text-text-muted hover:border-primary/30"
                  )}
                >
                   {f}
                </button>
             ))}
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {query.length === 0 ? (
            <div className="p-8 text-center space-y-4">
              <div className="p-4 bg-surface rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8 text-text-muted/70" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-text-main uppercase tracking-widest text-sm">Busca Global</p>
                <p className="text-xs text-text-muted font-ui">Digite pelo menos 2 caracteres para pesquisar em todo o portal.</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2 mb-4">Resultados Encontrados</p>
              {results.map((result) => (
                <Link 
                  key={result.id}
                  href={result.href}
                  onClick={handleClose}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 transition-all group"
                >
                  <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center group-hover:bg-white border-2 border-border transition-colors">
                    <result.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-black text-text-main uppercase text-sm tracking-tight">{result.title}</p>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{result.category}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-text-muted">
              <p className="font-black">Nenhum resultado para &quot;{query}&quot;</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-surface-container border-t-2 border-border flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest">
          <span>Dica: Use termos curtos como &quot;Saúde&quot; ou &quot;Luz&quot;</span>
          <div className="flex gap-4">
             <span className="flex items-center gap-1"><kbd className="bg-white border-2 border-border px-1.5 py-0.5 rounded-md text-[8px]">ESC</kbd> Fechar</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
