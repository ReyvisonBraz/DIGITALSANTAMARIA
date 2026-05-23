# Gestao/Admin

Data: 2026-05-22

## Decisao

Para o MVP, `/gestao` administra as solicitacoes da colecao `demands`.

`reports` fica como legado/secundario ate decidirmos se sera unificado ou removido.

## Implementacao aplicada

Arquivos alterados:

- `app/gestao/page.tsx`
- `features/gestao/hooks/useAdminData.ts`
- `features/gestao/MetricsDashboard.tsx`
- `features/gestao/StatusUpdater.tsx`
- `services/demands.service.ts`

## Mudancas principais

- Gestao deixou de listar `reports` e passou a listar `demands`.
- Acesso permitido para `admin` e `clerk`.
- Usuarios `admin` e `clerk` agora veem um atalho "Gestao" no topo em telas desktop.
- Painel mostra metricas:
  - Total.
  - Pendentes.
  - Em analise.
  - Resolvidas.
- Cada demanda mostra:
  - tipo;
  - status;
  - data;
  - assunto;
  - texto;
  - protocolo;
  - autor/categoria.
- Gestor pode:
  - alterar status;
  - registrar resposta oficial.

## Pendencias

- Confirmar regras Firestore em ambiente real.
- Definir como criar documentos em `admins`.
- Decidir se `clerk` pode gerenciar todos os setores ou apenas departamento.
- Adicionar filtros por status/categoria.
- Validar visualmente mobile e desktop.

## Validacao

`npm.cmd run build` passou com sucesso.
