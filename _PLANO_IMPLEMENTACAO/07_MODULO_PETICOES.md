# 07 — Módulo Petições: Criação + Assinatura Atômica

> Problema atual: dados hardcoded, assinatura só muda state local
> Solução: Firestore completo com transação atômica para assinaturas

---

## Arquivo: `services/petitions.service.ts` (NOVO)

```typescript
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  runTransaction,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { petitionConverter } from '@/lib/firebase/converters';
import type {
  Petition,
  PetitionSignature,
  CreatePetitionInput,
} from '@/types/petition.types';

/**
 * Cria uma nova petição cidadã.
 */
export async function createPetition(
  input: CreatePetitionInput,
  userId: string,
  userName: string,
  userPhotoURL: string | null
): Promise<string> {
  const docRef = await addDoc(
    collection(db, 'petitions').withConverter(petitionConverter),
    {
      creatorId: userId,
      creatorName: userName,
      creatorPhotoURL: userPhotoURL,
      title: input.title,
      description: input.description,
      category: input.category,
      goal: input.goal,
      signaturesCount: 0,
      status: 'active',
      officialReply: null,
      coverImageURL: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as Omit<Petition, 'id'>
  );
  return docRef.id;
}

/**
 * Lista petições ativas, ordenadas por número de assinaturas.
 * @param limitCount - máximo de resultados (default: 20)
 */
export async function getActivePetitions(limitCount = 20): Promise<Petition[]> {
  const q = query(
    collection(db, 'petitions').withConverter(petitionConverter),
    where('status', '==', 'active'),
    orderBy('signaturesCount', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

/**
 * Busca uma petição por ID.
 */
export async function getPetitionById(petitionId: string): Promise<Petition | null> {
  const docSnap = await getDoc(
    doc(db, 'petitions', petitionId).withConverter(petitionConverter)
  );
  return docSnap.exists() ? docSnap.data() : null;
}

/**
 * Verifica se o usuário já assinou a petição.
 * O ID do documento de assinatura é "{petitionId}_{userId}" para garantir unicidade.
 */
export async function hasUserSigned(petitionId: string, userId: string): Promise<boolean> {
  const sigId = `${petitionId}_${userId}`;
  const sigDoc = await getDoc(doc(db, 'petition_signatures', sigId));
  return sigDoc.exists();
}

/**
 * Assina uma petição com garantia de atomicidade.
 *
 * Usa runTransaction para garantir que:
 * 1. O contador de assinaturas seja incrementado exatamente 1x
 * 2. O registro de assinatura seja criado
 * 3. Se qualquer parte falhar, nenhuma mudança persiste
 *
 * @throws Error se o usuário já assinou
 */
export async function signPetition(
  petitionId: string,
  userId: string,
  userName: string
): Promise<void> {
  const sigId = `${petitionId}_${userId}`;
  const petitionRef = doc(db, 'petitions', petitionId);
  const signatureRef = doc(db, 'petition_signatures', sigId);

  await runTransaction(db, async (transaction) => {
    // Verifica se já assinou (leitura deve vir antes de escritas no runTransaction)
    const sigSnap = await transaction.get(signatureRef);
    if (sigSnap.exists()) {
      throw new Error('Você já assinou esta petição.');
    }

    const petitionSnap = await transaction.get(petitionRef);
    if (!petitionSnap.exists()) {
      throw new Error('Petição não encontrada.');
    }

    const petition = petitionSnap.data();
    if (petition.status !== 'active') {
      throw new Error('Esta petição não está mais ativa.');
    }

    // Registra a assinatura (ID único garante deduplicação)
    transaction.set(signatureRef, {
      petitionId,
      userId,
      userName,
      createdAt: serverTimestamp(),
    } satisfies Omit<PetitionSignature, 'id'>);

    // Incremento atômico do contador
    transaction.update(petitionRef, {
      signaturesCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  });
}

/**
 * Busca as petições criadas por um usuário.
 */
export async function getPetitionsByUser(userId: string): Promise<Petition[]> {
  const q = query(
    collection(db, 'petitions').withConverter(petitionConverter),
    where('creatorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}
```

---

## Arquivo: `features/peticoes/SignatureButton.tsx` (NOVO)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { PenLine, Check, Loader2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/lib/contexts/auth-context';
import { signPetition, hasUserSigned } from '@/services/petitions.service';

interface SignatureButtonProps {
  petitionId: string;
  petitionTitle: string;
  /** Chamado após assinatura bem-sucedida para atualizar contagem */
  onSigned: () => void;
}

/**
 * Botão de assinatura de petição com feedback visual e compartilhamento.
 * Verifica automaticamente se o usuário já assinou.
 */
