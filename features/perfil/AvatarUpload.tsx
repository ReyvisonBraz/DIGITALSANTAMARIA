'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link2, Loader2, Save, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { updateUserProfile } from '@/services/users.service';
import { useToast } from '@/lib/toast-context';

export default function AvatarUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string | null>(user?.photoURL || null);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

  useEffect(() => {
    setDisplayUrl(user?.photoURL || null);
    setPhotoURL(user?.photoURL || '');
  }, [user?.photoURL]);

  const handleSave = async () => {
    if (!user) return;
    const nextURL = photoURL.trim();
    if (nextURL && !nextURL.startsWith('https://')) {
      toast('Informe uma URL publica iniciando com https://.', 'error');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile(user.uid, { photoURL: nextURL || null });
      setDisplayUrl(nextURL || null);
      toast(nextURL ? 'Foto atualizada.' : 'Foto removida.', 'success');
    } catch {
      toast('Nao foi possivel atualizar a foto agora.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const fallbackUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || user?.uid || 'cidadao'}`;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative h-28 w-28 overflow-hidden rounded-[2.5rem] border-4 border-white bg-surface shadow-xl">
        <Image
          src={displayUrl || fallbackUrl}
          alt="Avatar"
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="w-full max-w-sm space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
          Foto por link
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="url"
              value={photoURL}
              onChange={(event) => setPhotoURL(event.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm font-medium outline-none focus:border-primary"
            />
          </div>
          {photoURL && (
            <button
              type="button"
              onClick={() => setPhotoURL('')}
              aria-label="Limpar foto"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-text-muted hover:border-rose-300 hover:text-rose-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            aria-label="Salvar foto"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
          Upload direto fica desativado enquanto o Storage nao estiver ativo.
        </p>
      </div>
    </div>
  );
}
