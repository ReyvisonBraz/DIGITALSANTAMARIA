# CONSOLIDADO MESTRE — Digital Santa Maria (Civic Guardian)

> Gerado em Maio 2026. Unifica **63 documentos .md** de 6 pastas diferentes em um só lugar.  
> Skills aplicadas: **debugging** + **planning-architecture**.

---

## 0. FONTES CONSOLIDADAS

| Pasta | # Docs | Conteúdo |
|---|---|---|
| `_ANALISE/` | 4 | Diagnóstico linha a linha, visão ideal, resumo executivo, setup local |
| `_PLANO_IMPLEMENTACAO/` | 17 | Plano faseado de implementação Fase 1–5 |
| `docs/` | 28 | Arquitetura técnica, 20 módulos detalhados, bugs e prevenção |
| `FINAL/` | 8 | Declaração de completude (equivocada) + análise modular |
| `GUIA COMPLETO/` | 6 | Mockups, design system, adaptation/refinement plans |
| Root | 1 | README.md |

---

## 1. DIAGNÓSTICO REAL (skill: debugging)

| Dimensão | % Completo | Evidência |
|---|---|---|
| Páginas / Rotas | 100% | 22+ páginas existem e navegam |
| UI / Design visual | 100% | Todos os componentes responsivos prontos |
| **Persistência de dados** | **5%** | Só `/relatar` grava no Firestore |
| **Funcionalidades reais** | **8%** | 21/22 páginas retornam toast falso (dados descartados) |
| Autenticação | 60% | Login Google funciona; roles não implementados |
| Backend / Cloud Functions | 0% | Pasta `functions/` existe mas código é placeholder |
| Testes | 0% | Nenhum arquivo de teste |
| Tipagem TypeScript | 50% | Muito `any`, tipos parciais/não usados |
| Acessibilidade | 40% | Context existe; ARIA labels ausentes; hydration bugs |
| **Completude Geral Real** | **~30%** | O claim "Front-End COMPLETO e REDONDO" do `FINAL/` é falso |

---

## 2. TODOS OS BUGS CONFIRMADOS

### Bugs Bloqueantes (impedem uso real)

| # | Bug | Arquivo | Responsável | Impacto |
|---|---|---|---|---|
| B1 | Busca de protocolo só funciona com ID hardcoded `2847192` | `app/ouvidoria/page.tsx:~150` | Ouvidoria | ALTA — inutilizável |
| B2 | Admin acessível por e-mail hardcoded `littlefigther50@gmail.com` | `app/gestao/page.tsx:46` | Segurança | ALTA — não escalável |
| B3 | Form de matrícula coleta 5 etapas e descarta dados | `app/educacao/matricula/page.tsx:~50` | Educação | ALTA — UX enganosa |
| B4 | Hydration mismatch — `Math.random()` em JSX | `app/saude/page.tsx:155` | Saúde | MÉDIA — erro no console |
| B5 | Hydration mismatch — `window.innerWidth` no render | `lib/accessibility-context.tsx:~40` | Acessibilidade | MÉDIA — SSR quebra |
| B6 | Hydration mismatch — estado inicial `undefined` | `hooks/use-mobile.ts:6` | Core | MÉDIA — flicker |
| B7 | Candidatura a emprego em state (perde no reload) | `app/empregos/page.tsx:~92` | Empregos | MÉDIA |
| B8 | Dados do form de sugestão de grupo descartados | `app/comunidade/page.tsx:~127` | Comunidade | BAIXA |
| B9 | `setTimeout` sem cleanup → memory leak potencial | `components/AppointmentModal.tsx:64` | Core | MÉDIA |
| B10 | `handleFirestoreError` serializa erro como JSON string | `lib/firebase.ts:41-42` | Core | BAIXA |
| B11 | `key={idx}` em listas (múltiplos componentes) | Vários | Core | BAIXA |
| B12 | Upload de foto em `/relatar` não implementado | `app/relatar/` | Relatar | MÉDIA |
| B13 | GPS em `/relatar` não captura coordenadas reais | `app/relatar/` | Relatar | MÉDIA |
| B14 | SOS em `/seguranca` só vibra, não envia nada | `app/seguranca/` | Segurança | MÉDIA |
| B15 | Preferências de acessibilidade não persistem no localStorage | `lib/accessibility-context.tsx` | Acessibilidade | BAIXA |

### Problemas de Segurança

