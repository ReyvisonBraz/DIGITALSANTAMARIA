# Obras Publicas — `/obras` e `/obras/[id]`

Acompanhamento de obras publicas municipais.

**Dados:** Firestore real (`works`)
**Padrao:** Catalogo (usa `useContent<Work>` + `ContentPage` + `ContentCard`)

## Dados exibidos

- Nome, tipo (asfalto, saneamento, escola, hospital, etc.)
- Orcamento, progresso (%), localizacao
- Atualizacoes (timeline de `updates[]`)

## Admin

`WorksAdmin` — CRUD com campos de progresso, orcamento e atualizacoes.
