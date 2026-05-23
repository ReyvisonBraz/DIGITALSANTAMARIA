# Ouvidoria

Data: 2026-05-22

## Decisao

Para o MVP, `/ouvidoria` sera o fluxo principal de "Abrir solicitacao".

`/relatar` fica como modulo secundario ou atalho futuro para problemas urbanos especificos.

## Implementacao aplicada

Arquivos alterados:

- `app/ouvidoria/page.tsx`
- `features/ouvidoria/DemandForm.tsx`
- `features/ouvidoria/ProtocolSearch.tsx`
- `services/demands.service.ts`

## Mudancas principais

- A pagina foi simplificada para mobile e desktop.
- O hero exagerado foi substituido por uma estrutura mais direta.
- O fluxo agora tem duas abas:
  - Abrir solicitacao.
  - Consultar protocolo.
- O formulario ficou em uma etapa unica.
- A consulta de protocolo usa `getDemandByProtocol`.
- O protocolo exibido no sucesso agora e o mesmo protocolo salvo no Firestore.

## Colecao usada

Colecao principal:

- `demands`

Campos principais:

- `protocolId`
- `authorId`
- `type`
- `category`
- `subject`
- `status`
- `content.text`
- `isAnonymous`
- `consent`
- `createdAt`
- `updatedAt`

## Decisao tecnica importante

`createDemand` agora retorna:

```ts
{ id: string; protocolId: string }
```

Antes retornava apenas o ID do documento, enquanto a pagina gerava outro protocolo para exibir. Isso poderia mostrar ao usuario um protocolo que nao existia no Firestore.

## Validacao

`npm.cmd run build` passou com sucesso.

## Pendencias

- Validar regras Firestore para criacao e leitura por protocolo.
- Definir se solicitacao anonima pode ser consultada publicamente.
- Definir se solicitacao nao anonima exige login sempre.
- Mostrar historico no Painel do Cidadao.
- Conectar Gestao/admin para responder demandas reais.
