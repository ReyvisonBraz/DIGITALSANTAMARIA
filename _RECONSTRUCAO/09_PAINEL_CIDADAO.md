# Painel do Cidadao

Data: 2026-05-22

## Decisao

Para o MVP, a rota `/perfil` sera usada como Painel do Cidadao.

Mais tarde, podemos separar:

- `/painel` para resumo, protocolos e atividades.
- `/perfil` para edicao de dados pessoais.

## Implementacao aplicada

Arquivos alterados:

- `app/perfil/page.tsx`
- `features/perfil/ActivityHistory.tsx`

## Mudancas principais

- O painel foi simplificado para o MVP.
- Foram removidos blocos mockados de documentos digitais.
- A tela de visitante sem login ficou mais direta.
- O usuario logado ve:
  - dados basicos;
  - contadores;
  - historico de protocolos;
  - botao para abrir solicitacao;
  - botao para sair.
- O historico agora destaca protocolos de `demands`.

## Dados usados

- `users`
- `demands`
- `reports`

## Pendencias

- Criar edicao simples de perfil novamente, se necessario.
- Definir se `/painel` sera criado no futuro.
- Melhorar filtros do historico.
- Mostrar peticoes assinadas/criadas.

## Validacao

`npm.cmd run build` passou com sucesso.
