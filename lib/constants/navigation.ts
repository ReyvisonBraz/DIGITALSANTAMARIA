import type { LucideIcon } from 'lucide-react';
import {
  Briefcase,
  Calendar,
  DollarSign,
  HardHat,
  FileText,
  Grid,
  Heart,
  Home,
  Leaf,
  Megaphone,
  MessageSquare,
  Navigation,
  Shield,
  School,
  SearchCheck,
  Store,
  UserRound,
  Users,
  Vote,
} from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  category: string;
}

export interface BottomNavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface DashboardModule {
  icon: LucideIcon;
  label: string;
  href: string;
  color: string;
  bg: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Abrir solicitação', href: '/ouvidoria', icon: MessageSquare, category: 'Atendimento' },
  { label: 'Relatar problema', href: '/relatar', icon: Megaphone, category: 'Atendimento' },
  { label: 'Consultar protocolo', href: '/perfil', icon: SearchCheck, category: 'Atendimento' },
  { label: 'Peticoes', href: '/peticoes', icon: FileText, category: 'Participacao' },
  { label: 'Painel do Cidadão', href: '/perfil', icon: UserRound, category: 'Conta' },
  { label: 'Servicos', href: '/servicos', icon: Grid, category: 'Portal' },
  { label: 'Saude', href: '/saude', icon: Heart, category: 'Servicos' },
  { label: 'Educacao', href: '/educacao', icon: School, category: 'Servicos' },
  { label: 'Empregos', href: '/empregos', icon: Briefcase, category: 'Economia' },
  { label: 'Tributos', href: '/tributos', icon: DollarSign, category: 'Gestao' },
  { label: 'Mobilidade', href: '/transito', icon: Navigation, category: 'Servicos' },
  { label: 'Seguranca', href: '/seguranca', icon: Shield, category: 'Servicos' },
  { label: 'Meio Ambiente', href: '/meio-ambiente', icon: Leaf, category: 'Servicos' },
  { label: 'Social', href: '/social', icon: Heart, category: 'Servicos' },
  { label: 'Obras', href: '/obras', icon: HardHat, category: 'Gestao' },
  { label: 'Avisos', href: '/avisos', icon: Megaphone, category: 'Portal' },
  { label: 'Comércio', href: '/comercio', icon: Store, category: 'Economia' },
  { label: 'Eventos', href: '/eventos', icon: Calendar, category: 'Vida Urbana' },
  { label: 'Comunidade', href: '/comunidade', icon: Users, category: 'Vida Urbana' },
  { label: 'Votos', href: '/votos', icon: Vote, category: 'Participacao' },
] as const;

export const BOTTOM_NAV_ITEMS: readonly BottomNavItem[] = [
  { icon: Home, label: 'Inicio', href: '/' },
  { icon: MessageSquare, label: 'Solicitar', href: '/ouvidoria' },
  { icon: SearchCheck, label: 'Protocolo', href: '/perfil' },
  { icon: FileText, label: 'Peticoes', href: '/peticoes' },
  { icon: UserRound, label: 'Painel', href: '/perfil' },
] as const;

export const DASHBOARD_MODULES: readonly DashboardModule[] = [
  { icon: MessageSquare, label: 'Abrir solicitação', href: '/ouvidoria', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Megaphone, label: 'Relatar problema', href: '/relatar', color: 'text-accent-success', bg: 'bg-accent-success/10' },
  { icon: SearchCheck, label: 'Consultar protocolo', href: '/perfil', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { icon: FileText, label: 'Peticoes', href: '/peticoes', color: 'text-orange-600', bg: 'bg-orange-500/10' },
  { icon: UserRound, label: 'Painel do Cidadão', href: '/perfil', color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { icon: Heart, label: 'Saude', href: '/saude', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: School, label: 'Educacao', href: '/educacao', color: 'text-violet-600', bg: 'bg-violet-500/10' },
  { icon: DollarSign, label: 'Tributos', href: '/tributos', color: 'text-amber-600', bg: 'bg-amber-600/10' },
  { icon: Briefcase, label: 'Empregos', href: '/empregos', color: 'text-slate-700', bg: 'bg-slate-500/10' },
] as const;

export const FOOTER_LINKS: readonly { label: string; href: string }[] = [
  { label: 'Sobre o Portal', href: '/sobre' },
  { label: 'Privacidade', href: '/legal' },
  { label: 'Termos de Uso', href: '/legal' },
  { label: 'Abrir solicitação', href: '/ouvidoria' },
  { label: 'Peticoes', href: '/peticoes' },
  { label: 'Painel do Cidadão', href: '/perfil' },
  { label: 'Contato', href: '/ouvidoria' },
] as const;
