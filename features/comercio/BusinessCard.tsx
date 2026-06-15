'use client';

import Image from 'next/image';
import { Clock, MapPin, MessageCircle, Phone, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  BUSINESS_CATEGORY_ACCENT,
  getBusinessCategoryLabel,
} from '@/lib/constants/businesses';
import type { Business } from '@/types';

function buildWhatsAppLink(numbersOnly: string, businessName: string): string {
  const trimmed = numbersOnly.replace(/\D/g, '');
  const withCountry = trimmed.length === 11 || trimmed.length === 10 ? `55${trimmed}` : trimmed;
  const text = encodeURIComponent(`Ola! Encontrei "${businessName}" no portal Conecta Santa Maria.`);
  return `https://wa.me/${withCountry}?text=${text}`;
}

function buildMapsLink(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function getMapHref(business: Business): string {
  return business.mapURL?.trim() || buildMapsLink(business.address || business.title);
}

interface BusinessCardProps {
  business: Business;
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const categoryLabel = getBusinessCategoryLabel(business.category);
  const categoryAccent = BUSINESS_CATEGORY_ACCENT[business.category] ?? BUSINESS_CATEGORY_ACCENT.outros;
  const whatsapp = business.whatsapp || '';
  const phone = business.phone || '';
  const address = business.address || '';
  const hours = business.hours || '';
  const hasWhatsapp = whatsapp.replace(/\D/g, '').length >= 10;
  const hasPhone = phone.trim().length > 0;
  const hasAddress = address.trim().length > 0;

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
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span
            className={cn(
              'absolute left-4 top-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm',
              categoryAccent,
            )}
          >
            <Store className="h-3 w-3" />
            {categoryLabel}
          </span>
          <span
            className={cn(
              'absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm',
              business.isOpen
                ? 'border-green-200 bg-green-50/90 text-green-700'
                : 'border-rose-200 bg-rose-50/90 text-rose-700',
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', business.isOpen ? 'bg-green-500' : 'bg-rose-500')} />
            {business.isOpen ? 'Aberto' : 'Fechado'}
          </span>
        </div>
      ) : null}

      <div className="space-y-3 p-6">
        {!business.imageURL && (
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]',
                categoryAccent,
              )}
            >
              <Store className="h-3 w-3" />
              {categoryLabel}
            </span>
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em]',
                business.isOpen
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700',
              )}
            >
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
              href={getMapHref(business)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 truncate transition hover:text-primary"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{address}</span>
            </a>
          )}
          {hours && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {hours}
            </span>
          )}
        </div>

        {(hasWhatsapp || hasPhone) && (
          <div className="flex flex-col gap-2 pt-3 sm:flex-row">
            {hasWhatsapp && (
              <a
                href={buildWhatsAppLink(whatsapp, business.title)}
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
                href={`tel:${phone.replace(/\D/g, '')}`}
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
