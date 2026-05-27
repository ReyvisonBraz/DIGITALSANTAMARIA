'use client';

import Link from 'next/link';
import {
  Bell,
  Building2,
  ChevronRight,
  ClipboardList,
  FileText,
  Globe,
  Palette,
  Shield,
} from 'lucide-react';
import SidePanel from '@/components/ui/SidePanel';
import AvatarUpload from '@/features/perfil/AvatarUpload';
import EditProfileForm from '@/features/perfil/EditProfileForm';
import { useAuth } from '@/lib/auth-context';

interface ProfileSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'preferences';
}

export default function ProfileSettingsPanel({ isOpen, onClose, mode }: ProfileSettingsPanelProps) {
  const { userRole } = useAuth();
  const isStaff = userRole === 'admin' || userRole === 'clerk';

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Editar perfil' : 'Preferencias'}>
      <div className="space-y-8 p-4 pb-32 sm:p-6">
        {mode === 'edit' ? (
          <div className="space-y-8">
            <AvatarUpload />
            <EditProfileForm onSaved={onClose} />
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { icon: Bell, label: 'Notificacoes', desc: 'Alertas de zeladoria e novidades.' },
              { icon: Palette, label: 'Acessibilidade', desc: 'Modo alto contraste e fontes.' },
              { icon: Globe, label: 'Idioma e regiao', desc: 'Portugues (Brasil).' },
              { icon: Shield, label: 'Privacidade', desc: 'Dados e permissoes de conta.' },
            ].map((pref) => (
              <button
                key={pref.label}
                className="civic-card group flex w-full items-center justify-between p-4 sm:p-5"
              >
                <span className="flex items-center gap-4 text-left">
                  <span className="rounded-lg border border-border bg-surface p-3 transition group-hover:text-primary">
                    <pref.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold uppercase leading-none tracking-normal text-text-main">
                      {pref.label}
                    </span>
                    <span className="mt-1 block text-xs font-medium text-text-muted">{pref.desc}</span>
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-text-muted/40" />
              </button>
            ))}
          </div>
        )}

        {isStaff && (
          <div className="border-t border-dashed border-border pt-6">
            <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              Acesso administrativo
            </p>
            <div className="grid gap-2">
              {[
                { href: '/gestao', label: 'Painel de gestao', desc: 'Responder protocolos', icon: Building2 },
                { href: '/peticoes', label: 'Peticoes', desc: 'Ver pagina publica', icon: FileText },
                { href: '/ouvidoria', label: 'Solicitacoes', desc: 'Abrir ou consultar', icon: ClipboardList },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="civic-card group flex items-center justify-between p-4 text-text-main hover:text-primary"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="text-left">
                      <span className="block text-xs font-semibold uppercase tracking-widest">{item.label}</span>
                      <span className="block text-xs font-medium text-text-muted">{item.desc}</span>
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-text-muted/40 transition group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </SidePanel>
  );
}
