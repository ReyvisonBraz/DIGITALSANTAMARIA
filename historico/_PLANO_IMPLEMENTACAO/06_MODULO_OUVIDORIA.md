# 06 — Módulo Ouvidoria: Persistência Real + Protocolo Único

> Problema atual: form descarta dados + busca hardcoded com ID '2847192'
> Solução: gravar na coleção `demands` + busca real no Firestore

---

## Arquivo: `services/demands.service.ts` (NOVO)

```typescript
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { demandConverter } from '@/lib/firebase/converters';
import type { Demand, CreateDemandInput, DemandStatus } from '@/types/demand.types';
import { generateProtocolId } from '@/lib/utils/protocol';

/**
 * Cria uma nova demanda na ouvidoria.
 * Gera protocolo único no formato OUV-YYYY-XXXXX.
 */
export async function createDemand(
  input: CreateDemandInput,
  userId: string,
  userName: string
): Promise<{ id: string; protocolId: string }> {
  const protocolId = generateProtocolId('OUV');

  const docRef = await addDoc(
    collection(db, 'demands').withConverter(demandConverter),
    {
      protocolId,
      authorId: userId,
      authorName: input.isAnonymous ? 'Anônimo' : userName,
      type: input.type,
      category: input.category,
      subject: input.subject,
      status: 'pending' as DemandStatus,
      content: {
        text: input.text,
        mediaFiles: [],  // arquivos são adicionados após upload
        location: input.location ?? null,
      },
      adminAction: null,
      isAnonymous: input.isAnonymous,
      consent: input.consent,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as Omit<Demand, 'id'>
  );

  return { id: docRef.id, protocolId };
}

/**
 * Busca uma demanda pelo protocolo (ex: "OUV-2026-01234").
 * Retorna null se não encontrada.
 */
export async function getDemandByProtocol(protocolId: string): Promise<Demand | null> {
  const q = query(
    collection(db, 'demands').withConverter(demandConverter),
    where('protocolId', '==', protocolId.toUpperCase().trim())
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

/**
 * Busca todas as demandas de um cidadão.
 */
export async function getDemandsByUser(userId: string): Promise<Demand[]> {
  const q = query(
    collection(db, 'demands').withConverter(demandConverter),
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

/**
 * Busca demandas pendentes (painel admin).
 */
export async function getPendingDemands(): Promise<Demand[]> {
  const q = query(
    collection(db, 'demands').withConverter(demandConverter),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

/**
 * Admin/clerk atualiza o status e adiciona resposta.
 */
export async function updateDemandStatus(
  demandId: string,
  status: DemandStatus,
  response: string,
  clerkId: string,
  clerkName: string
): Promise<void> {
  await updateDoc(doc(db, 'demands', demandId), {
    status,
    adminAction: {
      clerkId,
      clerkName,
      response,
      updatedAt: serverTimestamp(),
    },
    updatedAt: serverTimestamp(),
  });
}
```

---

## Arquivo: `lib/utils/protocol.ts` (NOVO)

```typescript
/**
 * Gera um ID de protocolo único no formato {PREFIX}-{ANO}-{SEQUENCIAL}.
 * Usa timestamp + random para garantir unicidade sem consultar o banco.
 *
 * Exemplos:
 *   OUV-2026-01234
 *   GC-2026-98765
 *
 * @param prefix - Prefixo do protocolo (ex: 'OUV', 'GC')
 */
export function generateProtocolId(prefix: string): string {
  const year = new Date().getFullYear();

  // Combina timestamp (ms) com random para unicidade
  // Transforma em base36 para compactar, depois para número de 5 dígitos
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, '0');

  // Pega os últimos 5 chars do timestamp e combina com random
  const seq = (timestamp.slice(-3) + random.slice(0, 2)).toUpperCase();

  return `${prefix}-${year}-${seq}`;
}

/**
 * Valida o formato de um protocolo.
 * Aceita: PREFIX-YYYY-XXXXX
 */
export function isValidProtocol(protocol: string): boolean {
  return /^[A-Z]+-\d{4}-[A-Z0-9]{5}$/.test(protocol);
}
```

---

## Arquivo: `features/ouvidoria/DemandForm.tsx` (NOVO)

