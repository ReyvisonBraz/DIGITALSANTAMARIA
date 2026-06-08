# Estrutura de Diretorios

```
DIGITALSANTAMARIA/
├── app/                          # 26 rotas Next.js (App Router)
│   ├── layout.tsx                # Providers: Auth, Toast, Accessibility, Notifications
│   ├── page.tsx                  # Home
│   ├── api/                      # API Routes (Gemini AI + logs)
│   │   ├── classify-report/      # POST — classifica tipo de relato via Gemini
│   │   ├── suggest-response/     # POST — sugere resposta para demanda via Gemini
│   │   └── logs/                 # POST/GET — log client-side
│   ├── relatar/                  # Relatar problema (Firestore)
│   ├── ouvidoria/                # Ouvidoria (Firestore)
│   ├── peticoes/                 # Petições + [id] (Firestore)
│   ├── saude/                    # Saúde (Firestore)
│   ├── educacao/                 # Educação + /matricula (Firestore)
│   ├── empregos/                 # Empregos (Firestore)
│   ├── comercio/                 # Comércio local (Firestore)
│   ├── eventos/                  # Eventos + [id] (Firestore)
│   ├── obras/                    # Obras + [id] (Firestore)
│   ├── avisos/                   # Avisos (Firestore)
│   ├── votos/                    # Votações (Firestore + Cloud Function)
│   ├── seguranca/                # Segurança (Firestore)
│   ├── transito/                 # Trânsito (Firestore)
│   ├── tributos/                 # Tributos (Firestore)
│   ├── social/                   # Social (Firestore)
│   ├── meio-ambiente/            # Meio Ambiente (Firestore)
│   ├── comunidade/               # Comunidade (Firestore)
│   ├── servicos/                 # Serviços públicos (Firestore)
│   ├── gestao/                   # Painel admin (Firestore)
│   ├── perfil/                   # Painel do cidadão (Firestore)
│   ├── sobre/                    # Estático
│   └── legal/                    # Estático
│
├── components/                   # Componentes reutilizaveis
│   ├── TopAppBar.tsx             # Barra superior (logo, busca, notificações, perfil)
│   ├── BottomNavBar.tsx          # Navegação mobile (5 abas)
│   ├── Footer.tsx                # Rodapé
│   ├── SearchModal.tsx           # Busca global (Cmd+K)
│   ├── NotificationsPanel.tsx    # Painel de notificações
│   ├── AlertBanner.tsx           # Banner de alertas/emergências
│   ├── ProfileSettingsPanel.tsx  # Painel de configurações do perfil
│   ├── AppointmentModal.tsx      # Modal de agendamento de saúde
│   ├── CreatePetitionModal.tsx   # Modal de criação de petição
│   ├── GlobalStatsModal.tsx      # Modal de estatísticas municipais
│   ├── HealthHistoryPanel.tsx    # Histórico de consultas
│   ├── InstallPrompt.tsx         # Prompt de instalação PWA
│   ├── Logo.tsx                  # Logo "Conecta Santa Maria"
│   ├── ScrollAmbience.tsx        # Efeito de cor ambiente no scroll
│   ├── ErrorBoundary.tsx         # Boundary de erro React
│   ├── IssueCard.tsx             # Card de problema relatado
│   ├── PetitionCard.tsx          # Card de petição
│   ├── ServiceCard.tsx           # Card de serviço
│   ├── ClinicCard.tsx            # Card de unidade de saúde
│   └── ui/                       # Primitivos de UI
│       ├── Button.tsx            # Botão com variantes (primary, secondary, ghost, danger)
│       ├── Modal.tsx             # Modal com overlay
│       ├── SidePanel.tsx         # Painel lateral deslizante
│       ├── ConfirmDialog.tsx     # Diálogo de confirmação
│       ├── EmptyState.tsx        # Estado vazio
│       ├── Skeleton.tsx          # Skeleton loading
│       ├── Counter.tsx           # Contador animado
│       ├── ContentPage.tsx       # Wrapper de página com estados
│       ├── ContentCard.tsx       # Card de conteúdo genérico
│       ├── ContentHero.tsx       # Hero de página
│       ├── Reveal.tsx            # Animação de entrada no scroll
│       └── TextReveal.tsx        # Revelação de texto palavra por palavra
│
├── features/                     # Componentes de dominio
│   ├── gestao/                   # Painel admin
│   │   ├── AdminAuditPanel.tsx   # Auditoria administrativa
│   │   ├── AdminOverview.tsx     # Dashboard de visão geral
│   │   ├── AdminSectionNav.tsx   # Navegação entre seções
│   │   ├── ContentAdminPanel.tsx # Painel mestre de conteúdo
│   │   ├── MetricsDashboard.tsx  # KPIs
│   │   ├── PetitionsAdminPanel.tsx # Gestão de petições
│   │   ├── StatusUpdater.tsx     # Atualizador de status de demandas
│   │   ├── ReportStatusUpdater.tsx # Atualizador de status de relatos
│   │   ├── UsersAdminPanel.tsx   # Gestão de usuários
│   │   └── content/              # Sub-painéis de conteúdo (14 arquivos)
│   │       ├── NoticesAdmin.tsx, EventsAdmin.tsx, WorksAdmin.tsx,
│   │       ├── BusinessesAdmin.tsx, TrafficAdmin.tsx, JobsAdmin.tsx,
│   │       ├── HealthUnitsAdmin.tsx, GenericCatalogAdmin.tsx,
│   │       ├── EmergencyAlertsAdmin.tsx, EnrollmentsAdmin.tsx,
│   │       ├── ApplicationsAdmin.tsx, AppointmentsAdmin.tsx,
│   │       ├── AdminQueueControls.tsx, ContentWorkflowControls.tsx
│   ├── relatar/                  # Relatar problema
│   │   ├── ReportForm.tsx        # Formulário multi-etapa
│   │   ├── ReportTimeline.tsx    # Timeline de mensagens
│   │   ├── PhotoUpload.tsx       # Upload de foto
│   │   └── LocationPicker.tsx    # Seletor de localização
│   ├── ouvidoria/                # Ouvidoria
│   │   ├── DemandForm.tsx        # Formulário de manifestação
│   │   ├── DemandTimeline.tsx    # Timeline de mensagens
│   │   └── ProtocolSearch.tsx    # Busca por protocolo
│   ├── perfil/                   # Perfil do cidadão
│   │   ├── ActivityHistory.tsx   # Histórico agregado de atividades
│   │   ├── AvatarUpload.tsx      # Upload de avatar
│   │   ├── EditProfileForm.tsx   # Edição de perfil
│   │   └── MyBusinessesSection.tsx # Meus negócios
│   ├── peticoes/                 # Petições
│   │   ├── SignatureButton.tsx   # Botão de assinar
│   │   └── SignatureProgress.tsx # Barra de progresso
│   ├── comercio/                 # Comércio
│   │   └── BusinessCard.tsx      # Card de negócio
│   ├── empregos/                 # Empregos
│   │   └── ApplicationModal.tsx  # Modal de candidatura
│   └── saude/                    # Saúde
│       └── WaitTimeBadge.tsx     # Badge de tempo de espera
│
├── services/                     # Camada de dados (14 arquivos)
│   ├── content.service.ts        # Factory genérico de CRUD
│   ├── reports.service.ts        # Relatos
│   ├── demands.service.ts        # Demandas (ouvidoria)
│   ├── petitions.service.ts      # Petições + assinaturas
│   ├── appointments.service.ts   # Agendamentos + unidades de saúde
│   ├── jobs.service.ts           # Vagas + candidaturas
│   ├── businesses.service.ts     # Comércios
│   ├── educacao.service.ts       # Matrículas
│   ├── emergency.service.ts      # Alertas de emergência
│   ├── polls.service.ts          # Votações (via Cloud Function)
│   ├── notifications.service.ts  # Notificações
│   ├── users.service.ts          # Usuários + roles
│   ├── storage.service.ts        # Upload de arquivos
│   └── admin-audit.service.ts    # Log de auditoria admin
│
├── lib/                          # Infraestrutura
│   ├── firebase.ts               # Init Firebase (singleton)
│   ├── auth-context.tsx          # AuthProvider + useAuth()
│   ├── toast-context.tsx         # ToastProvider + useToast()
│   ├── accessibility-context.tsx # AccessibilityProvider
│   ├── notifications-context.tsx # NotificationsProvider
│   ├── logger.ts                 # Logger estruturado
│   ├── utils.ts                  # cn() — classname utility
│   ├── constants/
│   │   └── navigation.ts         # Links de navegação (20 links, 5 bottom, etc.)
│   ├── firebase/
│   │   ├── converters.ts         # FirestoreDataConverters (12)
│   │   └── storage.ts            # uploadFile, deleteFile
│   ├── gemini/
│   │   └── gemini.ts             # classifyReport, suggestDemandResponse
│   ├── hooks/
│   │   ├── use-content.ts        # Hook generico para colecoes
│   │   ├── use-home-metrics.ts   # Metricas da home
│   │   ├── use-auth-guard.ts     # Protecao de rota
│   │   ├── use-firestore-doc.ts  # Documento Firestore
│   │   ├── use-mobile.ts         # Deteccao mobile
│   │   ├── use-click-outside.ts  # Clique fora
│   │   └── use-keyboard-shortcut.ts # Atalhos de teclado
│   └── utils/
│       ├── validators.ts         # CPF, email, telefone, CEP
│       ├── formatters.ts         # Data, moeda, protocolo, telefone
│       └── protocol.ts           # Geracao de protocolos
│
├── types/                        # Tipos TypeScript (13 modulos)
│   ├── index.ts                  # Barrel export
│   ├── common.types.ts           # GeoLocation, AsyncStatus, StorageFile
│   ├── user.types.ts             # UserRole, UserProfile, Department
│   ├── report.types.ts           # Report, ReportMessage, ReportStatus
│   ├── demand.types.ts           # Demand, DemandMessage, DemandCategory
│   ├── petition.types.ts         # Petition, PetitionSignature
│   ├── job.types.ts              # Job, JobApplication
│   ├── content.types.ts          # 13 content types (Work, Event, Notice, etc.)
│   ├── emergency.types.ts        # EmergencyAlert
│   ├── enrollment.types.ts       # Enrollment
│   ├── appointment.types.ts      # HealthUnit, Appointment
│   ├── notification.types.ts     # Notification
│   └── admin-audit.types.ts      # AdminAuditLog
│
├── functions/                    # Cloud Functions (Firebase)
│   └── src/
│       └── index.ts              # signPetitionCallable, votePollCallable
│
├── scripts/                      # Scripts
│   └── seed.ts                   # Seed de dados para Firestore
│
├── public/                       # Arquivos estaticos
├── firebase.json                 # Config Firebase
├── firestore.rules               # Regras de seguranca Firestore
├── firestore.indexes.json        # Indices compostos
├── storage.rules                 # Regras do Storage
├── firebase-blueprint.json       # Schema declarativo das colecoes
├── next.config.ts                # Config Next.js
├── tsconfig.json                 # Config TypeScript
├── package.json                  # Dependencias
└── vercel.json                   # Config Vercel
```
