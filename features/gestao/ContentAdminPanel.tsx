'use client';

import { useState } from 'react';
import { Bell, CalendarDays } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NoticesAdmin from '@/features/gestao/content/NoticesAdmin';
import EventsAdmin from '@/features/gestao/content/EventsAdmin';
import { cn } from '@/lib/utils';

type ContentTab = 'notices' | 'events';

const TABS: { value: ContentTab; label: string; icon: LucideIcon; href: string }[] = [
  { value: 'notices', label: 'Avisos',  icon: Bell,         href: '/avisos' },
  { value: 'events',  label: 'Eventos', icon: CalendarDays, href: '/eventos' },
];

export default function ContentAdminPanel() {
  const [tab, setTab] = useState<ContentTab>('notices');

  return (
    <div className="space-y-5">
      <div className="glass-panel grid grid-cols-2 p-1">
        {TABS.map((item) => {
          const active = item.value === tab;
          const Icon = item.icon;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTab(item.value)}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-widest transition',
                active ? 'bg-primary text-white' : 'text-text-muted hover:text-primary'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === 'notices' ? <NoticesAdmin /> : <EventsAdmin />}
    </div>
  );
}
