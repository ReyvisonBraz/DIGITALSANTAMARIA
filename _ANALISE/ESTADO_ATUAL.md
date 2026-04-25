# Estado Atual do Projeto — Digital Santa Maria

> Análise profunda gerada em: Abril 2026  
> Baseada em leitura linha a linha de todos os arquivos do projeto.

---

## 1. Tipo de Aplicação

Aplicação web **frontend-heavy** com Next.js 15 + React 19 RC. Hospedada no Google Cloud Run via AI Studio. **Não possui backend próprio** — toda a persistência deveria ocorrer via SDK do Firebase no client-side, mas na prática só uma página (`/relatar`) realmente grava dados.

> **Diagnóstico central**: O projeto é um protótipo de UI altamente refinado com uma única conexão real ao banco de dados.

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão | Observação |
|---|---|---|---|
| Framework Web | Next.js (App Router) | 15.0.0 | Estável |
| UI Library | React | 19.0.0-rc.1 | **RC — não é versão estável** |
| Linguagem | TypeScript | 5.0.0 | Strict mode ativado |
| Estilização | Tailwind CSS | 4.2.4 | PostCSS configurado |
| Animações | Motion (Framer) | 11.0.0 | Transpilado no next.config |
| Ícones | Lucide React | 1.9.0 | |
| Gráficos | Recharts + D3 | 2.10 / 7.8 | Incluídos mas uso limitado |
| Autenticação | Firebase Auth | 12.12.1 | Google OAuth via popup |
| Banco de Dados | Firestore | Firebase 12.12.1 | Configurado, subutilizado |
| Armazenamento | Firebase Storage | Firebase 12.12.1 | Configurado, não usado |
| Deploy | Google Cloud Run | Standalone output | `output: 'standalone'` |

---

## 3. Estrutura de Arquivos

```
/DIGITALSANTAMARIA
├── /app                       → 22+ rotas Next.js (App Router)
│   ├── layout.tsx             → Providers: Auth, Toast, Accessibility
│   ├── page.tsx               → Home dashboard (dados mock)
│   ├── /saude                 → Saúde (mock)
│   ├── /educacao              → Educação + /matricula (form sem persistência)
│   ├── /transito              → Trânsito (mock)
│   ├── /tributos              → Tributos (mock)
│   ├── /empregos              → Empregos (mock)
│   ├── /comercio              → Comércio (mock)
│   ├── /comunidade            → Comunidade (mock, sugestão descartada)
│   ├── /obras                 → Obras + /[id] (mock)
│   ├── /eventos               → Eventos + /[id] (mock)
│   ├── /ouvidoria             → Ouvidoria (sem persistência + busca hardcoded)
│   ├── /peticoes              → Petições + /[id] (sem persistência)
│   ├── /relatar               → ✅ ÚNICA página com escrita real no Firestore
│   ├── /seguranca             → Segurança (mock)
│   ├── /meio-ambiente         → Meio Ambiente (mock)
│   ├── /social                → Social (mock)
│   ├── /gestao                → Admin (acesso por e-mail hardcoded, sem persistência)
│   ├── /avisos                → Avisos (mock)
│   ├── /votos                 → Votações (mock)
│   ├── /servicos              → Diretório de serviços (mock)
│   ├── /perfil                → Perfil (form sem persistência)
│   ├── /legal                 → Conteúdo estático
│   └── /sobre                 → Conteúdo estático
│
├── /components                → 15+ componentes reutilizáveis
│   ├── TopAppBar.tsx          → Barra de navegação superior
│   ├── BottomNavBar.tsx       → Navegação mobile (inferior)
│   ├── Footer.tsx             → Rodapé
│   ├── AlertBanner.tsx        → Banner de alertas (mock)
│   ├── SearchModal.tsx        → Busca global (UI apenas, sem lógica)
│   ├── NotificationsPanel.tsx → Painel de notificações (UI apenas)
│   ├── ProfileSettingsPanel.tsx → Perfil (form sem salvar)
│   ├── GlobalStatsModal.tsx   → Estatísticas (dados hardcoded)
│   ├── HealthHistoryPanel.tsx → Histórico de saúde (mock)
│   ├── AppointmentModal.tsx   → Agendamento (modal sem persistência)
│   ├── CreatePetitionModal.tsx → Criar petição (form sem Firestore)
│   ├── PetitionCard.tsx       → Card de petição
│   ├── IssueCard.tsx          → Card de problema
│   ├── ClinicCard.tsx         → Card de clínica
│   ├── ServiceCard.tsx        → Card de serviço
│   └── /ui
│       ├── Modal.tsx          → Modal primitivo reutilizável
│       └── SidePanel.tsx      → Painel lateral primitivo
│
├── /lib
│   ├── firebase.ts            → Init Firebase + handleFirestoreError()
│   ├── auth-context.tsx       → AuthProvider + useAuth() hook
│   ├── accessibility-context.tsx → Font size, contrast, layout scale
│   ├── toast-context.tsx      → Sistema de toast (totalmente funcional)
│   └── utils.ts               → cn() para Tailwind
│
├── /hooks
│   └── use-mobile.ts          → Hook responsivo (< 768px)
│
├── /docs                      → Documentação técnica
├── /FINAL                     → Especificações modulares (01–07)
├── /GUIA COMPLETO             → Mockups e guias de design
├── /_ANALISE                  → Esta pasta de análise
│
├── firebase-applet-config.json → Credenciais Firebase (⚠️ API key exposta)
├── firebase-blueprint.json    → Schemas das coleções
├── firestore.rules            → Regras de segurança do Firestore
├── next.config.ts             → Config Next.js
├── tailwind.config.js         → Config Tailwind
└── .env.example               → Template de variáveis de ambiente
```

