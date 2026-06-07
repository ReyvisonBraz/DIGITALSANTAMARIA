# Peticoes — `/peticoes` e `/peticoes/[id]`

Abaixo-assinados online. Cidadaos criam e assinam peticoes.

**Dados:** Firestore real (`petitions`, `petition_signatures`)
**Features:** `SignatureButton`, `SignatureProgress`, `CreatePetitionModal`
**Service:** `petitions.service.ts`
**Cloud Function:** `signPetitionCallable`

## Paginas

### Listagem (`/peticoes`)
- Lista peticoes ativas com barra de progresso
- Modal para criar nova peticao (`CreatePetitionModal`)
- Sidebar com relatos recentes (dados do Firestore)

### Detalhe (`/peticoes/[id]`)
- Detalhes completos da peticao
- Barra de progresso animada (`SignatureProgress`)
- Botao de assinar (`SignatureButton`)
- Contagem de assinaturas em tempo real

## Fluxo de assinatura

1. Usuario clica "Assinar"
2. Se nao autenticado → prompt de login
3. Verifica se ja assinou (`hasUserSigned`)
4. Chama `signPetitionCallable` (Cloud Function)
5. Cloud Function incrementa `signaturesCount` atomicamente
6. Se meta atingida → status muda para `achieved`

## Colecoes

| Colecao | Proposito |
|---|---|
| `petitions` | Peticao (creatorId, title, description, goal, signaturesCount, status) |
| `petition_signatures` | Assinatura (composite key: `petitionId_userId`) |
