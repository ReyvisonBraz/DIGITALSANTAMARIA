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
- `components/ProfileSettingsPanel.tsx`
- `features/perfil/EditProfileForm.tsx`
- `services/users.service.ts`

## Mudancas principais

- O painel foi simplificado para o MVP.
- Foram removidos blocos mockados de documentos digitais.
- A tela de visitante sem login ficou mais direta.
- O usuario logado ve:
  - dados basicos;
  - contadores;
  - historico de protocolos;
  - edicao simples de perfil;
  - botao para abrir solicitacao;
  - botao para sair.
- O historico agora destaca protocolos de `demands`.
- Admin/clerk ve atalhos para Gestao, Peticoes e Solicitacoes.

## Dados usados

- `users`
- `demands`
- `reports`

## Pendencias

- Definir se `/painel` sera criado no futuro.
- Melhorar filtros do historico.
- Mostrar peticoes assinadas/criadas.

## Validacao

`npm.cmd run build` passou com sucesso.
