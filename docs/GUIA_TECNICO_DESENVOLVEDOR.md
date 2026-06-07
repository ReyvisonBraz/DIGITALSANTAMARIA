# Guia Tecnico do Desenvolvedor

Este guia existe para ajudar qualquer desenvolvedor a entender, manter e evoluir o projeto sem precisar descobrir tudo por tentativa e erro.

## Visao Geral

O projeto e um portal municipal em Next.js com Firebase. A aplicacao publica fica em `app/`, os modulos maiores ficam em `features/`, o acesso ao Firebase fica em `services/`, os contratos ficam em `types/` e as automacoes server-side ficam em `functions/`.

Use este guia antes de criar uma feature nova, alterar regras do Firebase ou mexer no painel de gestao.

## Stack Principal

- Next.js 16
- React 19
- TypeScript
- Firebase Auth
- Firestore
- Firebase Storage
- Firebase Cloud Functions
- Tailwind CSS 4
- Lucide React
- Playwright para validacoes de navegador

## Comandos

Desenvolvimento local:

```bash
npm install
npm.cmd run dev
```

Validacao antes de entregar:

```bash
npm.cmd run lint
npm.cmd run build
```

Firebase:

```bash
npm.cmd run firebase:rules:check
npm.cmd run firebase:rules:deploy
npm.cmd run firebase:indexes:check
npm.cmd run firebase:indexes:deploy
npm.cmd run firebase:storage:check
npm.cmd run firebase:storage:deploy
npm.cmd run firebase:functions:build
npm.cmd run firebase:functions:deploy
```

Functions isolado:

```bash
npm --prefix functions run build
npm --prefix functions run serve
```

## Estrutura de Pastas

```text
app/
  Rotas Next.js. Cada pasta representa uma rota publica ou administrativa.

components/
  Componentes compartilhados globais.

features/
  Modulos de negocio e telas compostas.
  Ex: gestao, perfil, comercio, ouvidoria.

features/gestao/
  Painel administrativo.

features/gestao/content/
  Modulos administrativos de conteudo e filas:
  avisos, eventos, obras, comercio, consultas, candidaturas, matriculas etc.

services/
  Camada de acesso ao Firebase.
  Toda leitura/escrita de Firestore deve preferencialmente passar por aqui.

types/
  Tipos TypeScript compartilhados entre UI, services e functions.

lib/
  Configuracao Firebase, auth-context, helpers e utilitarios.

functions/src/
  Cloud Functions TypeScript.

FINAL/
  Planejamento de produto e backlog vivo.

docs/
  Documentacao tecnica.
```

## Mapa de Rotas

Rotas principais em `app/`:

| Rota | Funcao | Dados principais |
| --- | --- | --- |
| `/` | Home publica | componentes e constantes locais |
| `/avisos` | Avisos publicos | `notices` via conteudo publico |
| `/comercio` | Vitrine de comercios | `businesses` |
| `/comunidade` | Grupos comunitarios | `community_groups` |
| `/educacao` | Escolas e educacao | `education_schools` e fallback local |
| `/educacao/matricula` | Matricula online | `enrollments` via `createEnrollment` |
| `/empregos` | Vagas publicas | `jobs` via `getActiveJobs` |
| `/eventos` | Agenda publica | `events` |
| `/eventos/[id]` | Detalhe de evento | `events` |
| `/gestao` | Painel administrativo | demandas, relatos, conteudo, filas e usuarios |
| `/meio-ambiente` | Informacoes ambientais | `environment_data` |
| `/obras` | Obras publicas | `works` |
| `/obras/[id]` | Detalhe de obra | `works` |
| `/ouvidoria` | Solicitar/consultar protocolo | `demands` |
| `/perfil` | Painel do cidadao | demandas, relatos, consultas, candidaturas, matriculas e emergencias |
| `/peticoes` | Peticoes publicas | `petitions` |
| `/peticoes/[id]` | Detalhe/assinatura de peticao | `petitions`, callable `signPetitionCallable` |
| `/relatar` | Relatos urbanos com evidencias | `reports` |
| `/saude` | Saude, unidades e farmacia | `health_units`, `appointments`, `pharmacy_items` |
| `/seguranca` | Seguranca e alerta emergencial | `emergency_alerts`, `safety_zones` |
| `/servicos` | Catalogo de servicos | `public_services` |
| `/social` | Programas sociais | `social_programs` |
| `/transito` | Alertas de transito | `traffic_alerts` |
| `/tributos` | Tributos | `tax_records` |
| `/votos` | Votacoes | `polls`, callable `votePollCallable` |

