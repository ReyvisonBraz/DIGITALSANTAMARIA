# 01 — Nova Estrutura de Pastas Completa

> Reorganização do projeto seguindo feature-folder pattern.
> Cada domínio tem sua própria pasta com sub-responsabilidades claras.

---

## Estrutura Atual vs. Nova

### Atual (flat, sem organização por domínio)
```
/app
  /saude/page.tsx
  /peticoes/page.tsx
/components
  AppointmentModal.tsx
  CreatePetitionModal.tsx
/lib
  firebase.ts
  auth-context.tsx
```

### Nova (feature-folder, cada domínio isolado)
```
/app
  /(auth)                          → Grupo de rotas autenticadas
  /(public)                        → Grupo de rotas públicas

/components
  /ui                              → Primitivos (Modal, SidePanel, Button, Input...)
  /layout                          → TopAppBar, BottomNavBar, Footer
  /shared                          → Componentes usados em múltiplos módulos

/features                          → NOVO: cada módulo tem sua pasta
  /auth
  /saude
  /ouvidoria
  /peticoes
  /empregos
  /gestao
  /perfil
  /relatar
  /comunidade
  /obras
  /eventos

/lib
  /firebase                        → firebase.ts, storage.ts, functions.ts
  /hooks                           → hooks globais reutilizáveis
  /contexts                        → todos os contexts
  /utils                           → helpers, formatters, validators

/types                             → NOVO: todos os tipos TypeScript centralizados

/services                          → NOVO: camada de acesso a dados (Firestore)

/functions                         → NOVO: Firebase Cloud Functions
```

---

## Estrutura Completa Detalhada

