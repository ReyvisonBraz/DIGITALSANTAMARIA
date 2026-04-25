# 16 — Ordem de Execução: Implementação Passo a Passo

> Sequência exata para implementar sem quebrar o que já funciona.
> Cada etapa é independente o suficiente para testar antes de avançar.

---

## Regra Geral

1. **Nunca apagar** código funcionando sem ter o substituto pronto
2. **Testar localmente** (`npm run dev`) após cada etapa
3. **Tipar tudo** — sem `any`, sempre usar os tipos de `/types/`
4. **Comentar em português** — o quê e por quê, não como

---

## FASE 1 — Fundação (Dia 1–2)

> Sem isso nada funciona. Zero dependências externas.

### Etapa 1.1 — Criar pasta `/types/`
```
Criar em ordem (cada um pode depender do anterior):
1. types/common.types.ts
2. types/user.types.ts
3. types/report.types.ts
4. types/demand.types.ts
5. types/petition.types.ts
6. types/appointment.types.ts
7. types/job.types.ts
8. types/index.ts (re-exports)

Testar: npx tsc --noEmit (deve passar sem erros)
```

### Etapa 1.2 — Criar `/lib/firebase/`
```
1. lib/firebase/storage.ts       (uploadFile, deleteFile)
2. lib/firebase/converters.ts    (userConverter, reportConverter, etc.)

Testar: npx tsc --noEmit
```

### Etapa 1.3 — Atualizar `lib/contexts/auth-context.tsx`
```
ANTES: retorna { user, loading, login, logout }
DEPOIS: retorna { user, userRole, loading, login, logout }

Mudanças:
- Adicionar fetchUserRole() que busca /admins/{uid}
- Adicionar syncUserProfile() que cria /users/{uid} no primeiro login
- login() trata popup bloqueado
- userRole propagado no context

IMPORTANTE: manter a interface compatível com todos os
componentes que usam useAuth() — adicionar userRole sem
quebrar os que não usam.

Testar: login com Google, verificar toast de erro se popup bloqueado
```

### Etapa 1.4 — Criar primitivos de UI
```
1. components/ui/Skeleton.tsx      (variants: line, card, avatar, page)
2. components/ui/Button.tsx        (variants: primary, secondary, ghost, danger)
3. components/ui/EmptyState.tsx    (icon, title, description, action)
4. components/ui/ConfirmDialog.tsx (title, message, onConfirm, onCancel)

Testar: criar página de teste temporária que renderiza cada componente
```

### Etapa 1.5 — Criar páginas de erro
```
1. app/error.tsx     (Error boundary global)
2. app/not-found.tsx (Página 404)
3. app/loading.tsx   (Loading global)

Testar: acessar /rota-que-nao-existe → ver 404 customizado
```

### Etapa 1.6 — Corrigir bugs de hydration
```
1. hooks/use-mobile.ts:
   - estado inicial: false (não undefined)

2. lib/contexts/accessibility-context.tsx:
   - window.innerWidth para dentro de useEffect
   - localStorage para persistência

Testar: npm run dev → zero erros de hydration no console
```

---

## FASE 2 — Persistência Core (Dia 3–5)

> Conectar os formulários mais importantes ao Firestore.

### Etapa 2.1 — Utilitários
```
1. lib/utils/formatters.ts   (formatDate, formatCurrency, formatProtocol)
2. lib/utils/validators.ts   (validateCPF, validateEmail, validatePhone)
3. lib/utils/protocol.ts     (generateProtocolId)
4. lib/hooks/use-auth-guard.ts
5. lib/hooks/use-firestore-doc.ts

Testar: importar e usar em um componente
```

### Etapa 2.2 — Serviços Firestore
```
Criar em ordem (serviços simples primeiro):
1. services/users.service.ts          (getUserProfile, updateUserProfile)
2. services/reports.service.ts        (getReportsByUser, getPendingReports, updateReportStatus)
3. services/demands.service.ts        (createDemand, getDemandByProtocol, updateDemandStatus)
4. services/petitions.service.ts      (createPetition, getActivePetitions, signPetition)
5. services/appointments.service.ts   (createAppointment, getAppointmentsByUser, getHealthUnits)
6. services/jobs.service.ts           (getActiveJobs, applyForJob, hasUserApplied)
7. services/storage.service.ts        (wrapper do lib/firebase/storage.ts)

Testar: npx tsc --noEmit após cada arquivo
```

