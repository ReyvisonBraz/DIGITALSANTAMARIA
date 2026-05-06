'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Bell, 
  ChevronRight, 
  LogOut,
  Gavel,
  MessageSquare,
  FileText,
  BadgeCheck,
  Edit3,
  Camera,
  Share2,
  Lock,
  Download,
  Fingerprint,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/lib/toast-context';
import ProfileSettingsPanel from '@/components/ProfileSettingsPanel';
import ActivityHistory from '@/features/perfil/ActivityHistory';
import { getUserProfile } from '@/services/users.service';
import { getReportsByUser } from '@/services/reports.service';
import { getDemandsByUser } from '@/services/demands.service';
import { getAppointmentsByUser } from '@/services/appointments.service';
import { uploadAvatar } from '@/services/storage.service';
import type { UserProfile } from '@/types';

export default function PerfilPage() {
  const { user, logout, login } = useAuth();
  const { toast } = useToast();
  const [settingsMode, setSettingsMode] = useState<'edit' | 'preferences' | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reportsCount, setReportsCount] = useState(0);
  const [demandsCount, setDemandsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setStatsLoading(true);
    Promise.all([
      getUserProfile(user.uid),
      getReportsByUser(user.uid),
      getDemandsByUser(user.uid),
      getAppointmentsByUser(user.uid),
    ]).then(([prof, reports, demands, appointments]) => {
      setProfile(prof);
      setReportsCount(reports.length);
      setDemandsCount(demands.length);
      setAppointmentsCount(appointments.length);
    }).catch(() => {
      toast('Erro ao carregar dados do perfil', 'error');
    }).finally(() => {
      setStatsLoading(false);
    });
  }, [user]);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast('A imagem deve ter no máximo 2MB', 'error');
      return;
    }
    setUploading(true);
    try {
      await uploadAvatar(user.uid, file);
      toast('Foto atualizada!', 'success');
    } catch {
      toast('Erro ao enviar foto.', 'error');
    }
    setUploading(false);
  };

  const citizenshipLevel = (() => {
    const pts = profile?.points ?? 0;
    if (pts >= 500) return { label: 'Ouro', pct: 100 };
    if (pts >= 200) return { label: 'Prata', pct: (pts / 500) * 100 };
    if (pts >= 50) return { label: 'Bronze', pct: (pts / 200) * 100 };
    return { label: 'Iniciante', pct: (pts / 50) * 100 };
  })();

  const stats = [
    { label: 'Relatos', value: reportsCount, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Demandas', value: demandsCount, icon: Gavel, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Consultas', value: appointmentsCount, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Pontos', value: profile?.points ?? 0, icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-8">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border-4 border-dashed border-border animate-pulse">
           <Lock className="w-10 h-10 text-text-muted/30" />
        </div>
        <div className="space-y-2">
           <h2 className="text-3xl font-black text-text-main tracking-tighter uppercase">Acesso Restrito</h2>
           <p className="text-text-muted font-ui font-medium max-w-xs">Você precisa estar autenticado para visualizar seu painel de cidadão.</p>
        </div>
        <button 
          onClick={login}
          className="btn-tactile bg-primary text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
        >
           Entrar Agora
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto min-h-screen p-6 md:p-12 pb-32">
      
      {/* Profile Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* User Identity Card */}
        <div className="lg:col-span-1 bg-white p-6 md:p-10 rounded-[3rem] border-2 border-border border-b-[8px] md:border-b-[12px] border-b-primary shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-surface border-4 border-white shadow-2xl overflow-hidden relative group/avatar">
                    <Image 
                      src={profile?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} 
                      alt={user.displayName || 'Usuário'} 
                      fill
                      className="object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                       {uploading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Camera className="w-8 h-8 text-white" />}
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                    />
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-2 border-white shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
              </div>

              <div className="space-y-1 w-full overflow-hidden">
                 <h2 className="text-2xl md:text-3xl font-black text-text-main tracking-tighter uppercase leading-none scale-safe">{user.displayName}</h2>
                 <p className="text-[10px] md:text-xs font-black text-text-muted uppercase tracking-[0.2em] break-all">{user.email}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full pt-4">
                 <button 
                  onClick={() => setSettingsMode('edit')}
                  className="flex-1 btn-tactile bg-surface border-2 border-border text-text-muted py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all whitespace-nowrap"
                 >
                    Editar Perfil
                 </button>
                 <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast('Link de perfil copiado!', 'info');
                  }}
                  className="p-3 bg-surface border-2 border-border text-text-muted rounded-xl hover:text-primary transition-all flex justify-center"
                 >
                    <Share2 className="w-5 h-5" />
                 </button>
              </div>

              <div className="w-full pt-8 border-t border-border/50">
                 <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Cidadania</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{citizenshipLevel.label}</span>
                 </div>
                 <div className="w-full h-3 bg-surface rounded-full border border-border overflow-hidden p-0.5 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${citizenshipLevel.pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-primary rounded-full shadow-lg"
                    />
                 </div>
              </div>
           </div>

           <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none rotate-12 group-hover:rotate-6 transition-transform duration-1000">
              <User className="w-64 h-64" />
           </div>
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-10">
           
           {/* Stats Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, idx) => (
                <motion.div 
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-[2rem] border-2 border-border shadow-sm group hover:border-primary hover:shadow-xl transition-all"
                >
                   <div className={cn("p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform", s.bg)}>
                      <s.icon className={cn("w-6 h-6", s.color)} />
                   </div>
                   <div className="space-y-0.5">
                      <span className="block text-3xl font-black tracking-tighter text-text-main">
                        {statsLoading ? <Loader2 className="w-6 h-6 animate-spin text-text-muted" /> : s.value}
                      </span>
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">{s.label}</span>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Recent Activity */}
           <div className="bg-white rounded-[3rem] border-2 border-border p-8 md:p-12 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-text-main tracking-tighter uppercase flex items-center gap-3">
                    <Clock className="w-6 h-6 text-primary" />
                    Histórico Recente
                 </h3>
              </div>
              <ActivityHistory />
           </div>

           {/* Digital Documents Section */}
           <div className="bg-text-main p-8 md:p-12 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden group">
              <div className="flex items-center justify-between relative z-10">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                       <Fingerprint className="w-6 h-6 text-primary" />
                       Central de Documentos
                    </h3>
                    <p className="text-xs font-ui opacity-60 font-medium">Versão digital das suas certidões e identidade municipal.</p>
                 </div>
                 <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
                    <Lock className="w-5 h-5" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                 {[
                   { name: 'Certidão Negativa de Débitos', type: 'Fiscal', date: 'Expira em 90 dias' },
                   { id: '1', name: 'Identidade Cidadã (QR Code)', type: 'Identidade', date: 'Válido' },
                   { name: 'Licença Municipal (MEI)', type: 'Comercial', date: 'Atualizada' },
                   { name: 'Cartão do SUS Digital', type: 'Saúde', date: 'Integralizado' }
                 ].map((doc, idx) => (
                   <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-between group/doc hover:bg-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover/doc:bg-primary transition-colors">
                            <FileText className="w-5 h-5" />
                         </div>
                         <div>
                            <p className="text-xs font-black uppercase tracking-tight">{doc.name}</p>
                            <p className="text-[8px] font-black uppercase opacity-40 tracking-widest">{doc.type} • {doc.date}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => toast(`Gerando download seguro de ${doc.name}...`, 'info')}
                        className="p-2 hover:bg-white/10 rounded-lg"
                      >
                         <Download className="w-4 h-4" />
                      </button>
                   </div>
                 ))}
              </div>
              <Fingerprint className="absolute -right-12 -bottom-12 w-64 h-64 opacity-[0.03] group-hover:scale-110 transition-transform" />
           </div>

           {/* Settings Quick Access */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button 
                onClick={() => setSettingsMode('preferences')}
                className="bg-surface p-8 rounded-[2.5rem] border-2 border-border hover:border-primary transition-all group flex flex-col items-center text-center gap-4"
              >
                 <div className="p-4 bg-white rounded-2xl shadow-sm border border-border group-hover:rotate-12 transition-transform">
                    <Settings className="w-8 h-8 text-primary" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-xl font-black text-text-main tracking-tight uppercase">Preferências</h4>
                    <p className="text-xs font-medium text-text-muted font-ui">Notificações, tema e acessibilidade.</p>
                 </div>
              </button>
              
              <button 
                onClick={() => {
                  logout();
                  toast('Sessão encerrada com sucesso', 'info');
                }}
                className="bg-rose-50 p-8 rounded-[2.5rem] border-2 border-rose-100 hover:border-rose-500 transition-all group flex flex-col items-center text-center gap-4"
              >
                 <div className="p-4 bg-white rounded-2xl shadow-sm border border-rose-100 group-hover:-rotate-12 transition-transform">
                    <LogOut className="w-8 h-8 text-rose-500" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-xl font-black text-rose-500 tracking-tight uppercase">Sair da Conta</h4>
                    <p className="text-xs font-medium text-rose-300 font-ui">Encerrar acesso com segurança.</p>
                 </div>
              </button>
           </div>

        </div>
      </div>

      <ProfileSettingsPanel 
        isOpen={!!settingsMode}
        onClose={() => setSettingsMode(null)}
        mode={settingsMode === 'edit' ? 'edit' : 'preferences'}
      />
    </div>
  );
}
