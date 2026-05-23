# Checklist de Teste do MVP

Data: 2026-05-23

## Fluxo confirmado

- [x] Login funciona.
- [x] Usuario admin consegue acessar `/gestao`.
- [x] Cidadao abre solicitacao em `/ouvidoria`.
- [x] Solicitacao aparece no historico do Painel do Cidadao.
- [x] Admin responde solicitacao em `/gestao`.
- [x] Cidadao consulta protocolo e ve a resposta.
- [x] Peticoes aparecem na lista publica depois da criacao.
- [x] Ambiente local aponta para `digitalsantamaria-2ced4` e Firestore `(default)`.
- [x] `/relatar` foi unificado como redirecionamento para `/ouvidoria`.
- [x] Home, Ouvidoria e Peticoes foram limpas de textos quebrados no MVP.
- [x] Layouts principais dessas telas foram ajustados para mobile/web.
- [x] Gestao, Perfil e componentes internos do MVP foram limpos de textos quebrados.
- [x] Painel de gestao foi compactado para uso melhor em mobile/web.
- [x] Barra superior, busca, notificacoes, footer e navegacao mobile foram limpos.
- [x] `app/globals.css` teve letter spacing negativo removido.
- [x] Gestao ganhou aba `Usuarios`.
- [x] Admin/clerk pode buscar usuario e editar nome, telefone e bairro.

## Proximo teste: Perfil, Gestao de Peticoes e Usuarios

### Editar perfil

1. Acessar `/perfil` logado.
2. Clicar em "Editar perfil".
3. Alterar nome, telefone e bairro.
4. Salvar.
5. Fechar e confirmar que os dados aparecem no painel.

Resultado esperado:

- Documento `users/{uid}` atualizado.
- Campo `updatedAt` atualizado.
- Nome, telefone e bairro aparecem no painel.

### Gestao de peticoes

1. Acessar `/gestao`.
2. Entrar na aba "Peticoes".
3. Buscar uma peticao criada.
4. Alterar status ou resposta oficial.
5. Salvar.

Resultado esperado:

- Documento `petitions/{id}` atualizado.
- Peticao fechada deixa de aparecer na lista publica de ativas.

### Gestao de usuarios

1. Acessar `/gestao`.
2. Entrar na aba "Usuarios".
3. Buscar um usuario por nome, email ou UID.
4. Alterar nome, telefone ou bairro.
5. Salvar.

Resultado esperado:

- Documento `users/{uid}` atualizado.
- Campo `updatedAt` atualizado.
- Dados aparecem corrigidos no Painel do Cidadao.

## Teste complementar: Peticoes

### Criar peticao

1. Acessar `/peticoes`.
2. Clicar em "Nova peticao".
3. Preencher titulo, categoria, meta e descricao.
4. Publicar.
5. Confirmar que a peticao aparece na lista.

Resultado esperado:

- Documento criado em `petitions`.
- `status` igual a `active`.
- `signaturesCount` igual a `0`.

### Assinar peticao

1. Clicar em "Assinar Agora".
2. Confirmar feedback de sucesso.
3. Ver contador subir.

Resultado esperado:

- Documento criado em `petition_signatures`.
- Campo `signaturesCount` incrementado na peticao.

### Impedir assinatura duplicada

1. Tentar assinar a mesma peticao novamente com o mesmo usuario.

Resultado esperado:

- App informa que o usuario ja assinou.
- Contador nao aumenta novamente.

## Pendencias depois dos testes

- Revisar mobile/web das paginas do MVP.
- Revisar visualmente em navegador real apos `npm.cmd run dev`.
- Testar visualmente o painel lateral de edicao de perfil no mobile.
- Limpar ou arquivar modulos fora do MVP.
