'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { updateUserProfile } from '@/services/users.service';
import { useToast } from '@/lib/toast-context';
import Button from '@/components/ui/Button';

export default function EditProfileForm({ onSaved }: { onSaved?: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: user?.displayName || '',
    phone: '',
    neighborhood: '',
  });

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUserProfile(user.uid, {
        displayName: form.displayName || user.displayName || '',
        phone: form.phone || null,
        neighborhood: form.neighborhood || null,
      });
      toast('Perfil atualizado!', 'success');
      onSaved?.();
    } catch {
      toast('Erro ao salvar perfil.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Nome de Exibição</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/50" />
          <input
            className="w-full bg-surface border-2 border-border p-4 pl-12 rounded-xl font-bold focus:border-primary outline-none transition-all shadow-inner"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Telefone</label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/50" />
          <input
            className="w-full bg-surface border-2 border-border p-4 pl-12 rounded-xl font-bold focus:border-primary outline-none transition-all shadow-inner"
            placeholder="(00) 00000-0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Bairro</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/50" />
          <input
            className="w-full bg-surface border-2 border-border p-4 pl-12 rounded-xl font-bold focus:border-primary outline-none transition-all shadow-inner"
            placeholder="Seu bairro"
            value={form.neighborhood}
            onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={handleSave} isLoading={loading} className="w-full justify-center">
        Salvar Alterações
      </Button>
    </div>
  );
}