### Etapa 2.3 — Módulo Relatar (ampliar)
```
1. Criar features/relatar/LocationPicker.tsx
2. Criar features/relatar/PhotoUpload.tsx
3. Atualizar app/relatar/page.tsx:
   - Integrar LocationPicker (GPS real)
   - Integrar PhotoUpload (Storage real)
   - Salvar photo e geoLocation no Firestore

Testar:
  a) Enviar relato sem foto → deve funcionar (como antes)
  b) Enviar relato com foto → verificar Storage no Firebase Console
  c) Enviar relato com GPS → verificar coordenadas no Firestore
```

### Etapa 2.4 — Módulo Ouvidoria
```
1. Criar features/ouvidoria/DemandForm.tsx
2. Criar features/ouvidoria/ProtocolSearch.tsx
3. Atualizar app/ouvidoria/page.tsx:
   - Substituir form por DemandForm
   - Substituir busca hardcoded por ProtocolSearch

Testar:
  a) Criar demanda → verificar coleção demands no Firestore
  b) Buscar protocolo existente → deve exibir resultado
  c) Buscar protocolo inexistente → deve exibir "não encontrado"
```

### Etapa 2.5 — Módulo Petições
```
1. Criar features/peticoes/SignatureButton.tsx
2. Criar features/peticoes/SignatureProgress.tsx
3. Atualizar components/CreatePetitionModal.tsx (addDoc real)
4. Atualizar app/peticoes/page.tsx (query real)
5. Atualizar app/peticoes/[id]/page.tsx (getPetitionById)

Testar:
  a) Criar petição → verificar Firestore
  b) Assinar petição → verificar incremento de signaturesCount
  c) Tentar assinar duas vezes → deve bloquear com mensagem
  d) Usuário não logado → deve abrir login
```

---

## FASE 3 — Módulos Principais (Dia 6–9)

### Etapa 3.1 — Módulo Saúde
```
1. Criar features/saude/WaitTimeBadge.tsx
2. Criar features/saude/hooks/useHealthUnits.ts
3. Atualizar components/AppointmentModal.tsx (createAppointment real)
4. Atualizar app/saude/page.tsx (useHealthUnits)
5. Atualizar components/HealthHistoryPanel.tsx (getAppointmentsByUser)

Testar:
  a) Listar unidades → deve buscar do Firestore (health_units seed)
  b) Agendar consulta → verificar coleção appointments
  c) Ver histórico de consultas no perfil
```

### Etapa 3.2 — Módulo Empregos
```
1. Criar features/empregos/ApplicationModal.tsx
2. Atualizar app/empregos/page.tsx (getActiveJobs + ApplicationModal)

Testar:
  a) Listar vagas → deve buscar do Firestore (jobs seed)
  b) Candidatar-se → verificar job_applications
  c) Candidatar-se duas vezes → deve bloquear
```

### Etapa 3.3 — Módulo Admin
```
1. Atualizar lib/hooks/use-auth-guard.ts (já criado na fase 1)
2. Criar features/gestao/hooks/useAdminData.ts
3. Criar features/gestao/StatusUpdater.tsx
4. Criar features/gestao/MetricsDashboard.tsx
5. Reescrever app/gestao/page.tsx (remover email hardcoded)

Testar:
  a) Acessar /gestao sem ser admin → deve redirecionar para /
  b) Acessar /gestao como admin → deve listar relatos pendentes
  c) Atualizar status → verificar Firestore e que some da fila
  d) Dados atualizam em tempo real (abrir dois navegadores)
```

### Etapa 3.4 — Módulo Perfil
```
1. Criar features/perfil/AvatarUpload.tsx
2. Criar features/perfil/EditProfileForm.tsx
3. Criar features/perfil/ActivityHistory.tsx
4. Atualizar components/ProfileSettingsPanel.tsx

Testar:
  a) Editar nome → verificar Firestore
  b) Upload de foto → verificar Storage
  c) Ver histórico → deve mostrar relatos e petições criadas
```