Rotas de API:

| Rota | Funcao |
| --- | --- |
| `/api/classify-report` | Classificacao/apoio de IA para relato |
| `/api/suggest-response` | Sugestao de resposta administrativa |
| `/api/logs` | Endpoint de logs |

## Mapa de Services

| Service | Responsabilidade | Colecoes |
| --- | --- | --- |
| `appointments.service.ts` | consultas e unidades de saude | `appointments`, `health_units` |
| `businesses.service.ts` | comercio local e aprovacao de cadastros | `businesses` |
| `content.service.ts` | CRUD generico editorial | varias colecoes de conteudo |
| `demands.service.ts` | ouvidoria/protocolos/conversa | `demands`, `demand_messages` |
| `educacao.service.ts` | matriculas | `enrollments` |
| `emergency.service.ts` | alertas emergenciais | `emergency_alerts` |
| `jobs.service.ts` | vagas e candidaturas | `jobs`, `job_applications` |
| `notifications.service.ts` | notificacoes do usuario | `notifications` |
| `petitions.service.ts` | peticoes e assinaturas | `petitions`, `petition_signatures` |
| `polls.service.ts` | votos em enquetes | `polls` via Cloud Function |
| `reports.service.ts` | relatos urbanos/conversa | `reports`, `report_messages` |
| `storage.service.ts` | uploads | Firebase Storage |
| `users.service.ts` | perfis e papeis | `users` |

## Mapa de Colecoes Firestore

| Colecao | Tipo principal | Leitura publica | Escrita principal | Observacao |
| --- | --- | --- | --- | --- |
| `users` | `UserProfile` | nao | usuario dono/admin | controla `role` |
| `admins` | controle auxiliar | staff | admin | usado por rules/staff |
| `demands` | `Demand` | nao | usuario logado | ouvidoria/protocolo |
| `demand_messages` | `DemandMessage` | conforme protocolo | staff/autor | conversa imutavel da solicitacao |
| `reports` | `Report` | nao | usuario logado | relatos urbanos |
| `report_messages` | `ReportMessage` | dono/staff | staff/autor | conversa imutavel do relato |
| `petitions` | `Petition` | sim | usuario logado/admin | participacao |
| `petition_signatures` | `PetitionSignature` | sim | usuario logado | assinaturas imutaveis |
| `appointments` | `Appointment` | nao | usuario logado/staff | consultas |
| `health_units` | `HealthUnit` | sim | staff | unidades de saude |
| `enrollments` | `Enrollment` | nao | usuario logado/staff | matriculas |
| `jobs` | `Job` | sim | usuario logado/staff | vagas |
| `job_applications` | `JobApplication` | dono/staff | usuario logado/staff | candidaturas |
| `emergency_alerts` | `EmergencyAlert` | dono/staff | usuario logado/staff | emergencias |
| `notifications` | `Notification` | dono | staff/sistema | notificacoes |
| `admin_audit_logs` | `AdminAuditLog` | staff | staff | auditoria imutavel |
| `notices` | `Notice` | sim | admin | workflow editorial |
| `events` | `Event` | sim | admin | workflow editorial |
| `works` | `Work` | sim | admin | workflow editorial |
| `businesses` | `Business` | sim | admin/dono limitado | comercio e aprovacao |
| `traffic_alerts` | `TrafficAlert` | sim | admin | transito |
| `community_groups` | `CommunityGroup` | sim | admin | comunidade |
| `safety_zones` | `SafetyZone` | sim | admin | seguranca |
| `environment_data` | `EnvironmentData` | sim | admin | meio ambiente |
| `social_programs` | `SocialProgram` | sim | admin | social |
| `tax_records` | `TaxRecord` | sim | admin | tributos |
| `polls` | `Poll` | sim | admin/voto por function | votacoes |
| `public_services` | `PublicService` | sim | admin | servicos |
| `education_schools` | catalogo escola | sim | admin | educacao |
| `pharmacy_items` | `PharmacyItem` | sim | admin | farmacia |

