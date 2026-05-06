'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, Clock, ChevronRight, Calendar, Phone, Users, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * ContentCard — Card reutilizável para qualquer tipo de conteúdo.
 *
 * Adapta-se automaticamente ao tipo de dado recebido:
 * - Se tiver imageURL → mostra imagem com fallback
 * - Se tiver status → badge colorido
 * - Se tiver date/time → mostra data formatada
 * - Se tiver address → mostra ícone de localização
 *
 * Props universais:
 * - title, description (obrigatórios)
 * - imageURL, status, date, address, phone (opcionais)
 * - action (slot para botão customizado)
 * - onClick (navegação)
 */

interface ContentCardProps {
  title: string;
  description: string;
  imageURL?: string | null;
  status?: string;
  statusColor?: string;
  date?: string;
  time?: string;
  address?: string;
  phone?: string;
  extra?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  badge?: { text: string; color: string };
  stats?: { label: string; value: string | number }[];
}

export default function ContentCard({
  title, description, imageURL, status, statusColor,
  date, time, address, phone, extra, action, onClick,
  className, badge, stats,
}: ContentCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        'bg-white rounded-[2rem] border-2 border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group cursor-pointer overflow-hidden',
        className,
      )}
    >
      {/* Imagem de capa */}
      {imageURL && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image src={imageURL} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {badge && (
            <span className={cn('absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest', badge.color)}>
              {badge.text}
            </span>
          )}
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-6 space-y-3">
        {/* Badge + Status */}
        <div className="flex items-center gap-2 flex-wrap">
          {!imageURL && badge && (
            <span className={cn('px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest', badge.color)}>
              {badge.text}
            </span>
          )}
          {status && (
            <span className={cn('px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest',
              statusColor || 'bg-primary/10 text-primary border border-primary/20')}>
              {status}
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="text-lg font-black text-text-main uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Descrição */}
        <p className="text-xs font-medium text-text-muted leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Metadados */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
          {date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {date}
            </span>
          )}
          {time && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {time}
            </span>
          )}
          {address && (
            <span className="flex items-center gap-1.5 truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              {address}
            </span>
          )}
          {phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" />
              {phone}
            </span>
          )}
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <span className="block text-lg font-black text-text-main">{s.value}</span>
                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Extra content slot */}
        {extra}

        {/* Action slot */}
        {action && <div className="pt-2">{action}</div>}
      </div>
    </motion.article>
  );
}
