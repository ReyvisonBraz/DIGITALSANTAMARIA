# Plano do Painel de Gestao Profissional

Este documento e o backlog vivo para transformar `/gestao` em uma central administrativa mais completa, organizada e confiavel. A ideia e planejar antes de produzir, marcar prioridades e depois implementar por blocos sem perder contexto.

## Objetivo

Criar um painel de gestao municipal com qualidade de sistema operacional real: rapido para atender protocolos, claro para acompanhar filas, seguro para editar dados publicos, confiavel para o Firebase e agradavel para uso diario por administradores e atendentes.

## Estado Atual

Ja existe:

- Login administrativo com controle por `admin` e `clerk`.
- Secoes principais do painel: solicitacoes, relatos, conteudo, peticoes e usuarios.
- Abas de conteudo para avisos, eventos, obras, comercio, transito, saude, consultas, farmacia, vagas, candidaturas, educacao, matriculas, comunidade, seguranca, emergencias, ambiente, social, tributos, votos e servicos.
- Integracao com Firestore para varias colecoes reais.
- Atualizacao de status em solicitacoes, relatos, agendamentos, candidaturas, matriculas e emergencias.
- Notificacoes para algumas mudancas de status.
- Regras e indices do Firestore ja publicados.
- Cloud Function para incrementar contador de candidaturas em vagas.

Ainda precisa evoluir:

- O painel ainda esta muito espalhado em abas e listas independentes.
- Faltam filtros, busca, contadores e ordenacao consistentes em todas as filas.
- Faltam telas de detalhe mais completas.
- Faltam auditoria, historico administrativo e confirmacoes para acoes importantes.
- Faltam padroes de permissao mais finos entre administrador e atendente.
- Faltam dados iniciais organizados para varias colecoes.
- Faltam testes profundos de fluxo com admin e cidadao comum.

## Principios de Produto

- O operador deve ver primeiro o que precisa de acao.
- Toda fila deve ter busca, filtros, status, prioridade e contagem.
- Toda acao administrativa importante deve ser rastreavel.
- O painel nao deve misturar cadastro publico com atendimento operacional sem organizacao.
- O sistema deve proteger dados sensiveis e evitar alteracao acidental.
- Cada modulo deve ter estado vazio, carregando, erro e sucesso bem tratados.
- O painel precisa funcionar bem em desktop e aceitavelmente em mobile.

## Nova Organizacao Sugerida

### 1. Visao Geral

Primeira tela do painel depois do login.

Deve mostrar:

- Protocolos pendentes.
- Relatos pendentes.
- Agendamentos pendentes.
- Matriculas pendentes.
- Candidaturas pendentes.
- Alertas emergenciais ativos.
- Conteudos em rascunho ou vencidos.
- Indicadores por modulo.
- Atalhos para as filas mais urgentes.

Prioridade: alta.

### 2. Atendimento

Central para coisas que exigem resposta a cidadao.

Inclui:

- Solicitacoes da ouvidoria.
- Relatos urbanos.
- Agendamentos.
- Matriculas.
- Candidaturas.
- Alertas emergenciais.

Melhorias:

- Busca global da fila.
- Filtro por status.
- Filtro por periodo.
- Filtro por categoria.
- Ordenacao por urgencia, data e status.
- Cartao de detalhe com historico.
- Campo de resposta administrativa.
- Botao para copiar protocolo.
- Mudanca de status com confirmacao quando for finalizar/recusar.

Prioridade: alta.

### 3. Conteudo Publico

Central para tudo que aparece nas paginas publicas.

Inclui:

- Avisos.
- Eventos.
- Obras.
- Comercios.
- Transito.
- Farmacia.
- Escolas.
- Comunidade.
- Seguranca.
- Meio ambiente.
- Social.
- Tributos.
- Enquetes.
- Servicos publicos.

Melhorias:

- Separar `Publicar`, `Rascunho`, `Arquivado` e `Expirado`.
- Preview antes de publicar.
- Validacao dos campos obrigatorios por tipo.
- Imagem com validacao de URL e fallback.
- Duplicar item existente.
- Arquivar sem deletar.
- Indicador de onde o item aparece no site.

Prioridade: alta.

### 4. Cadastros Mestres

Base de dados mais estavel do municipio.

Inclui:

- Unidades de saude.
- Escolas.
- Departamentos.
- Locais publicos.
- Categorias de atendimento.
- Tipos de servico.
- Usuarios administrativos.

Melhorias:

- Padronizar formularios.
- Evitar duplicidade.
- Exibir dependencias antes de remover/arquivar.
- Definir quem pode editar cada cadastro.

Prioridade: media.

### 5. Usuarios e Permissoes

Controle de acesso administrativo.

Papeis sugeridos:

- `admin`: acesso total.
- `clerk`: atendimento operacional, sem cadastros sensiveis.
- `editor`: conteudo publico, sem usuarios e sem filas sensiveis.
- `viewer`: somente leitura.

Melhorias:

