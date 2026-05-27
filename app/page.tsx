'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarDays,
  FileText,
  GraduationCap,
  HeartPulse,
  Landmark,
  MapPin,
  MessageSquare,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import Reveal, { RevealGroup, RevealItem } from '@/components/ui/Reveal';
import Counter from '@/components/ui/Counter';

const primaryActions = [
  {
    title: 'Abrir solicitação',
    description: 'Registre pedidos, reclamações, denúncias, sugestões ou problemas urbanos.',
    href: '/ouvidoria',
    icon: MessageSquare,
    cta: 'Começar',
  },
  {
    title: 'Consultar protocolo',
    description: 'Acompanhe o andamento de uma solicitação enviada ao município.',
    href: '/ouvidoria',
    icon: SearchCheck,
    cta: 'Consultar',
  },
  {
    title: 'Petições',
    description: 'Apoie causas abertas e acompanhe respostas oficiais da gestão.',
    href: '/peticoes',
    icon: FileText,
    cta: 'Participar',
  },
  {
    title: 'Painel do Cidadão',
    description: 'Veja seu histórico, dados básicos, protocolos e atividades.',
    href: '/perfil',
    icon: UserRound,
    cta: 'Entrar',
  },
] as const;

const serviceHighlights = [
  { label: 'Saúde', href: '/saude', icon: HeartPulse, tone: 'from-sky-100/80' },
  { label: 'Educação', href: '/educacao', icon: GraduationCap, tone: 'from-blue-100/80' },
  { label: 'Empregos', href: '/empregos', icon: Briefcase, tone: 'from-emerald-100/70' },
  { label: 'Tributos', href: '/tributos', icon: Landmark, tone: 'from-amber-100/80' },
  { label: 'Eventos', href: '/eventos', icon: CalendarDays, tone: 'from-indigo-100/70' },
  { label: 'Serviços', href: '/servicos', icon: Bell, tone: 'from-cyan-100/80' },
] as const;

const processSteps = [
  'Descreva a necessidade',
  'Receba um protocolo',
  'Acompanhe a resposta',
] as const;

const stats = [
  { value: 24, suffix: 'h', label: 'Canais sempre abertos' },
  { value: 14, suffix: '', label: 'Áreas de serviço' },
  { value: 100, suffix: '%', label: 'Digital e gratuito' },
] as const;

const marqueeWords = [
  'Saúde', 'Educação', 'Tributos', 'Mobilidade', 'Empregos', 'Eventos',
  'Comércio', 'Comunidade', 'Petições', 'Ouvidoria', 'Meio Ambiente', 'Segurança',
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yPanel = useTransform(scrollY, [0, 500], [0, -42]);
  const yBlob = useTransform(scrollY, [0, 500], [0, 70]);
  const rotateMark = useTransform(scrollY, [0, 600], [0, 24]);

  return (
    <div className="page-shell">
      {/* ───────────── Hero ───────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div ref={heroRef} className="hero-panel grid grid-cols-1 gap-8 p-5 sm:p-7 md:grid-cols-[1.08fr_0.92fr] md:p-9 lg:p-12">
          {/* Blob decorativo com parallax */}
          <motion.div
            aria-hidden
            style={{ y: yBlob }}
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-accent/25 to-transparent blur-2xl"
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

            <div className="max-w-3xl space-y-5">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                className="text-5xl font-semibold leading-[0.98] tracking-tight text-text-main sm:text-6xl lg:text-7xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Sua cidade,{' '}
                <span className="text-gradient">conectada</span> a você.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="max-w-2xl text-base font-medium leading-7 text-text-muted sm:text-lg"
              >
                Solicite serviços, consulte protocolos, participe de petições e
                acompanhe Santa Maria do Pará com mais clareza — tudo em um só lugar.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap"
            >
              <Link href="/ouvidoria" className="action-button-primary group">
                Abrir solicitação
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/perfil" className="action-button-secondary">
                Painel do Cidadão
              </Link>
            </motion.div>

            {/* Stats com contadores */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid max-w-md grid-cols-3 gap-4 border-t border-border/70 pt-6"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-semibold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
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
              transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="glass-panel p-4 sm:p-5"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-dark via-secondary to-secondary-dark p-6 text-white shadow-[0_22px_50px_rgba(17,132,188,0.32)] animate-drift">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                      Atendimento digital
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      Comece pelo protocolo
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
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-accent text-sm font-bold text-secondary-dark">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-white/90">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ['Seguro', 'Login Google'],
                  ['Rápido', 'Fluxos reais'],
                  ['Aberto', '24 horas'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-border bg-white/80 p-3 text-center">
                    <p className="text-sm font-semibold text-text-main" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
                    <p className="mt-1 text-[10px] font-semibold leading-tight text-text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ───────────── Marquee de áreas ───────────── */}
      <div className="relative mt-10 select-none border-y border-border/70 bg-white/40 py-4 marquee-mask">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap will-change-transform">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="flex items-center gap-8 text-lg font-medium text-text-muted" style={{ fontFamily: 'var(--font-display)' }}>
              {word}
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl space-y-16 px-4 py-12 sm:px-6 md:px-10 md:py-16 lg:px-12">
        {/* ───────────── Ações principais ───────────── */}
        <section className="space-y-7" aria-labelledby="acoes-principais">
          <Reveal>
            <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr] sm:items-end">
              <div>
                <p className="eyebrow">Acesso rápido</p>
                <h2 id="acoes-principais" className="section-title mt-2">
                  O que você precisa fazer?
                </h2>
              </div>
              <p className="text-sm font-medium leading-6 text-text-muted">
                Os caminhos centrais ficam destacados e funcionam em fluxo direto, para cidadão e gestão.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {primaryActions.map((action) => (
              <RevealItem key={action.title}>
                <Link
                  href={action.href}
                  className="civic-card group flex h-full min-h-56 flex-col justify-between p-6"
                >
                  <div className="relative z-10 space-y-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-text-main" style={{ fontFamily: 'var(--font-display)' }}>
                        {action.title}
                      </h3>
                      <p className="mt-2 text-sm font-medium leading-6 text-text-muted">{action.description}</p>
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
              <p className="eyebrow mt-5">Portal público</p>
              <h2 id="servicos" className="mt-2 text-2xl font-semibold tracking-tight text-text-main md:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
                Serviços municipais em um só lugar
              </h2>
              <p className="mt-3 text-sm font-medium leading-6 text-text-muted">
                Solicitação, protocolo, painel e petições no centro da experiência.
                As demais áreas ficam acessíveis e podem ser ativadas por etapas.
              </p>
              <Link href="/servicos" className="action-button-secondary mt-6">
                Ver todos os serviços
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
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/70 text-primary shadow-sm transition group-hover:scale-110">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <span className="relative z-10 text-lg font-semibold text-text-main" style={{ fontFamily: 'var(--font-display)' }}>
                    {service.label}
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>

        {/* ───────────── Petições (CTA) ───────────── */}
        <Reveal>
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-dark via-primary to-secondary-dark p-7 text-white shadow-[0_26px_70px_rgba(14,58,140,0.34)] animate-drift md:p-10">
            <LogoMark size={220} className="animate-floaty pointer-events-none absolute -right-12 -bottom-16 opacity-[0.08]" />
            <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">Participação cidadã</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
                  Petições transformam demandas em pautas visíveis.
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/75">
                  Causas abertas pela comunidade ganham meta, contador de assinaturas e espaço para resposta oficial.
                </p>
              </div>
              <Link href="/peticoes" className="action-button bg-white text-primary-dark hover:bg-accent hover:text-secondary-dark">
                Ver petições
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
