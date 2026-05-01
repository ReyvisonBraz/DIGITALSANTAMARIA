'use client';

import { useState, useEffect } from 'react';
import { Clock, FileText, ClipboardList } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getReportsByUser } from '@/services/reports.service';
import { getDemandsByUser } from '@/services/demands.service';
import { formatRelativeTime } from '@/lib/utils/formatters';
import type { Report, Demand } from '@/types';

export default function ActivityHistory() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [demands, setDemands] = useState<Demand[]>([]);

  useEffect(() => {
    if (!user) return;
    getReportsByUser(user.uid).then(setReports);
    getDemandsByUser(user.uid).then(setDemands);
  }, [user]);

  const activities = [
    ...reports.map((r) => ({
      id: r.id,
      type: 'Relato' as const,
      title: r.title,
      status: r.status,
      date: r.createdAt,
    })),
    ...demands.map((d) => ({
      id: d.id,
      type: 'Demanda' as const,
      title: d.subject,
      status: d.status,
      date: d.createdAt,
    })),
  ].sort((a, b) => {
    const aTime = 'seconds' in a.date ? a.date.seconds * 1000 : new Date(a.date).getTime();
    const bTime = 'seconds' in b.date ? b.date.seconds * 1000 : new Date(b.date).getTime();
    return bTime - aTime;
  });

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p className="text-xs font-black uppercase tracking-widest">Nenhuma atividade ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 10).map((item) => (
        <div key={`${item.type}-${item.id}`} className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border">
          <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center shrink-0">
            {item.type === 'Relato' ? <FileText className="w-5 h-5 text-primary" /> : <ClipboardList className="w-5 h-5 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-text-main uppercase truncate">{item.title}</p>
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">
              {item.type} • {item.status}
            </p>
          </div>
          <Clock className="w-4 h-4 text-text-muted shrink-0" />
        </div>
      ))}
    </div>
  );
}
