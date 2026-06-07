# Como o Projeto Deveria Ser — Digital Santa Maria

> Visão de produto refinado baseada na análise profunda do código, docs e gaps encontrados.

---

## 1. Diagnóstico Antes da Visão

A análise profunda revelou que o projeto está em **~30% de completude real**:
- **100%** de UI construída (todas as páginas e componentes existem)
- **~5%** de persistência real (só `/relatar` grava dados)
- **0%** de backend (sem Cloud Functions)
- **0%** de integrações externas (Gemini, Maps, ViaCEP)

O caminho para o produto ideal é implementar o que já está desenhado e documentado, não redesenhar.

---

## 2. Arquitetura Ideal

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                        │
│  22 páginas + 15 componentes + Context (Auth/Toast/A11y)        │
│  Firestore SDK client-side para leituras em tempo real          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Firestore SDK + Next.js API Routes
┌───────────────────────────▼─────────────────────────────────────┐
│             BACKEND (Firebase Cloud Functions)                  │
│  - Geração de protocolo único (OUV-XXXXX)                       │
│  - Envio de e-mail (agendamentos, status de relatos)            │
│  - Notificações push (FCM)                                      │
│  - Classificação de relatos com Gemini AI                       │
│  - Validação de CPF (anti-fraude)                               │
│  - Incremento atômico de assinaturas de petições                │
└──────┬──────────────┬────────────────┬────────────────┬─────────┘
       │              │                │                │
