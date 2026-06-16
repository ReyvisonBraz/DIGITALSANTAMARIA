'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin, Phone, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { getUserProfile, updateUserProfile } from '@/services/users.service';

export default function EditProfileForm({ onSaved }: { onSaved?: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    phone: '',
    neighborhood: '',
  });

  useEffect(() => {
    if (!user) {
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    getUserProfile(user.uid)
      .then((profile) => {
        setForm({
          displayName: profile?.displayName || user.displayName || '',
          phone: profile?.phone || '',
          neighborhood: profile?.neighborhood || '',
        });
      })
      .catch(() => toast('Não foi possível carregar seus dados de perfil.', 'error'))
      .finally(() => setLoadingProfile(false));
  }, [toast, user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: form.displayName.trim() || user.displayName || '',
        phone: form.phone.trim() || null,
        neighborhood: form.neighborhood.trim() || null,
      });
      toast('Perfil atualizado.', 'success');
      onSaved?.();
    } catch {
      toast('Erro ao salvar perfil.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-border bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="ml-1 text-[11px] font-black uppercase tracking-widest text-text-muted">
          Nome de exibição
        </span>
        <span className="relative block">
          <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted/50" />
          <input
            className="w-full rounded-xl border border-border bg-surface p-4 pl-12 font-bold shadow-inner outline-none transition focus:border-primary"
            value={form.displayName}
            onChange={(event) => setForm({ ...form, displayName: event.target.value })}
          />
        </span>
      </label>

      <label className="block space-y-2">
        <span className="ml-1 text-[11px] font-black uppercase tracking-widest text-text-muted">
          Telefone
        </span>
        <span className="relative block">
          <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted/50" />
          <input
            className="w-full rounded-xl border border-border bg-surface p-4 pl-12 font-bold shadow-inner outline-none transition focus:border-primary"
            placeholder="(00) 00000-0000"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </span>
      </label>

      <label className="block space-y-2">
        <span className="ml-1 text-[11px] font-black uppercase tracking-widest text-text-muted">
          Bairro
        </span>
        <span className="relative block">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted/50" />
          <input
            className="w-full rounded-xl border border-border bg-surface p-4 pl-12 font-bold shadow-inner outline-none transition focus:border-primary"
            placeholder="Seu bairro"
            value={form.neighborhood}
            onChange={(event) => setForm({ ...form, neighborhood: event.target.value })}
          />
        </span>
      </label>

      <Button onClick={handleSave} isLoading={saving} className="min-h-11 w-full justify-center">
        Salvar alterações
      </Button>
    </div>
  );
}
