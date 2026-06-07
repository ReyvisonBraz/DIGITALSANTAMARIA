# Avisos — `/avisos`

Avisos e comunicados oficiais da prefeitura.

**Dados:** Firestore real (`notices`)
**Padrao:** Catalogo (usa `useContent<Notice>` + `ContentPage` + `ContentCard`)

## Funcionalidades

- **Tipos:** alerta, urgencia, informativo
- **Prioridade:** baixa, media, alta
- **Expiracao:** `expiresAt` — documentos expirados sao filtrados
- **AlertBanner:** notices tipo `alerta`/`urgencia` aparecem no banner superior

## Admin

`NoticesAdmin` — CRUD com tipo, prioridade e expiracao.