---

## 4. Análise Página por Página

| Página | Dados | Formulários | Persiste? | Bugs/Problemas Críticos |
|---|---|---|---|---|
| `/` | Hardcoded (pontos, stats) | "Assinar Agora" → só toast | ❌ | Stats fixos (1250pts, "Cidadão Elite") |
| `/saude` | 3 clínicas hardcoded | Agendamento → modal | ❌ | Modal sem integração |
| `/educacao` | 3 escolas hardcoded | Matrícula → toast | ❌ | |
| `/educacao/matricula` | Form vazio | 5 etapas (cpf, nome, endereço) | ❌ | Form completo descartado no submit |
| `/transito` | Mock | Alertas → toast | ❌ | |
| `/tributos` | Mock | Pagamento → UI | ❌ | |
| `/empregos` | 4 vagas hardcoded | Candidatura → `appliedJobs` state | ❌ | State em memória, perde no reload |
| `/comercio` | 5 empresas hardcoded | "Como Chegar" → toast | ❌ | Sem GPS real |
| `/comunidade` | 3 grupos hardcoded | Sugerir grupo → formulário descartado | ❌ | Dados do form jogados fora |
| `/obras` | 3 obras hardcoded | Filtros client-side | ❌ | |
| `/obras/[id]` | Mock | "Auditoria Cidadã" → toast | ❌ | |
| `/eventos` | 4 eventos hardcoded | "Confirmar Presença" → toast | ❌ | |
| `/eventos/[id]` | Mock | "Quero Ir" → toast | ❌ | |
| `/ouvidoria` | Mock | 3 etapas de manifestação | ❌ | Busca de protocolo só funciona com ID hardcoded `2847192` |
| `/peticoes` | 3 petições hardcoded | "Assinar" → toast | ❌ | |
| `/peticoes/[id]` | Mock | "Assinar" → state local | ❌ | |
| `/relatar` | Form | 3 etapas | ✅ Firestore | Upload de foto não implementado; geolocalização não captura lat/lng |
| `/seguranca` | 4 zonas hardcoded | SOS 3s → vibrate + toast | ❌ | `navigator.vibrate()` sem envio real |
| `/meio-ambiente` | Mock | Notificação → toast | ❌ | |
| `/social` | 3 programas mock | Agendamento → toast | ❌ | |
| `/gestao` | 2 protocolos hardcoded | Responder → state local | ❌ | Email hardcoded como portão de acesso |
| `/avisos` | 4 avisos hardcoded | "Solicitar Justificativa" → toast | ❌ | |
| `/votos` | Mock | Votações → toast | ❌ | |
| `/servicos` | Categorias hardcoded | Busca client-side | ❌ | |
| `/perfil` | Form do usuário | Editar → não salva | ❌ | |
| `/legal` | Conteúdo estático | Tabs | — | |
| `/sobre` | Time hardcoded | — | — | |

---

## 5. Análise dos Componentes

