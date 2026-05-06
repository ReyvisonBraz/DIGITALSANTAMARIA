# ROADMAP FATORADO — Digital Santa Maria
# Ações Corretivas e de Completude

> Gerado em Maio 2026 após auditoria completa do código real (não dos docs).
> Estado real: ~55% (7 serviços reais, 15 features reais, 5 páginas reais, 15 páginas mock)

---

## DIAGNÓSTICO REAL (PÓS-AUDITORIA DE CÓDIGO)

### O que JÁ ESTÁ PRONTO (ao contrário do que os docs antigos dizem):

| Camada | Status Real |
|---|---|
| Services/ (7 arquivos) | ✅ 7/7 FULL — todas operações Firestore reais |
| Features/ (15 componentes) | ✅ 15/15 — todas com chamadas reais |
| UI Primitives (6) | ✅ Button, Skeleton, EmptyState, ConfirmDialog, Modal, SidePanel |
| Hooks (6) | ✅ todos implementados |
| Auth + userRole | ✅ funcional (não usa mais email hardcoded) |
| Error pages | ✅ loading, error, not-found existem |
| Ouvidoria | ✅ busca real + formulário real |
| Relatar | ✅ com foto e GPS reais |
| Petições | ✅ criação + assinatura atômica reais |
| Gestão Admin | ✅ lista real + status updater |
| Empregos | ✅ vagas + candidatura reais |
| lib/utils/ (3) | ✅ formatters, validators, protocol |

### O que AINDA É MOCK (priorizado por impacto):

| Prioridade | Página/Componente | Problema | Esforço |
|---|---|---|---|
| 🔴 P0 | `app/perfil/page.tsx` | Stats, histórico, docs — tudo hardcoded. ActivityHistory existe mas não é usado | 30min |
| 🔴 P0 | `app/educacao/matricula/page.tsx` | 5-step wizard descarta dados no toast. Sem service | 1h |
| 🔴 P0 | `app/saude/page.tsx` | Clinics hardcoded. useHealthUnits hook existe mas não usado | 20min |
| 🟠 P1 | `app/peticoes/page.tsx` | Sidebar "Relatos Recentes" e "Impact Gauge" hardcoded | 30min |
| 🟠 P1 | `app/page.tsx` (home) | Stats e dados mock | 1h |
| 🟡 P2 | `app/obras/` + `[id]/` | Mock | 1h |
| 🟡 P2 | `app/eventos/` + `[id]/` | Mock | 1h |
| 🟡 P2 | `app/avisos/` | Mock | 30min |
| 🟡 P2 | `app/votos/` | Mock | 30min |
| 🟡 P2 | `app/comunidade/` | Mock | 30min |
| 🟢 P3 | `app/meio-ambiente/` | Mock | 30min |
| 🟢 P3 | `app/social/` | Mock | 30min |
| 🟢 P3 | `app/tributos/` | Mock | 30min |
| 🟢 P3 | `app/transito/` | Mock | 30min |
| 🟢 P3 | `app/comercio/` | Mock | 30min |
| 🟢 P3 | `app/servicos/` | Mock | 30min |
| 🟢 P3 | `app/seguranca/` | Mock | 30min |

---

## FASES DE EXECUÇÃO

### FASE 1 — CORREÇÕES CRÍTICAS (P0) — ~2 horas

#### 1.1 PERFIL — Substituir mock por dados reais

**Arquivo:** `app/perfil/page.tsx`

**Mudanças:**
- Adicionar import: `ActivityHistory` de `@/features/perfil/ActivityHistory`
- Adicionar imports: `getUserProfile` de `@/services/users.service`
- Adicionar imports: `getReportsByUser` de `@/services/reports.service`
- Adicionar imports: `getDemandsByUser` de `@/services/demands.service`
- Adicionar `useEffect` para buscar dados reais do usuário
- Substituir array `stats` hardcoded por dados calculados de `getReportsByUser` + `getDemandsByUser`
- Substituir array `activities` hardcoded pelo componente `<ActivityHistory />`
- Substituir nível "Ouro" 75% por `userProfile.points` e `userProfile.level`
- Avatar upload: usar `AvatarUpload` feature quando clicar na câmera

**Verificação:**
- Logar → perfil mostra número real de relatos/demandas
- Histórico mostra atividades reais do Firestore
- Nível de cidadania reflete pontos reais

---

#### 1.2 EDUCAÇÃO/MATRÍCULA — Criar service e conectar form

**Arquivos a criar/modificar:**

