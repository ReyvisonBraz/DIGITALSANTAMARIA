# 11 — Módulo Perfil: Edição Real + Foto + Histórico

---

## Arquivo: `services/users.service.ts` (NOVO)

```typescript
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { userConverter } from '@/lib/firebase/converters';
import type { UserProfile } from '@/types/user.types';

/**
 * Busca o perfil completo do usuário no Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docSnap = await getDoc(
    doc(db, 'users', uid).withConverter(userConverter)
  );
  return docSnap.exists() ? docSnap.data() : null;
}

/**
 * Atualiza campos do perfil do usuário.
 * Apenas campos editáveis (não altera role, uid, email, createdAt).
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<Pick<UserProfile, 'displayName' | 'phone' | 'neighborhood' | 'photoURL'>>
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
```

---

## Arquivo: `features/perfil/EditProfileForm.tsx` (NOVO)

```typescript
'use client';

import { useState } from 'react';
import { Loader2, Save, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/contexts/auth-context';
import { updateUserProfile } from '@/services/users.service';
import { AvatarUpload } from './AvatarUpload';
import { useToast } from '@/lib/contexts/toast-context';
import type { UserProfile } from '@/types/user.types';

interface EditProfileFormProps {
  profile: UserProfile;
  onSaved: (updated: Partial<UserProfile>) => void;
}

/**
 * Formulário de edição de perfil com persistência real no Firestore.
 * ANTES: ProfileSettingsPanel salvava em state local apenas
 * AGORA: updateDoc na coleção users/{uid}
 */
export function EditProfileForm({ profile, onSaved }: EditProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    displayName: profile.displayName ?? '',
    phone: profile.phone ?? '',
    neighborhood: profile.neighborhood ?? '',
    photoURL: profile.photoURL ?? '',
  });

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (formData.displayName.trim().length < 2) {
      toast('O nome precisa ter pelo menos 2 caracteres', 'error');
      return;
    }

    setLoading(true);
    try {
      const updates = {
        displayName: formData.displayName.trim(),
        phone: formData.phone.trim() || null,
        neighborhood: formData.neighborhood.trim() || null,
        photoURL: formData.photoURL || null,
      };

      await updateUserProfile(user.uid, updates);
      onSaved(updates);
      toast('Perfil atualizado com sucesso!', 'success');
    } catch (err) {
      console.error('[EditProfileForm] Erro:', err);
      toast('Falha ao salvar perfil. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Upload de avatar */}
      <AvatarUpload
        currentPhotoURL={formData.photoURL}
        userName={formData.displayName}
        onUploaded={(url) => updateField('photoURL', url)}
      />

      {/* Nome */}
      <div>
        <label className="block text-sm font-ui font-semibold text-text-main mb-2">
          Nome Completo <span className="text-accent-danger">*</span>
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => updateField('displayName', e.target.value)}
          placeholder="Seu nome completo"
          maxLength={80}
          className="w-full px-4 py-3 bg-surface-low border-2 border-outline/30 rounded-xl text-sm font-ui text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Telefone */}
      <div>
        <label className="block text-sm font-ui font-semibold text-text-main mb-2">
          Telefone
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="(91) 99999-9999"
          maxLength={20}
          className="w-full px-4 py-3 bg-surface-low border-2 border-outline/30 rounded-xl text-sm font-ui text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Bairro */}
      <div>
        <label className="block text-sm font-ui font-semibold text-text-main mb-2">
          Bairro
        </label>
        <input
          type="text"
          value={formData.neighborhood}
          onChange={(e) => updateField('neighborhood', e.target.value)}
          placeholder="Seu bairro em Santa Maria do Pará"
          maxLength={80}
          className="w-full px-4 py-3 bg-surface-low border-2 border-outline/30 rounded-xl text-sm font-ui text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Botão salvar */}
      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 bg-primary text-white rounded-xl font-ui font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Salvar Alterações
          </>
        )}
      </motion.button>
    </form>
  );
}
```

---

## Arquivo: `features/perfil/AvatarUpload.tsx` (NOVO)

```typescript
'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { uploadFile } from '@/lib/firebase/storage';
import { useAuth } from '@/lib/contexts/auth-context';

interface AvatarUploadProps {
  currentPhotoURL: string | null;
  userName: string;
  onUploaded: (url: string) => void;
}

/**
 * Upload de foto de perfil para Firebase Storage.
 * Clique na foto atual para substituir.
 */
export function AvatarUpload({ currentPhotoURL, userName, onUploaded }: AvatarUploadProps) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Gera avatar inicial com DiceBear se não tiver foto
  const avatarUrl =
    currentPhotoURL ||
    `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=1173d4&textColor=ffffff`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return; // máx 5MB para avatar

    setUploading(true);
    try {
      const stored = await uploadFile(file, 'avatars');
      onUploaded(stored.url);
    } catch (err) {
      console.error('[AvatarUpload] Erro:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative group"
        aria-label="Alterar foto de perfil"
      >
        {/* Foto atual */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30">
          <Image
            src={avatarUrl}
            alt={userName}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Overlay de câmera */}
        <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin opacity-0 group-hover:opacity-100" />
          ) : (
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        {/* Indicador de câmera fixo */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white">
          <Camera className="w-3 h-3" />
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
```

