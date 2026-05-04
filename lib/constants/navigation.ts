/**
 * @module navigation
 * @description Constantes centralizadas de navegação do portal.
 *
 * Todas as rotas, labels e ícones usados em menus, barras de navegação
 * e listagens de serviços ficam aqui como fonte única de verdade.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Home,
  MessageSquare,
  Vote,
  FileText,
  Heart,
  Store,
  Users,
  Briefcase,
  DollarSign,
  Navigation,
  School,
  Calendar,
  Activity,
  ShieldCheck,
} from 'lucide-react';

// ─── Tipos ──────────────────────────────────────────────────────────

/** Representação de um link de navegação */
export interface NavLink {
  /** Label visível ao usuário */
  label: string;
  /** Rota do Next.js */
  href: string;
  /** Componente de ícone Lucide */
  icon: LucideIcon;
  /** Categoria para agrupamento (Explorer) */
  category: string;
}

/** Representação de um item da barra inferior */
export interface BottomNavItem {
  /** Componente de ícone Lucide */
  icon: LucideIcon;
  /** Label curto */
  label: string;
  /** Rota do Next.js */
  href: string;
}

/** Representação de um módulo do dashboard */
export interface DashboardModule {
  /** Componente de ícone Lucide */
  icon: LucideIcon;
  /** Label do módulo */
  label: string;
  /** Rota do Next.js */
  href: string;
  /** Classe CSS de cor do texto */
  color: string;
  /** Classe CSS de fundo */
  bg: string;
}

// ─── Dados ──────────────────────────────────────────────────────────

/** Links do menu Explorer (navegação completa) */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Ouvidoria', href: '/ouvidoria', icon: MessageSquare, category: 'Participação' },
  { label: 'Petições', href: '/peticoes', icon: FileText, category: 'Participação' },
  { label: 'Votos', href: '/votos', icon: Vote, category: 'Participação' },
  { label: 'Saúde', href: '/saude', icon: Heart, category: 'Serviços' },
  { label: 'Escolas', href: '/educacao', icon: School, category: 'Serviços' },
  { label: 'Tributos', href: '/tributos', icon: DollarSign, category: 'Gestão' },
  { label: 'Mobilidade', href: '/transito', icon: Navigation, category: 'Serviços' },
  { label: 'Comércio', href: '/comercio', icon: Store, category: 'Economia' },
  { label: 'Empregos', href: '/empregos', icon: Briefcase, category: 'Economia' },
  { label: 'Cultura', href: '/eventos', icon: Calendar, category: 'Vida Urbana' },
  { label: 'Obras', href: '/obras', icon: School, category: 'Gestão' },
  { label: 'Comunidade', href: '/comunidade', icon: Users, category: 'Vida Urbana' },
] as const;

/** Itens da barra de navegação inferior (mobile) */
export const BOTTOM_NAV_ITEMS: readonly BottomNavItem[] = [
  { icon: Home, label: 'Início', href: '/' },
  { icon: MessageSquare, label: 'Relatar', href: '/relatar' },
  { icon: Heart, label: 'Saúde', href: '/saude' },
  { icon: Vote, label: 'Votos', href: '/votos' },
  { icon: FileText, label: 'Petições', href: '/peticoes' },
] as const;

/** Módulos do Hub de Acesso na Home */
export const DASHBOARD_MODULES: readonly DashboardModule[] = [
  { icon: Briefcase, label: 'Emprego', href: '/empregos', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Activity, label: 'Saúde', href: '/saude', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Navigation, label: 'Trânsito', href: '/transito', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: ShieldCheck, label: 'Segurança', href: '/seguranca', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: DollarSign, label: 'Tributos', href: '/tributos', color: 'text-amber-600', bg: 'bg-amber-600/10' },
  { icon: School, label: 'Educação', href: '/educacao', color: 'text-orange-500', bg: 'bg-orange-500/10' },
] as const;

/** Links do rodapé */
export const FOOTER_LINKS: readonly { label: string; href: string }[] = [
  { label: 'Sobre o Portal', href: '/sobre' },
  { label: 'Privacidade', href: '/legal' },
  { label: 'Termos de Uso', href: '/legal' },
  { label: 'Ouvidoria', href: '/ouvidoria' },
  { label: 'Contato', href: '/ouvidoria' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Educação', href: '/educacao' },
  { label: 'Tributos', href: '/tributos' },
  { label: 'Trânsito', href: '/transito' },
] as const;