┌──────▼──────┐ ┌─────▼────┐ ┌────────▼──────┐ ┌──────▼──────────┐
│  Firestore  │ │  Auth    │ │   Storage     │ │  APIs Externas  │
│  (banco)    │ │ (Google) │ │ (fotos/docs)  │ │ Gemini · Maps   │
│  9 coleções │ │ 3 roles  │ │               │ │ ViaCEP · IBGE   │
└─────────────┘ └──────────┘ └───────────────┘ └─────────────────┘
```

---

## 3. Correções Críticas Imediatas

Estas são as falhas que impedem o uso básico do produto:

### 3.1 Persistência dos Formulários (maior impacto)

Cada página já tem o form completo — basta conectar ao Firestore:

| Página / Componente | Coleção Firestore | O Que Adicionar |
|---|---|---|
| `CreatePetitionModal` | `petitions` | `addDoc(collection(db, 'petitions'), {...})` |
| `AppointmentModal` | `appointments` | `addDoc(collection(db, 'appointments'), {...})` |
| `ProfileSettingsPanel` | `users` | `updateDoc(doc(db, 'users', uid), {...})` |
| `/educacao/matricula` | `enrollments` (nova coleção) | `addDoc(collection(db, 'enrollments'), {...})` |
| `/empregos` candidatura | `job_applications` | `addDoc(collection(db, 'job_applications'), {...})` |
| `/comunidade` sugestão | `community_suggestions` (nova) | `addDoc(...)` |
| `/ouvidoria` manifestação | `demands` | `addDoc(collection(db, 'demands'), {...})` |
| `/peticoes/[id]` assinar | `petition_signatures` | `addDoc(...)` + `increment(1)` em `petitions` |

### 3.2 Autenticação Admin — Remover E-mail Hardcoded

**Situação atual** (`app/gestao/page.tsx:46`):
```typescript
if (!user || user.email !== 'littlefigther50@gmail.com') { ... }
```

**Solução correta** (coleção `admins` já prevista no `firestore.rules`):
```typescript
const adminDoc = await getDoc(doc(db, 'admins', user.uid));
if (!adminDoc.exists()) { redirect('/'); }
```

### 3.3 Busca de Protocolo na Ouvidoria

**Situação atual** (`app/ouvidoria/page.tsx:~150`):
```typescript
// Só funciona com ID literal '2847192'
if (searchProtocol.includes('2847192')) { ... }
```

**Solução**: Query real no Firestore por campo `protocolId`.

### 3.4 Corrigir Hydration Mismatches

- `hooks/use-mobile.ts`: estado inicial deve ser `false`, não `undefined`
- `lib/accessibility-context.tsx`: `window.innerWidth` fora do `useEffect`

---

## 4. Implementações por Módulo

### 4.1 Saúde (`/saude`)
**Atual:** 3 clínicas hardcoded, modal sem backend.  
**Deveria ser:**
- Listagem dinâmica da coleção `health_units` (criar no Firestore)
- `AppointmentModal` → `addDoc(collection(db, 'appointments'), {...})`
- `HealthHistoryPanel` → `getDocs(query(collection(db, 'appointments'), where('userId', '==', uid)))`
- Tempo de espera atualizável por funcionário (role: `clerk`)

### 4.2 Ouvidoria (`/ouvidoria`)
**Atual:** 3-step form que descarta dados + busca hardcoded.  
**Deveria ser:**
- Formulário grava na coleção `demands`
- Protocolo gerado por Cloud Function (formato `OUV-2026-XXXXX`)
- Busca real por `protocolId` no Firestore
- Cidadão acompanha status via listener (`onSnapshot`)
- Admin/clerk atualiza status → `updateDoc`

### 4.3 Petições (`/peticoes`)
**Atual:** Dados hardcoded, assinar só muda state local.  
**Deveria ser:**
- `CreatePetitionModal` → `addDoc(collection(db, 'petitions'), {...})`
- Assinar → Cloud Function com `runTransaction` (incremento atômico + registro de assinatura)
- Deduplicação via `petition_signatures` (regra já no `firestore.rules`)
- Listagem em tempo real via `onSnapshot`
- Notificação ao criador ao atingir 50%, 100% da meta

### 4.4 Relatar Problema (`/relatar`)
**Atual:** Persiste texto no Firestore. ✅ Base funciona.  
**Completar:**
- Upload de foto → `uploadBytes(ref(storage, 'reports/${uid}/${filename}'), file)`
- Geolocalização real → `navigator.geolocation.getCurrentPosition()`
- Classificação automática via Gemini AI (Cloud Function)
- `onSnapshot` no painel admin para atualizações em tempo real

### 4.5 Empregos (`/empregos`)
**Atual:** 4 vagas hardcoded, candidatura perde no reload.  
**Deveria ser:**
- Vagas lidas da coleção `jobs`
- Candidatura → `addDoc(collection(db, 'job_applications'), {...})`
- Verificar candidatura existente antes de permitir nova (deduplicação)

### 4.6 Painel Admin (`/gestao`)
**Atual:** Email hardcoded + status perde no reload.  
**Deveria ser:**
- Verificar role via `doc(db, 'admins', uid)` ou campo `role` em `users`
- Listagem de `demands` e `reports` com status `pending`
- `updateDoc` para mudança de status
- Clerk pode atualizar status; admin tem acesso total

### 4.7 Perfil (`/perfil`)
**Atual:** Form visualmente completo mas sem salvar.  
**Deveria ser:**
- Carregar dados do `users/{uid}` no Firestore com `getDoc`
- Salvar com `updateDoc(doc(db, 'users', uid), formData)`
- Upload de foto de perfil → Firebase Storage

---

## 5. Integrações a Implementar

### 5.1 Gemini AI
**Prioridade:** Alta — já tem `GEMINI_API_KEY` configurado  
**Uso principal:** Classificar tipo de relato automaticamente

```typescript
// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function classifyReport(description: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(
    `Classifique este relato municipal em uma categoria: 
    infrastructure, environment, security, or other.
    Relato: "${description}"
    Responda apenas com a categoria.`
  );
  return result.response.text();
}
```

**Outros usos:**
- Sugestão de resposta para ouvidoria (admin)
- Resumo automático de petições
- Chatbot de atendimento ao cidadão

### 5.2 Firebase Cloud Functions
**Prioridade:** Alta — necessário para e-mails, protocolos, notificações

```
functions/
├── src/
│   ├── onReportCreated.ts    → Envia e-mail + notificação push
│   ├── onStatusChanged.ts    → Notifica cidadão da mudança de status
│   ├── generateProtocol.ts   → Protocolo único para ouvidoria
│   ├── signPetition.ts       → Transação atômica de assinatura
│   └── classifyReport.ts     → Gemini AI classification
```

### 5.3 Google Maps
**Prioridade:** Média  
**Uso:** Mapa de relatos, localização de clínicas, zoom por bairro

Biblioteca recomendada: `@vis.gl/react-google-maps` (oficial Google)

### 5.4 APIs Públicas Gratuitas
| API | Uso | Endpoint |
|---|---|---|
| ViaCEP | Auto-completar endereço | `viacep.com.br/ws/{cep}/json/` |
| IBGE | Dados do município | `servicodados.ibge.gov.br` |
| Receita Federal (proxy) | Validação CNPJ | Via proxy público |

---

## 6. Novas Coleções Necessárias no Firestore

Além das 8 já definidas no `firebase-blueprint.json`:

| Coleção | Propósito | Quem usa |
|---|---|---|
| `admins` | Controle de acesso admin/clerk | `firestore.rules` (já referencia) |
| `health_units` | Clínicas, UPAs — dados reais | `/saude` |
| `demands` | Ouvidoria unificada | `/ouvidoria`, `/gestao` |
| `enrollments` | Matrículas escolares | `/educacao/matricula` |
| `community_suggestions` | Sugestões de grupos | `/comunidade` |
| `events` | Eventos dinâmicos | `/eventos` |
| `works` | Obras públicas | `/obras` |
| `notices` | Avisos e alertas | `/avisos` |

---

## 7. Correções de TypeScript

O projeto usa `any` em vários lugares. Criar `types/index.ts` centralizado:

```typescript
// types/index.ts
export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'citizen' | 'admin' | 'clerk';
  photoURL?: string;
  neighborhood?: string;
  points: number;
}

