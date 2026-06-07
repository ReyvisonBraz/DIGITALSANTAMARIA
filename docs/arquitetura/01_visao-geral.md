# Visao Geral — Conecta Santa Maria

## O que e

Portal digital do cidadao de Santa Maria do Para. Plataforma web progressiva (PWA) que conecta moradores aos servicos publicos municipais.

## Funcionalidades principais

### Para o Cidadao
- **Relatar problemas** urbanos (infraestrutura, meio ambiente, seguranca) com foto e localizacao
- **Ouvidoria** — abrir manifestacoes (reclamacao, sugestao, denuncia, elogio) com protocolo
- **Petições** — criar e assinar abaixo-assinados online
- **Saude** — visualizar unidades de saude, agendar consultas
- **Educacao** — consultar escolas, realizar matriculas
- **Empregos** — banco de talentos com candidatura online
- **Comercio local** — cadastrar e visualizar negocios da cidade
- **Eventos, Obras, Avisos** — consulta de conteudo municipal
- **Votacoes** — participar de enquetes publicas
- **Seguranca** — alertas de emergencia e zonas seguras
- **Transito, Tributos, Social, Meio Ambiente, Comunidade, Servicos** — catalogos informativos
- **Painel do cidadao** — acompanhar historico de demandas, relatos, agendamentos, notificacoes

### Para o Administrador/Gestor
- **Painel de gestao** com visao geral de filas (demandas, relatos, emergencias, matriculas)
- **Gestao de conteudo** — publicar/editar/arquivar avisos, eventos, obras, comercios, vagas, etc.
- **Gestao de usuarios** — visualizar e editar perfis de cidadaos
- **Resposta a demandas e relatos** — atualizar status, responder com mensagens
- **Aprovacao** — revisar e aprovar comercios cadastrados, matriculas, candidaturas

## Modelo de dados

Toda persistencia via **Firebase Firestore** no client-side (SDK Web). Cloud Functions para operacoes atomicas (assinatura de abaixo-assinados, votacao).

- 22+ colecoes no Firestore
- 4 listeners em tempo real (notifications, demands, reports, businesses)
- Sistema de notificacoes integrado entre cidadao e gestao

## Paginas

26 rotas no App Router do Next.js:
- 24 usam dados reais do Firestore
- 2 sao estaticas (`/sobre`, `/legal`)
