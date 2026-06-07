# Componentes UI — Referencia

30 componentes (19 globais + 12 primitivos em `ui/`).

---

## Componentes Globais (`components/`)

| Componente | Descricao | Estados |
|---|---|---|
| `TopAppBar` | Barra superior com logo, busca (Cmd+K), notificacoes (badge), acessibilidade, menu usuario | Autenticado / nao autenticado |
| `BottomNavBar` | Navegacao mobile fixa no rodape: Home, Solicitacoes, Protocolo, Peticoes, Painel | 5 abas com highlight ativo |
| `Footer` | Rodape com logo, copyright, links | — |
| `SearchModal` | Busca global estilo command palette (Cmd+K) | Aberto/fechado, com/sem resultados |
| `NotificationsPanel` | Painel lateral com lista de notificacoes, icone por tipo, tempo relativo, badge nao lida | Com/sem notificacoes |
| `AlertBanner` | Banner de alerta/emergencia dismissivel, busca notices tipo `alerta` ou `urgencia` | Visivel/fechado, expandido/colapsado |
| `ProfileSettingsPanel` | Painel lateral: AvatarUpload + EditProfileForm + preferencias + links | — |
| `AppointmentModal` | Modal multi-etapa para agendar consulta: unidade → especialidade → data/hora → confirmar | Etapas 1-4 |
| `CreatePetitionModal` | Modal multi-etapa para criar abaixo-assinado: titulo → categoria → descricao → meta → capa | Etapas 1-5 |
| `GlobalStatsModal` | Modal com estatisticas municipais e contadores animados | — |
| `HealthHistoryPanel` | Painel lateral com historico de consultas do cidadao | Com/sem consultas |
| `InstallPrompt` | Card flutuante para instalar PWA na tela inicial | Visivel/instalado/fechado |
| `Logo` | SVG "Conecta Santa Maria" com nodulo dourado animado | — |
| `ScrollAmbience` | Efeito de cor ambiente que transita no scroll (terracota → dourado → verde) | Respeita `prefers-reduced-motion` |
| `ErrorBoundary` | Boundary de erro React com UI amigavel, botao reload, log para `/api/logs` | Erro capturado |
| `IssueCard` | Card de problema relatado: titulo, categoria, descricao, local, votos, status | — |
| `PetitionCard` | Card de peticao: titulo, categoria, progresso assinaturas, capa | — |
| `ServiceCard` | Card clicavel com icone, titulo e descricao | — |
| `ClinicCard` | Card de unidade de saude: nome, endereco, tempo de espera colorido | — |

---

## Primitivos de UI (`components/ui/`)

| Componente | Descricao | Variantes |
|---|---|---|
| `Button` | Botao reutilizavel | `primary` (gradiente), `secondary` (outlined), `ghost`, `danger`; loading spinner |
| `Modal` | Modal centralizado com overlay blur, animacao framer-motion, scroll lock | — |
| `SidePanel` | Painel lateral deslizante da direita com overlay, scroll lock, botao voltar | — |
| `ConfirmDialog` | Dialogo de confirmacao (wrapper de Modal): titulo, descricao, confirmar/cancelar | `danger`, `default` |
| `EmptyState` | Estado vazio: icone inbox, titulo, descricao, botao acao opcional | — |
| `Skeleton` | Skeleton loading com animacao pulse | `line` (h-4), `card` (h-32), `avatar` (circle), `page` (h-96) |
| `Counter` | Contador animado (0 → N) ao entrar no viewport, prefixo/sufixo | Duracao configuravel |
| `ContentPage` | Wrapper universal: loading (spinner), error (alerta + retry), empty (mensagem), success (children) | 4 estados |
| `ContentCard` | Card generico que adapta a qualquer tipo: imagem + fallback, status badge, data, endereco, telefone, acao | — |
| `ContentHero` | Hero de pagina com chip de categoria, titulo, subtitulo, cores de acento por categoria | Cores: primary, secondary, accent, success, navy |
| `Reveal` | Animacao de entrada no scroll com framer-motion | 5 direcoes: up/down/left/right/none; delay, distancia |
| `TextReveal` | Revelacao de texto palavra por palavra com stagger no scroll | — |
