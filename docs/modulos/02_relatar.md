# Relatar Problema — `/relatar`

Formulario para cidadaos reportarem problemas urbanos.

**Dados:** Firestore real (`reports`)
**Features:** `ReportForm`, `PhotoUpload`, `LocationPicker`
**Service:** `reports.service.ts`
**API:** `POST /api/classify-report` (Gemini AI)

## Fluxo

1. **Tipo** — selecionar categoria (infraestrutura, meio ambiente, seguranca, outros)
2. **Detalhes** — descricao, foto (opcional), localizacao
3. **Revisar** — confirmar dados e enviar

## Funcionalidades

- **Upload de foto** via `PhotoUpload` → Firebase Storage (`storage.service.ts`)
- **Localizacao** via `LocationPicker` — endereco manual ou geolocalizacao do navegador
- **Classificacao automatica** via Gemini AI (`/api/classify-report`) — sugere tipo baseado na descricao
- **Persistencia** — `createReport()` grava em `reports/{id}`
- **Notificacao** — ao ser respondido pelo admin, cidadao recebe notificacao
- **Timeline** — historico de mensagens entre cidadao e gestao (`ReportTimeline`)

## Colecoes

| Colecao | Proposito |
|---|---|
| `reports` | Relato principal (id, reporterId, type, description, location, photoURL, status) |
| `report_messages` | Mensagens trocadas (reportId, authorId, text) |