| Componente | Funcionalidade Real | O Que Falta |
|---|---|---|
| `TopAppBar` | ✅ Navegação, auth | Busca não funciona |
| `BottomNavBar` | ✅ Navegação mobile | — |
| `Footer` | ✅ Estático | — |
| `AlertBanner` | ✅ UI | Dados reais do Firestore |
| `SearchModal` | ❌ Só UI | Toda a lógica de busca |
| `NotificationsPanel` | ❌ Só UI | Backend de notificações |
| `ProfileSettingsPanel` | ❌ Form sem save | `updateDoc` no Firestore |
| `GlobalStatsModal` | ❌ Dados hardcoded | Leitura de coleções reais |
| `HealthHistoryPanel` | ❌ Mock | Leitura de `appointments` |
| `AppointmentModal` | ❌ Modal sem backend | `addDoc` em `appointments` |
| `CreatePetitionModal` | ❌ Form sem save | `addDoc` em `petitions` |
| `PetitionCard` | ✅ Display | — |
| `IssueCard` | ✅ Display | — |
| `ClinicCard` | ✅ Display | — |
| `ServiceCard` | ✅ Display | — |
| `Modal` (ui) | ✅ | — |
| `SidePanel` (ui) | ✅ | — |

---

## 6. Análise da Camada `/lib`

### `lib/firebase.ts`
- Inicialização singleton do Firebase (correta)
- Usa `firestoreDatabaseId` do config JSON
- `handleFirestoreError()` captura permissão negada com contexto de usuário
- **Ausente:** retry logic, persistência offline (`enablePersistence()`), onSnapshot listeners

### `lib/auth-context.tsx`
- Google OAuth via `signInWithPopup` (funciona)
- `useAuth()` retorna `{ user, loading, login, logout }`
- **Problema:** `login()` não trata erro de popup bloqueado pelo browser
- **Ausente:** estado de erro no contexto, suporte a múltiplos providers

### `lib/accessibility-context.tsx`
- Font size ajustável (16–32px desktop, 16–22px mobile)
- Layout scale (0.8–1.5) via CSS custom property
- High contrast toggle (classe no `body`)
- **Problema:** `window.innerWidth` no render causa hydration mismatch
- **Ausente:** `localStorage` para persistir preferências, `prefers-reduced-motion`

### `lib/toast-context.tsx`
- ✅ Totalmente funcional
- 3 tipos: success, error, info
- Auto-dismiss em 4s, animação com Motion
- **Ausente:** limite de toasts simultâneos, anúncio para screen readers (ARIA live)

### `hooks/use-mobile.ts`
- Detecta `< 768px` via MediaQueryList
- **Problema:** estado inicial `undefined` causa hydration mismatch

---

## 7. Firebase — Configuração e Schema

### Arquivo de Credenciais (`firebase-applet-config.json`)
```json
{
  "projectId": "gen-lang-client-0701591157",
  "apiKey": "AIzaSyBYhqooZtu3G0Wl5ZTtzRwRPMSQZGum7Sc",  ← EXPOSTA NO REPOSITÓRIO
  "firestoreDatabaseId": "ai-studio-cbf81fa4-073d-45d7-88fd-f054c5080e02"
}
```
> ⚠️ A API key do Firebase está em um arquivo JSON versionado. Para um projeto de testes do AI Studio isso é tolerável, mas deve ser movida para variável de ambiente antes de qualquer deploy real.

### Schema (`firebase-blueprint.json`) — 8 coleções definidas

| Coleção | Campos obrigatórios | Status no código |
|---|---|---|
| `users` | uid, email, role (citizen\|admin) | Criado no login, parcialmente |
| `reports` | reporterId, type, description, status | ✅ Usado em `/relatar` |
| `appointments` | userId, type, unitId, date, status | ❌ Não usado |
| `jobs` | employerId, title, description | ❌ Não usado |
| `job_applications` | jobId, applicantId, status | ❌ Não usado |
| `emergency_alerts` | userId, type, location, status | ❌ Não usado |
| `petitions` | creatorId, title, goal, signaturesCount | ❌ Não usado |
| `petition_signatures` | petitionId, userId | ❌ Não usado |