---

## Arquivo: `features/perfil/ActivityHistory.tsx` (NOVO)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { FileText, PenLine, Calendar, Loader2 } from 'lucide-react';
import { getReportsByUser } from '@/services/reports.service';
import { getPetitionsByUser } from '@/services/petitions.service';
import { getAppointmentsByUser } from '@/services/appointments.service';
import type { Report } from '@/types/report.types';
import type { Petition } from '@/types/petition.types';
import type { Appointment } from '@/types/appointment.types';

interface ActivityHistoryProps {
  userId: string;
}

type ActivityItem =
  | { type: 'report'; data: Report }
  | { type: 'petition'; data: Petition }
  | { type: 'appointment'; data: Appointment };

/**
 * Histórico real de atividades do usuário buscado do Firestore.
 * Combina relatos, petições criadas e agendamentos.
 */
export function ActivityHistory({ userId }: ActivityHistoryProps) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca todas as atividades em paralelo
    Promise.all([
      getReportsByUser(userId),
      getPetitionsByUser(userId),
      getAppointmentsByUser(userId),
    ])
      .then(([reports, petitions, appointments]) => {
        const activities: ActivityItem[] = [
          ...reports.map((r) => ({ type: 'report' as const, data: r })),
          ...petitions.map((p) => ({ type: 'petition' as const, data: p })),
          ...appointments.map((a) => ({ type: 'appointment' as const, data: a })),
        ];

        // Ordena por data decrescente
        activities.sort((a, b) => {
          const dateA = a.data.createdAt?.toMillis?.() ?? 0;
          const dateB = b.data.createdAt?.toMillis?.() ?? 0;
          return dateB - dateA;
        });

        setItems(activities);
      })
      .catch((err) => console.error('[ActivityHistory]', err))
      .finally(() => setLoading(false));
  }, [userId]);

  const CONFIG = {
    report: { icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Relato' },
    petition: { icon: PenLine, color: 'text-primary', bg: 'bg-primary/10', label: 'Petição' },
    appointment: { icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Agendamento' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p className="text-sm font-ui">Nenhuma atividade registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 10).map((item, i) => {
        const cfg = CONFIG[item.type];
        const Icon = cfg.icon;

        let title = '';
        let subtitle = '';
        let date = '';

        if (item.type === 'report') {
          title = item.data.title;
          subtitle = `Protocolo: ${item.data.protocol}`;
          date = item.data.createdAt?.toDate().toLocaleDateString('pt-BR') ?? '';
        } else if (item.type === 'petition') {
          title = item.data.title;
          subtitle = `${item.data.signaturesCount} assinaturas`;
          date = item.data.createdAt?.toDate().toLocaleDateString('pt-BR') ?? '';
        } else {
          title = `Consulta em ${item.data.unitName}`;
          subtitle = `${item.data.date} às ${item.data.time}`;
          date = item.data.createdAt?.toDate().toLocaleDateString('pt-BR') ?? '';
        }

        return (
          <div key={i} className="flex items-start gap-3 p-3 bg-surface-low rounded-xl border border-outline/20">
            <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${cfg.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-ui font-semibold text-text-main truncate">{title}</p>
              <p className="text-xs text-text-muted font-ui">{subtitle}</p>
            </div>
            <span className="text-xs text-text-muted font-ui shrink-0">{date}</span>
          </div>
        );
      })}
    </div>
  );
}
```

---

## Atualização: `components/ProfileSettingsPanel.tsx`

```typescript
// Substituir o conteúdo do modo 'edit' por:
import { EditProfileForm } from '@/features/perfil/EditProfileForm';
import { getUserProfile } from '@/services/users.service';

// No componente, carregar o perfil real e usar EditProfileForm
const [profile, setProfile] = useState<UserProfile | null>(null);

useEffect(() => {
  if (!user || mode !== 'edit') return;
  getUserProfile(user.uid).then(setProfile);
}, [user, mode]);

// No JSX do modo edit:
{mode === 'edit' && profile && (
  <EditProfileForm
    profile={profile}
    onSaved={(updates) => {
      setProfile((prev) => prev ? { ...prev, ...updates } : prev);
      onClose();
    }}
  />
)}
```
