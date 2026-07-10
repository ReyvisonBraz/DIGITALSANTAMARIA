'use client';

import React from 'react';
import { 
  LucideIcon, 
  ChevronRight, 
  MapPin, 
  Clock,
  Activity,
  Calendar
} from 'lucide-react';

interface ClinicCardProps {
  name: string;
  address: string;
  waitTime: string;
  status: 'low' | 'medium' | 'high';
  icon: LucideIcon;
  onDetailsClick?: () => void;
}

const ClinicCard: React.FC<ClinicCardProps> = React.memo(function ClinicCard({ 
  name, 
  address, 
  waitTime, 
  status, 
  icon: Icon,
  onDetailsClick 
}) {
  const statusColors = {
    low: { text: 'text-green-600', label: 'ESPERA BAIXA', bg: 'bg-green-50' },
    medium: { text: 'text-amber-600', label: 'ESPERA MÉDIA', bg: 'bg-amber-50' },
    high: { text: 'text-rose-600', label: 'ESPERA ALTA', bg: 'bg-rose-50' }
  };

  const currentStatus = statusColors[status];

  return (
    <div className="bg-white rounded-xl shadow-sm border-b-2 border-primary hover:border-b-4 transition-all duration-200 p-6 flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Icon className="w-5 h-5" />
          </span>
          <div className="text-right">
            <span className={`text-[11px] font-bold ${currentStatus.text} block tracking-wider uppercase`}>
              {currentStatus.label}
            </span>
            <span className="text-xl font-bold text-text-main tabular-nums">
              {waitTime}
            </span>
          </div>
        </div>
        <h3 className="text-name text-lg mb-1">
          {name}
        </h3>
        <p className="text-subname flex items-center gap-1 mb-4">
          <MapPin className="w-3 h-3 opacity-60" />
          {address}
        </p>
      </div>
      
      <div className="pt-4 border-t border-border flex items-center justify-between">
        <span className="text-[11px] font-bold text-text-muted/80 uppercase tracking-widest">
          Atualizado há 2 min
        </span>
        <button 
          onClick={onDetailsClick}
          className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm group-hover:text-primary-dark"
        >
          Ver detalhes <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export default ClinicCard;
