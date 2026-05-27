'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bell,
  Command,
  Grid,
  Minus,
  Monitor,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import SearchModal from '@/components/SearchModal';
import NotificationsPanel from '@/components/NotificationsPanel';
import Logo from '@/components/Logo';
import { NAV_LINKS } from '@/lib/constants';
import { useAccessibility } from '@/lib/accessibility-context';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { useKeyboardShortcut } from '@/lib/hooks/use-keyboard-shortcut';
import { createLogger } from '@/lib/logger';
import { cn } from '@/lib/utils';

const log = createLogger('TopAppBar');

export default function TopAppBar() {
  const { user, userRole, login } = useAuth();
  const { toast } = useToast();
  const {
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    increaseLayoutScale,
    decreaseLayoutScale,
    resetAccessibility,
    highContrast,
    fontSize,
    layoutScale,
  } = useAccessibility();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accessibilityRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isStaff = userRole === 'admin' || userRole === 'clerk';

  useClickOutside(accessibilityRef, () => setIsAccessibilityOpen(false), isAccessibilityOpen);
  useKeyboardShortcut('k', () => setIsSearchOpen(true), { meta: true });
  useKeyboardShortcut('Escape', () => setIsExplorerOpen(false), { enabled: isExplorerOpen });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    log.info('Navigation', { pathname, isAuthenticated: !!user });
  }, [pathname, user]);

  const handleToggleContrast = useCallback(() => {
    const nextState = !highContrast;
    toggleHighContrast();
    toast(nextState ? 'Modo de acessibilidade ativado.' : 'Modo padrao restaurado.', 'info');
  }, [highContrast, toast, toggleHighContrast]);

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 flex justify-center transition-all duration-300',
          scrolled ? 'px-3 pt-3' : 'px-0 pt-0 md:px-6 md:pt-5'
        )}
        role="banner"
      >
        <motion.div
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          className={cn(
            'flex w-full max-w-7xl items-center justify-between border border-white/70 bg-white/80 px-3 shadow-[0_18px_60px_rgba(20,34,74,0.12)] backdrop-blur-2xl transition-all duration-300 md:px-8',
            scrolled ? 'h-14 rounded-2xl md:h-16' : 'h-16 rounded-none md:h-18 md:rounded-2xl'
          )}
        >
          <div className="flex min-w-0 items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="group flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.02]"
              aria-label="Ir para a pagina inicial"
            >
              <Logo size={40} withWordmark className="hidden sm:inline-flex" />
              <Logo size={38} withWordmark={false} className="sm:hidden" />
            </Link>

            <button
              onClick={() => setIsExplorerOpen(true)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-border bg-white/70 px-3.5 text-xs font-semibold tracking-wide text-text-main shadow-sm transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              aria-label="Abrir menu de servicos"
            >
              <Grid className="h-4 w-4 text-primary" />
              <span className="hidden lg:inline">Serviços</span>
            </button>
          </div>

          <div className="hidden flex-1 justify-center px-4 lg:flex">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-10 w-full max-w-md items-center justify-between rounded-xl border border-border bg-white/70 px-4 text-text-muted shadow-inner transition hover:border-primary hover:bg-white"
              aria-label="Abrir busca global"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Search className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate text-xs font-medium">Buscar servicos...</span>
              </span>
              <span className="flex items-center gap-1 opacity-40">
                <Command className="h-3 w-3" />
                <span className="text-[10px] font-semibold">K</span>
              </span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            {isStaff && (
              <Link
                href="/gestao"
                className="hidden min-h-10 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-primary transition hover:bg-primary hover:text-white md:inline-flex"
                aria-label="Abrir painel de gestao"
              >
                <ShieldCheck className="h-4 w-4" />
                Gestão
              </Link>
            )}

            <button
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/80 text-text-muted shadow-sm transition hover:border-primary hover:text-primary lg:hidden"
              aria-label="Abrir busca"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="relative" ref={accessibilityRef}>
              <button
                onClick={() => setIsAccessibilityOpen((value) => !value)}
                className={cn(
                  'relative inline-flex h-10 w-10 items-center justify-center rounded-xl border transition',
                  isAccessibilityOpen ? 'border-primary bg-primary text-white shadow-[0_12px_24px_rgba(26,86,196,0.22)]' : 'border-border bg-white/80 text-text-muted shadow-sm hover:border-primary hover:text-primary'
                )}
                aria-label="Menu de acessibilidade"
                aria-expanded={isAccessibilityOpen}
              >
                <Monitor className="h-4 w-4" />
                {highContrast && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-green-500" />}
              </button>

              <AnimatePresence>
                {isAccessibilityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] max-w-80 rounded-xl border border-border bg-white p-4 shadow-xl"
                    role="menu"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Acessibilidade</p>
                      <button onClick={() => setIsAccessibilityOpen(false)} className="rounded-lg p-1 text-text-muted hover:bg-surface" aria-label="Fechar">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-text-main">
                          <Sun className="h-4 w-4 text-primary" />
                          Alto contraste
                        </span>
                        <button
                          onClick={handleToggleContrast}
                          className={cn('relative h-6 w-12 rounded-full p-1 transition', highContrast ? 'bg-primary' : 'bg-border')}
                          role="switch"
                          aria-checked={highContrast}
                        >
                          <span className={cn('block h-4 w-4 rounded-full bg-white shadow-sm transition', highContrast && 'translate-x-6')} />
                        </button>
                      </div>

                      <ControlRow
                        label="Texto"
                        value={`${Math.round((fontSize / 16) * 100)}%`}
                        onDecrease={decreaseFontSize}
                        onIncrease={increaseFontSize}
                      />
                      <ControlRow
                        label="Layout"
                        value={`${Math.round(layoutScale * 100)}%`}
                        onDecrease={decreaseLayoutScale}
                        onIncrease={increaseLayoutScale}
                      />

                      <button
                        onClick={resetAccessibility}
                        className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 text-xs font-semibold uppercase tracking-widest text-text-muted transition hover:border-primary hover:text-primary"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restaurar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/80 text-text-muted shadow-sm transition hover:border-primary hover:text-primary"
              aria-label="Abrir notificacoes"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-danger" />
            </button>

            {user ? (
              <Link href="/perfil" className="relative h-10 w-10 overflow-hidden rounded-xl border border-border bg-primary-light" aria-label="Ir para perfil">
                <Image
                  src={user.photoURL || 'https://picsum.photos/seed/user/100/100'}
                  alt="Foto de perfil"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </Link>
            ) : (
              <button
                onClick={login}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-[10px] font-semibold uppercase tracking-widest text-white shadow-[0_12px_24px_rgba(26,86,196,0.22)] transition hover:bg-primary-dark"
                aria-label="Entrar com conta Google"
              >
                <span className="hidden sm:inline">Entrar</span>
                <UserIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {isExplorerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExplorerOpen(false)}
              className="fixed inset-0 z-[99] bg-text-main/30 backdrop-blur-sm"
            />

            {/* Painel */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 top-0 z-[100] overflow-y-auto bg-white/98 px-4 py-6 shadow-[0_32px_80px_rgba(20,34,74,0.16)] backdrop-blur-3xl md:px-8 md:py-10"
              role="dialog"
              aria-modal="true"
              aria-label="Mapa de servicos municipais"
              style={{ maxHeight: '92vh' }}
            >
              {/* Grade decorativa de fundo */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(20,34,74,1) 1px, transparent 1px), linear-gradient(90deg, rgba(20,34,74,1) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />

              <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                      <Grid className="h-3.5 w-3.5" />
                      Portal do cidadão
                    </span>
                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-main md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
                      Mapa de <span className="text-gradient">serviços</span>
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsExplorerOpen(false)}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition hover:border-primary/30 hover:bg-primary/8 hover:text-primary"
                    aria-label="Fechar menu de servicos"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsExplorerOpen(false)}
                      className="group flex min-h-32 flex-col justify-between rounded-2xl border border-border bg-surface-container p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:bg-white hover:shadow-[0_8px_24px_rgba(26,86,196,0.12)]"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white">
                        <link.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-text-main" style={{ fontFamily: 'var(--font-display)' }}>{link.label}</span>
                        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">{link.category}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
}

function ControlRow({
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-text-muted">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={onDecrease} className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface text-text-main">
          <Minus className="h-4 w-4" />
        </button>
        <button onClick={onIncrease} className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-surface text-text-main">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