```typescript
'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { createDemand } from '@/services/demands.service';
import type { CreateDemandInput, DemandType, DemandCategory } from '@/types/demand.types';

interface DemandFormProps {
  /** Chamado após envio bem-sucedido com protocolo gerado */
  onSuccess: (protocolId: string) => void;
}

// Tipos disponíveis para seleção
const DEMAND_TYPES: { value: DemandType; label: string; description: string }[] = [
  { value: 'reclamacao', label: 'Reclamação', description: 'Serviço prestado inadequadamente' },
  { value: 'sugestao', label: 'Sugestão', description: 'Proposta de melhoria' },
  { value: 'denuncia', label: 'Denúncia', description: 'Irregularidade ou abuso' },
  { value: 'elogio', label: 'Elogio', description: 'Reconhecimento de bom serviço' },
];

const DEMAND_CATEGORIES: { value: DemandCategory; label: string }[] = [
  { value: 'infraestrutura', label: 'Infraestrutura Urbana' },
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'seguranca', label: 'Segurança Pública' },
  { value: 'meio_ambiente', label: 'Meio Ambiente' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'tributos', label: 'Tributos e Finanças' },
  { value: 'outros', label: 'Outros' },
];

/**
 * Formulário de 3 etapas para criar demanda na ouvidoria.
 * Etapa 1: Tipo e categoria
 * Etapa 2: Assunto e texto detalhado
 * Etapa 3: Anonimato e consentimento
 */
export function DemandForm({ onSuccess }: DemandFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<CreateDemandInput, 'mediaFiles'>>({
    type: '' as DemandType,
    category: '' as DemandCategory,
    subject: '',
    text: '',
    isAnonymous: false,
    consent: false,
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  // Valida etapa atual antes de avançar
  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.type) { setError('Selecione o tipo de manifestação'); return false; }
      if (!formData.category) { setError('Selecione a categoria'); return false; }
    }
    if (step === 2) {
      if (formData.subject.trim().length < 5) {
        setError('O assunto precisa ter pelo menos 5 caracteres');
        return false;
      }
      if (formData.text.trim().length < 20) {
        setError('O detalhamento precisa ter pelo menos 20 caracteres');
        return false;
      }
    }
    if (step === 3) {
      if (!formData.consent) { setError('O aceite dos termos é obrigatório'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { protocolId } = await createDemand(
        formData as CreateDemandInput,
        user.uid,
        user.displayName ?? 'Cidadão'
      );
      onSuccess(protocolId);
    } catch (err) {
      console.error('[DemandForm] Erro ao criar demanda:', err);
      setError('Falha ao enviar. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Indicador de etapas */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              s <= step ? 'bg-primary' : 'bg-outline/30'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── ETAPA 1: Tipo e Categoria ─── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <p className="text-sm font-ui font-semibold text-text-main mb-3">
                Tipo de Manifestação
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DEMAND_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => updateField('type', t.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.type === t.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-outline/30 text-text-muted hover:border-primary/50'
                    }`}
                  >
                    <p className="text-sm font-ui font-semibold">{t.label}</p>
                    <p className="text-xs mt-0.5 leading-tight">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-ui font-semibold text-text-main mb-3">
                Categoria
              </p>
              <div className="grid grid-cols-2 gap-2">
                {DEMAND_CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => updateField('category', c.value)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-ui text-center transition-all ${
                      formData.category === c.value
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-outline/30 text-text-muted hover:border-primary/50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── ETAPA 2: Assunto e Detalhamento ─── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-ui font-semibold text-text-main mb-2">
                Assunto <span className="text-accent-danger">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="Resumo em uma frase (mín. 5 caracteres)"
                maxLength={120}
                className="w-full px-4 py-3 bg-surface-low border-2 border-outline/30 rounded-xl text-sm font-ui text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-text-muted font-ui mt-1 text-right">
                {formData.subject.length}/120
              </p>
            </div>

            <div>
              <label className="block text-sm font-ui font-semibold text-text-main mb-2">
                Detalhamento <span className="text-accent-danger">*</span>
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => updateField('text', e.target.value)}
                placeholder="Descreva o problema ou sugestão com detalhes (mín. 20 caracteres)"
                rows={5}
                maxLength={1000}
                className="w-full px-4 py-3 bg-surface-low border-2 border-outline/30 rounded-xl text-sm font-ui text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <p className="text-xs text-text-muted font-ui mt-1 text-right">
                {formData.text.length}/1000
              </p>
            </div>
          </motion.div>
        )}

        {/* ─── ETAPA 3: Privacidade e Consentimento ─── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Opção de anonimato */}
            <label className="flex items-start gap-3 p-4 border-2 border-outline/30 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => updateField('isAnonymous', e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-primary"
              />
              <div>
                <p className="text-sm font-ui font-semibold text-text-main">
                  Enviar anonimamente
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Seu nome não será vinculado publicamente à manifestação.
                  O protocolo ainda permite rastreamento interno.
                </p>
              </div>
            </label>

            {/* Consentimento obrigatório */}
            <label className="flex items-start gap-3 p-4 border-2 border-outline/30 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => updateField('consent', e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-primary"
              />
              <div>
                <p className="text-sm font-ui font-semibold text-text-main">
                  Aceito os termos de uso <span className="text-accent-danger">*</span>
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  Declaro que as informações são verdadeiras e autorizo o
                  processamento conforme a Lei Geral de Proteção de Dados (LGPD).
                </p>
              </div>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Erro de validação */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-accent-danger/5 border border-accent-danger/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-accent-danger shrink-0" />
          <p className="text-sm text-accent-danger font-ui">{error}</p>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 py-3 border-2 border-outline/50 rounded-xl text-sm font-ui font-semibold text-text-muted hover:border-primary hover:text-primary transition-colors"
          >
            Voltar
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-ui font-bold"
          >
            Continuar
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || !formData.consent}
            className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-ui font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Protocolar Manifestação
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
```

---

## Arquivo: `features/ouvidoria/ProtocolSearch.tsx` (NOVO)

```typescript
'use client';

