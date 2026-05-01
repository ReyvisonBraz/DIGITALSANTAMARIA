'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { uploadAvatar } from '@/services/storage.service';
import { useToast } from '@/lib/toast-context';

export default function AvatarUpload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File | null) => {
    if (!file || !user) return;
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-28 h-28 rounded-[2.5rem] bg-surface border-4 border-white shadow-xl overflow-hidden relative">
          <Image
            src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName}`}
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files?.[0] || null)}
      />
      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Toque para alterar a foto</p>
    </div>
  );
}
