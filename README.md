# Conecta Santa Maria

Portal municipal com area publica, painel do cidadao, painel de gestao e integracao Firebase.

## Comecar

```bash
npm install
npm run dev
```

A aplicacao local roda em `http://localhost:3000`.

## Validar

Antes de entregar alteracoes:

```bash
npm run lint
npm run build
npx tsc --noEmit
```

## Firebase

```bash
npm run firebase:rules:check
npm run firebase:rules:deploy
npm run firebase:indexes:check
npm run firebase:indexes:deploy
npm run firebase:functions:build
npm run firebase:functions:deploy
```

## Documentacao

- [Indice completo da documentacao](./docs/README.md)
- [Visao geral do projeto](./docs/arquitetura/01_visao-geral.md)
- [Setup local](./docs/guias/01_setup.md)
- [Como adicionar um modulo](./docs/guias/02_novo-modulo.md)

Documentacao antiga de planejamento esta em [`historico/`](./historico/).

## Estrutura Rapida

```text
app/          rotas Next.js (26 paginas)
features/     componentes de dominio (41)
services/     acesso ao Firebase (14)
components/   UI reutilizavel (30)
lib/          infraestrutura (contexts, hooks, utils)
types/        contratos TypeScript (13 modulos)
hooks/        hooks compartilhados
functions/    Cloud Functions
docs/         documentacao tecnica atualizada
historico/    documentacao antiga de planejamento
```
