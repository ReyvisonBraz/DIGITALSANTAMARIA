/**
 * @module TopAppBar
 * @description Barra de navegação superior fixa da aplicação.
 *
 * Funcionalidades:
 * - Logo com link para home
 * - Botão Explorer (menu de serviços em fullscreen)
 * - Barra de busca com atalho Cmd+K / Ctrl+K
 * - Controles de acessibilidade (contraste, fonte, layout)
 * - Notificações
 * - Avatar do usuário / botão de login
 *
 * Comportamento:
 * - Reduz tamanho e muda estilo ao scrollar (scrolled state)
 * - Menu de acessibilidade fecha ao clicar fora
 * - Explorer overlay em fullscreen com animação
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Search, Bell, User as UserIcon, Menu, MapPin, Store,
  Users, Briefcase, Heart, MessageSquare, Vote, FileText,
  DollarSign, Navigation, School, Calendar, Sun, Type,
  Minus, Plus, RotateCcw, Moon, Grid, X, ChevronDown, Monitor, Command, Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SidePanel from '@/components/ui/SidePanel';
import SearchModal from '@/components/SearchModal';
import NotificationsPanel from '@/components/NotificationsPanel';
import { useAccessibility } from '@/lib/accessibility-context';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import { createLogger } from '@/lib/logger';
import { NAV_LINKS } from '@/lib/constants';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { useKeyboardShortcut } from '@/lib/hooks/use-keyboard-shortcut';

const log = createLogger('TopAppBar');

export default function TopAppBar() {
  const { user, userRole, login } = useAuth();
  const { toast } = useToast();
  const {
    toggleHighContrast, increaseFontSize, decreaseFontSize,
    increaseLayoutScale, decreaseLayoutScale,
    resetAccessibility, highContrast, fontSize, layoutScale
  } = useAccessibility();

  // ─── Estado ─────────────────────────────────────────────────────

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  // ─── Refs ───────────────────────────────────────────────────────

  /** Ref para o popover de acessibilidade (click-outside detection) */
  const accessibilityRef = useRef<HTMLDivElement>(null);

  // ─── Hooks customizados ─────────────────────────────────────────

  // Fecha o menu de acessibilidade ao clicar fora
  useClickOutside(accessibilityRef, () => setIsAccessibilityMenuOpen(false), isAccessibilityMenuOpen);

  // Atalho Cmd+K / Ctrl+K para abrir busca
  useKeyboardShortcut('k', () => setIsSearchOpen(true), { meta: true });

  // ESC fecha o Explorer se aberto
  useKeyboardShortcut('Escape', () => setIsExplorerOpen(false), { enabled: isExplorerOpen });

  // ─── Effects ────────────────────────────────────────────────────

  /** Detecta scroll para mudar estilo da barra */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /** Log de montagem e navegação */
  useEffect(() => {
    log.info('Navigation', { pathname, isAuthenticated: !!user });
  }, [pathname, user]);

  // ─── Handlers ───────────────────────────────────────────────────

  /** Alterna modo de alto contraste com feedback via toast */
  const handleToggleContrast = useCallback(() => {
    const newState = !highContrast;
    log.info('Accessibility: contrast toggled', { highContrast: newState });
    toggleHighContrast();
    toast(newState ? 'Modo de acessibilidade ativado.' : 'Modo padrão restaurado.', 'info');
  }, [highContrast, toggleHighContrast, toast]);

  // ─── Render ─────────────────────────────────────────────────────

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500",
          scrolled ? "pt-4 px-4" : "pt-0 px-0 md:pt-6 md:px-6"
        )}
        role="banner"
      >
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
              "w-full max-w-7xl flex items-center justify-between transition-all duration-500",
              scrolled
                ? "h-14 md:h-16 bg-surface/80 backdrop-blur-2xl border-2 border-border shadow-2xl rounded-2xl md:rounded-full px-3 md:px-8"
                : "h-16 md:h-20 bg-white/95 backdrop-blur-xl border border-border shadow-sm rounded-none md:rounded-[2.5rem] px-4 md:px-12"
            )}
          >
            {/* ── Seção Esquerda: Logo & Explorer ──────────────── */}
            <div className="flex items-center gap-2 md:gap-8 min-w-0">
                <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0" aria-label="Ir para página inicial">
                   <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-900 rounded-lg md:rounded-xl flex items-center justify-center shadow-md group-hover:bg-primary transition-all">
                     <span className="text-white font-bold text-sm md:text-base tracking-tighter uppercase">SM</span>
                   </div>
                   <div className="flex flex-col hidden sm:block overflow-hidden">
                     <span className="text-name text-xs md:text-sm uppercase tracking-tight leading-none group-hover:text-primary transition-colors">Digital</span>
                     <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Santa Maria</span>
                   </div>
                </Link>

               <div className="h-6 w-px bg-border hidden md:block" aria-hidden="true" />

               {/* Botão Explorer — abre menu de serviços em fullscreen */}
               <button
                 onClick={() => setIsExplorerOpen(true)}
                 className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-surface-container hover:bg-border/30 border border-border rounded-xl transition-all group shrink-0"
                 aria-label="Abrir explorador de serviços"
               >
                  <Grid className="w-4 h-4 text-primary group-hover:rotate-90 transition-transform duration-500" />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-main hidden lg:block">Explorer</span>
                  <ChevronDown className="w-3 h-3 text-text-muted opacity-50 hidden sm:block" aria-hidden="true" />
               </button>
            </div>

            {/* ── Seção Central: Busca Global ─────────────────── */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full h-10 bg-surface-container border border-border rounded-xl px-4 flex items-center justify-between text-text-muted hover:border-primary transition-all group shadow-inner"
                aria-label="Abrir busca global (Ctrl+K)"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Search className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs font-medium text-text-muted/70 truncate">Buscar serviços...</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-30 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true">
                  <Command className="w-3 h-3" />
                  <span className="text-[10px] font-black">K</span>
                </div>
              </button>
            </div>

            {/* ── Seção Direita: Acessibilidade, Notificações, Perfil */}
            <div className="flex items-center gap-1 md:gap-3 shrink-0">
              {(userRole === 'admin' || userRole === 'clerk') && (
                <Link
                  href="/gestao"
                  className="hidden md:inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary transition hover:bg-primary hover:text-white"
                  aria-label="Abrir painel de gestão"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Gestão
                </Link>
              )}

              {/* Popover de Acessibilidade */}
              <div className="relative" ref={accessibilityRef}>
                <button
                  onClick={() => setIsAccessibilityMenuOpen(!isAccessibilityMenuOpen)}
                  className={cn(
                    "p-2 md:p-3 rounded-xl transition-all border border-border relative shadow-sm",
                    isAccessibilityMenuOpen ? "bg-primary text-white border-primary" : "bg-white text-text-muted hover:border-primary/50"
                  )}
                  aria-label="Menu de acessibilidade"
                  aria-expanded={isAccessibilityMenuOpen}
                  aria-haspopup="true"
                >
                  <Monitor className="w-4 md:w-5 h-4 md:h-5" />
                  {highContrast && <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 border-2 border-white rounded-full animate-pulse" aria-label="Alto contraste ativo" />}
                </button>

                <AnimatePresence>
                  {isAccessibilityMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-white border border-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-6 z-50 overflow-hidden"
                      role="menu"
                      aria-label="Preferências de acessibilidade"
                    >
                       <div className="flex items-center justify-between mb-6">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-muted font-sans">Preferências de Visão</h4>
                          <button onClick={() => setIsAccessibilityMenuOpen(false)} className="hover:text-primary transition-colors px-1 text-text-muted" aria-label="Fechar menu de acessibilidade">
                            <X className="w-4 h-4" />
                          </button>
                       </div>

                       <div className="space-y-6">
                          {/* Toggle de alto contraste */}
                          <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-border/30">
                                   <Sun className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-xs font-bold text-text-main font-sans">Alto Contraste</span>
                             </div>
                             <button
                              onClick={handleToggleContrast}
                              className={cn(
                                "w-12 h-6 rounded-full transition-all relative p-1",
                                highContrast ? "bg-primary" : "bg-border"
                              )}
                              role="switch"
                              aria-checked={highContrast}
                              aria-label="Alternar alto contraste"
                             >
                                <div className={cn(
                                  "w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                                  highContrast ? "translate-x-6" : "translate-x-0"
                                )} />
                             </button>
                          </div>

                          {/* Controle de escala do texto */}
                          <div className="space-y-3">
                             <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted px-1 font-sans">
                                <span>Escala do Texto</span>
                                <span className={cn(fontSize > 16 ? "text-primary" : "text-text-muted")}>{Math.round((fontSize/16)*100)}%</span>
                             </div>
                             <div className="flex items-center gap-2 p-1.5 bg-surface rounded-2xl border border-border/50">
                                <button
                                  onClick={decreaseFontSize}
                                  disabled={fontSize <= 12}
                                  className="p-2.5 hover:bg-white hover:shadow-sm disabled:opacity-30 rounded-xl flex-grow flex justify-center transition-all px-4"
                                  aria-label="Diminuir tamanho da fonte"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <div className="h-6 w-px bg-border/50" aria-hidden="true" />
                                <button
                                  onClick={increaseFontSize}
                                  disabled={fontSize >= 32}
                                  className="p-2.5 hover:bg-white hover:shadow-sm disabled:opacity-30 rounded-xl flex-grow flex justify-center transition-all px-4"
                                  aria-label="Aumentar tamanho da fonte"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                             </div>
                          </div>

                          {/* Controle de escala do layout */}
                          <div className="space-y-3">
                             <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted px-1 font-sans">
                                <span>Escala do Layout</span>
                                <span className={cn(layoutScale > 1 ? "text-primary" : "text-text-muted")}>{Math.round(layoutScale * 100)}%</span>
                             </div>
                             <div className="flex items-center gap-2 p-1.5 bg-surface rounded-2xl border border-border/50">
                                <button
                                  onClick={decreaseLayoutScale}
                                  disabled={layoutScale <= 0.8}
                                  className="p-2.5 hover:bg-white hover:shadow-sm disabled:opacity-30 rounded-xl flex-grow flex justify-center transition-all px-4"
                                  aria-label="Diminuir escala do layout"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <div className="h-6 w-px bg-border/50" aria-hidden="true" />
                                <button
                                  onClick={increaseLayoutScale}
                                  disabled={layoutScale >= 1.5}
                                  className="p-2.5 hover:bg-white hover:shadow-sm disabled:opacity-30 rounded-xl flex-grow flex justify-center transition-all px-4"
                                  aria-label="Aumentar escala do layout"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                             </div>
                          </div>

                          {/* Botão de reset */}
                          <button
                            onClick={resetAccessibility}
                            className="w-full py-3.5 bg-slate-50 text-text-muted rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 hover:text-text-main transition-all flex items-center justify-center gap-2 border border-border/30"
                            aria-label="Restaurar configurações padrão de acessibilidade"
                          >
                             <RotateCcw className="w-3.5 h-3.5" />
                             Configuração Inicial
                          </button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-6 w-px bg-border hidden sm:block" aria-hidden="true" />

              {/* Botão de notificações */}
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 md:p-3 bg-surface-container hover:bg-border/30 rounded-lg md:rounded-xl transition-all text-text-muted border border-border relative group"
                aria-label="Abrir notificações"
              >
                <Bell className="w-4 md:w-5 h-4 md:h-5 group-hover:animate-bounce" />
                <span className="absolute top-2 right-2 md:top-2.5 md:right-2.5 w-2 md:w-3.5 h-2 md:h-3.5 bg-accent-danger rounded-full border-2 md:border-4 border-white shadow-sm" aria-label="Notificações não lidas" />
              </button>

              {/* Avatar do usuário ou botão de login */}
              {user ? (
                <Link href="/perfil" aria-label="Ir para perfil">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-primary-light border-2 border-border overflow-hidden cursor-pointer relative shadow-lg hover:border-primary transition-all p-1 group shrink-0"
                  >
                    <div className="absolute inset-0 border-2 border-primary rounded-2xl animate-pulse opacity-0 group-hover:opacity-20 transition-opacity" />
                    <div className="relative w-full h-full rounded-xl overflow-hidden ring-1 ring-border">
                      <Image
                        src={user.photoURL || 'https://picsum.photos/seed/user/100/100'}
                        alt="Foto de perfil"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <button
                  onClick={login}
                  className="btn-tactile bg-text-main text-white px-6 py-3 hover:bg-primary transition-all active:scale-95 text-[10px] font-black tracking-widest uppercase shadow-xl flex items-center gap-3"
                  aria-label="Entrar com conta Google"
                >
                  <span>Entrar</span>
                  <UserIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
      </header>

      {/* ── Explorer Overlay — Menu de Serviços em Fullscreen ────── */}
      <AnimatePresence>
        {isExplorerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-text-main/95 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12"
            role="dialog"
            aria-modal="true"
            aria-label="Mapa de serviços municipais"
          >
             <button
               onClick={() => setIsExplorerOpen(false)}
               className="absolute top-12 right-12 text-white/50 hover:text-white transition-all group"
               aria-label="Fechar explorador"
             >
                <X className="w-12 h-12 group-hover:rotate-90 transition-transform" />
             </button>

             <div className="w-full max-w-6xl space-y-16">
                <div className="space-y-4 text-center md:text-left">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 rounded-full text-[10px] font-black uppercase text-primary border border-primary/20">
                      <Sparkles className="w-4 h-4" />
                      Portal do Cidadão
                   </div>
                   <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">Mapa de <br/> <span className="text-primary">Serviços.</span></h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                   {NAV_LINKS.map((link, idx) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.03 } }}
                      >
                         <Link
                           href={link.href}
                           onClick={() => setIsExplorerOpen(false)}
                           className="group flex flex-col items-center gap-4 p-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[3rem] transition-all hover:border-primary active:scale-95"
                         >
                            <div className="w-16 h-16 bg-white/10 text-primary rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                               <link.icon className="w-8 h-8" />
                            </div>
                            <div className="text-center space-y-1">
                               <span className="block text-[11px] font-black text-white uppercase tracking-widest">{link.label}</span>
                               <span className="block text-[8px] font-black text-white/30 uppercase tracking-widest">{link.category}</span>
                            </div>
                         </Link>
                      </motion.div>
                   ))}
                </div>

                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="flex items-center gap-6">
                      <div className="text-center md:text-left">
                         <span className="block text-2xl font-black text-white tabular-nums">{NAV_LINKS.length}</span>
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Serviços Digitais</span>
                      </div>
                      <div className="w-px h-10 bg-white/10" aria-hidden="true" />
                      <div className="text-center md:text-left">
                         <span className="block text-2xl font-black text-white tabular-nums">1.2k</span>
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Acessos Hoje</span>
                      </div>
                   </div>
                   <p className="text-xs font-ui text-white/50 max-w-sm text-center md:text-right">
                     Todos os serviços integrados são monitorados para garantir a sua privacidade e segurança digital.
                   </p>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals & Panels ──────────────────────────────────────── */}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