| # | Problema | Severidade |
|---|---|---|
| S1 | API key Firebase exposta em `firebase-applet-config.json` versionado | ALTA |
| S2 | E-mail de admin hardcoded em `app/gestao/page.tsx:46` | ALTA |
| S3 | `emergency_alerts` com leitura pública em `firestore.rules:116` | MÉDIA |
| S4 | Sem rate limiting no Firestore | MÉDIA |
| S5 | `.env` e `.env.local` versionados no repositório | ALTA |
| S6 | `ignoreDuringBuilds: true` no ESLint esconde erros | MÉDIA |

---

## 3. STATUS REAL DE CADA PÁGINA/MÓDULO

| Módulo | Rota | Dados | Persiste? | Bugs | Prioridade |
|---|---|---|---|---|---|
| Relatar Problema | `/relatar` | Form → Firestore | ✅ PARCIAL | B12, B13 (GPS/foto) | 🔴 |
| Ouvidoria | `/ouvidoria` | Mock | ❌ | B1 (busca hardcoded) | 🔴 |
| Petições | `/peticoes` | Mock | ❌ | Sem persistência | 🔴 |
| Petições [id] | `/peticoes/[id]` | Mock | ❌ | Sem persistência | 🔴 |
| Saúde | `/saude` | 3 clínicas hardcoded | ❌ | B4 (hydration), B9 (timer) | 🔴 |
| Gestão Admin | `/gestao` | Mock | ❌ | B2 (email hardcoded), S2 | 🔴 |
| Perfil | `/perfil` | Form | ❌ | Form sem save | 🔴 |
| Empregos | `/empregos` | 4 vagas hardcoded | ❌ | B7 (state-only) | 🟠 |
| Educação | `/educacao` | 3 escolas hardcoded | ❌ | — | 🟠 |
| Educação Matrícula | `/educacao/matricula` | Form 5 etapas | ❌ | B3 (dados descartados) | 🟠 |
| Segurança | `/seguranca` | 4 zonas hardcoded | ❌ | B14 (SOS não envia) | 🟠 |
| Obras | `/obras` | 3 obras hardcoded | ❌ | — | 🟡 |
| Obras [id] | `/obras/[id]` | Mock | ❌ | — | 🟡 |
| Eventos | `/eventos` | 4 eventos hardcoded | ❌ | — | 🟡 |
| Eventos [id] | `/eventos/[id]` | Mock | ❌ | — | 🟡 |
| Comunidade | `/comunidade` | 3 grupos hardcoded | ❌ | B8 (sugestão descartada) | 🟡 |
| Meio Ambiente | `/meio-ambiente` | Mock | ❌ | — | 🟡 |
| Social | `/social` | 3 programas mock | ❌ | — | 🟡 |
| Tributos | `/tributos` | Mock | ❌ | — | 🟡 |
| Trânsito | `/transito` | Mock | ❌ | — | 🟡 |
| Comércio | `/comercio` | 5 empresas hardcoded | ❌ | — | 🟡 |
| Avisos | `/avisos` | 4 avisos hardcoded | ❌ | — | 🟡 |
| Votos | `/votos` | Mock | ❌ | — | 🟡 |
| Serviços | `/servicos` | Categorias hardcoded | ❌ | — | 🟡 |
| Home | `/` | Stats hardcoded | ❌ | Stats fixos "Cidadão Elite" | 🟡 |
| Legal / Sobre | `/legal`, `/sobre` | Estático | ✅ | — | OK |

---

## 4. SCHEMA FIRESTORE — GAP ANALYSIS

### Coleções no `firebase-blueprint.json` (definidas mas NÃO USADAS)

| Coleção | Definida | Usada no Código | Status |
|---|---|---|---|
| `users` | ✅ | ⚠️ Parcial (criada no login) | Sem campos role/points |
| `reports` | ✅ | ✅ Única usada | Sem foto/geo |
| `appointments` | ✅ | ❌ | Zero código |
| `jobs` | ✅ | ❌ | Zero código |
| `job_applications` | ✅ | ❌ | Zero código |
| `emergency_alerts` | ✅ | ❌ | Zero código |
| `petitions` | ✅ | ❌ | Zero código |
| `petition_signatures` | ✅ | ❌ | Zero código |

### Coleções Documentadas mas AUSENTES do Schema

