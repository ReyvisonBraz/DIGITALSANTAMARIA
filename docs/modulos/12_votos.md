# Votacoes — `/votos`

Enquetes publicas para participacao cidada.

**Dados:** Firestore real (`polls`)
**Padrao:** Catalogo (usa `useContent<Poll>`)
**Cloud Function:** `votePollCallable`

## Funcionalidades

- Lista enquetes ativas
- Opcoes de voto com contagem
- Voto atomico via Cloud Function (evita race condition)
- Resultados em tempo real

## Colecao

| Colecao | Proposito |
|---|---|
| `polls` | Enquete (question, options[{ id, text, votes }], status) |
