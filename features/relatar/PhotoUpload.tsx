'use client';

import Image from 'next/image';
import { ImageIcon, Link2, X } from 'lucide-react';

interface PhotoUploadProps {
  imageURL: string;
  onImageURLChange: (url: string) => void;
}

const IMAGE_INPUT_ID = 'report-photo-url';

export default function PhotoUpload({ imageURL, onImageURLChange }: PhotoUploadProps) {
  const trimmedURL = imageURL.trim();
  const canPreview = trimmedURL.startsWith('https://');

  return (
    <div className="space-y-2">
      <label htmlFor={IMAGE_INPUT_ID} className="text-[11px] font-black uppercase tracking-widest text-text-main">
        Link da imagem (opcional)
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            id={IMAGE_INPUT_ID}
            type="url"
            inputMode="url"
            value={imageURL}
            onChange={(event) => onImageURLChange(event.target.value)}
            placeholder="https://exemplo.com/foto.jpg"
            className="h-12 w-full rounded-xl border-2 border-border bg-white pl-10 pr-3 text-sm font-medium text-text-main outline-none transition placeholder:text-text-muted/60 focus:border-primary"
          />
        </div>

        {trimmedURL && (
          <button
            type="button"
            onClick={() => onImageURLChange('')}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-xs font-black uppercase tracking-widest text-text-muted transition hover:border-rose-300 hover:text-rose-600"
          >
            <X className="h-4 w-4" />
            Limpar
          </button>
        )}
      </div>

      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
        Use uma imagem pública em HTTPS. Upload direto fica desativado enquanto o Storage não estiver ativo.
      </p>

      {canPreview ? (
        <div className="relative h-48 overflow-hidden rounded-2xl border-2 border-border bg-surface">
          <Image
            src={trimmedURL}
            alt="Preview da imagem informada"
            fill
            sizes="100vw"
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-4 border-dashed border-border/60 bg-white text-center">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <ImageIcon className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
            Cole um link para exibir preview
          </span>
        </div>
      )}
    </div>
  );
}
