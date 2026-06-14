'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Bell,
  CalendarDays,
  CalendarCheck,
  Car,
  ClipboardList,
  FileText,
  Gavel,
  GraduationCap,
  HardHat,
  Heart,
  Hospital,
  Briefcase,
  Leaf,
  Layers,
  Pill,
  Shield,
  Siren,
  Store,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NoticesAdmin from '@/features/gestao/content/NoticesAdmin';
import EventsAdmin from '@/features/gestao/content/EventsAdmin';
import WorksAdmin from '@/features/gestao/content/WorksAdmin';
import BusinessesAdmin from '@/features/gestao/content/BusinessesAdmin';
import TrafficAdmin from '@/features/gestao/content/TrafficAdmin';
import HealthUnitsAdmin from '@/features/gestao/content/HealthUnitsAdmin';
import JobsAdmin from '@/features/gestao/content/JobsAdmin';
import AppointmentsAdmin from '@/features/gestao/content/AppointmentsAdmin';
import ApplicationsAdmin from '@/features/gestao/content/ApplicationsAdmin';
import EnrollmentsAdmin from '@/features/gestao/content/EnrollmentsAdmin';
import EmergencyAlertsAdmin from '@/features/gestao/content/EmergencyAlertsAdmin';
import GenericCatalogAdmin, { type CatalogAdminConfig } from '@/features/gestao/content/GenericCatalogAdmin';
import { FEATURE_STATUS, type FeatureEntry } from '@/lib/constants/feature-status';
import DevBadge from '@/components/ui/DevBadge';
import { cn } from '@/lib/utils';

export type ContentTab =
  | 'notices'
  | 'events'
  | 'works'
  | 'businesses'
  | 'traffic'
  | 'health'
  | 'appointments'
  | 'pharmacy'
  | 'jobs'
  | 'applications'
  | 'education'
  | 'enrollments'
  | 'community'
  | 'safety'
  | 'emergency'
  | 'environment'
  | 'social'
  | 'taxes'
  | 'polls'
  | 'services';

type ContentGroup = 'all' | 'publishing' | 'operations' | 'registries' | 'participation';

const GROUPS: { value: ContentGroup; label: string; description: string }[] = [
  { value: 'all', label: 'Todos', description: 'Todas as areas' },
  { value: 'publishing', label: 'Publicacao', description: 'Informacoes publicas' },
  { value: 'operations', label: 'Atendimento', description: 'Filas de trabalho' },
  { value: 'registries', label: 'Cadastros', description: 'Bases municipais' },
  { value: 'participation', label: 'Participacao', description: 'Comunidade e votos' },
];

const TABS: { value: ContentTab; label: string; icon: LucideIcon; group: Exclude<ContentGroup, 'all'> }[] = [
  { value: 'notices', label: 'Avisos', icon: Bell, group: 'publishing' },
  { value: 'events', label: 'Eventos', icon: CalendarDays, group: 'publishing' },
  { value: 'works', label: 'Obras', icon: HardHat, group: 'publishing' },
  { value: 'businesses', label: 'Comercio', icon: Store, group: 'publishing' },
  { value: 'traffic', label: 'Transito', icon: Car, group: 'publishing' },
  { value: 'appointments', label: 'Consultas', icon: CalendarCheck, group: 'operations' },
  { value: 'applications', label: 'Candidaturas', icon: ClipboardList, group: 'operations' },
  { value: 'enrollments', label: 'Matriculas', icon: GraduationCap, group: 'operations' },
  { value: 'emergency', label: 'Emergencias', icon: Siren, group: 'operations' },
  { value: 'health', label: 'Unidades', icon: Hospital, group: 'registries' },
  { value: 'pharmacy', label: 'Farmacia', icon: Pill, group: 'registries' },
  { value: 'jobs', label: 'Vagas', icon: Briefcase, group: 'registries' },
  { value: 'education', label: 'Educacao', icon: GraduationCap, group: 'registries' },
  { value: 'safety', label: 'Seguranca', icon: Shield, group: 'registries' },
  { value: 'environment', label: 'Ambiente', icon: Leaf, group: 'registries' },
  { value: 'social', label: 'Social', icon: Heart, group: 'registries' },
  { value: 'taxes', label: 'Tributos', icon: FileText, group: 'registries' },
  { value: 'services', label: 'Servicos', icon: Layers, group: 'registries' },
  { value: 'community', label: 'Comunidade', icon: Users, group: 'participation' },
  { value: 'polls', label: 'Votos', icon: Gavel, group: 'participation' },
];

