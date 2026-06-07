# Cloud Functions

Firebase Cloud Functions para operacoes atomicas server-side.

---

## Estrutura

```
functions/
├── package.json
├── tsconfig.json
└── src/
    └── index.ts
```

## Funcoes deployadas

### `signPetitionCallable`

**Tipo:** `httpsCallable` (chamada direta do client)

**Proposito:** Assinar peticao com incremento atomico do contador.

```typescript
// Client (services/petitions.service.ts)
const signFn = httpsCallable(functions, 'signPetitionCallable')
await signFn({ petitionId, userName, userId })
```

**Logica server-side:**
1. Verifica se usuario ja assinou (composite key `petitionId_userId`)
2. Cria documento em `petition_signatures/{petitionId_userId}`
3. Incrementa `signaturesCount` no documento da peticao
4. Se `signaturesCount >= goal`, atualiza status para `achieved`
5. Retorna novo `signaturesCount`

### `votePollCallable`

**Tipo:** `httpsCallable`

**Proposito:** Votar em enquete com incremento atomico por opcao.

```typescript
// Client (services/polls.service.ts)
const voteFn = httpsCallable(functions, 'votePollCallable')
await voteFn({ pollId, optionId })
```

**Logica server-side:**
1. Busca documento da enquete
2. Incrementa `votes` na opcao especifica
3. Atualiza documento da enquete com as novas contagens

---

## Deploy

```bash
cd functions
npm install
npm run build
cd ..
npx firebase deploy --only functions
```

## Desenvolvimento local

```bash
cd functions
npm run serve   # Firebase Emulator
```

---

## Quando usar Cloud Functions vs Firestore direto

| Operacao | Onde | Motivo |
|---|---|---|
| Criar documento simples | Firestore direto (client) | Sem necessidade de atomo |
| Incrementar contador | Cloud Function | Evita race conditions |
| Assinar peticao | Cloud Function | Composite key + incremento atomico |
| Votar enquete | Cloud Function | Incremento atomico por opcao |
| Enviar email | Cloud Function (futuro) | Server-side apenas |
| Notificacao push | Cloud Function (futuro) | Server-side apenas |
