'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Camera, Link2, Loader2, Save, UserRound, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { updateUserProfile } from '@/services/users.service';
import { uploadAvatar } from '@/services/storage.service';
import { useToast } from '@/lib/toast-context';

const AVATAR_FILE_INPUT_ID = 'avatar-photo-file';

export default function AvatarUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayUrl, setDisplayUrl] = useState<string | null>(user?.photoURL || null);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    setProgress(0);
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

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setSaving(true);
    setProgress(0);
    try {
      const uploaded = await uploadAvatar(user.uid, file, {
        onProgress: setProgress,
      });
      await updateUserProfile(user.uid, { photoURL: uploaded.url });
      setPhotoURL(uploaded.url);
      setDisplayUrl(uploaded.url);
      setProgress(100);
      toast('Foto enviada e salva.', 'success');
    } catch (error) {
      const message = error instanceof Error && error.message
        ? error.message
        : 'Nao foi possivel enviar a foto agora.';
      toast(message, 'error');
    } finally {
      setSaving(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fallbackInitial = (user?.displayName || user?.email || 'C').trim().charAt(0).toUpperCase();

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative h-28 w-28 overflow-hidden rounded-[2.5rem] border-4 border-white bg-surface shadow-xl">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="Avatar"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
            {fallbackInitial ? (
              <span className="text-4xl font-semibold">{fallbackInitial}</span>
            ) : (
              <UserRound className="h-10 w-10" />
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-sm space-y-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-text-muted">
          Foto do perfil
        </span>
        <label
          htmlFor={AVATAR_FILE_INPUT_ID}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          Enviar foto
        </label>
        <input
          ref={fileInputRef}
          id={AVATAR_FILE_INPUT_ID}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={saving}
          onChange={handleUpload}
          className="sr-only"
        />

        {saving && progress > 0 && (
          <div className="space-y-1">
            <div className="h-2 overflow-hidden rounded-full bg-primary/10">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">{progress}% enviado</p>
          </div>
        )}

        <label className="text-[11px] font-black uppercase tracking-widest text-text-muted">
          Link alternativo
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
        <p className="text-[11px] font-semibold leading-5 text-text-muted">
          Formatos aceitos: JPG, PNG ou WebP ate 2 MB.
        </p>
      </div>
    </div>
  );
}
