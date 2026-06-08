# Painel de Gestao - `/gestao`

Painel administrativo completo. Acesso restrito a `admin` e `clerk`.

**Dados:** Firestore real em multiplas colecoes
**Features:** componentes em `features/gestao/`
**Hook:** `useAdminData()`
**Auth:** `useAuth()` + documento em `admins/{uid}`

## Secoes do painel

Navegacao por abas em `AdminSectionNav`.

### 1. Visao Geral (`AdminOverview`)
Dashboard com contadores de filas que pedem acao:
- Solicitacoes, relatos, alertas de emergencia, agendamentos, matriculas e candidaturas
- Solicitacoes contam pendencias e novas respostas do cidadao

### 2. Solicitacoes (Ouvidoria)
- Lista de demandas com filtros por status e categoria
- Busca por protocolo, assunto, texto, categoria e ultima interacao
- Ordenacao por mais recentes, mais antigas, pendentes primeiro e novas respostas primeiro
- Badge `Nova resposta` quando `demands.conversation.unreadByStaff` esta ativo
- Abrir detalhe marca a conversa como lida para a equipe e mantem a timeline visivel
- `StatusUpdater` atualiza status e resposta oficial
- `MetricsDashboard` exibe KPIs de total, pendentes, em analise e resolvidas

### 3. Relatos
- Lista de relatos com filtros
- `ReportStatusUpdater` atualiza status e resposta oficial

### 4. Conteudo (`ContentAdminPanel`)

| Aba | Componente | Colecao |
|---|---|---|
| Avisos | `NoticesAdmin` | `notices` |
| Eventos | `EventsAdmin` | `events` |
| Obras | `WorksAdmin` | `works` |
| Comercios | `BusinessesAdmin` | `businesses` |
| Transito | `TrafficAdmin` | `traffic_alerts` |
| Vagas | `JobsAdmin` | `jobs` |
| Saude | `HealthUnitsAdmin` | `health_units` |
| Emergencias | `EmergencyAlertsAdmin` | `emergency_alerts` |
| Matriculas | `EnrollmentsAdmin` | `enrollments` |
| Candidaturas | `ApplicationsAdmin` | `job_applications` |
| Agendamentos | `AppointmentsAdmin` | `appointments` |
| Catalogos | `GenericCatalogAdmin` | `safety_zones`, `environment_data`, `social_programs`, `tax_records`, `public_services`, `pharmacy_items`, `education_schools`, `community_groups`, `polls` |

### 5. Peticoes (`PetitionsAdminPanel`)
- Lista de peticoes com filtros
- Atualizar status e resposta oficial
- Busca e ordenacao

### 6. Usuarios (`UsersAdminPanel`)
- Lista de cidadaos com busca
- Edicao de perfil: nome, telefone e bairro

## Fila de atendimento da Ouvidoria

O painel usa `demands.conversation` para destacar protocolos que tiveram retorno do cidadao depois da resposta da prefeitura. Esse resumo evita consultas extras em `demand_messages` na listagem e permite priorizar por `Novas respostas primeiro`.

Comportamento esperado:
- Mensagem do cidadao grava `conversation.unreadByStaff = true`
- Mensagem da prefeitura grava `conversation.unreadByCitizen = true`
- Gestor abre o detalhe da demanda e o painel chama `markDemandReadByStaff()`
- A timeline continua carregando as mensagens completas em `DemandTimeline`

## Componentes compartilhados

| Componente | Uso |
|---|---|
| `AdminQueueControls` | Busca, filtro de status, refresh e contagem |
| `ContentWorkflowControls` | Status badge, filtro, sort, preview e acoes rapidas |
| `StatusUpdater` | Status e resposta oficial de demandas |
| `ReportStatusUpdater` | Status e resposta oficial de relatos |

## Colecoes usadas pelo admin

`demands`, `demand_messages`, `reports`, `report_messages`, `notices`, `events`, `works`, `businesses`, `traffic_alerts`, `jobs`, `health_units`, `emergency_alerts`, `enrollments`, `job_applications`, `appointments`, `petitions`, `users`, `safety_zones`, `environment_data`, `social_programs`, `tax_records`, `public_services`, `pharmacy_items`, `education_schools`, `community_groups`, `polls`, `admin_audit_logs`
