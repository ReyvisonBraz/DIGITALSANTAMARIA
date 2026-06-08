# Ouvidoria - `/ouvidoria`

Sistema de manifestacoes do cidadao: reclamacao, sugestao, denuncia e elogio.

**Dados:** Firestore real (`demands`, `demand_messages`)
**Features:** `DemandForm`, `DemandTimeline`, `ProtocolSearch`
**Service:** `demands.service.ts`
**API:** `POST /api/suggest-response` (Gemini AI)

## Fluxos

### Nova manifestacao
1. **Tipo** - reclamacao, sugestao, denuncia ou elogio
2. **Categoria** - infraestrutura, saude, educacao, seguranca, transito, meio ambiente, social ou outros
3. **Detalhes** - titulo, descricao, localizacao e midia opcional
4. **Confirmacao** - protocolo gerado no formato `OUV-ANO-RANDOM`

### Consulta por protocolo
- Usuario logado consulta primeiro por `protocolId + authorId`
- Se nao encontrar demanda vinculada ao usuario, a busca cai para demandas anonimas por `protocolId + isAnonymous`
- Exibe status, detalhes da solicitacao e timeline de mensagens

## Funcionalidades

- **Protocolo unico** - gerado via `generateDemandProtocolId()`
- **Timeline** - conversa entre cidadao e atendente (`DemandTimeline`)
- **Resposta do cidadao** - novas mensagens atualizam `demands.conversation` para sinalizar retorno pendente no painel de gestao
- **Busca por protocolo** - query real ao Firestore (`ProtocolSearch`)
- **Sugestao de resposta** - Gemini AI sugere resposta formal para o admin
- **Notificacao** - cidadao recebe notificacao ao ter demanda respondida
- **Listener em tempo real** - `listenToUserDemands` no painel do cidadao

## Colecoes

| Colecao | Proposito |
|---|---|
| `demands` | Documento principal da manifestacao, com protocolo, status, conteudo e resumo da conversa |
| `demand_messages` | Mensagens da timeline por `demandId` |

## Resumo de conversa

O documento principal da demanda guarda `conversation` para o painel nao precisar carregar todas as mensagens so para montar a fila:

| Campo | Uso |
|---|---|
| `lastMessageAt` | Ordenacao e exibicao da ultima interacao |
| `lastMessageAuthorName` | Identificacao rapida de quem respondeu |
| `lastMessageAuthorRole` | `citizen` ou `staff` |
| `unreadByCitizen` | Indica resposta nova da prefeitura para o cidadao |
| `unreadByStaff` | Indica resposta nova do cidadao para o gestor |
