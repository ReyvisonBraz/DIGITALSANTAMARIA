# 05 — Módulo Relatar: Upload de Foto + Geolocalização Real

> Base já funciona (grava no Firestore). Este módulo adiciona:
> - Upload de foto → Firebase Storage
> - Geolocalização GPS real via `navigator.geolocation`
> - Classificação automática de categoria (preparado para Gemini)

---

## Arquivo: `features/relatar/PhotoUpload.tsx` (NOVO)

```typescript
'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import type { StorageFile } from '@/types/common.types';

interface PhotoUploadProps {
  /** Chamado quando o upload for concluído com sucesso */
  onUploadComplete: (file: StorageFile) => void;
  /** Chamado quando o usuário remover a foto */
  onRemove: () => void;
  /** Arquivo já enviado (para exibir preview em edição) */
  currentFile?: StorageFile | null;
}

/**
 * Componente de upload de foto para relatos.
 * Permite tirar foto com câmera ou selecionar da galeria.
 * Faz upload para Firebase Storage com barra de progresso.
 */
export function PhotoUpload({ onUploadComplete, onRemove, currentFile }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentFile?.url ?? null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Valida e processa o arquivo selecionado.
   * Aceita apenas imagens até 10MB.
   */
  const handleFileSelect = useCallback(async (file: File) => {
    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são aceitas (JPG, PNG, WEBP)');
      return;
    }

    // Validação de tamanho (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo: 10MB');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    // Preview local imediato (antes do upload)
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      // Importa dinamicamente para não bloquear o bundle inicial
      const { uploadFile } = await import('@/lib/firebase/storage');
      const stored = await uploadFile(file, 'reports', (pct) => setProgress(pct));

      // Libera URL de blob e usa a URL do Storage
      URL.revokeObjectURL(localUrl);
      setPreview(stored.url);
      onUploadComplete(stored);
    } catch {
      setError('Falha no upload. Tente novamente.');
      setPreview(null);
      URL.revokeObjectURL(localUrl);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [onUploadComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
    onRemove();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-ui font-semibold text-text-main">
        Foto do Problema
        <span className="text-text-muted font-normal ml-1">(opcional)</span>
      </label>

      <AnimatePresence mode="wait">
        {preview ? (
          /* Preview da imagem selecionada */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-xl overflow-hidden bg-surface-low border-2 border-primary/30"
          >
            <Image
              src={preview}
              alt="Preview do problema"
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />

            {/* Barra de progresso durante upload */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <div className="w-3/4 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-white text-sm font-ui">{progress}%</span>
              </div>
            )}

            {/* Botão remover */}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-accent-danger transition-colors"
                aria-label="Remover foto"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ) : (
          /* Área de upload vazia */
          <motion.button
            key="upload"
            type="button"
            onClick={() => inputRef.current?.click()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-36 border-2 border-dashed border-outline/50 rounded-xl flex flex-col items-center justify-center gap-2 text-text-muted hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
          >
            <Camera className="w-8 h-8" />
            <span className="text-sm font-ui font-medium">Tirar foto ou selecionar</span>
            <span className="text-xs">JPG, PNG ou WEBP até 10MB</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mensagem de erro */}
      {error && (
        <p className="text-sm text-accent-danger font-ui flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Input de arquivo oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"   // abre câmera traseira no mobile
        className="hidden"
        onChange={handleInputChange}
        aria-label="Selecionar imagem"
      />
    </div>
  );
}
```

---

## Arquivo: `features/relatar/LocationPicker.tsx` (NOVO)

