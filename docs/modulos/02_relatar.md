# Relatar Problema - `/relatar`

Formulario para cidadaos reportarem problemas urbanos.

**Dados:** Firestore real (`reports`, `report_messages`)
**Features:** `ReportForm`, `PhotoUpload`, `LocationPicker`, `ReportTimeline`
**Service:** `reports.service.ts`
**API:** `POST /api/classify-report` (Gemini AI)

## Fluxo

1. **Tipo** - infraestrutura, meio ambiente, seguranca ou outros
2. **Detalhes** - titulo, descricao, foto opcional e localizacao
3. **Revisar** - confirmar dados e enviar
4. **Acompanhar** - historico aparece no perfil do cidadao e no painel de gestao

## Funcionalidades

- **Upload de foto** via `PhotoUpload` para Firebase Storage (`storage.service.ts`)
- **Localizacao** via `LocationPicker`, com endereco manual ou geolocalizacao do navegador
- **Classificacao automatica** via Gemini AI (`/api/classify-report`)
- **Persistencia** via `createReport()` em `reports/{id}`
- **Timeline** com mensagens entre cidadao e gestao (`ReportTimeline`)
- **Resposta do cidadao** atualiza `reports.conversation` para sinalizar retorno pendente no painel
- **Notificacao** quando o admin atualiza status ou resposta oficial

## Colecoes

| Colecao | Proposito |
|---|---|
| `reports` | Relato principal com status, protocolo, foto, localizacao e resumo da conversa |
| `report_messages` | Mensagens completas da timeline por `reportId` |

## Resumo de conversa

`reports.conversation` segue o mesmo modelo de `demands.conversation`:

| Campo | Uso |
|---|---|
| `lastMessageAt` | Ordenacao e exibicao da ultima interacao |
| `lastMessageAuthorName` | Identificacao rapida de quem respondeu |
| `lastMessageAuthorRole` | `citizen` ou `staff` |
| `unreadByCitizen` | Indica resposta nova da prefeitura para o cidadao |
| `unreadByStaff` | Indica resposta nova do cidadao para o gestor |
