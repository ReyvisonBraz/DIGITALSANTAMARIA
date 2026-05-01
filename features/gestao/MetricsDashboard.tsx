'use client';

import { BarChart3, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Metrics {
  total: number;
  pending: number;
  inReview: number;
  resolved: number;
}

export default function MetricsDashboard({ total, pending, inReview, resolved }: Metrics) {
  const items = [
    { label: 'Total', value: total, icon: BarChart3, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Pendentes', value: pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { label: 'Em Revisão', value: inReview, icon: AlertTriangle, color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { label: 'Resolvidos', value: resolved, icon: CheckCircle2, color: 'bg-green-50 text-green-600 border-green-200' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className={`p-5 rounded-2xl border-2 ${item.color} space-y-2`}>
          <item.icon className="w-5 h-5" />
          <p className="text-2xl font-black leading-none">{item.value}</p>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
