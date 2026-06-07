# Comercio Local — `/comercio`

Vitrine de negocios locais. Cidadaos podem cadastrar seus negocios.

**Dados:** Firestore real (`businesses`)
**Features:** `BusinessCard`
**Service:** `businesses.service.ts`

## Funcionalidades

### Vitrine publica
- Lista de negocios aprovados (`status == 'published'`)
- Filtro por categoria
- `BusinessCard` com:
  - Foto com fallback
  - Nome, categoria, endereco
  - WhatsApp e telefone com links diretos
  - Horario de funcionamento
  - Indicador aberto/fechado
  - Mapa (Google Maps link)

### Cadastro de negocio
- Cidadao cadastra via painel do cidadao (`MyBusinessesSection`)
- Status inicial: `pending_approval`
- Admin revisa e aprova/reprova (`BusinessesAdmin`)
- Notificacao enviada ao cidadao com resultado

### Meus negocios
- Listagem em tempo real (`listenToOwnedBusinesses`)
- Edicao de dados do negocio
- Status visivel (pendente, aprovado, rejeitado)

## Colecoes

| Colecao | Proposito |
|---|---|
| `businesses` | Negocios (ownerId, name, category, phone, whatsapp, address, hours, status) |

## Workflow de aprovacao

```
Cidadao cadastra → pending_approval
  → Admin aprova → published + notificacao
  → Admin reprova → archived + notificacao com motivo
```
