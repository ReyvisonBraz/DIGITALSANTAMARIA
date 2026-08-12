'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Bell,
  CalendarDays,
  HardHat,
  MapPin,
  MessageSquare,
  Megaphone,
  SearchCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LogoMark } from '@/components/Logo';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';
import { useAccessibility } from '@/lib/accessibility-context';
import { useHomeMetrics } from '@/lib/hooks/use-home-metrics';
import { cn } from '@/lib/utils';

function getServiceHighlights(t: ReturnType<typeof useTranslations<'home'>>) {
  return [
    { label: t('services.notices'), href: '/avisos', icon: Bell, tone: 'from-primary/12', iconBg: 'bg-primary/12', iconColor: 'text-primary' },
    { label: t('services.events'), href: '/eventos', icon: CalendarDays, tone: 'from-secondary/15', iconBg: 'bg-secondary/15', iconColor: 'text-secondary' },
    { label: t('services.publicWorks'), href: '/obras', icon: HardHat, tone: 'from-accent/18', iconBg: 'bg-accent/22', iconColor: 'text-primary-dark' },
  ];
}

function getProcessSteps(t: ReturnType<typeof useTranslations<'home'>>) {
  return [t('process.step1'), t('process.step2'), t('process.step3')];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function HomeInteractive() {
  const t = useTranslations('home');
  const { eventsCount, noticesCount } = useHomeMetrics();
  const { contentMode } = useAccessibility();
  const isEssential = contentMode === 'essential';

  const primaryActions = useMemo(() => [
    {
      title: t('actions.reportProblem.title'),
      description: t('actions.reportProblem.description'),
      href: '/relatar',
      icon: Megaphone,
      cta: t('actions.reportProblem.cta'),
    },
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
      href: '/ouvidoria?tab=search',
      icon: SearchCheck,
      cta: t('actions.checkProtocol.cta'),
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
    '/relatar': [t('keywords.problem'), t('keywords.photo'), t('keywords.location')],
    '/ouvidoria': [t('keywords.request'), t('keywords.complaint'), t('keywords.report')],
    '/ouvidoria?tab=search': [t('keywords.status'), t('keywords.answer'), t('keywords.history')],
    '/perfil': [t('keywords.history'), t('keywords.status'), t('keywords.answer')],
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
  return (
    <div className="apple-home page-shell">
      {/* ───────────── Hero ───────────── */}
      <section className="apple-home-container">
        <div className="apple-home-hero hero-panel grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-8">
          <div aria-hidden className="apple-home-orb apple-home-orb-start" />
          <div aria-hidden className="apple-home-orb apple-home-orb-end" />
          <div aria-hidden className="apple-home-liquid-ribbon" />

          <div className="apple-home-copy relative z-10 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease }}
              className="apple-home-location w-fit"
            >
              <MapPin className="h-3.5 w-3.5" />
              Santa Maria do Pará
            </motion.div>

            <div className="max-w-3xl">
              <h1
                className="apple-home-title"
              >
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.46, ease }}
                  className="block"
                >
                  {isEssential ? t('hero.essentialLine1') : t('hero.cityLine1')}
                </motion.span>{' '}
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.46, delay: 0.06, ease }}
                  className="apple-home-title-accent"
                >
                  {isEssential ? t('hero.essentialLine2') : t('hero.cityLine2')}
                </motion.span>{' '}
                {!isEssential && (
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.46, delay: 0.12, ease }}
                  >
                    {t('hero.cityLine3')}
                  </motion.span>
                )}
              </h1>
              {isEssential && (
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.14, ease }}
                  className="apple-home-lede"
                >
                  {t('hero.essentialSubtitle')}
                </motion.p>
              )}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18, ease }}
                className={cn('apple-home-lede', isEssential && 'hidden')}
              >
                {t('hero.subtitle')}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.24, ease }}
              className="apple-home-actions grid grid-cols-1 gap-3 sm:flex sm:flex-wrap"
            >
              <Link href="/relatar" className="apple-home-primary action-button-primary group">
                {t('hero.ctaPrimary')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/ouvidoria" className="apple-home-secondary action-button-secondary">
                {t('hero.ctaSecondary')}
              </Link>
              <Link href="/ouvidoria?tab=search" className="apple-home-secondary action-button-secondary">
                <SearchCheck className="h-4 w-4" />
                {t('hero.ctaTrack')}
              </Link>
            </motion.div>

            {/* Stats com contadores */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.34, delay: 0.32, ease }}
              className="apple-home-stats grid max-w-md grid-cols-3"
            >
              {stats.map((s) => (
                <div key={s.label} className="apple-home-stat">
                  <p>
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="apple-home-visual relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.45, delay: 0.1 }}
              className="apple-home-material glass-panel"
            >
              <div className="apple-home-process ring-highlight-dark relative overflow-hidden text-white">
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                      {t('floatingPanel.badge')}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-white">
                      {t('floatingPanel.title')}
                    </h2>
                  </div>
                  <span className="apple-home-logo-mark grid h-12 w-12 shrink-0 place-items-center">
                    <LogoMark size={28} />
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.32, delay: 0.28 + index * 0.06, ease }}
                      className="apple-home-step flex items-center gap-3"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-primary-dark">
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
                  <div key={label} className="apple-home-trust text-center">
                    <p>{value}</p>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="apple-home-content mx-auto w-full max-w-7xl space-y-16 px-4 pb-14 pt-8 sm:px-6 md:px-10 md:pb-20 md:pt-12 lg:px-12">
        {/* ───────────── Ações principais ───────────── */}
        <section className="space-y-8" aria-labelledby="acoes-principais">
          <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr] sm:items-end">
            <div>
              <Reveal><p className="apple-home-eyebrow">{t('section.quickAccess.eyebrow')}</p></Reveal>
              <h2 id="acoes-principais" className="apple-home-section-title">
                {t('section.quickAccess.title')}
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
                    'apple-home-action civic-card group relative flex h-full flex-col justify-between p-6',
                    isEssential ? 'min-h-44' : 'min-h-56'
                  )}
                >
                  <div className="relative z-10 space-y-4">
                    <div className="apple-home-action-icon grid h-12 w-12 place-items-center">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="apple-home-action-title">
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
                  <span className="apple-home-action-link relative z-10 mt-5 inline-flex items-center gap-2">
                    {action.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ───────────── Serviços ───────────── */}
        <section id="servicos" className="scroll-mt-28 grid grid-cols-1 gap-5 lg:grid-cols-[0.85fr_1.15fr]" aria-labelledby="servicos">
          <Reveal direction="right">
            <div className="apple-home-service-intro glass-panel h-full p-6 md:p-8">
              <div className="apple-home-action-icon grid h-12 w-12 place-items-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="apple-home-eyebrow mt-5">{t('section.services.eyebrow')}</p>
              <h2 id="servicos" className="apple-home-section-title mt-2 text-3xl md:text-4xl">
                {t('section.services.title')}
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
                  className="apple-home-service-card civic-card group flex min-h-40 min-w-44 flex-col justify-between p-5"
                >
                  <div className="apple-home-service-icon grid h-9 w-9 place-items-center">
                    <service.icon className="h-[18px] w-[18px]" />
                  </div>
                  <span className="apple-home-service-label relative z-10 inline-flex items-center justify-between">
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
          <section className="apple-home-cta relative overflow-hidden p-7 md:p-12">
            <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <span className="apple-home-location mb-4 inline-flex">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {t('petitionsCta.badge')}
                </span>
                <h2 className="apple-home-section-title mt-1 text-3xl md:text-[2.6rem]">
                  {t('petitionsCta.titlePart1')}{' '}
                  <span className="text-gradient">{t('petitionsCta.titlePart2')}</span>
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-text-muted">
                  {t('petitionsCta.description')}
                </p>
              </div>
              <Link href="/avisos" className="action-button-primary group shrink-0">
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