| Coleção | Referenciada em | Propósito |
|---|---|---|
| `admins` | `firestore.rules` (já referencia) | Controle de acesso admin/clerk |
| `demands` | `ARQUITETURA_TECNICA.md`, `OUVIDORIA.md` | Ouvidoria unificada |
| `health_units` | `SAUDE.md`, `COMO_DEVERIA_SER.md` | Clínicas, UPAs |
| `enrollments` | `COMO_DEVERIA_SER.md` | Matrículas escolares |
| `community_suggestions` | `COMO_DEVERIA_SER.md` | Sugestões de grupos |
| `events` | `COMO_DEVERIA_SER.md` | Eventos dinâmicos |
| `works` | `COMO_DEVERIA_SER.md` | Obras públicas |
| `notices` | `COMO_DEVERIA_SER.md` | Avisos/alertas |
| `pharmacies` | `ARQUITETURA_TECNICA.md` | Farmácias |

---

## 5. COMPONENTES — O QUE FUNCIONA vs O QUE FALTA

| Componente | UI Pronta? | Lógica Real? | O Que Falta |
|---|---|---|---|
| `TopAppBar` | ✅ | ✅ Navegação + auth | Busca não funciona |
| `BottomNavBar` | ✅ | ✅ | — |
| `Footer` | ✅ | ✅ Estático | — |
| `AlertBanner` | ✅ | ❌ | Dados reais do Firestore |
| `SearchModal` | ✅ | ❌ Só UI | Lógica de busca completa |
| `NotificationsPanel` | ✅ | ❌ Só UI | Backend de notificações |
| `ProfileSettingsPanel` | ✅ | ❌ Form sem save | `updateDoc` no Firestore |
| `GlobalStatsModal` | ✅ | ❌ Hardcoded | Leitura de coleções reais |
| `HealthHistoryPanel` | ✅ | ❌ Mock | Leitura de `appointments` |
| `AppointmentModal` | ✅ | ❌ Mock | `addDoc` em `appointments` |
| `CreatePetitionModal` | ✅ | ❌ Mock | `addDoc` em `petitions` |
| `PetitionCard` | ✅ | ✅ Display | — |
| `IssueCard` | ✅ | ✅ Display | — |
| `ClinicCard` | ✅ | ✅ Display | — |
| `ServiceCard` | ✅ | ✅ Display | — |
| `Modal` (ui) | ✅ | ✅ | — |
| `SidePanel` (ui) | ✅ | ✅ | — |
| `ErrorBoundary` | ✅ | ✅ | Existe mas não é usado em todo lugar |
| `InstallPrompt` | ✅ | ✅ PWA | — |
| `Button` (ui) | ❌ | ❌ | Não existe, precisa criar |
| `Skeleton` (ui) | ❌ | ❌ | Não existe, precisa criar |
| `EmptyState` (ui) | ❌ | ❌ | Não existe, precisa criar |
| `ConfirmDialog` (ui) | ❌ | ❌ | Não existe, precisa criar |

---

## 6. O QUE JÁ EXISTE (PRONTO)

### Infraestrutura Core
- ✅ Next.js 15 App Router com 22+ rotas
- ✅ Firebase Auth (Google OAuth via popup) — funcional
- ✅ Firebase Firestore inicializado (singleton)
- ✅ Sistema de Toast funcional (3 tipos: success, error, info)
- ✅ Accessibility Context (font-size, contrast, layout-scale)
- ✅ Design responsivo Tailwind CSS 4
- ✅ Animações Motion (Framer)
- ✅ PWA manifest + Service Worker
- ✅ Vercel deploy configurado
- ✅ Firestore security rules (112 linhas, bem escritas)

### Funcionalidades Reais
- ✅ Envio de relato → Firestore (`app/relatar/`)
- ✅ API `/api/logs` (client-side logging)
- ✅ Login/Logout Google OAuth

### Documentação Existente
- ✅ 63 documentos .md cobrindo análise, arquitetura, bugs, planos, módulos

---

## 7. O QUE FALTA (PRIORIZADO)

### CRÍTICO — Impede uso real (Fase 1)

| # | Tarefa | Esforço | Descrição |
|---|---|---|---|
| 1 | **Conectar formulários ao Firestore** | BAIXO | Adicionar `addDoc`/`updateDoc` em: petições, agendamentos, perfil, ouvidoria, matrículas, empregos |
| 2 | **Corrigir autenticação admin** | BAIXO | Remover email hardcoded; usar coleção `admins` + `getDoc` |
| 3 | **Corrigir busca de protocolo na ouvidoria** | BAIXO | Query real ao Firestore por `protocolId` em vez de hardcoded |
| 4 | **Corrigir hydration mismatches** | BAIXO | B4, B5, B6 — 3 arquivos pra corrigir |
| 5 | **Criar coleção `admins` no Firestore** | BAIXO | Popular com admin inicial |