## Regras de Ouro

- Nao acesse Firestore direto dentro de componentes se ja existir um service para isso.
- Ao criar uma colecao nova, crie ou atualize:
  - tipo em `types/`
  - service em `services/`
  - regras em `firestore.rules`
  - indices em `firestore.indexes.json` se a query exigir
  - tela publica ou admin, se aplicavel
- Antes de finalizar, rode `lint` e `build`.
- Se alterar consulta Firestore com `where` + `orderBy`, confira se precisa de indice.
- Se alterar permissao, valide no front e em `firestore.rules`.
- Nao use dados mockados permanentes quando ja houver colecao real no Firestore.

## Padrao de Tipos

Cada dominio deve ter um arquivo em `types/`.

Exemplos:

- `types/content.types.ts`
- `types/demand.types.ts`
- `types/report.types.ts`
- `types/appointment.types.ts`
- `types/job.types.ts`
- `types/enrollment.types.ts`
- `types/emergency.types.ts`

Depois de criar um tipo novo, exporte em:

```text
types/index.ts
```

Exemplo:

```ts
export type * from './novo-modulo.types';
```

## Padrao de Services

Services ficam em `services/` e encapsulam Firestore.

Exemplo de service de fila:

```ts
export async function getAllAppointments() {}
export async function updateAppointmentStatus(id, status) {}
```

Exemplo de service de conteudo:

```ts
const service = createContentService<Notice>('notices');
```

O service generico `createContentService` oferece:

- `list()` para listagem publica de itens `published`
- `listAdmin()` para painel administrativo
- `getById()`
- `create()`
- `update()`
- `setStatus()`
- `archive()`

Use `list()` em paginas publicas e `listAdmin()` no painel.

## Padrao de Conteudo Publico

Conteudos publicos usam `ContentStatus`:

```ts
'published' | 'draft' | 'archived' | 'pending_approval'
```

Padrao esperado:

- `published`: aparece no site publico.
- `draft`: salvo no painel, nao aparece no site.
- `pending_approval`: aguardando revisao.
- `archived`: fora do site publico, mantido no Firebase.

Componentes compartilhados:

```text
features/gestao/content/ContentWorkflowControls.tsx
```

Ele fornece:

- `ContentStatusSelect`
- `ContentStatusBadge`
- `ContentStatusFilter`
- `ContentQuickActions`
- `ContentPreviewDialog`

Use esses componentes ao criar um novo modulo editorial.

## Padrao de Filas Administrativas

Filas operacionais devem ter:

- busca
- filtro por status
- contadores por status
- botao atualizar
- estado vazio
- estado carregando
- estado de erro

Componentes compartilhados:

```text
features/gestao/content/AdminQueueControls.tsx
```

Ele fornece:

- `AdminQueueToolbar`
- `AdminStatusSummary`

Use esse padrao para novas filas como transferencias, receitas, protocolos especiais etc.

## Painel de Gestao

Entrada principal:

```text
app/gestao/page.tsx
```

Componentes principais:

```text
features/gestao/AdminOverview.tsx
features/gestao/AdminSectionNav.tsx
features/gestao/ContentAdminPanel.tsx
```

O painel esta organizado em:

- Visao geral
- Solicitacoes
- Relatos
- Conteudo
- Peticoes
- Usuarios

### Confirmacoes em acoes sensiveis

Use `components/ui/ConfirmDialog.tsx` antes de gravar acoes finais, destrutivas ou que disparam notificacao sensivel.

Padrao atual:

