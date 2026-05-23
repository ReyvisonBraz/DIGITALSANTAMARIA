import { AlertTriangle, BarChart3, CheckCircle2, Clock } from 'lucide-react';

interface Metrics {
  total: number;
  pending: number;
  analyzing: number;
  solved: number;
}

export default function MetricsDashboard({ total, pending, analyzing, solved }: Metrics) {
  const items = [
    { label: 'Total', value: total, icon: BarChart3, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Pendentes', value: pending, icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Em análise', value: analyzing, icon: AlertTriangle, color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { label: 'Resolvidas', value: solved, icon: CheckCircle2, color: 'bg-green-50 text-green-700 border-green-200' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={`rounded-2xl border p-4 shadow-sm ${item.color}`}>
          <item.icon className="h-5 w-5" />
          <p className="mt-3 text-2xl font-black leading-none">{item.value}</p>
          <p className="mt-1 text-xs font-black uppercase tracking-widest opacity-70">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
