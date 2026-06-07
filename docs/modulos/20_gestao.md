# Painel de Gestao — `/gestao`

Painel administrativo completo. Acesso restrito a `admin` e `clerk`.

**Dados:** Firestore real (multiplas colecoes)
**Features:** 23 arquivos em `features/gestao/`
**Hook:** `useAdminData()`
**Auth:** `useAuthGuard('admin')` — redireciona se nao autorizado

---

## Secoes do painel

Navegacao por abas (`AdminSectionNav`):

### 1. Visao Geral (`AdminOverview`)
Dashboard com contadores de filas pendentes:
- Demandas, Relatos, Alertas de emergencia, Agendamentos, Matriculas, Candidaturas

### 2. Solicitacoes (Ouvidoria)
- Lista de demandas com filtros (status, categoria)
- `StatusUpdater` — atualizar status + responder
- `MetricsDashboard` — KPIs (total, pendentes, em analise, resolvidos)

### 3. Relatos
- Lista de relatos com filtros
- `ReportStatusUpdater` — atualizar status + responder

### 4. Conteudo (`ContentAdminPanel`)
Gestao de todo o conteudo do portal. Abas internas:

| Aba | Componente | Colecao |
|---|---|---|
| Avisos | `NoticesAdmin` | `notices` |
| Eventos | `EventsAdmin` | `events` |
| Obras | `WorksAdmin` | `works` |
| Comercios | `BusinessesAdmin` | `businesses` (inclui fila de aprovacao) |
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
- Atualizar status + resposta oficial
- Busca e ordenacao

### 6. Usuarios (`UsersAdminPanel`)
- Lista de cidadaos com busca
- Edicao de perfil (nome, telefone, bairro)

---

## Workflow de aprovacao

Varios modulos tem fluxo de aprovacao:

```
Cidadao submete → pending_approval
  → Admin revisa em fila especifica
    → Aprova → published + notificacao
    → Reprova → archived/rejected + notificacao
```

Aplica-se a: `businesses`, `enrollments`, `job_applications`, `emergency_alerts`

---

## Componentes compartilhados

| Componente | Uso |
|---|---|
| `AdminQueueControls` | Busca, filtro de status, refresh, badge de contagem |
| `ContentWorkflowControls` | Status badge, filtro, sort, preview, quick actions (publicar/arquivar/editar) |
| `StatusUpdater` | Dropdown de status para demandas |
| `ReportStatusUpdater` | Dropdown de status para relatos |

---

## Colecoes usadas pelo admin

`demands`, `demand_messages`, `reports`, `report_messages`, `notices`, `events`, `works`, `businesses`, `traffic_alerts`, `jobs`, `health_units`, `emergency_alerts`, `enrollments`, `job_applications`, `appointments`, `petitions`, `users`, `safety_zones`, `environment_data`, `social_programs`, `tax_records`, `public_services`, `pharmacy_items`, `education_schools`, `community_groups`, `polls`, `admin_audit_logs`