- Tela para listar admins/atendentes.
- Alterar papel com confirmacao.
- Mostrar ultimo acesso quando disponivel.
- Bloquear acoes sensiveis no front e no Firestore rules.

Prioridade: media.

### 6. Auditoria

Historico de acoes administrativas.

Deve registrar:

- Quem alterou.
- O que alterou.
- Colecao/documento.
- Valor anterior e novo quando fizer sentido.
- Data/hora.
- Motivo opcional em acoes sensiveis.

Colecao sugerida:

- `admin_audit_logs`

Acoes que devem gerar log:

- Mudanca de status.
- Publicacao/arquivamento.
- Edicao de conteudo publico.
- Alteracao de permissao.
- Exclusao ou arquivamento.

Prioridade: media/alta.

### 7. Notificacoes

Centralizar notificacoes para cidadaos e admins.

Melhorias:

- Notificacao para resposta de protocolo.
- Notificacao para agendamento atualizado.
- Notificacao para candidatura atualizada.
- Notificacao para matricula atualizada.
- Notificacao para alerta emergencial atualizado.
- Notificacao interna para admin quando chegar item urgente.

Prioridade: media.

### 8. Firebase e Backend

Melhorias necessarias:

- Revisar regras por papel.
- Criar indices conforme filtros novos.
- Criar seed controlado para dados iniciais.
- Evitar contadores manipulados no cliente.
- Criar Cloud Functions para logs e contadores quando necessario.
- Padronizar timestamps e campos `createdAt`, `updatedAt`, `createdBy`, `updatedBy`.

Prioridade: alta para regras/indices; media para automacoes.

### 9. Qualidade Visual e UX

Melhorias:

- Layout mais denso e profissional.
- Navegacao lateral ou agrupamento por modulo.
- Header fixo com busca e resumo.
- Estados vazios melhores.
- Loading skeleton por lista.
- Badges de status consistentes.
- Tabelas responsivas quando fizer sentido.
- Cards apenas onde ajudam; filas operacionais podem ser mais compactas.
- Menos abas horizontais longas em uma unica linha.

Prioridade: alta.

### 10. Testes

Testes manuais obrigatorios:

- Login admin.
- Login usuario comum.
- Usuario comum bloqueado em `/gestao`.
- Criar aviso.
- Criar evento.
- Criar obra.
- Criar comercio.
- Criar unidade de saude.
- Criar medicamento.
- Criar escola.
- Criar vaga.
- Cidadao enviar solicitacao.
- Cidadao enviar relato.
- Cidadao agendar consulta.
- Cidadao se candidatar a vaga.
- Cidadao enviar matricula.
- Cidadao enviar emergencia.
- Admin mudar status de cada fila.
- Usuario receber notificacao/historico.

Testes automatizados sugeridos:

- Smoke de rotas principais.
- Smoke de `/gestao`.
- Validacao de console sem erros criticos.
- Teste de permissao Firestore para usuario comum.
- Teste de formulario generico de catalogo.
- Teste de Cloud Function de contadores.

Prioridade: alta.

## Fases de Implementacao

### Fase 1 - Base profissional do painel

- Reorganizar navegacao do painel.
- Criar visao geral com indicadores reais.
- Padronizar filtros, busca, status e ordenacao.
- Melhorar filas de atendimento.
- Melhorar componentes administrativos novos.

Resultado esperado: painel fica mais facil de operar no dia a dia.

#### Detalhamento da Fase 1

Entregas de interface:

- Criar uma aba inicial `Visao geral`.
- Mostrar cards de operacao com pendencias por area.
- Mostrar atalhos para filas criticas.
- Separar melhor `Atendimento`, `Conteudo`, `Participacao` e `Administracao`.
- Reduzir dependencia de uma linha longa de abas para tudo.
- Manter os fluxos atuais funcionando enquanto a estrutura evolui.

Entregas de fila:

- Solicitacoes: busca, status, categoria, ordenacao, contador, cards compactos e conversa por protocolo ja existem.
- Relatos: busca, status, contador, cards compactos, foto/localizacao no detalhe e conversa por relato ja existem.
- Consultas: adicionar busca, contador por status e botao atualizar.
- Candidaturas: adicionar busca, contador por status e botao atualizar.
- Matriculas: adicionar busca, contador por status e botao atualizar.
- Emergencias: adicionar busca, contador por status e destaque de ativos.

Componentes provaveis:

- `AdminOverview`: resumo operacional do painel.
- `AdminSectionNav`: navegacao principal mais clara.
- `AdminQueueToolbar`: padrao reutilizavel para busca, filtro e atualizar.
- `AdminStatusSummary`: chips/cartoes compactos por status.

Criterios de pronto da Fase 1:

- `/gestao` abre primeiro em uma visao geral util.
- O admin consegue identificar rapidamente o que esta pendente.
- As filas principais continuam editaveis.
- As novas buscas nao exigem novos indices desnecessarios.
- `lint` e `build` passam.

### Fase 2 - Conteudo publico com workflow

