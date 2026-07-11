'use client';

import { Camera, ClipboardList, MapPin, Megaphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ContentHero from '@/components/ui/ContentHero';
import ReportForm from '@/features/relatar/ReportForm';

export default function RelatarPage() {
  const t = useTranslations('relatar');

  const TIPS = [
    {
      icon: Camera,
      title: t('tips.photo.title'),
      body: t('tips.photo.body'),
    },
    {
      icon: MapPin,
      title: t('tips.location.title'),
      body: t('tips.location.body'),
    },
    {
      icon: ClipboardList,
      title: t('tips.track.title'),
      body: t('tips.track.body'),
    },
  ];

  return (
    <div className="flex w-full min-h-screen flex-col gap-10 p-4 pb-32 md:p-12 max-w-7xl mx-auto">
      <ContentHero
        icon={Megaphone}
        label={t('activeCitizen')}
        title={t('title')}
        subtitle={t('subtitle')}
        accent="accent-success"
      />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.36fr]">
        <div className="glass-panel p-5 md:p-8">
          <div className="mb-6 border-b border-border pb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-success">{t('newReport')}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-normal text-text-main">
              {t('formTitle')}
            </h2>
          </div>
          <ReportForm />
        </div>

        <aside className="space-y-4 pt-24 lg:pt-0">
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
              {t('urgent')}
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-white/80">
              {t('urgentNote')}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