export interface Report {
  id: string;
  reporterId: string;
  type: 'infrastructure' | 'environment' | 'security' | 'other';
  title: string;
  description: string;
  status: 'pending' | 'in_review' | 'resolved' | 'rejected';
  location?: { lat: number; lng: number; address: string };
  imageUrl?: string;
  protocolId: string;
  createdAt: Timestamp;
}

export interface Petition {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  goal: number;
  signaturesCount: number;
  status: 'active' | 'achieved' | 'closed';
  createdAt: Timestamp;
}
// ... demais tipos
```

---

## 8. Páginas de Erro Faltantes

Criar:
- `app/not-found.tsx` — Página 404 customizada
- `app/error.tsx` — Error boundary global
- `app/loading.tsx` — Skeleton de carregamento global
- Skeletons por módulo (substituir dados hardcoded enquanto carrega)

---

## 9. PWA e Notificações

Para funcionar como app no celular:
- `public/manifest.json` — metadados de instalação
- Ícones em múltiplos tamanhos
- Firebase Cloud Messaging para push notifications
- `public/firebase-messaging-sw.js` — service worker

---

## 10. Roadmap Priorizado

| Fase | O Que Fazer | Impacto | Esforço | Semanas |
|---|---|---|---|---|
| **Fase 1** | Conectar formulários ao Firestore (petições, agendamentos, perfil, ouvidoria, matrículas) | 🔴 Crítico | Baixo | 2 |
| **Fase 2** | Admin por role real + busca de protocolo na ouvidoria | 🔴 Crítico | Baixo | 1 |
| **Fase 3** | Upload de fotos (Firebase Storage) + geolocalização real no `/relatar` | 🔴 Alto | Médio | 1 |
| **Fase 4** | Cloud Functions (e-mails, protocolos, notificações push) | 🟠 Alto | Alto | 2–3 |
| **Fase 5** | Integração Gemini AI (classificação de relatos) | 🟠 Alto | Médio | 1 |
| **Fase 6** | Google Maps real + heatmaps | 🟡 Médio | Médio | 1 |
| **Fase 7** | Tipos TypeScript + Error Boundaries + páginas de erro | 🟡 Médio | Baixo | 1 |
| **Fase 8** | Seed de dados reais no Firestore (clínicas, eventos, obras) | 🟡 Médio | Baixo | 1 |
| **Fase 9** | PWA + push notifications + offline | 🟢 Desejável | Alto | 2 |
| **Fase 10** | Testes automatizados + CI/CD | 🟢 Desejável | Alto | 2–3 |

**Estimativa total para produto funcional (Fases 1–5):** ~7–8 semanas de desenvolvimento focado.
