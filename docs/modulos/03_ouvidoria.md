# Ouvidoria — `/ouvidoria`

Sistema de manifestacoes do cidadao (reclamacao, sugestao, denuncia, elogio).

**Dados:** Firestore real (`demands`, `demand_messages`)
**Features:** `DemandForm`, `DemandTimeline`, `ProtocolSearch`
**Service:** `demands.service.ts`
**API:** `POST /api/suggest-response` (Gemini AI)

## Fluxos

### Nova manifestacao
1. **Tipo** — reclamacao, sugestao, denuncia, elogio
2. **Categoria** — infraestrutura, saude, educacao, seguranca, transito, meio ambiente, social, outros
3. **Detalhes** — titulo, descricao, localizacao, midia (opcional)
4. **Confirmacao** — protocolo gerado (OUV-2026-XXXXXX)

### Consulta por protocolo
- Input do numero de protocolo → busca em `demands` por `protocolId`
- Exibe status, timeline de mensagens, detalhes

## Funcionalidades

- **Protocolo unico** — gerado via `generateDemandProtocolId()` → `OUV-ANO-RANDOM`
- **Timeline** — chat entre cidadao e atendente (`DemandTimeline`)
- **Busca por protocolo** — query real ao Firestore (`ProtocolSearch`)
- **Sugestao de resposta** — Gemini AI sugere resposta formal para o admin
- **Notificacao** — cidadao recebe notificacao ao ter demanda respondida
- **Listener em tempo real** — `listenToUserDemands` no painel do cidadao

## Colecoes

| Colecao | Proposito |
|---|---|
| `demands` | Manifestacao (userId, type, category, status, protocol, title, description) |
| `demand_messages` | Mensagens (demandId, authorId, authorRole, text) |