**A) Criar `types/enrollment.types.ts`:**
```typescript
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'waiting_list';

export interface Enrollment {
  id: string;
  userId: string;
  parentName: string;
  parentCpf: string;
  studentName: string;
  studentBirth: string;
  address: string;
  cep: string;
  schoolPreference: string;
  status: EnrollmentStatus;
  protocol: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**B) Criar `services/educacao.service.ts`:**
```typescript
- createEnrollment(input) → addDoc na coleção 'enrollments'
```

**C) Modificar `app/educacao/matricula/page.tsx`:**
- Adicionar states para todos os campos do form
- Conectar inputs aos states
- Adicionar validação antes de submit
- `handleSubmit` → chamar `createEnrollment()` + mostrar protocolo real

**Verificação:**
- Preencher 5 etapas → clicar Finalizar → dados aparecem no Firestore
- Protocolo gerado é exibido no modal de sucesso

---

#### 1.3 SAÚDE — Usar useHealthUnits hook

**Arquivo:** `app/saude/page.tsx`

**Mudanças:**
- Remover array `clinics` hardcoded (linhas 39-61)
- Adicionar: `const { units, status, error } = useHealthUnits()`
- Mapear `units` no lugar de `clinics`
- Substituir `clinicQueues` aleatório por `unit.waitTime` e `unit.waitLevel` reais
- Adicionar estado de loading/error

**Verificação:**
- Página carrega clínicas do Firestore
- Comportamento com coleção vazia → EmptyState
- Comportamento com erro → mensagem de erro

---

### FASE 2 — COMPLETAR PÁGINAS SEMI-REAIS (P1) — ~1.5 horas

#### 2.1 PETIÇÕES — Substituir sidebar mock

**Arquivo:** `app/peticoes/page.tsx`

**Mudanças:**
- Importar `getPendingReports` de `@/services/reports.service`
- Adicionar `useState` + `useEffect` para buscar relatos recentes
- Substituir array `recentReports` hardcoded (linhas 47-51) por dados da query
- Adicionar loading state no sidebar
- Stats "124" e "+15k" → buscar totais do Firestore ou manter como futuro seed

---

#### 2.2 HOME — Conectar dashboard ao Firestore

**Arquivo:** `app/page.tsx`

**Mudanças:**
- Importar `getPendingReports` de `services/reports.service`
- Importar `getActivePetitions` de `services/petitions.service`
- Importar `getActiveJobs` de `services/jobs.service`
- Substituir stats hardcoded (1250pts, "Cidadão Elite") por dados reais
- Contadores reais: total reports, total petitions, total jobs
- Pontos do usuário: `useUserProfile` ou `getUserProfile`

---

### FASE 3 — PÁGINAS INFORMACIONAIS (P2-P3) — ~4 horas

Cada página mock segue o mesmo padrão de correção:
1. Identificar a coleção Firestore correspondente
2. Importar/criar service se necessário
3. Adicionar `useEffect` para buscar dados
4. Adicionar estados de loading/error/empty
5. Substituir array hardcoded por dados da query

#### Páginas que precisam de NOVAS coleções + services:
- `obras/` → coleção `works` + `services/obras.service.ts`
- `eventos/` → coleção `events` + `services/eventos.service.ts`
- `avisos/` → coleção `notices` + `services/avisos.service.ts`
- `comunidade/` → coleção `community_groups` + service
- `votos/` → coleção `polls` + service

#### Páginas que podem ser populadas por seed + query simples:
- `meio-ambiente/` → coleção `environment_alerts`
- `social/` → coleção `social_programs`
- `tributos/` → coleção `taxes`
- `transito/` → coleção `traffic_alerts`
- `comercio/` → coleção `businesses`
- `servicos/` → coleção `public_services`
- `seguranca/` → coleção `safety_zones`

---

### FASE 4 — BACKEND & INFRA (Futuro) — ~3 semanas

- Cloud Functions: protocolos, emails, notificações
- Gemini AI: classificação automática
- Google Maps: mapa de relatos
- Seed script: popular TODAS as coleções
- Testes: Jest + Firebase Emulator
- CI/CD

---

## CHECKLIST DE VERIFICAÇÃO POR FASE

### Fase 1 concluída quando:
- [ ] Perfil mostra dados reais do usuário logado
- [ ] Matrícula grava no Firestore e mostra protocolo
- [ ] Saúde lista unidades do Firestore
- [ ] `npx tsc --noEmit` passa sem erros

### Fase 2 concluída quando:
- [ ] Sidebar de petições mostra relatos do Firestore
- [ ] Home mostra contadores reais
- [ ] `npm run build` passa

### Fase 3 concluída quando:
- [ ] Nenhuma página usa array hardcoded como única fonte de dados
- [ ] Todas as coleções têm seed scripts
- [ ] `npm run build` passa
