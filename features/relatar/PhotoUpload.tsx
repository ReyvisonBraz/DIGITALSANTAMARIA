'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface PhotoUploadProps {
  file: File | null;
  previewUrl: string | null;
  onFileChange: (file: File | null, previewUrl: string | null) => void;
}

const FILE_INPUT_ID = 'report-photo-input';
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function PhotoUpload({ previewUrl, onFileChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = (selected: File | null) => {
    if (!selected) return;
    if (selected.size > MAX_SIZE) {
      toast('A imagem deve ter no maximo 5MB.', 'error');
      return;
    }
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      toast('Formato não suportado. Use JPEG, PNG ou WebP.', 'error');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(selected);
    onFileChange(selected, url);
  };

  const clearPhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (inputRef.current) inputRef.current.value = '';
    onFileChange(null, null);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={FILE_INPUT_ID} className="text-[11px] font-black uppercase tracking-widest text-text-main">
        Evidencia visual (opcional)
      </label>
      <input
        ref={inputRef}
        id={FILE_INPUT_ID}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0] || null)}
      />
      {previewUrl ? (
        <div className="group relative h-48 overflow-hidden rounded-2xl border-2 border-border">
          <Image
            src={previewUrl}
            alt="Preview da foto selecionada"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
          <button
            type="button"
            onClick={clearPhoto}
            aria-label="Remover foto"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-4 border-dashed border-border/60 bg-white transition-all hover:border-primary/50"
        >
          <div className="rounded-2xl bg-primary/10 p-4 text-primary">
            <Camera className="h-8 w-8" />
          </div>
          <div className="font-ui text-center">
            <span className="block text-sm font-black text-text-main">Toque para anexar foto</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              JPEG, PNG ou WebP - max 5MB
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
