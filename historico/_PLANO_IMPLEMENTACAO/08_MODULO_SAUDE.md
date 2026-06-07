# 08 — Módulo Saúde: Dados Reais + Agendamento Real

---

## Arquivo: `services/appointments.service.ts` (NOVO)

```typescript
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type {
  Appointment,
  CreateAppointmentInput,
  HealthUnit,
} from '@/types/appointment.types';

/**
 * Cria um novo agendamento de consulta.
 */
export async function createAppointment(
  input: CreateAppointmentInput,
  userId: string,
  userName: string
): Promise<string> {
  const docRef = await addDoc(collection(db, 'appointments'), {
    userId,
    userName,
    unitId: input.unitId,
    unitName: input.unitName,
    specialty: input.specialty,
    date: input.date,
    time: input.time,
    status: 'scheduled',
    notes: input.notes ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } satisfies Omit<Appointment, 'id'>);

  return docRef.id;
}

/**
 * Busca agendamentos de um usuário, ordenados por data.
 */
export async function getAppointmentsByUser(userId: string): Promise<Appointment[]> {
  const q = query(
    collection(db, 'appointments'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Appointment));
}

/**
 * Cancela um agendamento (cidadão ou admin).
 */
export async function cancelAppointment(appointmentId: string): Promise<void> {
  await updateDoc(doc(db, 'appointments', appointmentId), {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  });
}

/**
 * Busca todas as unidades de saúde para listagem.
 * Usa coleção health_units (populada via seed).
 */
export async function getHealthUnits(): Promise<HealthUnit[]> {
  const snapshot = await getDocs(collection(db, 'health_units'));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as HealthUnit));
}
```

---

## Atualização: `components/AppointmentModal.tsx`

**Remover** o `setTimeout` fake e **conectar** ao Firestore:

```typescript
'use client';

/**
 * Modal de agendamento de consulta.
 * ANTES: setTimeout fake de 1.5s sem persistência
 * AGORA: addDoc real na coleção 'appointments'
 */

// Adicionar imports:
import { useAuth } from '@/lib/contexts/auth-context';
import { createAppointment } from '@/services/appointments.service';
import { useToast } from '@/lib/contexts/toast-context';

// Substituir handleConfirm (linhas 62-69):
const handleConfirm = async () => {
  if (!user) return;

  setLoading(true);
  try {
    await createAppointment(
      {
        unitId: selectedClinic?.id ?? 'unknown',
        unitName: selectedClinic?.name ?? 'Unidade não especificada',
        specialty: selectedSpecialty ?? 'Clínica Geral',
        date: selectedDate ?? new Date().toISOString().split('T')[0],
        time: selectedTime ?? '08:00',
        notes: null,
      },
      user.uid,
      user.displayName ?? 'Paciente'
    );

    setStep(5); // Step de sucesso
    toast('Consulta agendada com sucesso!', 'success');
  } catch (err) {
    console.error('[AppointmentModal] Erro ao agendar:', err);
    toast('Falha ao agendar. Tente novamente.', 'error');
  } finally {
    setLoading(false);
  }
};
```

---

## Arquivo: `features/saude/hooks/useHealthUnits.ts` (NOVO)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getHealthUnits } from '@/services/appointments.service';
import type { HealthUnit } from '@/types/appointment.types';

/**
 * Hook para buscar unidades de saúde do Firestore.
 * Retorna dados, loading e erro.
 */
export function useHealthUnits() {
  const [units, setUnits] = useState<HealthUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealthUnits()
      .then(setUnits)
      .catch((err) => {
        console.error('[useHealthUnits]', err);
        setError('Não foi possível carregar as unidades de saúde.');
      })
      .finally(() => setLoading(false));
  }, []);

  return { units, loading, error };
}
```

---

## Arquivo: `features/saude/WaitTimeBadge.tsx` (NOVO)

```typescript
import type { WaitTimeLevel } from '@/types/appointment.types';

interface WaitTimeBadgeProps {
  waitTime: string;
  level: WaitTimeLevel;
}

const LEVEL_STYLES: Record<WaitTimeLevel, string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

const LEVEL_DOT: Record<WaitTimeLevel, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500 animate-ping',
};

/**
 * Badge de tempo de espera com indicador visual de nível.
 */
export function WaitTimeBadge({ waitTime, level }: WaitTimeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-ui font-semibold ${LEVEL_STYLES[level]}`}
    >
      <span className={`w-2 h-2 rounded-full ${LEVEL_DOT[level]}`} />
      {waitTime}
    </span>
  );
}
```

---

## Atualização: `app/saude/page.tsx`

**Substituir** array hardcoded de clínicas por dados reais do Firestore:

```typescript
// Remover:
// const clinics = [ { name: 'UPA Central', ... }, ... ];

// Adicionar:
import { useHealthUnits } from '@/features/saude/hooks/useHealthUnits';
import { WaitTimeBadge } from '@/features/saude/WaitTimeBadge';
import { Skeleton } from '@/components/ui/Skeleton';

// No componente:
const { units: clinics, loading, error } = useHealthUnits();

if (loading) return <Skeleton variant="page" />;

if (error) return (
  <div className="p-6 text-center text-accent-danger text-sm font-ui">{error}</div>
);

// Usar 'clinics' (dados reais) no render onde antes estava o array mock
```