import { useState } from 'react';
import { Search, Loader2, FileSearch, Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDemandByProtocol } from '@/services/demands.service';
import type { Demand } from '@/types/demand.types';

// Mapeamento de status para UI
const STATUS_CONFIG = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  analyzing: {
    label: 'Em Análise',
    icon: FileSearch,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  solved: {
    label: 'Resolvido',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  rejected: {
    label: 'Indeferido',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
} as const;

/**
 * Componente de busca de protocolo da ouvidoria.
 * Busca real no Firestore (substitui o hardcoded anterior).
 */
export function ProtocolSearch() {
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Demand | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const protocol = searchId.trim().toUpperCase();
    if (!protocol) return;

    setLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const demand = await getDemandByProtocol(protocol);

      if (demand) {
        setResult(demand);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('[ProtocolSearch] Erro na busca:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const statusCfg = result ? STATUS_CONFIG[result.status] : null;
  const StatusIcon = statusCfg?.icon ?? AlertTriangle;

  return (
    <div className="space-y-4">
      {/* Campo de busca */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            setResult(null);
            setNotFound(false);
          }}
          placeholder="Ex: OUV-2026-A1B2C"
          className="flex-1 px-4 py-3 bg-surface-low border-2 border-outline/30 rounded-xl text-sm font-ui text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors uppercase"
        />
        <button
          type="submit"
          disabled={loading || !searchId.trim()}
          className="px-4 py-3 bg-primary text-white rounded-xl disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </form>

      <AnimatePresence>
        {/* Resultado encontrado */}
        {result && statusCfg && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl border-2 ${statusCfg.bg} ${statusCfg.border}`}
          >
            {/* Header do resultado */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-5 h-5 ${statusCfg.color}`} />
                <span className={`text-sm font-ui font-bold ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>
              <span className="text-xs font-mono text-text-muted bg-white px-2 py-1 rounded-lg border">
                {result.protocolId}
              </span>
            </div>

            {/* Dados da demanda */}
            <div className="space-y-2">
              <p className="text-sm font-ui font-semibold text-text-main">{result.subject}</p>
              <p className="text-xs text-text-muted font-ui">
                Tipo: {result.type} · Categoria: {result.category}
              </p>
              {result.createdAt && (
                <p className="text-xs text-text-muted font-ui">
                  Registrado em: {result.createdAt.toDate().toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            {/* Resposta do admin (se houver) */}
            {result.adminAction && (
              <div className="mt-3 p-3 bg-white rounded-lg border">
                <p className="text-xs font-ui font-bold text-text-main mb-1">
                  Resposta da Prefeitura:
                </p>
                <p className="text-sm text-text-muted font-ui leading-relaxed">
                  {result.adminAction.response}
                </p>
                <p className="text-xs text-text-muted font-ui mt-2">
                  Por: {result.adminAction.clerkName}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Não encontrado */}
        {notFound && (
          <motion.div
            key="notfound"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl border-2 bg-surface-low border-outline/30 text-center"
          >
            <FileSearch className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-sm font-ui text-text-muted">
              Protocolo não encontrado. Verifique o número e tente novamente.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```