const OPERATION_TABS: ContentTab[] = ['appointments', 'applications', 'enrollments', 'emergency'];

const CATALOGS: Record<Exclude<ContentTab, 'notices' | 'events' | 'works' | 'businesses' | 'traffic' | 'health' | 'appointments' | 'jobs' | 'applications' | 'enrollments' | 'emergency'>, CatalogAdminConfig> = {
  community: {
    collection: 'community_groups',
    eyebrow: 'Participacao comunitaria',
    title: 'grupos comunitarios',
    publicPath: '/comunidade',
    emptyTitle: 'Nenhum grupo comunitario publicado',
    categoryField: 'neighborhood',
    fields: [
      { name: 'neighborhood', label: 'Bairro', type: 'text', required: true },
      {
        name: 'category',
        label: 'Categoria',
        type: 'select',
        defaultValue: 'social',
        required: true,
        options: [
          { value: 'seguranca', label: 'Seguranca' },
          { value: 'cultura', label: 'Cultura' },
          { value: 'esporte', label: 'Esporte' },
          { value: 'meio_ambiente', label: 'Meio ambiente' },
          { value: 'social', label: 'Social' },
          { value: 'outros', label: 'Outros' },
        ],
      },
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
      {
        name: 'type',
        label: 'Tipo',
        type: 'select',
        defaultValue: 'delegacia',
        required: true,
        options: [
          { value: 'delegacia', label: 'Delegacia' },
          { value: 'policiamento', label: 'Policiamento' },
          { value: 'guarda_municipal', label: 'Guarda municipal' },
          { value: 'bombeiro', label: 'Bombeiro' },
          { value: 'defesa_civil', label: 'Defesa civil' },
        ],
      },
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
    title: 'informações ambientais',
    publicPath: '/meio-ambiente',
    emptyTitle: 'Nenhuma informação ambiental publicada',
    categoryField: 'category',
    fields: [
      {
        name: 'category',
        label: 'Categoria',
        type: 'select',
        defaultValue: 'coleta',
        required: true,
        options: [
          { value: 'coleta', label: 'Coleta' },
          { value: 'denuncia', label: 'Denuncia' },
          { value: 'programa', label: 'Programa' },
          { value: 'area_verde', label: 'Area verde' },
          { value: 'reciclagem', label: 'Reciclagem' },
        ],
      },
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
      {
        name: 'category',
        label: 'Categoria',
        type: 'select',
        defaultValue: 'cras',
        required: true,
        options: [
          { value: 'habitacao', label: 'Habitacao' },
          { value: 'cras', label: 'CRAS' },
          { value: 'cadastro_unico', label: 'Cadastro unico' },
          { value: 'bolsa_familia', label: 'Bolsa Familia' },
          { value: 'idoso', label: 'Idoso' },
          { value: 'crianca', label: 'Crianca' },
        ],
      },
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
      {
        name: 'type',
        label: 'Tipo',
        type: 'select',
        defaultValue: 'iptu',
        required: true,
        options: [
          { value: 'iptu', label: 'IPTU' },
          { value: 'iss', label: 'ISS' },
          { value: 'taxa', label: 'Taxa' },
          { value: 'certidao', label: 'Certidao' },
          { value: 'parcelamento', label: 'Parcelamento' },
        ],
      },
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
      {
        name: 'category',
        label: 'Categoria',
        type: 'select',
        defaultValue: 'consulta',
        required: true,
        options: [
          { value: 'orcamento', label: 'Orcamento' },
          { value: 'lei', label: 'Lei' },
          { value: 'consulta', label: 'Consulta' },
          { value: 'projeto', label: 'Projeto' },
        ],
      },
      { name: 'options', label: 'Opcoes de voto', type: 'options', required: true, placeholder: 'Uma opcao por linha' },
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
      {
        name: 'category',
        label: 'Categoria',
        type: 'select',
        defaultValue: 'documento',
        required: true,
        options: [
          { value: 'documento', label: 'Documento' },
          { value: 'saude', label: 'Saude' },
          { value: 'educacao', label: 'Educacao' },
          { value: 'social', label: 'Social' },
          { value: 'tributos', label: 'Tributos' },
          { value: 'obras', label: 'Obras' },
          { value: 'transito', label: 'Transito' },
          { value: 'outros', label: 'Outros' },
        ],
      },
      { name: 'department', label: 'Departamento', type: 'text', required: true },
      { name: 'address', label: 'Endereco', type: 'text' },
      { name: 'phone', label: 'Telefone', type: 'text' },
      { name: 'schedule', label: 'Horario', type: 'text' },
      { name: 'requirements', label: 'Requisitos', type: 'list', placeholder: 'Um requisito por linha' },
      { name: 'steps', label: 'Passo a passo', type: 'list', placeholder: 'Uma etapa por linha' },
      { name: 'onlineURL', label: 'Link online', type: 'text' },
    ],
  },
  pharmacy: {
    collection: 'pharmacy_items',
    eyebrow: 'Farmacia municipal',
    title: 'medicamentos',
    publicPath: '/saude',
    emptyTitle: 'Nenhum medicamento publicado',
    categoryField: 'stockStatus',
    fields: [
      {
        name: 'category',
        label: 'Categoria',
        type: 'select',
        defaultValue: 'outros',
        required: true,
        options: [
          { value: 'antibiotico', label: 'Antibiotico' },
          { value: 'analgesico', label: 'Analgesico' },
          { value: 'pressao', label: 'Pressao' },
          { value: 'diabetes', label: 'Diabetes' },
          { value: 'vacina', label: 'Vacina' },
          { value: 'outros', label: 'Outros' },
        ],
      },
      { name: 'unit', label: 'Unidade de medida', type: 'text', defaultValue: 'unidades', required: true },
      { name: 'quantity', label: 'Quantidade', type: 'number', defaultValue: 0, required: true },
      {
        name: 'stockStatus',
        label: 'Status do estoque',
        type: 'select',
        defaultValue: 'available',
        required: true,
        options: [
          { value: 'available', label: 'Disponivel' },
          { value: 'low_stock', label: 'Baixo estoque' },
          { value: 'unavailable', label: 'Em falta' },
        ],
      },
      { name: 'location', label: 'Local de retirada', type: 'text', defaultValue: 'Farmacia Municipal', required: true },
      { name: 'requiresPrescription', label: 'Exige receita', type: 'checkbox', defaultValue: true },
    ],
  },
  education: {
    collection: 'education_schools',
    eyebrow: 'Rede municipal de ensino',
    title: 'unidades escolares',
    publicPath: '/educacao',
    emptyTitle: 'Nenhuma unidade escolar publicada',
    categoryField: 'type',
    fields: [
      { name: 'type', label: 'Tipo de ensino', type: 'text', defaultValue: 'Ensino Fundamental', required: true },
      { name: 'address', label: 'Endereco', type: 'text', required: true },
      { name: 'availabilityStatus', label: 'Status de vagas', type: 'text', defaultValue: 'Vagas Abertas', required: true },
      { name: 'rating', label: 'Avaliacao', type: 'number', defaultValue: 0 },
      { name: 'ideb', label: 'IDEB', type: 'number', defaultValue: 0 },
      { name: 'imageURL', label: 'URL da imagem', type: 'text' },
    ],
  },
};

interface ContentAdminPanelProps {
  activeTab?: ContentTab;
  canManageCatalog?: boolean;
  onTabChange?: (tab: ContentTab) => void;
}

export default function ContentAdminPanel({ activeTab, canManageCatalog = true, onTabChange }: ContentAdminPanelProps) {
  const [internalTab, setInternalTab] = useState<ContentTab>('notices');
  const [group, setGroup] = useState<ContentGroup>('all');
  const tab = activeTab ?? internalTab;
  const allowedTabs = canManageCatalog ? TABS : TABS.filter((item) => OPERATION_TABS.includes(item.value));
  const activeTabAllowed = allowedTabs.some((item) => item.value === tab);
  const safeTab = activeTabAllowed ? tab : allowedTabs[0].value;
  const availableGroups = canManageCatalog ? GROUPS : GROUPS.filter((item) => item.value === 'operations');
  const visibleTabs = (group === 'all' ? allowedTabs : allowedTabs.filter((item) => item.group === group));

  const setTab = useCallback((nextTab: ContentTab) => {
    if (!canManageCatalog && !OPERATION_TABS.includes(nextTab)) return;
    setInternalTab(nextTab);
    onTabChange?.(nextTab);
  }, [canManageCatalog, onTabChange]);

  useEffect(() => {
    if (!canManageCatalog) {
      setGroup('operations');
      if (!OPERATION_TABS.includes(tab)) setTab(OPERATION_TABS[0]);
      return;
    }

    const activeItem = TABS.find((item) => item.value === tab);
    if (activeItem) setGroup(activeItem.group);
  }, [canManageCatalog, setTab, tab]);

  return (
    <div className="space-y-5">
      <div className="glass-panel space-y-3 p-3">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {availableGroups.map((item) => {
            const active = item.value === group;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setGroup(item.value)}
                className={cn(
                  'rounded-xl border px-3 py-3 text-left transition',
                  active
                    ? 'admin-choice-active'
                    : 'admin-choice-idle',
                )}
              >
                <span className="block text-xs font-black uppercase tracking-widest">{item.label}</span>
                <span className={cn('mt-1 block text-xs font-bold', active ? 'admin-choice-active-muted' : 'text-text-muted')}>
                  {item.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-1 overflow-x-auto custom-scrollbar">
          {visibleTabs.map((item) => {
            const active = item.value === tab;
            const Icon = item.icon;
            const featureStatus = FEATURE_STATUS.find((f) => f.adminTab === item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setTab(item.value)}
                className={cn(
                  'inline-flex min-w-max items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold uppercase tracking-widest transition',
                  active ? 'admin-choice-active border' : 'admin-choice-idle border',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {featureStatus && featureStatus.status !== 'complete' && (
                  <DevBadge status={featureStatus.status} className="ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {safeTab === 'notices' && <NoticesAdmin />}
      {safeTab === 'events' && <EventsAdmin />}
      {safeTab === 'works' && <WorksAdmin />}
      {safeTab === 'businesses' && <BusinessesAdmin />}
      {safeTab === 'traffic' && <TrafficAdmin />}
      {safeTab === 'health' && <HealthUnitsAdmin />}
      {safeTab === 'appointments' && <AppointmentsAdmin />}
      {safeTab === 'pharmacy' && <GenericCatalogAdmin config={CATALOGS.pharmacy} />}
      {safeTab === 'jobs' && <JobsAdmin />}
      {safeTab === 'applications' && <ApplicationsAdmin />}
      {safeTab === 'enrollments' && <EnrollmentsAdmin />}
      {safeTab === 'community' && <GenericCatalogAdmin config={CATALOGS.community} />}
      {safeTab === 'safety' && <GenericCatalogAdmin config={CATALOGS.safety} />}
      {safeTab === 'emergency' && <EmergencyAlertsAdmin />}
      {safeTab === 'environment' && <GenericCatalogAdmin config={CATALOGS.environment} />}
      {safeTab === 'social' && <GenericCatalogAdmin config={CATALOGS.social} />}
      {safeTab === 'taxes' && <GenericCatalogAdmin config={CATALOGS.taxes} />}
      {safeTab === 'polls' && <GenericCatalogAdmin config={CATALOGS.polls} />}
      {safeTab === 'services' && <GenericCatalogAdmin config={CATALOGS.services} />}
      {safeTab === 'education' && <GenericCatalogAdmin config={CATALOGS.education} />}
    </div>
  );
}
