'use client';

import { useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarDays,
  FileText,
  HardHat,
  MapPin,
  MessageSquare,
  SearchCheck,
  Sparkles,
  Store,
  UserRound,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LogoMark } from '@/components/Logo';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import TextReveal from '@/components/ui/TextReveal';
import { useAccessibility } from '@/lib/accessibility-context';
import { useHomeMetrics } from '@/lib/hooks/use-home-metrics';
import { cn } from '@/lib/utils';

const serviceHighlights = [
  { label: 'Empregos',  href: '/empregos',  icon: Briefcase,    tone: 'from-accent-success/12',   iconBg: 'bg-accent-success/15',   iconColor: 'text-accent-success' },
  { label: 'Comércio',  href: '/comercio',  icon: Store,        tone: 'from-secondary/15',        iconBg: 'bg-secondary/15',        iconColor: 'text-secondary' },
  { label: 'Eventos',   href: '/eventos',   icon: CalendarDays, tone: 'from-primary-dark/10',     iconBg: 'bg-primary-dark/12',     iconColor: 'text-primary-dark' },
  { label: 'Obras',     href: '/obras',     icon: HardHat,      tone: 'from-accent/18',           iconBg: 'bg-accent/22',           iconColor: 'text-primary-dark' },
  { label: 'Avisos',    href: '/avisos',    icon: Bell,         tone: 'from-primary/12',          iconBg: 'bg-primary/12',          iconColor: 'text-primary' },
  { label: 'Petições',  href: '/peticoes',  icon: FileText,     tone: 'from-secondary/15',        iconBg: 'bg-secondary/15',        iconColor: 'text-secondary' },
] as const;

function getServiceHighlights(t: ReturnType<typeof useTranslations<'home'>>) {
  return [
    { label: t('services.jobs'), href: '/empregos', icon: Briefcase, tone: 'from-accent-success/12', iconBg: 'bg-accent-success/15', iconColor: 'text-accent-success' },
    { label: t('services.commerce'), href: '/comercio', icon: Store, tone: 'from-secondary/15', iconBg: 'bg-secondary/15', iconColor: 'text-secondary' },
    { label: t('services.events'), href: '/eventos', icon: CalendarDays, tone: 'from-primary-dark/10', iconBg: 'bg-primary-dark/12', iconColor: 'text-primary-dark' },
    { label: t('services.publicWorks'), href: '/obras', icon: HardHat, tone: 'from-accent/18', iconBg: 'bg-accent/22', iconColor: 'text-primary-dark' },
    { label: t('services.notices'), href: '/avisos', icon: Bell, tone: 'from-primary/12', iconBg: 'bg-primary/12', iconColor: 'text-primary' },
    { label: t('services.petitions'), href: '/peticoes', icon: FileText, tone: 'from-secondary/15', iconBg: 'bg-secondary/15', iconColor: 'text-secondary' },
  ];
}