```typescript
'use client';

import { useState, useCallback } from 'react';
import { MapPin, Loader2, AlertCircle, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import type { GeoLocation } from '@/types/common.types';

interface LocationPickerProps {
  /** Localização já capturada (para exibir em edição) */
  value: GeoLocation | null;
  /** Campo de texto para endereço manual */
  textValue: string;
  /** Chamado quando localização GPS é capturada */
  onLocationCapture: (location: GeoLocation) => void;
  /** Chamado quando o endereço textual muda */
  onTextChange: (text: string) => void;
}

/**
 * Componente para seleção de localização do problema.
 * Permite captura GPS ou digitação manual do endereço.
 */
export function LocationPicker({
  value,
  textValue,
  onLocationCapture,
  onTextChange,
}: LocationPickerProps) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  /**
   * Solicita localização GPS do dispositivo.
   * Faz geocoding reverso para obter endereço legível.
   */
  const captureGPS = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocalização não suportada neste dispositivo');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        // Tenta geocoding reverso via API pública (Nominatim/OpenStreetMap)
        // Não requer API key
        let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt-BR`
          );
          if (res.ok) {
            const data = await res.json();
            address = data.display_name ?? address;
          }
        } catch {
          // Usa coordenadas brutas se geocoding falhar
        }

        onLocationCapture({ lat, lng, address });
        onTextChange(address);
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Permissão de localização negada. Digite o endereço manualmente.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Localização indisponível. Verifique o GPS.');
            break;
          case error.TIMEOUT:
            setGeoError('Tempo esgotado. Tente novamente.');
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [onLocationCapture, onTextChange]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-ui font-semibold text-text-main">
        Localização do Problema
        <span className="text-accent-danger ml-1">*</span>
      </label>

      {/* Botão de captura GPS */}
      <button
        type="button"
        onClick={captureGPS}
        disabled={geoLoading}
        className="w-full flex items-center gap-3 px-4 py-3 border-2 border-outline/30 rounded-xl text-text-muted hover:border-primary hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {geoLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm font-ui">Obtendo localização GPS...</span>
          </>
        ) : value ? (
          <>
            <Navigation className="w-5 h-5 text-primary fill-primary" />
            <span className="text-sm font-ui text-text-main font-medium">
              GPS Capturado ✓
            </span>
          </>
        ) : (
          <>
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-ui">Usar minha localização GPS</span>
          </>
        )}
      </button>

      {/* Exibe coordenadas capturadas */}
      {value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-text-muted font-mono break-all">
            {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
          </p>
        </motion.div>
      )}

      {/* Campo de texto para endereço manual */}
      <div className="relative">
        <span className="text-xs text-text-muted font-ui mb-1 block">
          Ou descreva o endereço manualmente:
        </span>
        <input
          type="text"
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Ex: Rua das Flores, 42, próximo à praça"
          className="w-full px-4 py-3 bg-surface-low border-2 border-outline/30 rounded-xl text-sm font-ui text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Erro de GPS */}
      {geoError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-2 p-3 bg-accent-danger/5 border border-accent-danger/20 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 text-accent-danger mt-0.5 shrink-0" />
          <p className="text-xs text-accent-danger font-ui">{geoError}</p>
        </motion.div>
      )}
    </div>
  );
}
```

---

## Atualização: `app/relatar/page.tsx`

**Mudanças:**
1. Integrar `PhotoUpload` (upload real ao Storage)
2. Integrar `LocationPicker` (GPS real)
3. Salvar `photo` e `location` no Firestore

```typescript
// Adicionar ao formData:
const [formData, setFormData] = useState({
  title: '',
  category: '',
  description: '',
  location: '',         // texto do endereço
  isPetition: false,
  // NOVOS campos:
  geoLocation: null as GeoLocation | null,   // coordenadas GPS
  photoFile: null as StorageFile | null,     // arquivo já enviado ao Storage
});

// Substituir handleSubmit para incluir photo e geoLocation:
const handleSubmit = async () => {
  if (!user) return login();
  if (!validateStep(step)) return;

  setLoading(true);
  try {
    const protocol = `GC-${Math.floor(Math.random() * 900000 + 100000)}`;

    await addDoc(collection(db, 'reports'), {
      ...formData,
      geoLocation: undefined,  // não salvar referência local
      photoFile: undefined,    // não salvar referência local
      userId: user.uid,
      reporterId: user.uid,
      reporterName: user.displayName ?? 'Cidadão',
      status: 'pending',
      protocol,
      votes: 0,
      // NOVOS campos conectados:
      location: formData.geoLocation
        ? formData.geoLocation
        : { lat: null, lng: null, address: formData.location },
      photo: formData.photoFile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setShowSuccessModal(true);
    setFormData({
      title: '', category: '', description: '', location: '',
      isPetition: false, geoLocation: null, photoFile: null,
    });
    setStep(1);
  } catch (error) {
    console.error('[relatar] Erro ao enviar relato:', error);
    toast('Erro ao enviar relato. Tente novamente.', 'error');
  } finally {
    setLoading(false);
  }
};
```

---

## Arquivo: `services/reports.service.ts` (NOVO)

```typescript
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { reportConverter } from '@/lib/firebase/converters';
import type { Report, ReportStatus } from '@/types/report.types';

/**
 * Busca todos os relatos de um usuário específico.
 */
export async function getReportsByUser(userId: string): Promise<Report[]> {
  const q = query(
    collection(db, 'reports').withConverter(reportConverter),
    where('reporterId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

/**
 * Busca todos os relatos pendentes (para o painel admin).
 */
export async function getPendingReports(): Promise<Report[]> {
  const q = query(
    collection(db, 'reports').withConverter(reportConverter),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

/**
 * Admin/clerk atualiza o status de um relato e adiciona resposta.
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminResponse?: string,
  clerkId?: string
): Promise<void> {
  await updateDoc(doc(db, 'reports', reportId), {
    status,
    adminResponse: adminResponse ?? null,
    clerkId: clerkId ?? null,
    updatedAt: serverTimestamp(),
  });
}
```
