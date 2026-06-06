'use client';

import { useState } from 'react';
import {
  Bell,
  CalendarDays,
  Car,
  FileText,
  Gavel,
  HardHat,
  Heart,
  Leaf,
  Layers,
  Shield,
  Store,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NoticesAdmin from '@/features/gestao/content/NoticesAdmin';
import EventsAdmin from '@/features/gestao/content/EventsAdmin';
import WorksAdmin from '@/features/gestao/content/WorksAdmin';
import BusinessesAdmin from '@/features/gestao/content/BusinessesAdmin';
import TrafficAdmin from '@/features/gestao/content/TrafficAdmin';
import GenericCatalogAdmin, { type CatalogAdminConfig } from '@/features/gestao/content/GenericCatalogAdmin';
import { cn } from '@/lib/utils';

type ContentTab =
  | 'notices'
  | 'events'
  | 'works'
  | 'businesses'
  | 'traffic'
  | 'community'
  | 'safety'
  | 'environment'
  | 'social'
  | 'taxes'
  | 'polls'
  | 'services';

const TABS: { value: ContentTab; label: string; icon: LucideIcon }[] = [
  { value: 'notices', label: 'Avisos', icon: Bell },
  { value: 'events', label: 'Eventos', icon: CalendarDays },
  { value: 'works', label: 'Obras', icon: HardHat },
  { value: 'businesses', label: 'Comercio', icon: Store },
  { value: 'traffic', label: 'Transito', icon: Car },
  { value: 'community', label: 'Comunidade', icon: Users },
  { value: 'safety', label: 'Seguranca', icon: Shield },
  { value: 'environment', label: 'Ambiente', icon: Leaf },
  { value: 'social', label: 'Social', icon: Heart },
  { value: 'taxes', label: 'Tributos', icon: FileText },
  { value: 'polls', label: 'Votos', icon: Gavel },
  { value: 'services', label: 'Servicos', icon: Layers },
];

const CATALOGS: Record<Exclude<ContentTab, 'notices' | 'events' | 'works' | 'businesses' | 'traffic'>, CatalogAdminConfig> = {
  community: {
    collection: 'community_groups',
    eyebrow: 'Participacao comunitaria',
    title: 'grupos comunitarios',
    publicPath: '/comunidade',
    emptyTitle: 'Nenhum grupo comunitario publicado',
    categoryField: 'neighborhood',
    fields: [
      { name: 'neighborhood', label: 'Bairro', type: 'text', required: true },
      { name: 'category', label: 'Categoria', type: 'text', defaultValue: 'social', required: true },
      { name: 'membersCount', label: 'Membros', type: 'number', defaultValue: 0 },
      { name: 'meetingSchedule', label: 'Encontros', type: 'text', placeholder: 'Ex: Toda terca, 19h' },
      { name: 'contactPhone', label: 'Telefone de contato', type: 'text' },
      { name: 'imageURL', label: 'URL da imagem', type: 'text' },
    ],
  },
  safety: {
    collection: 'safety_zones',
    eyebrow: 'Seguranca publica',
    title: 'pontos de seguranca',
    publicPath: '/seguranca',
    emptyTitle: 'Nenhum ponto de seguranca publicado',
    categoryField: 'type',
    fields: [
      { name: 'type', label: 'Tipo', type: 'text', defaultValue: 'delegacia', required: true },
      { name: 'address', label: 'Endereco', type: 'text', required: true },
      { name: 'phone', label: 'Telefone', type: 'text' },
      { name: 'emergencyPhone', label: 'Telefone emergencial', type: 'text', required: true },
      { name: 'is24h', label: 'Atende 24h', type: 'checkbox', defaultValue: true },
      { name: 'lat', label: 'Latitude', type: 'number', defaultValue: 0 },
      { name: 'lng', label: 'Longitude', type: 'number', defaultValue: 0 },
    ],
  },
  environment: {
    collection: 'environment_data',
    eyebrow: 'Meio ambiente',
    title: 'informacoes ambientais',
    publicPath: '/meio-ambiente',
    emptyTitle: 'Nenhuma informacao ambiental publicada',
    categoryField: 'category',
    fields: [
      { name: 'category', label: 'Categoria', type: 'text', defaultValue: 'coleta', required: true },
      { name: 'days', label: 'Dias ou bairros atendidos', type: 'list', placeholder: 'Um item por linha' },
      { name: 'schedule', label: 'Horario', type: 'text' },
      { name: 'instructions', label: 'Instrucoes', type: 'textarea' },
      { name: 'contactPhone', label: 'Telefone de contato', type: 'text' },
    ],
  },
  social: {
    collection: 'social_programs',
    eyebrow: 'Assistencia social',
    title: 'programas sociais',
    publicPath: '/social',
    emptyTitle: 'Nenhum programa social publicado',
    categoryField: 'category',
    fields: [
      { name: 'category', label: 'Categoria', type: 'text', defaultValue: 'cras', required: true },
      { name: 'requirements', label: 'Requisitos', type: 'list', placeholder: 'Um requisito por linha' },
      { name: 'documents', label: 'Documentos', type: 'list', placeholder: 'Um documento por linha' },
      { name: 'address', label: 'Endereco', type: 'text', required: true },
      { name: 'phone', label: 'Telefone', type: 'text' },
      { name: 'schedule', label: 'Horario', type: 'text' },
      { name: 'targetAudience', label: 'Publico alvo', type: 'text' },
    ],
  },
  taxes: {
    collection: 'tax_records',
    eyebrow: 'Fazenda municipal',
    title: 'tributos',
    publicPath: '/tributos',
    emptyTitle: 'Nenhum tributo publicado',
    categoryField: 'type',
    fields: [
      { name: 'type', label: 'Tipo', type: 'text', defaultValue: 'iptu', required: true },
      { name: 'year', label: 'Ano', type: 'number', defaultValue: new Date().getFullYear(), required: true },
      { name: 'dueDate', label: 'Vencimento', type: 'text', placeholder: '2026-07-10' },
      { name: 'amount', label: 'Valor', type: 'number', defaultValue: 0 },
      { name: 'installmentCount', label: 'Parcelas', type: 'number', defaultValue: 1 },
      { name: 'installmentValue', label: 'Valor da parcela', type: 'number', defaultValue: 0 },
      { name: 'paymentMethods', label: 'Formas de pagamento', type: 'list', placeholder: 'PIX\nBoleto' },
    ],
  },
  polls: {
    collection: 'polls',
    eyebrow: 'Participacao cidada',
    title: 'votacoes',
    publicPath: '/votos',
    emptyTitle: 'Nenhuma votacao publicada',
    categoryField: 'category',
    fields: [
      { name: 'category', label: 'Categoria', type: 'text', defaultValue: 'consulta', required: true },
      { name: 'options', label: 'Opcoes de voto', type: 'options', required: true, placeholder: 'Uma opcao por linha' },
      { name: 'totalVotes', label: 'Total de votos', type: 'number', defaultValue: 0 },
      { name: 'startDate', label: 'Inicio', type: 'text', placeholder: '2026-06-01' },
      { name: 'endDate', label: 'Fim', type: 'text', placeholder: '2026-06-30' },
      { name: 'isActive', label: 'Ativa', type: 'checkbox', defaultValue: true },
    ],
  },
  services: {
    collection: 'public_services',
    eyebrow: 'Catalogo municipal',
    title: 'servicos publicos',
    publicPath: '/servicos',
    emptyTitle: 'Nenhum servico publico publicado',
    categoryField: 'category',
    fields: [
      { name: 'category', label: 'Categoria', type: 'text', defaultValue: 'documento', required: true },
      { name: 'department', label: 'Departamento', type: 'text', required: true },
      { name: 'address', label: 'Endereco', type: 'text' },
      { name: 'phone', label: 'Telefone', type: 'text' },
      { name: 'schedule', label: 'Horario', type: 'text' },
      { name: 'requirements', label: 'Requisitos', type: 'list', placeholder: 'Um requisito por linha' },
      { name: 'steps', label: 'Passo a passo', type: 'list', placeholder: 'Uma etapa por linha' },
      { name: 'onlineURL', label: 'Link online', type: 'text' },
    ],
  },
};

export default function ContentAdminPanel() {
  const [tab, setTab] = useState<ContentTab>('notices');

  return (
    <div className="space-y-5">
      <div className="glass-panel grid grid-cols-2 gap-1 p-1 sm:grid-cols-3 lg:grid-cols-6">
        {TABS.map((item) => {
          const active = item.value === tab;
          const Icon = item.icon;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold uppercase tracking-widest transition',
                active ? 'bg-primary text-white' : 'text-text-muted hover:text-primary',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === 'notices' && <NoticesAdmin />}
      {tab === 'events' && <EventsAdmin />}
      {tab === 'works' && <WorksAdmin />}
      {tab === 'businesses' && <BusinessesAdmin />}
      {tab === 'traffic' && <TrafficAdmin />}
      {tab === 'community' && <GenericCatalogAdmin config={CATALOGS.community} />}
      {tab === 'safety' && <GenericCatalogAdmin config={CATALOGS.safety} />}
      {tab === 'environment' && <GenericCatalogAdmin config={CATALOGS.environment} />}
      {tab === 'social' && <GenericCatalogAdmin config={CATALOGS.social} />}
      {tab === 'taxes' && <GenericCatalogAdmin config={CATALOGS.taxes} />}
      {tab === 'polls' && <GenericCatalogAdmin config={CATALOGS.polls} />}
      {tab === 'services' && <GenericCatalogAdmin config={CATALOGS.services} />}
    </div>
  );
}
