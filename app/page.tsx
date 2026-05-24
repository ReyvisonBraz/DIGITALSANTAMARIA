import Link from 'next/link';
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

const primaryActions = [
  {
    title: 'Abrir solicitacao',
    description: 'Registre pedidos, reclamacoes, denuncias, sugestoes ou problemas urbanos.',
    href: '/ouvidoria',
    icon: MessageSquare,
    cta: 'Comecar',
  },
  {
    title: 'Consultar protocolo',
    description: 'Acompanhe o andamento de uma solicitacao enviada ao municipio.',
    href: '/ouvidoria',
    icon: SearchCheck,
    cta: 'Consultar',
  },
  {
    title: 'Peticoes',
    description: 'Apoie causas abertas e acompanhe respostas oficiais da gestao.',
    href: '/peticoes',
    icon: FileText,
    cta: 'Participar',
  },
  {
    title: 'Painel do Cidadao',
    description: 'Veja seu historico, dados basicos, protocolos e atividades.',
    href: '/perfil',
    icon: UserRound,
    cta: 'Entrar',
  },
] as const;

const serviceHighlights = [
  { label: 'Saude', href: '/saude', icon: HeartPulse, tone: 'from-rose-50 to-white' },
  { label: 'Educacao', href: '/educacao', icon: GraduationCap, tone: 'from-amber-50 to-white' },
  { label: 'Empregos', href: '/empregos', icon: Briefcase, tone: 'from-emerald-50 to-white' },
  { label: 'Tributos', href: '/tributos', icon: Landmark, tone: 'from-sky-50 to-white' },
  { label: 'Eventos', href: '/eventos', icon: CalendarDays, tone: 'from-violet-50 to-white' },
  { label: 'Servicos', href: '/servicos', icon: Bell, tone: 'from-slate-50 to-white' },
] as const;

const processSteps = [
  'Descreva a necessidade',
  'Receba um protocolo',
  'Acompanhe a resposta',
] as const;

export default function Home() {
  return (
    <div className="page-shell">
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 md:px-10 lg:px-12">
        <div className="hero-panel grid grid-cols-1 gap-8 p-5 sm:p-7 md:grid-cols-[1.08fr_0.92fr] md:p-9 lg:p-12">
          <div className="relative z-10 flex flex-col justify-center gap-7">
            <div className="soft-chip w-fit">
              <MapPin className="h-4 w-4" />
              Santa Maria do Para
            </div>

            <div className="max-w-3xl space-y-4 animate-float-in">
              <h1 className="text-4xl font-black leading-[0.95] tracking-normal text-text-main sm:text-5xl lg:text-7xl">
                Digital Santa Maria
              </h1>
              <p className="max-w-2xl text-base font-medium leading-7 text-text-muted sm:text-lg">
                Um portal publico para solicitar servicos, consultar protocolos,
                participar de peticoes e acompanhar a cidade com mais clareza.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <Link href="/ouvidoria" className="action-button-primary">
                Abrir solicitacao
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/perfil" className="action-button-secondary">
                Painel do Cidadao
              </Link>
            </div>
          </div>

          <div className="relative z-10">
            <div className="glass-panel p-4 sm:p-5">
              <div className="rounded-2xl bg-gradient-to-br from-text-main to-primary-dark p-5 text-white shadow-[0_22px_50px_rgba(15,23,42,0.18)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-primary-light">
                      Atendimento digital
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-normal">
                      Comece pelo protocolo
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-primary-light">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {processSteps.map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-bold text-white/90">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ['24h', 'Canais digitais'],
                  ['MVP', 'Fluxos reais'],
                  ['Login', 'Google seguro'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl border border-border bg-white/80 p-3 text-center">
                    <p className="text-lg font-black text-text-main">{value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase leading-tight text-text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-8 sm:px-6 md:px-10 md:py-10 lg:px-12">
        <section className="space-y-5" aria-labelledby="acoes-principais">
          <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr] sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary">Acesso rapido</p>
              <h2 id="acoes-principais" className="section-title mt-1">
                O que voce precisa fazer?
              </h2>
            </div>
            <p className="text-sm font-medium leading-6 text-text-muted">
              Os caminhos centrais do MVP ficam destacados e funcionam em fluxo direto para cidadao e gestao.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {primaryActions.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className="civic-card group flex min-h-56 flex-col justify-between p-5 animate-float-in"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="relative z-10 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-normal text-text-main">{action.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-text-muted">{action.description}</p>
                  </div>
                </div>
                <span className="relative z-10 mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  {action.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.85fr_1.15fr]" aria-labelledby="servicos">
          <div className="glass-panel p-5 md:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary/10 text-tertiary">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-widest text-primary">Portal publico</p>
            <h2 id="servicos" className="mt-2 text-2xl font-black tracking-normal text-text-main">
              Servicos municipais em um so lugar
            </h2>
            <p className="mt-3 text-sm font-medium leading-6 text-text-muted">
              A primeira versao prioriza solicitacao, protocolo, painel e peticoes.
              Os demais modulos seguem acessiveis e podem ser ativados por etapas.
            </p>
            <Link href="/servicos" className="action-button-secondary mt-6">
              Ver todos os servicos
            </Link>
          </div>

          <div className="smart-scroll -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
            {serviceHighlights.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className={`civic-card flex min-h-36 min-w-44 flex-col justify-between bg-gradient-to-br ${service.tone} p-4`}
              >
                <service.icon className="relative z-10 h-6 w-6 text-primary" />
                <span className="relative z-10 text-base font-black text-text-main">{service.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-text-main via-primary-dark to-text-main p-5 text-white shadow-[0_22px_70px_rgba(15,23,42,0.18)] md:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary-light">Participacao cidada</p>
              <h2 className="mt-2 text-2xl font-black tracking-normal md:text-3xl">
                Peticoes transformam demandas em pautas visiveis.
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/70">
                Causas abertas pela comunidade ganham meta, contador de assinaturas e espaco para resposta oficial.
              </p>
            </div>
            <Link href="/peticoes" className="action-button bg-white text-text-main hover:bg-primary hover:text-white">
              Ver peticoes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