---

## FASE 4 — Dados e Backend (Dia 10–13)

### Etapa 4.1 — Seed de Dados
```
1. Instalar: npm install --save-dev firebase-admin ts-node dotenv
2. Criar scripts/seed.ts
3. Criar admin manualmente no Firebase Console
4. Rodar: npx ts-node scripts/seed.ts

Verificar no Firebase Console:
  - health_units: 5 documentos
  - jobs: 4 documentos
  - petitions: 3 documentos
```

### Etapa 4.2 — Atualizar Firestore Rules
```
1. Substituir firestore.rules pelo conteúdo do arquivo 03_FIREBASE_CONFIG.md
2. Deploy: firebase deploy --only firestore:rules

Testar:
  a) Cidadão tenta ler dados de outro → deve falhar com permission-denied
  b) Usuário não logado tenta criar relato → deve falhar
  c) Admin lê relatos de todos → deve funcionar
```

### Etapa 4.3 — Cloud Functions
```
1. firebase init functions (TypeScript, Node 20)
2. Criar functions/src/index.ts
3. Criar functions/src/onDemandCreated.ts
4. Criar functions/src/onStatusChanged.ts
5. Criar functions/src/signPetition.ts
6. cd functions && npm run build
7. firebase deploy --only functions

Testar:
  a) Criar demanda → protocolo deve ser atualizado pela function
  b) Atualizar status → verificar log da function no Console
```

---

## FASE 5 — IA e Refinamento (Dia 14–16)

### Etapa 5.1 — Gemini AI
```
1. npm install @google/generative-ai
2. Criar lib/gemini/gemini.ts
3. Criar app/api/classify-report/route.ts
4. Criar app/api/suggest-response/route.ts
5. Integrar classificação automática no /relatar
6. Integrar sugestão de resposta no painel admin

Testar:
  a) Criar relato sobre buraco → categoria deve ser auto-classificada como 'infrastructure'
  b) Botão "Sugerir com IA" no admin → deve preencher resposta
```

### Etapa 5.2 — Refinamentos Finais
```
1. Corrigir todos os erros TypeScript: npx tsc --noEmit
2. Testar todas as funcionalidades end-to-end
3. Verificar responsividade mobile (Chrome DevTools)
4. Verificar acessibilidade básica (Tab navigation, contraste)
5. npm run build → deve passar sem erros
```

---

## Checklist Final

```
Fase 1 — Fundação:
  [ ] /types/ com todos os tipos
  [ ] lib/firebase/ (storage, converters)
  [ ] auth-context com userRole
  [ ] Primitivos UI (Skeleton, Button, EmptyState)
  [ ] Páginas de erro (error.tsx, not-found.tsx)
  [ ] Hydration bugs corrigidos

Fase 2 — Persistência Core:
  [ ] Serviços Firestore criados
  [ ] /relatar com foto e GPS reais
  [ ] /ouvidoria com persistência e busca real
  [ ] /peticoes com criação e assinatura atômica

Fase 3 — Módulos:
  [ ] /saude com dados reais e agendamento
  [ ] /empregos com vagas e candidatura
  [ ] /gestao com roles e tempo real
  [ ] /perfil com edição e histórico

Fase 4 — Dados e Backend:
  [ ] Seed rodou com sucesso
  [ ] Firestore Rules atualizadas
  [ ] Cloud Functions deployadas

Fase 5 — IA:
  [ ] Classificação de relatos com Gemini
  [ ] Sugestão de resposta admin
  [ ] Zero erros TypeScript
  [ ] Build passa: npm run build
```

---

## Dependências para Instalar

```bash
# AI Gemini
npm install @google/generative-ai

# Maps (fase futura)
npm install @vis.gl/react-google-maps

# Seed (dev only)
npm install --save-dev firebase-admin ts-node dotenv

# Cloud Functions
npm install -g firebase-tools
firebase init functions
cd functions && npm install firebase-admin@^12 firebase-functions@^5
```
