# Home Publica

Decisao registrada: 2026-05-22

## Decisao principal

A Home do Digital Santa Maria sera um portal publico da cidade.

Ela nao deve depender do usuario estar logado para fazer sentido. A primeira tela precisa explicar rapidamente o valor do portal e oferecer caminhos claros para as acoes principais.

## Separacao conceitual

### Home

Papel:

- Portal publico.
- Entrada principal do site.
- Acesso rapido a servicos essenciais.
- Apresentacao institucional e funcional.

### Painel do Cidadao

Papel:

- Area logada.
- Experiencia personalizada.
- Historico do usuario.
- Protocolos, perfil e atividades.

## Acoes principais da Home

Proposta inicial:

1. Abrir solicitacao.
2. Consultar protocolo.
3. Ver peticoes.
4. Entrar no Painel do Cidadao.

Decisao:

- O botao principal sera "Abrir solicitacao".
- "Relatar problema" pode aparecer como texto auxiliar ou categoria dentro do fluxo.

## Estrutura sugerida da Home

1. Hero publico
   - Nome: Digital Santa Maria.
   - Frase curta explicando o portal.
   - Botao principal: Abrir solicitacao.
   - Botao secundario: Painel do Cidadao.

2. Acoes rapidas
   - Ouvidoria/Relatar.
   - Consultar protocolo.
   - Peticoes.
   - Servicos.

3. Peticoes em destaque
   - Listagem curta de peticoes ativas.

4. Avisos ou comunicados
   - Conteudo publico da prefeitura, se existir fonte de dados.

5. Rodape institucional
   - Sobre, termos, privacidade e contato.

## Implementacao inicial aplicada

Arquivo alterado:

- `app/page.tsx`

Mudancas:

- A Home deixou de ser um dashboard pessoal/logado.
- A Home agora e uma pagina publica e estatica.
- Foram removidas dependencias de dados pessoais, modais de radar e estados client-side.
- O primeiro CTA aponta para `/ouvidoria` com o texto "Abrir solicitacao".
- O segundo CTA aponta para `/perfil` como "Painel do Cidadao".
- A primeira area de cards prioriza:
  - Abrir solicitacao.
  - Consultar protocolo.
  - Peticoes.
  - Painel do Cidadao.
- Os demais servicos aparecem como acesso secundario.
- O layout foi simplificado para funcionar melhor em mobile e desktop.

Validacao:

- `npm.cmd run build` passou.

## Perguntas pendentes

- O Painel do Cidadao deve usar a rota atual `/perfil` ou uma nova rota `/painel`?
- Consulta de protocolo deve ficar dentro de `/ouvidoria` ou ter uma rota propria?
- A Home deve mostrar muitos modulos ou apenas os essenciais do MVP?
