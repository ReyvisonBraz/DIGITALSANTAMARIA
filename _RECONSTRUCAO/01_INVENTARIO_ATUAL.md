# Inventario Atual do Projeto

Data: 2026-05-22

Este inventario e o ponto de partida da reconstrucao. Ele classifica o que existe hoje antes de mover, apagar ou refatorar qualquer coisa.

## 1. Visao geral

O projeto atual e um app Next.js com App Router, React, TypeScript, Tailwind CSS, Firebase, Gemini e Cloud Functions.

Ele mistura quatro tipos de material:

- Produto real: paginas, componentes, services, tipos, Firebase e APIs.
- Prototipo/mock: telas prontas visualmente, mas com dados fixos ou acao apenas por toast.
- Planejamento/documentacao: blueprints, analises, planos e detalhamentos.
- Build/ambiente: `.next`, `node_modules`, configs, manifests e arquivos gerados.

## 2. Pastas principais

| Pasta | Papel atual | Classificacao inicial | Acao sugerida |
|---|---|---|---|
| `app` | Rotas e paginas do Next.js | Produto real + mock | Auditar rota por rota |
| `components` | Componentes globais e UI compartilhada | Produto real | Separar globais, UI base e componentes de dominio |
| `features` | Componentes por modulo | Produto real | Manter como camada de dominio |
| `services` | Acesso a Firebase/Firestore | Produto real | Validar contra telas e regras |
| `lib` | Infra compartilhada, Firebase, auth, utils, Gemini | Produto real | Manter, limpar duplicidades |
| `types` | Tipos TypeScript por dominio | Produto real | Validar com schema real |
| `functions` | Cloud Functions Firebase | Produto real/infra | Confirmar se sera usado no MVP |
| `public` | Manifest, service worker e icones | Produto real | Revisar PWA depois |
| `hooks` | Hook duplicado/legado | Possivel duplicidade | Comparar com `lib/hooks` |
| `scripts` | Seed e automacoes | Infra/dev | Validar utilidade |
| `docs` | Documentacao tecnica e detalhamentos | Documentacao | Manter como referencia |
| `FINAL` | Plano/modulos consolidados | Documentacao | Arquivar como referencia |
| `GUIA COMPLETO` | Mockups, HTMLs e screenshots | Prototipo/referencia visual | Mover mentalmente para legado/referencia |
| `_ANALISE` | Analises antigas | Documentacao historica | Manter, mas nao tratar como verdade atual |
| `_PLANO_IMPLEMENTACAO` | Plano por etapas antigo | Documentacao historica | Usar como fonte auxiliar |
| `_ACAO` | Roadmap | Planejamento | Comparar com novo plano |
| `_RECONSTRUCAO` | Novo plano vivo | Fonte de verdade atual | Centralizar decisoes daqui em diante |

## 3. Rotas atuais em `app`

### Rotas de produto/cidadao

- `/` - Home/dashboard.
- `/avisos` - Avisos.
- `/comercio` - Comercio local.
- `/comunidade` - Comunidade.
- `/educacao` - Educacao.
- `/educacao/matricula` - Matricula escolar.
- `/empregos` - Empregos.
- `/eventos` - Eventos.
- `/eventos/[id]` - Detalhe de evento.
- `/meio-ambiente` - Meio ambiente.
- `/obras` - Obras.
- `/obras/[id]` - Detalhe de obra.
- `/ouvidoria` - Demandas/ouvidoria.
- `/perfil` - Perfil do usuario.
- `/peticoes` - Peticoes.
- `/peticoes/[id]` - Detalhe de peticao.
- `/relatar` - Relatar problema.
- `/saude` - Saude.
- `/seguranca` - Seguranca.
- `/servicos` - Diretorio de servicos.
- `/social` - Social.
- `/transito` - Transito.
- `/tributos` - Tributos.
- `/votos` - Votacoes.

### Rotas institucionais

- `/sobre` - Sobre o portal.
- `/legal` - Privacidade/termos.

### Rotas administrativas e API

- `/gestao` - Gestao/admin.
- `/api/classify-report` - Classificacao por Gemini.
- `/api/suggest-response` - Sugestao por Gemini.
- `/api/logs` - Logs.