- Solicitacoes: confirmar `solved` e `rejected`.
- Relatos: confirmar `resolved` e `rejected`.
- Consultas: confirmar `completed` e `cancelled`.
- Candidaturas: confirmar `hired` e `rejected`.
- Matriculas: confirmar `approved` e `rejected`.
- Emergencias: confirmar `resolved` e `cancelled`.
- Conteudo editorial: arquivamento deve passar por confirmacao.
- Comercio pendente: aprovacao publica deve passar por confirmacao; reprovacao deve exigir segundo passo com motivo opcional.

Mudancas intermediarias, como `analyzing`, `in_review`, `confirmed`, `interview`, `waiting_list` e `in_progress`, podem continuar diretas para manter velocidade operacional.

### Solicitacoes e conversa de protocolo

O documento principal em `demands` guarda o estado atual da solicitacao: protocolo, autor, tipo, categoria, assunto, status, texto inicial e ultima acao administrativa.

A conversa fica em `demand_messages` para preservar historico. Cada mensagem aponta para `demandId`, possui `authorRole` (`citizen`, `staff` ou `system`) e nao deve ser editada ou removida pela interface.

Padrao esperado:

- A reclamacao original continua em `demands.content.text`.
- Respostas novas do gestor sao gravadas em `demand_messages` quando o texto muda.
- O cidadao autenticado pode responder ao proprio protocolo nao anonimo pela consulta da ouvidoria.
- A tela do gestor deve listar solicitacoes compactas e abrir detalhe/conversa apenas sob demanda.
- Consultas da conversa usam indice `demand_messages`: `demandId ASC`, `createdAt ASC`.

### Relatos urbanos e conversa

Relatos de problemas urbanos continuam em `reports`, com foto, localizacao, status e resposta administrativa atual.

A conversa fica em `report_messages`, com o mesmo padrao imutavel de `demand_messages`. O painel gestor abre cada relato em detalhe, exibindo imagem, localizacao, dados do cidadao, conversa e controle de status.

Padrao esperado:

- O relato original continua em `reports.description`.
- Respostas novas do gestor sao gravadas em `report_messages` quando o texto muda.
- O cidadao autenticado pode responder ao proprio relato pelo Painel do Cidadao.
- Consultas da conversa usam indice `report_messages`: `reportId ASC`, `createdAt ASC`.

Abas de conteudo sao definidas em:

```text
features/gestao/ContentAdminPanel.tsx
```

Ao adicionar um novo modulo admin de conteudo:

1. Crie o componente em `features/gestao/content/`.
2. Adicione o tipo da aba em `ContentTab`.
3. Adicione o item em `TABS`.
4. Adicione o render condicional no final do componente.
5. Se for catalogo simples, use `GenericCatalogAdmin`.
6. Para listagens editoriais, use `ContentStatusFilter` e `ContentListControls` para manter status, busca e ordenacao consistentes.

## Firebase Auth e Perfis

Papeis atuais:

- `citizen`: usuario comum.
- `clerk`: atendente/operador.
- `admin`: administrador.

Tipos:

```text
types/user.types.ts
```

Service:

```text
services/users.service.ts
```

O front pode esconder botoes por papel, mas a seguranca real deve estar em:

```text
firestore.rules
```

## Firestore Rules

Arquivo:

```text
firestore.rules
```

Ao criar colecao nova:

1. Defina quem pode ler.
2. Defina quem pode criar.
3. Defina quem pode atualizar.
4. Defina se usuario comum so pode acessar documentos com `userId == request.auth.uid`.
5. Defina se apenas `admin`/`clerk` pode operar.
6. Rode dry-run:

```bash
npm.cmd run firebase:rules:check
```

7. Publique:

```bash
npm.cmd run firebase:rules:deploy
```

### Resumo de Permissoes Atuais

