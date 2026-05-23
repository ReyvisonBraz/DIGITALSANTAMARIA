# Checklist de Teste do MVP

Data: 2026-05-23

## Fluxo confirmado

- [x] Login funciona.
- [x] Usuario admin consegue acessar `/gestao`.
- [x] Cidadao abre solicitacao em `/ouvidoria`.
- [x] Solicitacao aparece no historico do Painel do Cidadao.
- [x] Admin responde solicitacao em `/gestao`.
- [x] Cidadao consulta protocolo e ve a resposta.

## Proximo teste: Peticoes

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
- Adicionar link de Gestao somente para admin/clerk no topo.
- Decidir destino da rota `/relatar`.
- Limpar ou arquivar modulos fora do MVP.
