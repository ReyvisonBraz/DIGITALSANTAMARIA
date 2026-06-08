# Painel de Gestao - `/gestao`

Painel administrativo com acesso por perfil. `admin` ve o painel completo; `clerk` ve filas de atendimento e area operacional.

**Dados:** Firestore real em multiplas colecoes
**Features:** componentes em `features/gestao/`
**Hook:** `useAdminData()`
**Auth:** `useAuth()` + documento em `admins/{uid}`

## Secoes do painel

Navegacao por abas em `AdminSectionNav`.

Permissoes de navegacao:
- `admin`: Visao geral, Solicitacoes, Relatos, Conteudo, Peticoes, Usuarios e Auditoria
- `clerk`: Visao geral, Solicitacoes, Relatos e Atendimentos

### 1. Visao Geral (`AdminOverview`)
Dashboard com contadores de filas que pedem acao:
- Solicitacoes, relatos, alertas de emergencia, agendamentos, matriculas e candidaturas
- Solicitacoes e relatos contam pendencias e novas respostas do cidadao

### 2. Solicitacoes (Ouvidoria)
- Lista de demandas com filtros por status e categoria
- Busca por protocolo, assunto, texto, categoria e ultima interacao
- Ordenacao por mais recentes, mais antigas, pendentes primeiro e novas respostas primeiro
- Badge `Nova resposta` quando `demands.conversation.unreadByStaff` esta ativo
- Abrir detalhe marca a conversa como lida para a equipe e mantem a timeline visivel
- `StatusUpdater` atualiza status e resposta oficial
- `MetricsDashboard` exibe KPIs de total, pendentes, em analise e resolvidas

### 3. Relatos
- Lista de relatos com filtros por status
- Busca por protocolo, titulo, descricao, cidadao e ultima interacao
- Ordenacao por mais recentes, mais antigos, pendentes primeiro e novas respostas primeiro
- Badge `Nova resposta` quando `reports.conversation.unreadByStaff` esta ativo
- Abrir detalhe marca a conversa como lida para a equipe e mantem a timeline visivel
- `ReportStatusUpdater` atualiza status e resposta oficial

### 4. Conteudo (`ContentAdminPanel`)

Para `admin`, mostra todas as abas de publicacao, atendimento, cadastros e participacao.
Para `clerk`, mostra somente o grupo `Atendimento`: consultas, candidaturas, matriculas e emergencias.

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

### 7. Auditoria (`AdminAuditPanel`)
- Lista os registros mais recentes de `admin_audit_logs`
- Busca por acao, colecao, documento, gestor e observacao
- Filtros por tipo de acao e colecao afetada
- Mostra valor anterior e novo valor quando o log registra mudanca de status
- Acesso restrito a perfis administrativos, usando as mesmas regras de leitura do painel

## Fila de atendimento da Ouvidoria e Relatos

O painel usa `demands.conversation` e `reports.conversation` para destacar protocolos que tiveram retorno do cidadao depois da resposta da prefeitura. Esse resumo evita consultas extras nas colecoes de mensagens durante a listagem e permite priorizar por `Novas respostas primeiro`.

Comportamento esperado:
- Mensagem do cidadao grava `conversation.unreadByStaff = true`
- Mensagem da prefeitura grava `conversation.unreadByCitizen = true`
- Gestor abre o detalhe e o painel chama `markDemandReadByStaff()` ou `markReportReadByStaff()`
- A timeline continua carregando as mensagens completas em `DemandTimeline` ou `ReportTimeline`

## Revisao de comercios

`BusinessesAdmin` separa cadastros `pending_approval` em uma fila de aprovacao. O gestor deve aprovar pela fila para publicar e notificar o cidadao, ou reprovar com motivo visivel para correcao.

Comportamento esperado:
- Aprovar publica o comercio (`published`), limpa `reviewNote`, cria notificacao e registra auditoria
- Reprovar exige motivo, muda para `archived`, salva `reviewNote`, cria notificacao e registra auditoria
- Cadastro pendente nao deve ser publicado por acao rapida generica; deve passar pela fila de aprovacao
- Cidadao pode corrigir cadastro reprovado em `/perfil` e reenviar para `pending_approval`

## Componentes compartilhados

| Componente | Uso |
|---|---|
| `AdminQueueControls` | Busca, filtro de status, refresh e contagem |
| `ContentWorkflowControls` | Status badge, filtro, sort, preview, acoes rapidas e confirmacao antes de publicar/reativar |
| `StatusUpdater` | Status e resposta oficial de demandas |
| `ReportStatusUpdater` | Status e resposta oficial de relatos |

## Colecoes usadas pelo admin

`demands`, `demand_messages`, `reports`, `report_messages`, `notices`, `events`, `works`, `businesses`, `traffic_alerts`, `jobs`, `health_units`, `emergency_alerts`, `enrollments`, `job_applications`, `appointments`, `petitions`, `users`, `safety_zones`, `environment_data`, `social_programs`, `tax_records`, `public_services`, `pharmacy_items`, `education_schools`, `community_groups`, `polls`, `admin_audit_logs`