| Area | `citizen` | `clerk` | `admin` |
| --- | --- | --- | --- |
| Proprio perfil | ler/editar parte segura | ler se admin apenas | ler/editar |
| `demands` | criar e ler proprios | ler/atualizar | ler/atualizar/deletar |
| `demand_messages` | ler/responder proprio protocolo | ler/criar | ler/criar |
| `reports` | criar e ler proprios | ler/atualizar | ler/atualizar |
| `report_messages` | ler/responder proprio relato | ler/criar | ler/criar |
| `appointments` | criar, ler proprios, cancelar proprio | ler/atualizar | ler/atualizar |
| `enrollments` | criar e ler proprios | ler/atualizar | ler/atualizar |
| `emergency_alerts` | criar e ler proprios | ler/atualizar | ler/atualizar |
| `jobs` | ler/criar vaga propria | atualizar se dono/staff | gerenciar |
| `job_applications` | criar e ler proprias | ler/atualizar | ler/atualizar |
| Conteudo editorial | ler | ler | escrever |
| `notifications` | ler/atualizar leitura proprias | criar | criar |

Importante: esconder um botao no front nao e seguranca. Se o dado e sensivel, a regra precisa bloquear.

## Firestore Indexes

Arquivo:

```text
firestore.indexes.json
```

Queries com `where` e `orderBy` frequentemente exigem indice composto.

Padrao comum:

```ts
query(ref, where('userId', '==', uid), orderBy('createdAt', 'desc'))
```

Se criar uma query desse tipo e o Firestore reclamar, adicione o indice e rode:

```bash
npm.cmd run firebase:indexes:check
npm.cmd run firebase:indexes:deploy
```

### Indices Importantes Ja Mapeados

| Colecao | Campos | Uso |
| --- | --- | --- |
| `appointments` | `userId`, `createdAt` | historico do cidadao |
| `appointments` | `date`, `time` | agenda |
| `businesses` | `ownerId`, `createdAt` | comercios do usuario |
| `businesses` | `status`, `createdAt` | listagem publica/admin |
| `demands` | `authorId`, `createdAt` | historico do cidadao |
| `demands` | `status`, `createdAt` | painel admin |
| `demand_messages` | `demandId`, `createdAt` | conversa do protocolo |
| `reports` | `reporterId`, `createdAt` | historico do cidadao |
| `reports` | `status`, `createdAt` | painel admin |
| `report_messages` | `reportId`, `createdAt` | conversa do relato |
| `jobs` | `isActive`, `createdAt` | vagas publicas |
| `jobs` | `isActive`, `isFeatured`, `createdAt` | destaque de vagas |
| `job_applications` | `applicantId`, `createdAt` | candidaturas do usuario |
| `job_applications` | `jobId`, `applicantId` | evitar candidatura duplicada |
| `enrollments` | `userId`, `createdAt` | matriculas do usuario |
| `emergency_alerts` | `userId`, `createdAt` | alertas do usuario |
| `notifications` | `recipientId`, `createdAt` | painel de notificacoes |
| `notifications` | `recipientId`, `read` | nao lidas |
| conteudo editorial | `status`, `createdAt` | paginas publicas/admin |

## Cloud Functions

Fonte:

```text
functions/src/
```

Build:

```bash
npm.cmd run firebase:functions:build
```

Deploy:

```bash
npm.cmd run firebase:functions:deploy
```

Exports ficam em:

```text
functions/src/index.ts
```

Padroes existentes:

- Callable para voto em enquete.
- Callable para assinatura de peticao.
- Trigger ao criar candidatura de vaga.
- Triggers de notificacao/status.

### Functions Atuais

| Function | Arquivo | Tipo | Responsabilidade |
| --- | --- | --- | --- |
| `onDemandCreated` | `onDemandCreated.ts` | Firestore trigger | reagir a nova demanda |
| `onJobApplicationCreated` | `onJobApplicationCreated.ts` | Firestore trigger | incrementar contador de candidaturas da vaga |
| `onDemandStatusChanged` | `onStatusChanged.ts` | Firestore trigger | notificar mudanca de demanda |
| `onReportStatusChanged` | `onStatusChanged.ts` | Firestore trigger | notificar mudanca de relato |
| `signPetitionCallable` | `signPetition.ts` | callable | assinar peticao com validacao server-side |
| `votePollCallable` | `votePoll.ts` | callable | votar em enquete com incremento server-side |