function getProcessSteps(t: ReturnType<typeof useTranslations<'home'>>) {
  return [t('process.step1'), t('process.step2'), t('process.step3')];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomeInteractive() {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { eventsCount, noticesCount } = useHomeMetrics();
  const { contentMode } = useAccessibility();
  const isEssential = contentMode === 'essential';

  const primaryActions = useMemo(() => [
    {
      title: t('actions.openRequest.title'),
      description: t('actions.openRequest.description'),
      href: '/ouvidoria',
      icon: MessageSquare,
      cta: t('actions.openRequest.cta'),
    },
    {
      title: t('actions.checkProtocol.title'),
      description: t('actions.checkProtocol.description'),
      href: '/perfil',
      icon: SearchCheck,
      cta: t('actions.checkProtocol.cta'),
    },
    {
      title: t('actions.petitions.title'),
      description: t('actions.petitions.description'),
      href: '/peticoes',
      icon: FileText,
      cta: t('actions.petitions.cta'),
    },
    {
      title: t('actions.citizenPanel.title'),
      description: t('actions.citizenPanel.description'),
      href: '/perfil',
      icon: UserRound,
      cta: t('actions.citizenPanel.cta'),
    },
  ], [t]);

  const essentialActionKeywords: Record<string, readonly string[]> = useMemo(() => ({
    '/ouvidoria': [t('keywords.request'), t('keywords.complaint'), t('keywords.report')],
    '/perfil': [t('keywords.status'), t('keywords.answer'), t('keywords.history')],
    '/peticoes': [t('keywords.causes'), t('keywords.sign'), t('keywords.track')],
  }), [t]);

  const serviceHighlights = useMemo(() => getServiceHighlights(t), [t]);
  const processSteps = useMemo(() => getProcessSteps(t), [t]);

  const stats = useMemo(() => [
    { value: 24, suffix: 'h', label: isEssential ? t('stats.alwaysOpen.essential') : t('stats.alwaysOpen.default') },
    eventsCount > 0
      ? { value: eventsCount, suffix: '', label: eventsCount === 1 ? t('stats.events.single') : t('stats.events.plural') }
      : { value: 14, suffix: '', label: isEssential ? t('stats.services.essential') : t('stats.services.default') },
    noticesCount > 0
      ? { value: noticesCount, suffix: '', label: noticesCount === 1 ? t('stats.notices.single') : t('stats.notices.plural') }
      : { value: 100, suffix: '%', label: isEssential ? t('stats.digital.essential') : t('stats.digital.default') },
  ], [eventsCount, noticesCount, isEssential, t]);
  const yPanel = useTransform(scrollY, [0, 500], [0, -46]);
  const yBlob = useTransform(scrollY, [0, 500], [0, 80]);
  const yBlob2 = useTransform(scrollY, [0, 600], [0, -60]);
  const rotateMark = useTransform(scrollY, [0, 600], [0, 24]);

  return (
    <div className="page-shell">
      {/* ───────────── Hero ───────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div ref={heroRef} className="hero-panel grid grid-cols-1 gap-8 p-5 sm:p-7 md:grid-cols-[1.08fr_0.92fr] md:p-9 lg:p-12">
          {/* Camadas decorativas com parallax */}
          <motion.div
            aria-hidden
            style={{ y: yBlob }}
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-secondary/25 to-transparent blur-3xl"
          />
          <motion.div
            aria-hidden
            style={{ y: yBlob2 }}
            className="pointer-events-none absolute -right-10 top-1/3 h-56 w-56 rounded-full bg-gradient-to-br from-accent/25 to-transparent blur-3xl"
          />

          <div className="relative z-10 flex flex-col justify-center gap-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="soft-chip w-fit"
            >
              <MapPin className="h-3.5 w-3.5" />
              Santa Maria do Pará
            </motion.div>

            <div className="max-w-3xl">
              <h1
                className="text-[2.7rem] font-extrabold leading-[0.95] tracking-[-0.03em] text-text-main sm:text-6xl lg:text-7xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease }}
                  className="block"
                >
                  {isEssential ? t('hero.essentialLine1') : t('hero.cityLine1')}
                </motion.span>{' '}
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease }}
                  className="font-script text-[1.35em] font-bold leading-[0.8] text-gradient"
                >
                  {isEssential ? t('hero.essentialLine2') : t('hero.cityLine2')}
                </motion.span>{' '}
                {!isEssential && (
                  <motion.span
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.18, ease }}
                  >
                    {t('hero.cityLine3')}
                  </motion.span>
                )}
              </h1>
              {isEssential && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.18 }}
                  className="mt-5 max-w-xl text-base font-bold leading-7 text-text-muted sm:text-lg"
                >
                  {t('hero.essentialSubtitle')}
                </motion.p>
              )}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.26 }}
                className={cn('mt-5 max-w-2xl text-base font-medium leading-7 text-text-muted sm:text-lg', isEssential && 'hidden')}
              >
                {t('hero.subtitle')}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap"
            >
              <Link href="/ouvidoria" className="action-button-primary group">
                {t('hero.ctaPrimary')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/perfil" className="action-button-secondary">
                {t('hero.ctaSecondary')}
              </Link>
            </motion.div>

            {/* Stats com contadores */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid max-w-md grid-cols-3 gap-4 border-t border-border/70 pt-6"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-extrabold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-[11px] font-semibold leading-tight text-text-muted">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Painel flutuante com parallax */}
          <motion.div style={{ y: yPanel }} className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="glass-panel p-4 sm:p-5"
            >
              <div className="ring-highlight-dark relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark to-primary p-6 text-white shadow-[0_22px_50px_rgba(14,58,140,0.34)]">
                {/* Brilho ciano sutil para profundidade (não compõe gradiente duro) */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-secondary/30 blur-3xl" />
                <div aria-hidden className="hero-grid-overlay" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                      {t('floatingPanel.badge')}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      {t('floatingPanel.title')}
                    </h2>
                  </div>
                  <motion.span
                    style={{ rotate: rotateMark }}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10"
                  >
                    <LogoMark size={28} />
                  </motion.span>
                </div>

                <div className="mt-6 space-y-3">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.12 }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent text-sm font-extrabold text-primary-dark">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-white/90">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  [t('floatingPanel.trust.value1'), t('floatingPanel.trust.label1')],
                  [t('floatingPanel.trust.value2'), t('floatingPanel.trust.label2')],
                  [t('floatingPanel.trust.value3'), t('floatingPanel.trust.label3')],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-border bg-white/80 p-3 text-center">
                    <p className="text-sm font-bold text-text-main" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
                    <p className="mt-1 text-[11px] font-semibold leading-tight text-text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-16 px-4 py-14 sm:px-6 md:px-10 md:py-20 lg:px-12">
        {/* ───────────── Ações principais ───────────── */}
        <section className="space-y-8" aria-labelledby="acoes-principais">
          <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr] sm:items-end">
            <div>
              <Reveal><p className="eyebrow">{t('section.quickAccess.eyebrow')}</p></Reveal>
              <h2 id="acoes-principais" className="section-title mt-2">
                <TextReveal text={t('section.quickAccess.title')} highlight={['fazer?']} />
              </h2>
            </div>
            <Reveal delay={0.1}>
              <p className={cn('text-sm font-medium leading-6 text-text-muted', isEssential && 'hidden')}>
                {t('section.quickAccess.subtitle')}
              </p>
            </Reveal>
          </div>

          <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {primaryActions.map((action) => (
              <RevealItem key={action.title}>
                <Link
                  href={action.href}
                  className={cn(
                    'civic-card group relative flex h-full flex-col justify-between overflow-hidden p-6',
                    isEssential ? 'min-h-44' : 'min-h-56'
                  )}
                >
                  {/* Faixa de cor que sobe no hover */}
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-primary/8 to-transparent transition-all duration-500 group-hover:h-full" />
                  <div className="relative z-10 space-y-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-text-main" style={{ fontFamily: 'var(--font-display)' }}>
                        {action.title}
                      </h3>
                      {isEssential ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {(essentialActionKeywords[action.href] ?? ['Acessar']).map((keyword) => (
                            <span key={keyword} className="rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-2 text-sm font-medium leading-6 text-text-muted">{action.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="relative z-10 mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    {action.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ───────────── Serviços ───────────── */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.85fr_1.15fr]" aria-labelledby="servicos">
          <Reveal direction="right">
            <div className="glass-panel h-full p-6 md:p-8">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary/10 text-secondary">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="eyebrow mt-5">{t('section.services.eyebrow')}</p>
              <h2 id="servicos" className="mt-2 text-2xl font-bold tracking-tight text-text-main md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
                <TextReveal text={t('section.services.title')} highlight={['lugar']} />
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-text-muted">
                {t('section.services.description')}
              </p>
              <Link href="/avisos" className="action-button-secondary mt-6">
                {t('section.services.cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <RevealGroup className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 smart-scroll sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {serviceHighlights.map((service) => (
              <RevealItem key={service.label}>
                <Link
                  href={service.href}
                  className={`civic-card group flex min-h-40 min-w-44 flex-col justify-between bg-gradient-to-br ${service.tone} to-white p-5`}
                >
                  <div className={`grid h-9 w-9 place-items-center rounded-xl ${service.iconBg} ${service.iconColor} shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-105`}>
                    <service.icon className="h-[18px] w-[18px]" />
                  </div>
                  <span className="relative z-10 inline-flex items-center justify-between text-lg font-bold text-text-main" style={{ fontFamily: 'var(--font-display)' }}>
                    {service.label}
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ───────────── Petições (CTA) ───────────── */}
        <Reveal>
          <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-white p-7 md:p-12">
            {/* Glow azul suave no canto */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
            {/* Barra de destaque lateral */}
            <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b from-primary to-secondary" />
            <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <span className="soft-chip mb-4 inline-flex">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {t('petitionsCta.badge')}
                </span>
                <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-text-main md:text-[2.6rem] md:leading-[1.02]" style={{ fontFamily: 'var(--font-display)' }}>
                  {t('petitionsCta.titlePart1')}{' '}
                  <span className="text-gradient">{t('petitionsCta.titlePart2')}</span>
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-text-muted">
                  {t('petitionsCta.description')}
                </p>
              </div>
              <Link href="/peticoes" className="action-button-primary group shrink-0">
                {t('petitionsCta.cta')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
