# Combinado de Trabalho - Reconstrucao do Digital Santa Maria

## Objetivo

Recomecar o projeto pela base, entendendo cada parte antes de alterar, remover ou consolidar codigo.

A meta nao e apenas "arrumar arquivos": e transformar o projeto em um site/app funcional, organizado e coerente, com cada modulo tendo finalidade clara, fluxo real e estrutura sustentavel.

## Como vamos trabalhar

1. Mapear o projeto atual.
2. Separar o que e codigo real, mock, documentacao, experimento, configuracao e legado.
3. Para cada pasta/modulo/tela importante, responder:
   - Qual e a finalidade?
   - Quem usa?
   - O que precisa funcionar de verdade?
   - O que pode ser removido, arquivado ou deixado para depois?
   - Quais dados precisa ler ou gravar?
4. Criar um plano por etapas antes de refatorar pesado.
5. Refatorar em blocos pequenos, verificando a cada etapa.

## Regras da reconstrucao

- Nao apagar codigo sem entender a finalidade.
- Nao misturar planejamento, mockups e codigo de producao.
- Separar claramente:
  - app real
  - componentes reutilizaveis
  - features por dominio
  - services de dados
  - tipos
  - documentacao
  - arquivos legados/experimentais
- Priorizar primeiro fazer o site funcionar de ponta a ponta.
- Depois melhorar design, performance, seguranca e automacoes.

## Perguntas que vamos responder juntos

Para cada area do sistema, vamos definir:

- Isso deve existir no produto final?
- E uma pagina publica, privada ou administrativa?
- Depende de login?
- Deve salvar dados no Firebase?
- Precisa aparecer no menu?
- Qual e a versao minima funcional?

## Primeira etapa sugerida

Criar um inventario real do projeto atual, classificando cada pasta:

- `app`
- `components`
- `features`
- `services`
- `lib`
- `types`
- `functions`
- `docs`
- `FINAL`
- `GUIA COMPLETO`
- `_ANALISE`
- `_PLANO_IMPLEMENTACAO`
- `_ACAO`

Depois disso, decidir a nova organizacao do projeto e iniciar a refatoracao.
