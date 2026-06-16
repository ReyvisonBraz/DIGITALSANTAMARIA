'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import { Camera, ImageIcon, Link2, Loader2, UploadCloud, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { uploadReportPhoto } from '@/services/storage.service';

interface PhotoUploadProps {
  imageURL: string;
  onImageURLChange: (url: string) => void;
}

const FILE_INPUT_ID = 'report-photo-file';
const URL_INPUT_ID = 'report-photo-url';

export default function PhotoUpload({ imageURL, onImageURLChange }: PhotoUploadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const trimmedURL = imageURL.trim();
  const canPreview = Boolean(localPreview || trimmedURL.startsWith('https://'));

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const replaceLocalPreview = (url: string | null) => {
    setLocalPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return url;
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user) {
      toast('Entre com sua conta para enviar foto.', 'error');
      return;
    }

    replaceLocalPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(0);
    try {
      const uploaded = await uploadReportPhoto(user.uid, file, {
        onProgress: setProgress,
      });
      onImageURLChange(uploaded.url);
      setProgress(100);
      toast('Foto anexada ao relato.', 'success');
    } catch (error) {
      replaceLocalPreview(null);
      const message = error instanceof Error && error.message
        ? error.message
        : 'Nao foi possivel enviar a foto agora.';
      toast(message, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const clearImage = () => {
    replaceLocalPreview(null);
    onImageURLChange('');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const previewSource = localPreview || trimmedURL;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-text-main">
          Foto da ocorrencia
        </span>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label
            htmlFor={FILE_INPUT_ID}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-primary-dark"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {uploading ? 'Enviando...' : 'Enviar foto'}
          </label>
          <input
            ref={fileInputRef}
            id={FILE_INPUT_ID}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            disabled={uploading}
            onChange={handleFileChange}
            className="sr-only"
          />

          {(trimmedURL || localPreview) && (
            <button
              type="button"
              onClick={clearImage}
              disabled={uploading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-xs font-black uppercase tracking-widest text-text-muted transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-60"
            >
              <X className="h-4 w-4" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {uploading && (
        <div className="space-y-1">
          <div className="h-2 overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
            {progress}% enviado
          </p>
        </div>
      )}

      <details className="rounded-xl border border-border bg-white p-3">
        <summary className="cursor-pointer text-[11px] font-black uppercase tracking-widest text-text-muted">
          Usar link publico
        </summary>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              id={URL_INPUT_ID}
              type="url"
              inputMode="url"
              value={imageURL}
              onChange={(event) => {
                replaceLocalPreview(null);
                onImageURLChange(event.target.value);
              }}
              placeholder="https://exemplo.com/foto.jpg"
              className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm font-medium text-text-main outline-none transition placeholder:text-text-muted/60 focus:border-primary"
            />
          </div>
        </div>
      </details>

      {canPreview ? (
        <div className="relative h-48 overflow-hidden rounded-2xl border border-border bg-surface">
          {previewSource.startsWith('blob:') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSource}
              alt="Preview da imagem selecionada"
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={previewSource}
              alt="Preview da imagem informada"
              fill
              sizes="100vw"
              unoptimized
              className="object-cover"
            />
          )}
        </div>
      ) : (
        <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-4 border-dashed border-border/60 bg-white text-center">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <UploadCloud className="h-6 w-6" />
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-text-muted">
            <ImageIcon className="h-3.5 w-3.5" />
            Anexe uma foto do local
          </span>
        </div>
      )}
    </div>
  );
}