Quando usar Cloud Function:

- contador que nao pode ser manipulado pelo cliente
- validacao transacional
- criacao automatica de notificacao
- log/auditoria administrativa
- acao que precisa de privilegio server-side

Ao criar uma function nova:

1. Crie arquivo em `functions/src/`.
2. Exporte em `functions/src/index.ts`.
3. Rode build.
4. Se necessario, ajuste regras/indices.
5. Deploy somente quando validado.

## Como Criar uma Feature Nova

Checklist pratico:

1. Defina o fluxo:
   - publico
   - admin
   - usuario logado
   - Firebase

2. Crie os tipos:

```text
types/minha-feature.types.ts
types/index.ts
```

3. Crie o service:

```text
services/minha-feature.service.ts
```

4. Crie ou atualize a pagina:

```text
app/minha-rota/page.tsx
```

5. Se tiver admin, crie componente:

```text
features/gestao/content/MinhaFeatureAdmin.tsx
```

6. Registre no painel:

```text
features/gestao/ContentAdminPanel.tsx
```

7. Atualize Firebase:

```text
firestore.rules
firestore.indexes.json
```

8. Rode:

```bash
npm.cmd run lint
npm.cmd run build
```

9. Teste no navegador.

## Como Criar um Novo Modulo Editorial

Use este fluxo para conteudos como noticias, editais, campanhas, programas, turismo etc.

1. Adicione interface em `types/content.types.ts`.
2. Use `BaseContent`.
3. Crie admin em `features/gestao/content/`.
4. Use:

```ts
const service = createContentService<MeuTipo>('minha_collection');
```

5. No admin, use:

```tsx
<ContentStatusSelect />
<ContentStatusBadge />
<ContentStatusFilter />
<ContentQuickActions />
<ContentPreviewDialog />
```

6. Pagina publica deve usar:

```ts
service.list()
```

7. Painel deve usar:

```ts
service.listAdmin()
```

### Exemplo de Modulo Editorial

1. Tipo:

```ts
export interface TourismPlace extends BaseContent {
  address: string;
  imageURL: string | null;
  category: 'rio' | 'praca' | 'igreja' | 'outros';
}
```

2. Service/admin:

```ts
const service = createContentService<TourismPlace>('tourism_places');
```

3. Publico:

```ts
const places = await service.list();
```

4. Admin:

```ts
const places = await service.listAdmin();
```

5. Firebase:

```text
match /tourism_places/{id} { allow read: if true; allow write: if isAdmin(); }
```

6. Indice se usar `status + createdAt`:

```json
{
  "collectionGroup": "tourism_places",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

## Como Criar uma Nova Fila Operacional

Use este fluxo para pedidos, agendamentos, protocolos e processos.

1. Crie tipo com `status`.
2. Crie service com:
   - create
   - getAll
   - getByUser, se aplicavel
   - updateStatus
3. Crie admin em `features/gestao/content/`.
4. Use:
   - `AdminQueueToolbar`
   - `AdminStatusSummary`
5. Status update deve gerar notificacao quando fizer sentido.
6. Firestore rules devem proteger dono do documento e staff.
7. Crie indice para `userId + createdAt` se houver historico do usuario.

### Exemplo de Fila Operacional

Use este modelo para `transfer_requests`, `prescription_validations`, `service_requests` etc.

Tipo:

```ts
export type TransferStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface TransferRequest {
  id: string;
  userId: string;
  studentName: string;
  originSchool: string;
  targetSchool: string;
  status: TransferStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Service minimo:

```ts
export async function createTransferRequest(input) {}
export async function getAllTransferRequests() {}
export async function getTransferRequestsByUser(userId: string) {}
export async function updateTransferRequestStatus(id: string, status: TransferStatus) {}
```

Rules minimas:

```text
match /transfer_requests/{id} {
  allow read: if isOwner(resource.data.userId) || isStaff();
  allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
  allow update: if isStaff();
}
```

Indice comum:

```json
{
  "collectionGroup": "transfer_requests",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "userId", "order": "ASCENDING" },
    { "fieldPath": "createdAt", "order": "DESCENDING" }
  ]
}
```

Admin:

- usar `AdminQueueToolbar`
- usar `AdminStatusSummary`
- gerar notificacao ao mudar status

## Notificacoes

Service:

```text
services/notifications.service.ts
```

Tipos:

```text
types/notification.types.ts
```

Use notificacao quando:

- status de protocolo mudar
- consulta for confirmada/cancelada
- candidatura mudar
- matricula mudar
- emergencia for atualizada

## Auditoria Administrativa

Tipos:

```text
types/admin-audit.types.ts
```

Service:

```text
services/admin-audit.service.ts
```

Colecao:

```text
admin_audit_logs
```

Use auditoria quando:

- status editorial mudar
- conteudo for arquivado
- papel de usuario mudar
- status de fila operacional mudar
- acao sensivel for feita por admin/staff

Padrao recomendado:

```ts
await tryCreateAdminAuditLog({
  action: 'content_status_changed',
  collectionName: 'notices',
  documentId: item.id,
  actorId: user.uid,
  actorName: user.displayName || user.email || 'Gestor',
  previousValue: item.status,
  nextValue: 'published',
  note: null,
});
```

Use `tryCreateAdminAuditLog` em fluxos de UI para nao quebrar a acao principal se o registro de auditoria falhar. Para operacoes criticas server-side, prefira registrar em Cloud Function.

## Storage

Service:

```text
services/storage.service.ts
```

Rules:

```text
storage.rules
```

Use Storage para imagens, anexos e evidencias. Nao grave base64 grande no Firestore.

## Testes e Validacao

Minimo antes de concluir uma tarefa:

```bash
npm.cmd run lint
npm.cmd run build
```

Para UI:

- abrir rota no navegador
- checar console
- testar clique principal
- testar estado vazio
- testar responsivo quando for tela publica ou painel

Para Firebase:

- testar usuario comum
- testar admin
- testar permissao negada
- testar rules/indexes se mexeu em Firestore

## Fluxo de Deploy Seguro

Use esta ordem quando uma entrega envolver Firebase:

1. Validar front:

```bash
npm.cmd run lint
npm.cmd run build
```

2. Validar functions, se mexeu em `functions/src`:

```bash
npm.cmd run firebase:functions:build
```

3. Validar rules, se mexeu em `firestore.rules`:

```bash
npm.cmd run firebase:rules:check
```

4. Validar indexes, se mexeu em `firestore.indexes.json`:

```bash
npm.cmd run firebase:indexes:check
```

5. Publicar somente o que mudou:

```bash
npm.cmd run firebase:rules:deploy
npm.cmd run firebase:indexes:deploy
npm.cmd run firebase:functions:deploy
```

6. Abrir o app local e testar fluxo principal.

7. Se mexeu em permissao, testar com usuario comum e admin.

## Debug de Erros Comuns

### `Missing or insufficient permissions`

Provavel causa:

- `firestore.rules` nao permite a operacao.
- O usuario nao tem `role` correto em `users`.
- O documento usa campo de dono diferente do esperado (`userId`, `authorId`, `reporterId`, `applicantId`).

Como investigar:

1. Veja a colecao e operacao.
2. Abra `firestore.rules`.
3. Confira se o campo dono bate com a regra.
4. Confira se o usuario logado tem papel correto.

### Firestore pede indice

Provavel causa:

- query com `where` + `orderBy`.

Como resolver:

1. Adicionar indice em `firestore.indexes.json`.
2. Rodar:

```bash
npm.cmd run firebase:indexes:deploy
```

### Dado aparece no admin mas nao aparece no site publico

Provavel causa:

- `status` nao esta `published`.
- `deletedAt` esta preenchido.
- pagina publica usa `list()` e admin usa `listAdmin()`.

Como resolver:

1. Verificar status no painel.
2. Reativar/publicar pelo workflow editorial.
3. Conferir se a pagina publica usa o service correto.

### Build falha em tipo

Provavel causa:

- campo usado no componente nao existe no tipo.
- tipo novo nao foi exportado em `types/index.ts`.
- Cloud Function usa tipo/API diferente do front.

Como resolver:

1. Abrir o erro do `npm.cmd run build`.
2. Corrigir o tipo em `types/`.
3. Evitar `any` para esconder o problema.

### Login funciona mas painel nao libera

Provavel causa:

- perfil em `users/{uid}` nao tem `role: admin` ou `role: clerk`.
- Auth logado, mas Firestore profile incompleto.

Como resolver:

1. Conferir `users/{uid}` no Firestore.
2. Verificar `role`.
3. Recarregar app apos alterar.

### Texto aparece quebrado

Provavel causa:

- arquivo antigo com problema de codificacao.

Como resolver:

- Se for trecho pequeno, corrigir apenas o texto alterado.
- Se o arquivo estiver atrapalhando manutencao, reescrever de forma controlada e rodar build.

## Responsabilidades por Area

| Area | Arquivos principais | Cuidado principal |
| --- | --- | --- |
| UI publica | `app/*`, `components/*` | responsividade e dados reais |
| Painel admin | `app/gestao`, `features/gestao` | permissao, filtros, estados |
| Conteudo editorial | `content.service`, `ContentWorkflowControls` | status e listagem publica/admin |
| Filas operacionais | services especificos + `AdminQueueControls` | notificacao e status |
| Firebase rules | `firestore.rules` | seguranca real |
| Firebase indexes | `firestore.indexes.json` | queries compostas |
| Functions | `functions/src` | validacao server-side |
| Tipos | `types/*` | contrato consistente |

## Onde Mexer Para Cada Tipo de Mudanca

| Quero fazer | Comece por | Depois confira |
| --- | --- | --- |
| Nova pagina publica | `app/nova-rota/page.tsx` | service, types, rules |
| Nova aba no painel | `features/gestao/ContentAdminPanel.tsx` | componente em `features/gestao/content` |
| Nova colecao editorial | `types/content.types.ts` | `content.service`, rules, indexes |
| Nova fila de atendimento | `types/novo.types.ts` | service, admin, rules, indexes, notificacao |
| Nova notificacao | `types/notification.types.ts` | `notifications.service.ts`, chamada no service/function |
| Nova Cloud Function | `functions/src` | export em `functions/src/index.ts` |
| Nova permissao | `firestore.rules` | front apenas como apoio visual |
| Novo indice | `firestore.indexes.json` | deploy dos indexes |

## Documentos de Planejamento

Plano atual do painel:

```text
FINAL/PLANO_PAINEL_GESTAO_PROFISSIONAL.md
```

Indice geral:

```text
FINAL/PLANO_GERAL_INDEX.md
```

Documentos antigos de arquitetura:

```text
docs/ARQUITETURA_TECNICA.md
docs/MASTER_BLUEPRINT.md
docs/SERVICOS_DETALHADOS.md
```

## Checklist Antes de Entregar

- [ ] A feature tem tipos em `types/`.
- [ ] A feature usa service em `services/`.
- [ ] Nao ha acesso Firestore solto em componente sem motivo.
- [ ] Painel admin usa componentes compartilhados quando aplicavel.
- [ ] Regras do Firestore foram revisadas.
- [ ] Indices foram revisados.
- [ ] `npm.cmd run lint` passou.
- [ ] `npm.cmd run build` passou.
- [ ] Rota principal foi aberta no navegador.
- [ ] Console nao tem erro novo.
- [ ] Plano/documentacao foi atualizado se mudou arquitetura ou fluxo.

## Observacoes Importantes

- O projeto ainda tem alguns textos antigos com problemas de codificacao em documentos e alguns componentes antigos. Ao tocar nesses arquivos, prefira limpar somente o trecho alterado ou reescrever o arquivo de forma controlada quando fizer sentido.
- O painel de gestao esta em evolucao. Prefira seguir os componentes novos de workflow e filas em vez de copiar padroes antigos.
- Evite apagar dados reais do Firebase durante testes. Se precisar popular dados, use seed com IDs identificaveis e sem destruir documentos existentes.
