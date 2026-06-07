# Digital Santa Maria

Portal municipal com area publica, painel do cidadao, painel de gestao e integracao Firebase.

## Comecar

```bash
npm install
npm.cmd run dev
```

A aplicacao local roda em:

```text
http://localhost:3000
```

## Validar

Antes de entregar alteracoes:

```bash
npm.cmd run lint
npm.cmd run build
```

## Firebase

Scripts principais:

```bash
npm.cmd run firebase:rules:check
npm.cmd run firebase:rules:deploy
npm.cmd run firebase:indexes:check
npm.cmd run firebase:indexes:deploy
npm.cmd run firebase:functions:build
npm.cmd run firebase:functions:deploy
```

## Documentacao

Leia primeiro:

- [Guia Tecnico do Desenvolvedor](./docs/GUIA_TECNICO_DESENVOLVEDOR.md)
- [Plano do Painel de Gestao Profissional](./FINAL/PLANO_PAINEL_GESTAO_PROFISSIONAL.md)
- [Indice Geral de Planejamento](./FINAL/PLANO_GERAL_INDEX.md)

## Estrutura Rapida

```text
app/        rotas Next.js
features/   modulos de negocio e telas compostas
services/   acesso ao Firebase
types/      contratos TypeScript
functions/  Cloud Functions
docs/       documentacao tecnica
FINAL/      planejamento e backlog
```
