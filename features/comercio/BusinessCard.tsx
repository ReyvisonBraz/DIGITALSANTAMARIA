'use client';

import Image from 'next/image';
import { Clock, MapPin, MessageCircle, Phone, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { Business } from '@/types';

const CATEGORY_LABEL: Record<Business['category'], string> = {
  restaurante: 'Restaurante',
  farmacia: 'Farmácia',
  mercado: 'Mercado',
  servico: 'Serviço',
  loja: 'Loja',
  outros: 'Outros',
};

const CATEGORY_ACCENT: Record<Business['category'], string> = {
  restaurante: 'bg-accent/15 text-primary-dark border-accent/30',
  farmacia: 'bg-accent-success/12 text-accent-success border-accent-success/30',
  mercado: 'bg-secondary/15 text-secondary border-secondary/30',
  servico: 'bg-primary/10 text-primary border-primary/25',
  loja: 'bg-primary-dark/12 text-primary-dark border-primary-dark/25',
  outros: 'bg-surface text-text-muted border-border',
};

function buildWhatsAppLink(numbersOnly: string, businessName: string): string {
  const trimmed = numbersOnly.replace(/\D/g, '');
  const withCountry = trimmed.length === 11 || trimmed.length === 10 ? `55${trimmed}` : trimmed;
  const text = encodeURIComponent(`Olá! Encontrei "${businessName}" no portal Conecta Santa Maria.`);
  return `https://wa.me/${withCountry}?text=${text}`;
}

function buildMapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const hasWhatsapp = business.whatsapp.replace(/\D/g, '').length >= 10;
  const hasPhone = business.phone.trim().length > 0;
  const hasAddress = business.address.trim().length > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -2 }}
      className="group overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-[0_10px_34px_rgba(20,34,74,0.07)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_22px_50px_rgba(20,34,74,0.14)]"
    >
      {business.imageURL ? (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={business.imageURL}
            alt={business.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className={cn(
            'absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm',
            CATEGORY_ACCENT[business.category]
          )}>
            <Store className="h-3 w-3" />
            {CATEGORY_LABEL[business.category]}
          </span>
        </div>
      ) : null}

      <div className="space-y-3 p-6">
        {!business.imageURL && (
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]',
              CATEGORY_ACCENT[business.category]
            )}>
              <Store className="h-3 w-3" />
              {CATEGORY_LABEL[business.category]}
            </span>
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]',
              business.isOpen
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            )}>
              <span className={cn('h-1.5 w-1.5 rounded-full', business.isOpen ? 'bg-green-500' : 'bg-rose-500')} />
              {business.isOpen ? 'Aberto' : 'Fechado'}
            </span>
          </div>
        )}

        <h3
          className="text-xl font-semibold leading-snug tracking-tight text-text-main transition-colors group-hover:text-primary"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {business.title}
        </h3>

        <p className="line-clamp-2 text-sm font-medium leading-relaxed text-text-muted">
          {business.description}
        </p>

        <div className="flex flex-col gap-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
          {hasAddress && (
            <a
              href={buildMapsLink(business.address)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 truncate transition hover:text-primary"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{business.address}</span>
            </a>
          )}
          {business.hours && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {business.hours}
            </span>
          )}
        </div>

        {(hasWhatsapp || hasPhone) && (
          <div className="flex flex-col gap-2 pt-3 sm:flex-row">
            {hasWhatsapp && (
              <a
                href={buildWhatsAppLink(business.whatsapp, business.title)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-success px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-accent-success/90"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
            {hasPhone && (
              <a
                href={`tel:${business.phone.replace(/\D/g, '')}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                Ligar
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
