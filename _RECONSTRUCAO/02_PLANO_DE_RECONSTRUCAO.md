# Plano de Reconstrucao

Este plano sera ajustado conforme as respostas sobre a finalidade de cada modulo.

## Fase 0 - Entendimento e decisoes

Status: em andamento.

Objetivo: definir o que o produto precisa ser antes de refatorar pesado.

Tarefas:

- [x] Criar combinado de trabalho.
- [x] Criar inventario atual.
- [x] Definir MVP.
- [ ] Classificar cada rota como essencial, secundaria, informativa ou arquivavel.
- [ ] Definir quais fluxos precisam salvar dados.
- [ ] Definir quais paginas exigem login.
- [ ] Definir quais paginas aparecem no menu principal.

## Fase 1 - Limpeza estrutural sem quebrar o app

Objetivo: organizar sem mudar comportamento.

Tarefas:

- [x] Conferir build atual.
- [x] Corrigir raiz do Turbopack no `next.config.ts`.
- [x] Remover dependencia de download externo de Google Fonts no build.
- [ ] Corrigir problemas basicos de script/config, se existirem.
- [ ] Separar componentes globais de componentes de dominio.
- [ ] Identificar hooks duplicados.
- [ ] Marcar dados mockados.
- [x] Criar um mapa de rotas oficial.
- [ ] Criar regras de responsividade para mobile e web.

## Fase 2 - Base funcional

Objetivo: garantir que o app abra, navegue e autentique corretamente.

Tarefas:

- [ ] Validar layout global.
- [ ] Validar TopAppBar e BottomNavBar.
- [ ] Validar Firebase config.
- [ ] Validar login/logout.
- [ ] Validar criacao/sincronizacao de usuario.
- [x] Validar pagina de perfil minima.
- [x] Transformar Home em portal publico do MVP.

## Fase 3 - Fluxo principal do cidadao

Objetivo: fazer o cidadao abrir uma solicitacao e consultar andamento.

Tarefas:

- [x] Escolher se o fluxo principal sera `relatar`, `ouvidoria` ou ambos.
- [ ] Unificar conceitos de `reports` e `demands`, se necessario.
- [x] Criar formulario minimo funcional.
- [x] Salvar no Firestore.
- [x] Consultar por protocolo.
- [x] Mostrar historico no perfil.

## Fase 4 - Gestao/admin

Objetivo: permitir que alguem da prefeitura veja e responda solicitacoes.

Tarefas:

- [x] Definir roles: cidadao, atendente, admin.
- [x] Remover qualquer permissao hardcoded.
- [x] Listar demandas/relatos reais.
- [x] Atualizar status.
- [x] Registrar resposta oficial.

## Fase 5 - Modulos prioritarios

Objetivo: transformar modulos escolhidos em funcionais.

Candidatos:

- Peticoes. Status: MVP funcional inicial concluido.
- Saude/agendamentos.
- Educacao/matricula.
- Empregos/candidaturas.

Cada modulo deve responder:

- Existe no MVP?
- Quem usa?
- Precisa login?
- Quais colecoes usa?
- Qual e a versao minima funcional?

## Fase 6 - Modulos informativos/futuros

Objetivo: manter paginas bonitas sem prometer funcionalidade falsa.

Candidatos:

- Comercio.
- Eventos.
- Obras.
- Tributos.
- Transito.
- Seguranca.
- Meio ambiente.
- Social.
- Comunidade.
- Votos.
- Avisos.
- Servicos.

Opcoes:

- Manter como pagina informativa.
- Integrar ao Firestore.
- Esconder do menu.
- Arquivar para fase futura.

## Fase 7 - Qualidade e publicacao

Objetivo: deixar pronto para uso real.

Tarefas:

- [x] Revisar regras Firestore.
- [ ] Revisar `.env.example`.
- [ ] Remover credenciais reais do codigo versionado.
- [ ] Validar PWA.
- [ ] Revisar layout mobile e desktop das paginas do MVP.
- [ ] Rodar build.
- [ ] Testar rotas principais.
- [ ] Criar checklist de deploy.

## MVP definido

MVP inicial aprovado:

1. Home funcional.
2. Login Google.
3. Perfil do cidadao.
4. Ouvidoria/Relatar com protocolo.
5. Gestao/admin para responder solicitacoes.
6. Peticoes.

Saude, educacao, empregos, tributos, obras, eventos e demais modulos ficam para uma rodada posterior, salvo se forem necessarios para apoiar algum fluxo essencial.
