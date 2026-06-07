# Eventos — `/eventos` e `/eventos/[id]`

Agenda cultural e eventos da cidade.

**Dados:** Firestore real (`events`)
**Padrao:** Catalogo (usa `useContent<Event>` + `ContentPage` + `ContentCard`)

## Paginas

- **Listagem** (`/eventos`) — cards com data, hora, local, preco
- **Detalhe** (`/eventos/[id]`) — busca por ID na colecao

## Admin

`EventsAdmin` — CRUD completo com status workflow (draft → published → archived).
