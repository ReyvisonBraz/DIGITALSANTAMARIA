# Peticoes

Data: 2026-05-22

## Decisao

Peticoes entram no MVP com tres funcoes reais:

- Listar peticoes ativas.
- Criar nova peticao.
- Assinar peticao uma vez por usuario.

## Implementacao aplicada

Arquivos alterados:

- `app/peticoes/page.tsx`
- `app/peticoes/[id]/page.tsx`
- `components/CreatePetitionModal.tsx`

## Base ja existente preservada

- `services/petitions.service.ts`
- `features/peticoes/SignatureButton.tsx`
- `features/peticoes/SignatureProgress.tsx`

## Mudancas principais

- A listagem foi simplificada e removida a dependencia de `reports`.
- A busca local filtra por titulo, descricao e categoria.
- A criacao de peticao chama `createPetition` e atualiza a lista.
- A assinatura continua usando transacao em `signPetition`.
- A pagina de detalhe foi simplificada e mantem assinatura real.
- Layout reduzido para evitar componentes gigantes em mobile e desktop.

## Dados usados

- `petitions`
- `petition_signatures`

## Pendencias

- Validar regras Firestore em ambiente real.
- Decidir se toda peticao criada fica ativa imediatamente ou se exige aprovacao.
- Mostrar peticoes criadas/assinadas no Painel do Cidadao.
- Painel admin de peticoes criado em `/gestao`, com status e resposta oficial.

## Validacao

`npm.cmd run build` passou com sucesso.