```
DIGITALSANTAMARIA/
│
├── app/                                     # Next.js App Router
│   ├── layout.tsx                           # Root layout (providers)
│   ├── page.tsx                             # Home dashboard
│   ├── globals.css                          # CSS global + variáveis de design
│   ├── error.tsx                            # ← NOVO: Error boundary global
│   ├── not-found.tsx                        # ← NOVO: Página 404
│   ├── loading.tsx                          # ← NOVO: Loading global
│   │
│   ├── saude/
│   │   ├── page.tsx                         # Lista de unidades de saúde
│   │   └── loading.tsx                      # ← NOVO: Skeleton saúde
│   │
│   ├── ouvidoria/
│   │   └── page.tsx                         # Formulário + busca de protocolo
│   │
│   ├── peticoes/
│   │   ├── page.tsx                         # Lista de petições
│   │   └── [id]/page.tsx                    # Detalhe + assinatura
│   │
│   ├── relatar/
│   │   └── page.tsx                         # Formulário de relato (já funciona, ampliar)
│   │
│   ├── empregos/
│   │   └── page.tsx                         # Board de vagas
│   │
│   ├── gestao/
│   │   └── page.tsx                         # Painel admin (protegido por role)
│   │
│   ├── perfil/
│   │   └── page.tsx                         # Perfil do usuário
│   │
│   ├── educacao/
│   │   ├── page.tsx
│   │   └── matricula/page.tsx
│   │
│   ├── obras/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── eventos/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── comunidade/page.tsx
│   ├── seguranca/page.tsx
│   ├── meio-ambiente/page.tsx
│   ├── social/page.tsx
│   ├── tributos/page.tsx
│   ├── transito/page.tsx
│   ├── comercio/page.tsx
│   ├── avisos/page.tsx
│   ├── votos/page.tsx
│   ├── servicos/page.tsx
│   ├── legal/page.tsx
│   └── sobre/page.tsx
│
├── components/                              # Componentes React
│   │
│   ├── ui/                                  # Primitivos de UI
│   │   ├── Modal.tsx                        # Modal base (já existe)
│   │   ├── SidePanel.tsx                    # Painel lateral (já existe)
│   │   ├── Button.tsx                       # ← NOVO: Botão tipado com variantes
│   │   ├── Input.tsx                        # ← NOVO: Input com validação
│   │   ├── Textarea.tsx                     # ← NOVO: Textarea com contador
│   │   ├── Select.tsx                       # ← NOVO: Select acessível
│   │   ├── Badge.tsx                        # ← NOVO: Badge de status
│   │   ├── Skeleton.tsx                     # ← NOVO: Skeleton loader
│   │   ├── EmptyState.tsx                   # ← NOVO: Estado vazio
│   │   └── ConfirmDialog.tsx                # ← NOVO: Dialog de confirmação
│   │
│   ├── layout/                              # Componentes de layout
│   │   ├── TopAppBar.tsx                    # (já existe, manter)
│   │   ├── BottomNavBar.tsx                 # (já existe, manter)
│   │   └── Footer.tsx                       # (já existe, manter)
│   │
│   └── shared/                             # Componentes compartilhados
│       ├── AlertBanner.tsx                  # (já existe, conectar ao Firestore)
│       ├── SearchModal.tsx                  # (já existe, conectar busca real)
│       ├── NotificationsPanel.tsx           # (já existe, conectar ao Firestore)
│       ├── GlobalStatsModal.tsx             # (já existe, conectar ao Firestore)
│       ├── ProfileSettingsPanel.tsx         # (já existe, conectar updateDoc)
│       └── ServiceCard.tsx                  # (já existe)
│
├── features/                               # ← NOVO: Lógica por domínio
│   │
│   ├── saude/
│   │   ├── AppointmentModal.tsx            # Modal agendamento (conectar Firestore)
│   │   ├── HealthHistoryPanel.tsx          # Histórico (conectar query)
│   │   ├── ClinicCard.tsx                  # Card de clínica (dados reais)
│   │   ├── WaitTimeBadge.tsx               # ← NOVO: Badge de espera em tempo real
│   │   └── hooks/
│   │       ├── useHealthUnits.ts           # ← NOVO: Query coleção health_units
│   │       └── useAppointments.ts          # ← NOVO: Query coleção appointments
│   │
│   ├── ouvidoria/
│   │   ├── DemandForm.tsx                  # ← NOVO: Form de manifestação isolado
│   │   ├── ProtocolSearch.tsx              # ← NOVO: Busca real por protocolo
│   │   ├── ProtocolTimeline.tsx            # Timeline do protocolo
│   │   └── hooks/
│   │       └── useDemands.ts              # ← NOVO: CRUD coleção demands
│   │
│   ├── peticoes/
│   │   ├── CreatePetitionModal.tsx         # Criar petição (conectar Firestore)
│   │   ├── PetitionCard.tsx               # Card (já existe)
│   │   ├── SignatureButton.tsx             # ← NOVO: Botão assinar + transação atômica
│   │   ├── SignatureProgress.tsx           # ← NOVO: Barra de progresso de assinaturas
│   │   └── hooks/
│   │       └── usePetitions.ts            # ← NOVO: CRUD coleção petitions
│   │
│   ├── relatar/
│   │   ├── ReportForm.tsx                  # ← NOVO: Form isolado (já em page.tsx)
│   │   ├── LocationPicker.tsx              # ← NOVO: Geolocalização GPS real
│   │   ├── PhotoUpload.tsx                 # ← NOVO: Upload Firebase Storage
│   │   └── hooks/
│   │       └── useReports.ts              # ← NOVO: CRUD coleção reports
│   │
│   ├── empregos/
│   │   ├── JobCard.tsx                    # Card de vaga (dados reais)
│   │   ├── ApplicationModal.tsx           # ← NOVO: Modal candidatura com Firestore
│   │   └── hooks/
│   │       ├── useJobs.ts                 # ← NOVO: Query coleção jobs
│   │       └── useApplications.ts        # ← NOVO: CRUD job_applications
│   │
│   ├── gestao/
│   │   ├── DemandQueue.tsx               # ← NOVO: Fila de demandas em tempo real
│   │   ├── StatusUpdater.tsx             # ← NOVO: Atualizar status com Firestore
│   │   ├── MetricsDashboard.tsx          # ← NOVO: Métricas reais do Firestore
│   │   └── hooks/
│   │       └── useAdminData.ts          # ← NOVO: Queries admin (reports + demands)
│   │
│   └── perfil/
│       ├── EditProfileForm.tsx           # ← NOVO: Form editar perfil com updateDoc
│       ├── AvatarUpload.tsx             # ← NOVO: Upload foto perfil Storage
│       ├── ActivityHistory.tsx          # ← NOVO: Histórico real do Firestore
│       └── hooks/
│           └── useProfile.ts           # ← NOVO: getDoc/updateDoc users
│
├── lib/                                   # Utilitários e inicialização
│   │
│   ├── firebase/
│   │   ├── firebase.ts                   # Init Firebase (já existe, manter)
│   │   ├── storage.ts                    # ← NOVO: helpers Firebase Storage
│   │   └── converters.ts                # ← NOVO: Firestore data converters tipados
│   │
│   ├── contexts/
│   │   ├── auth-context.tsx             # (já existe, ampliar com role)
│   │   ├── toast-context.tsx            # (já existe, manter)
│   │   └── accessibility-context.tsx    # (já existe, + localStorage)
│   │
│   ├── hooks/
│   │   ├── use-mobile.ts               # (já existe, corrigir hydration)
│   │   ├── use-auth-guard.ts           # ← NOVO: proteção de rotas
│   │   └── use-firestore-doc.ts        # ← NOVO: hook genérico getDoc/onSnapshot
│   │
│   └── utils/
│       ├── utils.ts                     # cn() (já existe)
│       ├── formatters.ts               # ← NOVO: datas, moeda, protocolo
│       ├── validators.ts               # ← NOVO: CPF, e-mail, CEP
│       └── protocol.ts                 # ← NOVO: geração de protocolo único
│
├── types/                              # ← NOVO: Tipos TypeScript centralizados
│   ├── index.ts                        # Re-exports de todos os tipos
│   ├── user.types.ts                   # User, UserRole, UserProfile
│   ├── report.types.ts                 # Report, ReportType, ReportStatus
│   ├── petition.types.ts               # Petition, PetitionSignature
│   ├── demand.types.ts                 # Demand, DemandType, DemandStatus
│   ├── appointment.types.ts            # Appointment, HealthUnit
│   ├── job.types.ts                    # Job, JobApplication
│   └── common.types.ts                 # Timestamp, GeoLocation, PaginatedResult
│
├── services/                          # ← NOVO: Camada de acesso a dados
│   ├── users.service.ts               # getUser, updateUser, createUser
│   ├── reports.service.ts             # createReport, getReports, updateStatus
│   ├── demands.service.ts             # createDemand, getDemands, updateDemand
│   ├── petitions.service.ts           # createPetition, signPetition, getPetitions
│   ├── appointments.service.ts        # createAppointment, getAppointments
│   ├── jobs.service.ts                # getJobs, applyForJob
│   └── storage.service.ts            # uploadFile, deleteFile, getDownloadURL
│
├── functions/                         # ← NOVO: Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts                   # Entry point das functions
│   │   ├── onReportCreated.ts         # Trigger: e-mail + classificação Gemini
│   │   ├── onDemandCreated.ts         # Trigger: gera protocolo único
│   │   ├── onStatusChanged.ts         # Trigger: notifica cidadão
│   │   ├── signPetition.ts            # Callable: assinatura atômica
│   │   └── gemini/
│   │       └── classifyReport.ts      # Gemini AI classification
│   ├── package.json
│   └── tsconfig.json
│
├── _ANALISE/                          # Análise existente (manter)
├── _PLANO_IMPLEMENTACAO/              # Este plano (manter)
├── docs/                              # Docs existentes (manter)
├── FINAL/                             # Specs existentes (manter)
├── GUIA COMPLETO/                     # Design guides (manter)
│
├── firebase-applet-config.json        # Credenciais Firebase
├── firebase-blueprint.json            # Schema (atualizar)
├── firestore.rules                    # Regras (atualizar)
├── next.config.ts                     # Config Next.js
├── tailwind.config.js                 # Config Tailwind
├── tsconfig.json                      # TypeScript config
└── .env.example                       # Template env vars
```

