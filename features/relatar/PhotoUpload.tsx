'use client';

import { useState, useRef } from 'react';
import { Camera, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';

interface PhotoUploadProps {
  file: File | null;
  previewUrl: string | null;
  onFileChange: (file: File | null, previewUrl: string | null) => void;
}

export default function PhotoUpload({ file, previewUrl, onFileChange }: PhotoUploadProps) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = (selected: File | null) => {
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      toast('A imagem deve ter no máximo 5MB', 'error');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      toast('Formato não suportado. Use JPEG, PNG ou WebP', 'error');
      return;
    }
    const url = URL.createObjectURL(selected);
    onFileChange(selected, url);
  };

  const clearPhoto = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onFileChange(null, null);
  };

  return (
    <div className="space-y-2">
      <label className="font-black text-text-main text-[11px] uppercase tracking-widest">
        Evidência Visual (Opcional)
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />
      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-border group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <button
            type="button"
            onClick={clearPhoto}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-40 rounded-2xl border-4 border-dashed border-border/60 bg-white flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 transition-all"
        >
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <Camera className="w-8 h-8" />
          </div>
          <div className="text-center font-ui">
            <span className="block text-sm font-black text-text-main">Toque para anexar foto</span>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              JPEG ou PNG • Max 5MB
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
