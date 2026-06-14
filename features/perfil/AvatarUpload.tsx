'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { uploadAvatar } from '@/services/storage.service';
import { updateUserProfile } from '@/services/users.service';
import { useToast } from '@/lib/toast-context';

const MAX_SIZE = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AvatarUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [displayUrl, setDisplayUrl] = useState<string | null>(user?.photoURL || null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayUrl(user?.photoURL || null);
  }, [user?.photoURL]);

  const handleUpload = async (file: File | null) => {
    if (!file || !user) return;
    if (file.size > MAX_SIZE) {
      toast('A imagem deve ter no máximo 2MB.', 'error');
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast('Formato não suportado. Use JPEG, PNG ou WebP.', 'error');
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadAvatar(user.uid, file);
      await updateUserProfile(user.uid, { photoURL: uploaded.url });
      setDisplayUrl(uploaded.url);
      toast('Foto atualizada.', 'success');
    } catch {
      toast('Erro ao enviar foto.', 'error');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="group relative">
        <div className="relative h-28 w-28 overflow-hidden rounded-[2.5rem] border-4 border-white bg-surface shadow-xl">
          <Image
            src={displayUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || user?.uid || 'cidadao'}`}
            alt="Avatar"
            fill
            unoptimized={!displayUrl}
            className="object-cover"
          />
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="Alterar foto"
          className="absolute -bottom-2 -right-2 rounded-xl border-2 border-white bg-primary p-3 text-white shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(event) => handleUpload(event.target.files?.[0] || null)}
      />
      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Toque para alterar a foto</p>
    </div>
  );
}