### ALTO — Funcionalidades essenciais (Fase 2)

| # | Tarefa | Esforço | Descrição |
|---|---|---|---|
| 6 | **Upload de fotos (Storage)** | MÉDIO | `uploadBytes` no `/relatar` e `/perfil` |
| 7 | **Geolocalização real** | MÉDIO | `navigator.geolocation` no `/relatar` |
| 8 | **Seed de dados** | MÉDIO | Popular Firestore com clínicas, vagas, obras, eventos |
| 9 | **Tipos TypeScript** | BAIXO | Completar `types/` sem `any` |
| 10 | **Páginas de erro** | BAIXO | `app/not-found.tsx`, `app/loading.tsx` |

### MÉDIO — Backend e integrações (Fase 3)

| # | Tarefa | Esforço | Descrição |
|---|---|---|---|
| 11 | **Cloud Functions** | ALTO | Protocolos, e-mails, notificações push, incremento atômico |
| 12 | **Gemini AI** | MÉDIO | Classificação automática de relatos, sugestão de respostas |
| 13 | **Google Maps** | MÉDIO | Mapa de relatos, localização de clínicas |
| 14 | **ViaCEP** | BAIXO | Auto-completar endereço via API pública |
| 15 | **Logger centralizado** | BAIXO | Substituir todos os `console.error` por `log.error` |
| 16 | **Corrigir `setTimeout` leak** | BAIXO | Cleanup em `AppointmentModal.tsx` |
| 17 | **Corrigir `key={idx}`** | BAIXO | IDs únicos em todas as listas |

### BAIXO — Qualidade e completude (Fase 4)

| # | Tarefa | Esforço | Descrição |
|---|---|---|---|
| 18 | **Preferências de acessibilidade** | BAIXO | `localStorage` persistence |
| 19 | **ARIA labels** | MÉDIO | Screen reader em todas as interações |
| 20 | **Componentes UI primitivos** | BAIXO | Button, Skeleton, EmptyState, ConfirmDialog |
| 21 | **Offline first (PWA)** | ALTO | IndexedDB + Background Sync |
| 22 | **Testes automatizados** | ALTO | Jest + Firebase Emulator |
| 23 | **CI/CD** | MÉDIO | GitHub Actions |
| 24 | **Corrigir `handleFirestoreError`** | BAIXO | Classe de erro customizada |

---

## 8. PLANO DE EXECUÇÃO CONSOLIDADO

### SEMANA 1 — Fundação (Dia 1–5)

```
Dia 1–2: CORREÇÕES CRÍTICAS
  ☐ 1.1 Corrigir hydration mismatches (B4, B5, B6)
  ☐ 1.2 Corrigir setTimeout leak (B9 - AppointmentModal)
  ☐ 1.3 Adicionar localStorage nos preferences de acessibilidade

Dia 3: FIREBASE + ADMIN
  ☐ 1.4 Criar coleção admins + adicionar admin manualmente
  ☐ 1.5 Atualizar auth-context.tsx para buscar role da coleção admins
  ☐ 1.6 Corrigir app/gestao: remover email hardcoded, usar role real

Dia 4–5: OUVIDORIA
  ☐ 1.7 Criar services/demands.service.ts
  ☐ 1.8 Corrigir busca de protocolo (B1): query real ao Firestore
  ☐ 1.9 Conectar formulário da ouvidoria ao Firestore (addDoc)
```

### SEMANA 2 — Persistência Core (Dia 6–10)

```
Dia 6: PETIÇÕES
  ☐ 2.1 Criar services/petitions.service.ts
  ☐ 2.2 Conectar CreatePetitionModal ao Firestore
  ☐ 2.3 Conectar assinatura ao Firestore (petition_signatures)

Dia 7: SAÚDE
  ☐ 2.4 Criar services/appointments.service.ts
  ☐ 2.5 Conectar AppointmentModal ao Firestore
  ☐ 2.6 Criar seed de health_units

Dia 8: EMPREGOS + PERFIL
  ☐ 2.7 Criar services/jobs.service.ts
  ☐ 2.8 Conectar candidaturas ao Firestore (job_applications)
  ☐ 2.9 Conectar ProfileSettingsPanel ao Firestore (updateDoc)

Dia 9–10: RELATAR (completar)
  ☐ 2.10 Implementar upload de foto (Firebase Storage)
  ☐ 2.11 Implementar geolocalização real (navigator.geolocation)
  ☐ 2.12 Criar pages not-found, loading, error
```

