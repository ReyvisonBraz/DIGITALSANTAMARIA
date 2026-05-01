'use client';

import React from 'react';
import { Bell, Palette, Globe, Shield, ChevronRight, Building2 } from 'lucide-react';
import SidePanel from '@/components/ui/SidePanel';
import { useAuth } from '@/lib/auth-context';
import AvatarUpload from '@/features/perfil/AvatarUpload';
import EditProfileForm from '@/features/perfil/EditProfileForm';
import Link from 'next/link';

interface ProfileSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'preferences';
}

export default function ProfileSettingsPanel({ isOpen, onClose, mode }: ProfileSettingsPanelProps) {
  const { user, userRole } = useAuth();

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Editar Perfil' : 'Preferências'}>
      <div className="p-6 space-y-10 pb-32">
        {mode === 'edit' ? (
          <div className="space-y-8">
            <AvatarUpload />
            <EditProfileForm onSaved={onClose} />
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { icon: Bell, label: 'Notificações', desc: 'Alertas de zeladoria e novidades.' },
              { icon: Palette, label: 'Acessibilidade', desc: 'Modo alto contraste e fontes.' },
              { icon: Globe, label: 'Idioma & Região', desc: 'Português (Brasil).' },
              { icon: Shield, label: 'Privacidade', desc: 'Dados e permissões de conta.' },
            ].map((pref, idx) => (
              <button key={idx} className="w-full flex items-center justify-between p-6 bg-white border-2 border-border rounded-2xl hover:border-primary transition-all group">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-surface border border-border rounded-xl group-hover:text-primary transition-colors">
                    <pref.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-text-main uppercase tracking-tight leading-none mb-1">{pref.label}</h4>
                    <p className="text-[10px] font-medium text-text-muted font-ui">{pref.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-muted opacity-40" />
              </button>
            ))}
          </div>
        )}

        {(userRole === 'admin' || userRole === 'clerk') && (
          <div className="pt-8 border-t-2 border-border border-dashed">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 text-center">Acesso Administrativo</p>
            <Link href="/gestao" onClick={onClose}
              className="flex items-center justify-between p-5 bg-text-main text-white rounded-3xl border-2 border-white/10 hover:scale-[1.02] active:scale-95 transition-all shadow-xl group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-tight">Painel de Gestão</p>
                  <p className="text-[10px] opacity-60 font-medium font-ui">Gerenciar demandas da cidade</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </Link>
          </div>
        )}
      </div>
    </SidePanel>
  );
}