### Coleções documentadas em `ARQUITETURA_TECNICA.md` mas AUSENTES do schema:
- `demands` — referenciada nos docs como coleção unificada de ouvidoria
- `admins` — referenciada nas `firestore.rules` mas sem schema definido
- Coleções de saúde: `health_units`, `pharmacies`
- `clerk` role — documentado, mas blueprint só define `citizen` e `admin`

### `firestore.rules` — Análise de Segurança

**Pontos positivos:**
- Leitura/escrita negada por padrão
- Owner-based data isolation
- `isAdmin()` via coleção `/admins/{uid}`
- Validação de tipo nos reports (`infrastructure`, `environment`, `security`, `other`)
- Campos imutáveis após criação (`createdAt`, `role`)
- `.diff()` para prevenir mudanças de campos proibidos nos appointments

**Problemas encontrados:**
- `emergency_alerts` com `allow read: if true` — localização SOS pública para não autenticados
- Sem rate limiting — possível spam de reports e petições
- Coleção `admins` referenciada nas rules mas não documentada no schema
- Reports: status `pending` forçado na criação, mas sem validação no update impedindo pular estados

---

## 8. O Que Realmente Funciona

| Funcionalidade | Evidência no Código |
|---|---|
| Login Google OAuth | `lib/auth-context.tsx` → `signInWithPopup` |
| Logout | `auth.signOut()` |
| Navegação entre páginas | Next.js App Router |
| Design responsivo | Tailwind + `use-mobile` hook |
| Envio de relato → Firestore | `app/relatar/page.tsx:87-99` → `addDoc(collection(db, 'reports'), ...)` |
| Toast notifications | `lib/toast-context.tsx` totalmente funcional |
| Animações UI | Motion library integrada |
| Acessibilidade básica | Font size + contrast context |

---

## 9. Bugs Confirmados (por arquivo)

| Bug | Arquivo | Linha | Impacto |
|---|---|---|---|
| Busca de protocolo só funciona com ID `2847192` | `app/ouvidoria/page.tsx` | ~150 | Alta — funcionalidade central quebrada |
| Admin acessível apenas por e-mail hardcoded | `app/gestao/page.tsx` | 45–58 | Alta — não escalável |
| Hydration mismatch em `useIsMobile` | `hooks/use-mobile.ts` | 6 | Média — flicker no carregamento |
| `window.innerWidth` no render do AccessibilityContext | `lib/accessibility-context.tsx` | ~40 | Média — SSR incompatível |
| Preferências de acessibilidade não persistem | `lib/accessibility-context.tsx` | — | Média — reinicia a cada visita |
| `appliedJobs` state perde no reload | `app/empregos/page.tsx` | ~92 | Média |
| Dados do formulário de sugestão de grupo descartados | `app/comunidade/page.tsx` | ~127 | Baixa |
| Form de matrícula completo mas não salvo | `app/educacao/matricula/page.tsx` | ~50 | Alta |

---

## 10. Problemas de Segurança

| Problema | Localização | Severidade |
|---|---|---|
| API key Firebase exposta no repositório | `firebase-applet-config.json` | Alta (projeto de teste) |
| Email de admin hardcoded no código | `app/gestao/page.tsx:46` | Alta |
| `ignoreDuringBuilds: true` no ESLint | `next.config.ts:6` | Média |
| `emergency_alerts` com leitura pública | `firestore.rules:116` | Média |
| Sem rate limiting no Firestore | `firestore.rules` | Média |
| Login não trata popup bloqueado | `lib/auth-context.tsx` | Baixa |
| Sem validação de inputs em formulários | Múltiplas páginas | Média |

---

## 11. Métricas de Completude

| Dimensão | % Completo | Notas |
|---|---|---|
| Rotas / Páginas | 100% | Todas as 22+ páginas existem |
| UI / Design | 100% | Todos os componentes visualmente prontos |
| Persistência de dados | ~5% | Só `/relatar` grava no Firestore |
| Autenticação | 60% | Login funciona, roles não implementados |
| Funcionalidades reais | ~8% | Quase tudo é mock ou toast |
| Integrações externas | 0% | Gemini, Maps, ViaCEP — zero código |
| Backend / Cloud Functions | 0% | Não existe |
| Testes | 0% | Nenhum arquivo de teste |
| CI/CD | 0% | Não configurado |
| Acessibilidade completa | 40% | Context existe, ARIA labels ausentes |
| Design system aplicado | 70% | Tailwind usado mas sem tokens customizados |
