'use client';

import { useState } from 'react';
import { Bell, CalendarDays, Car, HardHat, Store } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NoticesAdmin from '@/features/gestao/content/NoticesAdmin';
import EventsAdmin from '@/features/gestao/content/EventsAdmin';
import WorksAdmin from '@/features/gestao/content/WorksAdmin';
import BusinessesAdmin from '@/features/gestao/content/BusinessesAdmin';
import TrafficAdmin from '@/features/gestao/content/TrafficAdmin';
import { cn } from '@/lib/utils';

type ContentTab = 'notices' | 'events' | 'works' | 'businesses' | 'traffic';

const TABS: { value: ContentTab; label: string; icon: LucideIcon }[] = [
  { value: 'notices',    label: 'Avisos',   icon: Bell },
  { value: 'events',     label: 'Eventos',  icon: CalendarDays },
  { value: 'works',      label: 'Obras',    icon: HardHat },
  { value: 'businesses', label: 'Comércio', icon: Store },
  { value: 'traffic',    label: 'Trânsito', icon: Car },
];

export default function ContentAdminPanel() {
  const [tab, setTab] = useState<ContentTab>('notices');

  return (
    <div className="space-y-5">
      <div className="glass-panel grid grid-cols-2 gap-1 p-1 sm:grid-cols-3 md:grid-cols-5">
        {TABS.map((item) => {
          const active = item.value === tab;
          const Icon = item.icon;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold uppercase tracking-widest transition',
                active ? 'bg-primary text-white' : 'text-text-muted hover:text-primary'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === 'notices' && <NoticesAdmin />}
      {tab === 'events' && <EventsAdmin />}
      {tab === 'works' && <WorksAdmin />}
      {tab === 'businesses' && <BusinessesAdmin />}
      {tab === 'traffic' && <TrafficAdmin />}
    </div>
  );
}