- Padronizar status: rascunho, publicado, arquivado e expirado.
- Adicionar preview.
- Melhorar validacoes.
- Melhorar obras, eventos, avisos e comercio.
- Adicionar duplicar/arquivar.

Resultado esperado: prefeitura consegue manter o site sem quebrar dados.

### Fase 3 - Permissoes, auditoria e seguranca

- Refinar papeis.
- Criar logs administrativos.
- Ajustar regras do Firestore.
- Adicionar confirmacoes para acoes sensiveis.

Resultado esperado: painel mais confiavel e rastreavel.

### Fase 4 - Dados iniciais e integracao Firebase

- Criar seed seguro.
- Popular colecoes sem apagar dados reais.
- Revisar indices.
- Adicionar automacoes com Cloud Functions onde fizer sentido.

Resultado esperado: sistema com conteudo realista e consistente.

### Fase 5 - Testes profundos e acabamento

- Rodar testes manuais completos.
- Rodar lint/build.
- Testar com navegador.
- Corrigir console errors.
- Ajustar responsividade.

Resultado esperado: painel pronto para uso continuo.

## Checklist de Prioridade Inicial

- [x] Criar visao geral operacional.
- [x] Melhorar navegacao do painel.
- [x] Reescrever `app/gestao/page.tsx` de forma controlada para reduzir acoplamento, limpar textos quebrados e separar secoes internas.
- [x] Agrupar abas de conteudo por Publicacao, Atendimento, Cadastros e Participacao.
- [x] Fazer a visao geral abrir diretamente filas especificas de conteudo.
- [x] Padronizar filtros nas filas iniciais de consultas, candidaturas, matriculas e emergencias.
- [x] Padronizar controles de atendimento em solicitacoes e relatos.
- [x] Adicionar copiar protocolo em solicitacoes e relatos.
- [x] Criar workflow inicial de conteudo publico com status `published`, `draft`, `pending_approval` e `archived`.
- [x] Aplicar status editorial em avisos, eventos, obras e comercio.
- [x] Separar listagem publica de listagem administrativa no servico generico de conteudo.
- [x] Corrigir contraste de opcoes selecionadas/ativas no painel com classes reutilizaveis do design system.
- [x] Adicionar filtros por status em avisos, eventos, obras e comercio.
- [x] Adicionar acoes rapidas de publicar, rascunho, reativar e arquivar no workflow editorial.
- [x] Adicionar preview reutilizavel para avisos, eventos, obras e comercio.
- [x] Adicionar busca e ordenacao reutilizavel em listas editoriais principais.
- [x] Criar base de auditoria administrativa em `admin_audit_logs`.
- [x] Registrar auditoria nas acoes rapidas editoriais de avisos, eventos, obras e comercio.
- [x] Padronizar cards de solicitacoes para formato compacto com detalhe expansivel.
- [x] Criar base de conversa de solicitacoes em `demand_messages`.
- [x] Exibir conversa no painel gestor e na consulta publica de protocolo.
- [x] Permitir resposta do cidadao autenticado no proprio protocolo nao anonimo.
- [x] Padronizar cards de relatos para formato compacto com detalhe expansivel.
- [x] Criar base de conversa de relatos em `report_messages`.
- [x] Exibir conversa de solicitacoes e relatos no Painel do Cidadao.
- [ ] Padronizar cards/tabelas das demais filas de atendimento para formato mais compacto quando houver alto volume.
- [ ] Melhorar abas de conteudo mais importantes: avisos, eventos, obras e comercio.
- [x] Adicionar contadores por status nas filas iniciais.
- [x] Adicionar botao de atualizar nas filas iniciais.
- [x] Adicionar confirmacao em finalizar/recusar/arquivar nas filas principais.
- [ ] Criar base de auditoria.
- [ ] Revisar regras do Firestore por papel.
- [ ] Criar seed inicial seguro.
- [ ] Testar fluxo admin e cidadao.

## Definicao de Pronto

Uma etapa so deve ser considerada pronta quando:

- `npm.cmd run lint` passar.
- `npm.cmd run build` passar.
- A rota alterada abrir no navegador.
- Console nao mostrar erro critico novo.
- O fluxo principal for testado pelo menos uma vez.
- Firestore rules e indexes estiverem coerentes com as novas consultas.
- O plano for atualizado com o que foi concluido.

## Decisoes Pendentes

- Definir se a navegacao principal sera lateral, topo segmentado ou hibrida.
- Definir se `clerk` pode editar conteudo publico ou apenas responder filas.
- Definir se itens serao deletados ou apenas arquivados.
- Definir quais modulos precisam de anexos/imagens via Storage.
- Definir se o painel tera dashboard com graficos agora ou depois.

## Primeira Entrega Recomendada

Comecar pela Fase 1:

1. Criar uma visao geral operacional em `/gestao`.
2. Agrupar melhor as secoes do painel.
3. Padronizar filtros e contadores nas filas de atendimento.
4. Melhorar a experiencia das filas de agendamentos, candidaturas, matriculas e emergencias.

Isso entrega ganho real rapido sem mexer ainda em regras mais sensiveis.