### SEMANA 3 — Refinamento + Seed (Dia 11–15)

```
Dia 11–12: COMPONENTES UI + TIPOS
  ☐ 3.1 Criar Button, Skeleton, EmptyState, ConfirmDialog
  ☐ 3.2 Completar types/ sem any
  ☐ 3.3 Criar lib/utils/formatters.ts, validators.ts
  ☐ 3.4 Substituir console.error por logger em todo o código

Dia 13: CORREÇÕES DE QUALIDADE
  ☐ 3.5 Corrigir key={idx} em todas as listas
  ☐ 3.6 Adicionar Error Boundaries em seções críticas
  ☐ 3.7 Corrigir handleFirestoreError (classe FirestoreError)

Dia 14–15: SEED DE DADOS
  ☐ 3.8 Criar scripts/seed.ts
  ☐ 3.9 Popular: health_units (5), jobs (4), petitions (3), events (4)
  ☐ 3.10 Popular: works (3), notices (4)
```

### SEMANA 4+ — Backend e IA

```
  ☐ 4.1 Cloud Functions: protocolos, e-mails, notificações
  ☐ 4.2 Gemini AI: classificação automática, sugestão de respostas
  ☐ 4.3 Google Maps: mapa de relatos e clínicas
  ☐ 4.4 ViaCEP: auto-completar endereço
  ☐ 4.5 Testes automatizados (Jest + Firebase Emulator)
```

---

## 9. NOVAS DEPENDÊNCIAS A INSTALAR

```bash
# AI Gemini (já incluído no package.json)
npm install @google/generative-ai

# Google Maps
npm install @vis.gl/react-google-maps

# Seed script (dev only)
npm install --save-dev firebase-admin ts-node dotenv

# Cloud Functions
npm install -g firebase-tools
```

---

## 10. CHECKLIST ANTI-BUG (para toda nova feature)

- [ ] Sem `Math.random()` / `Date.now()` em JSX → use `useState` no cliente
- [ ] Sem `console.log/error` → use `log.info` / `log.error`
- [ ] Sem `key={idx}` → use IDs únicos
- [ ] `setTimeout` sempre com cleanup no unmount
- [ ] Sem `auth.currentUser` direto em utilitários → receba userId como parâmetro
- [ ] Sem strings mágicas → use constantes
- [ ] Formulários validam conectividade (`navigator.onLine`) antes de submit
- [ ] Imagens externas têm fallback (`onError`)
- [ ] Regras Firestore criadas ANTES do código que escreve

---

## 11. ARQUIVOS DE REFERÊNCIA RÁPIDA

| Para saber... | Leia... |
|---|---|
| Setup local e troubleshooting | `_ANALISE/RODAR_LOCALMENTE.md` |
| Análise completa linha a linha | `_ANALISE/ESTADO_ATUAL.md` |
| Visão de como deveria ser | `_ANALISE/COMO_DEVERIA_SER.md` |
| Resumo executivo | `_ANALISE/RESUMO_EXECUTIVO.md` |
| Arquitetura técnica e schemas | `docs/ARQUITETURA_TECNICA.md` |
| Visão dos 12 pilares | `docs/MASTER_BLUEPRINT.md` |
| Bugs e padrões a evitar | `docs/bugs/bugs-conhecidos.md` |
| Checklist de prevenção | `docs/bugs/checklist-prevencao.md` |
| Plano faseado completo (17 docs) | `_PLANO_IMPLEMENTACAO/00_INDICE_GERAL.md` |
| Ordem de execução detalhada | `_PLANO_IMPLEMENTACAO/16_ORDEM_DE_EXECUCAO.md` |
| Design system (cores, fontes) | `GUIA COMPLETO/ADAPTATION_PLAN.md` |
| Firestore schema (8 coleções) | `firebase-blueprint.json` |
| Firestore security rules | `firestore.rules` |

---

## 12. COMANDOS ÚTEIS

```bash
# Dev
npm run dev

# Type Check
npx tsc --noEmit

# Build
npm run build

# Lint
npm run lint

# Deploy Firestore Rules
firebase deploy --only firestore:rules

# Deploy Cloud Functions
firebase deploy --only functions

# Rodar Seed
npx ts-node scripts/seed.ts
```
