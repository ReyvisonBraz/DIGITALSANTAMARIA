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
    description: 'Veja causas abertas e participe das decisoes coletivas da cidade.',
    href: '/peticoes',
    icon: FileText,
    cta: 'Ver peticoes',
  },
  {
    title: 'Painel do Cidadao',
    description: 'Acesse seus dados, historico, protocolos e atividades em um so lugar.',
    href: '/perfil',
    icon: UserRound,
    cta: 'Entrar',
  },
] as const;

const serviceHighlights = [
  { label: 'Saude', href: '/saude', icon: HeartPulse },
  { label: 'Educacao', href: '/educacao', icon: GraduationCap },
  { label: 'Empregos', href: '/empregos', icon: Briefcase },
  { label: 'Tributos', href: '/tributos', icon: Landmark },
  { label: 'Eventos', href: '/eventos', icon: CalendarDays },
  { label: 'Servicos', href: '/servicos', icon: Bell },
] as const;

const publicStats = [
  { label: 'Canais digitais', value: '24h' },
  { label: 'Fluxo principal', value: 'Protocolo' },
  { label: 'Area do cidadao', value: 'Login Google' },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-7 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:px-10 md:py-12 lg:px-12">
          <div className="flex flex-col justify-center gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <MapPin className="h-4 w-4" />
              Santa Maria do Para
            </div>

            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl font-black leading-tight tracking-normal text-text-main sm:text-5xl lg:text-6xl">
                Digital Santa Maria
              </h1>
              <p className="max-w-2xl text-base font-medium leading-7 text-text-muted sm:text-lg">
                Portal publico para acessar servicos municipais, abrir solicitacoes,
                consultar protocolos e participar das acoes da cidade.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/ouvidoria"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black uppercase tracking-widest text-white shadow-sm transition hover:bg-primary-dark"
              >
                Abrir solicitacao
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/perfil"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-black uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
              >
                Painel do Cidadao
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm md:p-5">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-text-muted">
                    Atendimento digital
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-normal text-text-main">
                    Comece pelo protocolo
                  </h2>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {publicStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
                  >
                    <span className="text-sm font-bold text-text-muted">{stat.label}</span>
                    <span className="text-right text-sm font-black text-text-main">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 md:px-10 md:py-10 lg:px-12">
        <section className="space-y-5" aria-labelledby="acoes-principais">
          <div className="grid gap-2 sm:grid-cols-[1fr_0.8fr] sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary">
                Acesso rapido
              </p>
              <h2 id="acoes-principais" className="mt-1 text-2xl font-black tracking-normal text-text-main md:text-3xl">
                O que voce precisa fazer?
              </h2>
            </div>
            <p className="text-sm font-medium leading-6 text-text-muted">
              Os principais caminhos do portal ficam aqui, sem depender de cadastro para entender o servico.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {primaryActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex min-h-48 flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition hover:border-primary hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-normal text-text-main">
                      {action.title}
                    </h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-text-muted">
                      {action.description}
                    </p>
                  </div>
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  {action.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="servicos">
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm md:p-6">
            <p className="text-xs font-black uppercase tracking-widest text-primary">
              Portal publico
            </p>
            <h2 id="servicos" className="mt-2 text-2xl font-black tracking-normal text-text-main">
              Servicos municipais em um so lugar
            </h2>
            <p className="mt-3 text-sm font-medium leading-6 text-text-muted">
              A primeira versao prioriza solicitacao, protocolo, painel e peticoes.
              Os demais modulos continuam acessiveis como servicos da cidade e entram
              em funcionamento completo por etapas.
            </p>
            <Link
              href="/servicos"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 py-2 text-xs font-black uppercase tracking-widest text-text-main transition hover:border-primary hover:text-primary"
            >
              Ver todos os servicos
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {serviceHighlights.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="flex min-h-24 flex-col justify-between rounded-xl border border-border bg-white p-4 shadow-sm transition hover:border-primary"
              >
                <service.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-black text-text-main">{service.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-text-main p-5 text-white shadow-sm md:p-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary-light">
                Participacao cidada
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-normal md:text-3xl">
                Acompanhe peticoes e participe das decisoes coletivas.
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/70">
                As peticoes ajudam a transformar demandas da comunidade em pautas
                visiveis, com metas, assinaturas e acompanhamento publico.
              </p>
            </div>
            <Link
              href="/peticoes"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black uppercase tracking-widest text-text-main transition hover:bg-primary hover:text-white"
            >
              Ver peticoes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
