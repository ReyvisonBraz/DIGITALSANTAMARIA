'use client';

import { Camera, ClipboardList, MapPin, Megaphone } from 'lucide-react';
import ContentHero from '@/components/ui/ContentHero';
import ReportForm from '@/features/relatar/ReportForm';

const TIPS = [
  {
    icon: Camera,
    title: 'Foto opcional, mas ajuda',
    body: 'Uma imagem do problema acelera o encaminhamento e evita idas a campo desnecessárias.',
  },
  {
    icon: MapPin,
    title: 'Localize com precisão',
    body: 'Digite o ponto de referência ou use o botão de GPS para fixar a coordenada exata.',
  },
  {
    icon: ClipboardList,
    title: 'Acompanhe no painel',
    body: 'Você recebe um protocolo e vê o status no Painel do Cidadão a qualquer momento.',
  },
] as const;

export default function RelatarPage() {
  return (
    <div className="flex w-full min-h-screen flex-col gap-10 p-4 pb-32 md:p-12 max-w-7xl mx-auto">
      <ContentHero
        icon={Megaphone}
        label="Cidadão ativo"
        title="Relatar um problema"
        subtitle="Reporte buracos, descarte irregular, riscos urbanos e outras ocorrências. Cada relato é registrado com protocolo e chega à equipe responsável."
        accent="accent-success"
      />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.36fr]">
        <div className="glass-panel p-5 md:p-8">
          <div className="mb-6 border-b border-border pb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-success">Novo relato</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-text-main">
              Conte o que está acontecendo
            </h2>
          </div>
          <ReportForm />
        </div>

        <aside className="space-y-4">
          {TIPS.map((tip) => (
            <div key={tip.title} className="civic-card p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent-success/12 text-accent-success">
                <tip.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-semibold tracking-normal text-text-main">{tip.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-text-muted">{tip.body}</p>
            </div>
          ))}

          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-primary-dark p-5 text-white shadow-[0_18px_48px_rgba(14,58,140,0.25)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">
              Caso urgente?
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-white/80">
              Em situações de risco imediato, use também os canais de emergência da Defesa Civil, Bombeiros (193) ou Polícia (190).
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