export function SignatureButton({ petitionId, petitionTitle, onSigned }: SignatureButtonProps) {
  const { user, login } = useAuth();
  const [alreadySigned, setAlreadySigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [justSigned, setJustSigned] = useState(false);

  // Verifica se o usuário já assinou ao montar
  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }

    hasUserSigned(petitionId, user.uid)
      .then((signed) => setAlreadySigned(signed))
      .finally(() => setChecking(false));
  }, [petitionId, user]);

  const handleSignClick = () => {
    if (!user) {
      login();
      return;
    }
    if (alreadySigned) return;
    setShowConfirm(true);
  };

  const handleConfirmSign = async () => {
    if (!user) return;

    setLoading(true);
    setShowConfirm(false);

    try {
      await signPetition(petitionId, user.uid, user.displayName ?? 'Cidadão');
      setAlreadySigned(true);
      setJustSigned(true);
      onSigned();

      // Remove animação de "acabou de assinar" após 3s
      setTimeout(() => setJustSigned(false), 3000);
    } catch (err) {
      console.error('[SignatureButton] Erro ao assinar:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Compartilha a petição via Web Share API (WhatsApp, etc.)
   * com fallback para cópia de URL.
   */
  const handleShare = async () => {
    const url = `${window.location.origin}/peticoes/${petitionId}`;
    const text = `Assine a petição: "${petitionTitle}" no Digital Santa Maria!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: petitionTitle, text, url });
      } catch {
        // Usuário cancelou — silencioso
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (checking) {
    return (
      <div className="h-12 bg-surface-med animate-pulse rounded-xl" />
    );
  }

  return (
    <>
      <div className="flex gap-2">
        {/* Botão principal de assinatura */}
        <button
          onClick={handleSignClick}
          disabled={loading || alreadySigned}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-ui font-bold text-sm transition-all ${
            alreadySigned
              ? 'bg-emerald-500 text-white cursor-default'
              : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
          } disabled:opacity-50`}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Loader2 className="w-4 h-4 animate-spin" />
              </motion.span>
            ) : alreadySigned ? (
              <motion.span
                key="signed"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {justSigned ? 'Assinado! Obrigado!' : 'Já Assinado'}
              </motion.span>
            ) : (
              <motion.span key="sign" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <PenLine className="w-4 h-4" />
                Assinar Agora
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Botão de compartilhar */}
        <button
          onClick={handleShare}
          className="px-4 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary/10 transition-colors"
          aria-label="Compartilhar petição"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Dialog de confirmação */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <PenLine className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-text-main">Confirmar Assinatura</h3>
                  <p className="text-xs text-text-muted font-ui">Esta ação é permanente</p>
                </div>
              </div>

              <p className="text-sm font-ui text-text-muted leading-relaxed">
                Você está prestes a assinar a petição{' '}
                <strong className="text-text-main">"{petitionTitle}"</strong>.
                Sua assinatura será vinculada ao seu perfil.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 border-2 border-outline/50 rounded-xl text-sm font-ui font-semibold text-text-muted"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmSign}
                  className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-ui font-bold"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

---

## Arquivo: `features/peticoes/SignatureProgress.tsx` (NOVO)

```typescript
'use client';

import { motion } from 'motion/react';
import { Users } from 'lucide-react';

interface SignatureProgressProps {
  current: number;
  goal: number;
  className?: string;
}

/**
 * Barra de progresso de assinaturas com animação.
 * Exibe % atingida e texto formatado.
 */
export function SignatureProgress({ current, goal, className }: SignatureProgressProps) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  const isAchieved = current >= goal;

  // Formata número com separador de milhar (pt-BR)
  const format = (n: number) => n.toLocaleString('pt-BR');

  return (
    <div className={className}>
      {/* Números */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-lg font-display font-black text-text-main">
            {format(current)}
          </span>
          <span className="text-sm text-text-muted font-ui">
            de {format(goal)} assinaturas
          </span>
        </div>
        <span
          className={`text-sm font-ui font-bold ${
            isAchieved ? 'text-emerald-600' : 'text-primary'
          }`}
        >
          {percentage}%
        </span>
      </div>

      {/* Barra */}
      <div className="h-3 bg-surface-med rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isAchieved ? 'bg-emerald-500' : 'bg-primary'}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Meta atingida */}
      {isAchieved && (
        <p className="text-xs text-emerald-600 font-ui font-semibold mt-1.5 text-center">
          🎉 Meta atingida! A prefeitura será notificada.
        </p>
      )}
    </div>
  );
}
```

---

## Atualização: `components/CreatePetitionModal.tsx`

**Substituir** o `handleSubmit` atual (que só faz `setShowSuccess(true)`) por chamada real ao Firestore:

```typescript
// Adicionar imports:
import { useAuth } from '@/lib/contexts/auth-context';
import { createPetition } from '@/services/petitions.service';

// Substituir handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) return login();
  if (!formData.title || formData.title.length < 10) {
    toast('O título precisa ter pelo menos 10 caracteres', 'error');
    return;
  }
  if (!formData.description || formData.description.length < 30) {
    toast('A descrição precisa ter pelo menos 30 caracteres', 'error');
    return;
  }

  setLoading(true);
  try {
    await createPetition(
      {
        title: formData.title,
        description: formData.description,
        category: formData.category || 'geral',
        goal: formData.goal || 100,
      },
      user.uid,
      user.displayName ?? 'Cidadão',
      user.photoURL
    );
    setShowSuccess(true);
    toast('Petição criada com sucesso!', 'success');
  } catch (err) {
    console.error('[CreatePetitionModal] Erro:', err);
    toast('Erro ao criar petição. Tente novamente.', 'error');
  } finally {
    setLoading(false);
  }
};
```

---

## Atualização: `app/peticoes/page.tsx`

**Substituir** array hardcoded por query real:

```typescript
// Substituir dados mock por:
import { useState, useEffect } from 'react';
import { getActivePetitions } from '@/services/petitions.service';
import type { Petition } from '@/types/petition.types';
import { Skeleton } from '@/components/ui/Skeleton';

const [petitions, setPetitions] = useState<Petition[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getActivePetitions(30)
    .then(setPetitions)
    .finally(() => setLoading(false));
}, []);

// Renderização:
if (loading) return <Skeleton variant="page" />;

// Mapear petitions reais em vez do array mock
```