---

## Convenções de Código

### Nomenclatura de Arquivos
```
PascalCase  → Componentes React       (AppointmentModal.tsx)
camelCase   → Hooks e serviços        (useAppointments.ts, reports.service.ts)
kebab-case  → Utilitários e configs   (use-mobile.ts, auth-context.tsx)
```

### Comentários (em português)
```typescript
// Comentário de linha simples — explicando POR QUÊ, não o QUÊ

/**
 * Função ou componente principal
 * @param param - descrição do parâmetro
 * @returns descrição do retorno
 */

// TODO: [nome] — o que fazer quando
// FIXME: bug conhecido
// HACK: workaround temporário — remover quando X
```

### Estrutura de Componente Padrão
```typescript
'use client'; // apenas quando necessário

// 1. Imports externos
import { useState } from 'react';
import { motion } from 'motion/react';

// 2. Imports internos (types, services, hooks)
import type { Petition } from '@/types/petition.types';
import { usePetitions } from './hooks/usePetitions';

// 3. Interface de props (sempre tipada)
interface PetitionCardProps {
  petition: Petition;
  onSign: (id: string) => Promise<void>;
}

// 4. Componente
export function PetitionCard({ petition, onSign }: PetitionCardProps) {
  // estado local
  // hooks
  // handlers
  // render
}
```

### Imports com Path Alias
```typescript
// ✅ Usar path alias (@/)
import { Button } from '@/components/ui/Button';
import type { User } from '@/types/user.types';
import { createDemand } from '@/services/demands.service';

// ❌ Evitar imports relativos longos
import { Button } from '../../../components/ui/Button';
```