## 4. Componentes atuais

### Componentes globais

- `TopAppBar`
- `BottomNavBar`
- `Footer`
- `ErrorBoundary`
- `InstallPrompt`
- `AlertBanner`
- `SearchModal`
- `NotificationsPanel`
- `GlobalStatsModal`

### Componentes de dominio ainda em `components`

- `AppointmentModal` - Saude/agendamento.
- `HealthHistoryPanel` - Saude.
- `ClinicCard` - Saude.
- `CreatePetitionModal` - Peticoes.
- `PetitionCard` - Peticoes.
- `IssueCard` - Relatos/obras/ouvidoria.
- `ProfileSettingsPanel` - Perfil.
- `ServiceCard` - Servicos.

### UI base em `components/ui`

- `Button`
- `ConfirmDialog`
- `ContentCard`
- `ContentHero`
- `ContentPage`
- `EmptyState`
- `Modal`
- `SidePanel`
- `Skeleton`

## 5. Features atuais

- `features/empregos` - Modal de candidatura.
- `features/gestao` - Dashboard/admin e atualizacao de status.
- `features/ouvidoria` - Formulario de demanda e busca por protocolo.
- `features/perfil` - Edicao de perfil, avatar, historico.
- `features/peticoes` - Botao de assinatura e progresso.
- `features/relatar` - Upload de foto e seletor de localizacao.
- `features/saude` - Badge de espera e hook de unidades de saude.

## 6. Services atuais

- `appointments.service.ts` - Agendamentos e unidades de saude.
- `content.service.ts` - Conteudo/avisos.
- `demands.service.ts` - Ouvidoria/demandas.
- `educacao.service.ts` - Matriculas.
- `jobs.service.ts` - Vagas e candidaturas.
- `petitions.service.ts` - Peticoes e assinaturas.
- `reports.service.ts` - Relatos.
- `storage.service.ts` - Upload/Storage.
- `users.service.ts` - Perfil de usuario.

## 7. Diagnostico inicial

O projeto nao precisa ser jogado fora. Ele tem uma base aproveitavel:

- Rotas ja existem.
- Design visual ja existe.
- Camada de services ja comeca a existir.
- Tipos estao separados por dominio.
- Firebase/Auth ja esta centralizado.
- Algumas features ja chamam services reais.

O problema principal e organizacao e decisao de produto:

- Muitas telas existem sem sabermos se entram no MVP.
- Alguns componentes de dominio estao misturados em `components`.
- Algumas documentacoes antigas nao refletem o codigo atual.
- O app provavelmente tem fluxos reais misturados com mocks.
- Falta uma ordem clara de implementacao.

## 8. Proposta de nova classificacao mental

Antes de mover arquivos, vamos trabalhar com estas caixas:

### Produto essencial

O minimo para o site funcionar:

- Home.
- Login/perfil.
- Ouvidoria ou Relatar.
- Peticoes.
- Saude/agendamento, se for prioridade.
- Gestao/admin minima.

### Produto secundario

Modulos que podem existir depois:

- Empregos.
- Educacao/matricula.
- Tributos.
- Transito.
- Obras.
- Eventos.
- Comercio.
- Comunidade.
- Social.
- Meio ambiente.
- Seguranca.
- Votos.

### Infra obrigatoria

- Firebase config.
- Auth.
- Firestore services.
- Rules/schema.
- Types.
- Layout global.
- UI base.

### Referencia/legado

- `GUIA COMPLETO`
- `FINAL`
- `_ANALISE`
- `_PLANO_IMPLEMENTACAO`
- Docs antigos que nao forem atualizados.

## 9. Proxima decisao

Antes da refatoracao fisica, precisamos decidir o MVP.

Pergunta central:

Quais modulos devem funcionar primeiro de verdade?

Minha sugestao de ordem:

1. Base do app: layout, auth, Firebase, menus, rotas sem erro.
2. Perfil do cidadao.
3. Ouvidoria/Relatar como fluxo principal de solicitacao.
4. Gestao/admin para responder e alterar status.
5. Peticoes.
6. Saude/agendamentos.
7. Demais modulos como paginas informativas ou futuras.
