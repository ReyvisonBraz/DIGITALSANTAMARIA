# Fluxo de Dados

## Visao geral

```
Firestore ──→ Service ──→ Hook ──→ Page/Feature
    ↑                         │
    └─── Cloud Functions ─────┘
```

## Camadas

### 1. Firestore (banco de dados)

22+ colecoes. Todas as operacoes de leitura/escrita passam pelo SDK Web do Firebase no client-side.

### 2. Services (`services/`)

Camada de abstracao sobre o Firestore. Cada service e um modulo com funcoes puras que recebem parametros e retornam dados.

**Dois padroes:**

#### A) Service dedicado (12 services)
Cada um lida com 1-2 colecoes especificas, exporta funcoes nomeadas:

```typescript
// services/reports.service.ts
export async function createReport(input: CreateReportInput): Promise<string>
export async function getReportsByUser(userId: string): Promise<Report[]>
export function listenToUserReports(userId, onChange, onError?): () => void
export async function updateReportStatus(id, status, ...): Promise<void>
```

#### B) Factory generico (`content.service.ts`)
Para colecoes de catalogo (obras, eventos, avisos, comercios, etc.). Cria um service CRUD sob demanda:

```typescript
// services/content.service.ts
export function createContentService<T>(collectionName: string)
// Retorna: { list, listAdmin, getById, create, update, setStatus, archive }
```

### 3. Hooks (`lib/hooks/`, `features/*/hooks/`)

Gerenciam estado React e ciclo de vida. Consomem services.

**Tres padroes:**

#### A) useContent — para paginas de listagem
```typescript
const { data, loading, error, refresh } = useContent<Event>('events')
```
Busca documentos com `status == 'published'`, ordenados por `createdAt`.

#### B) Hook dedicado — para paginas com logica especifica
```typescript
const { units, status, error } = useHealthUnits()
const { pendingDemands, pendingReports, ... } = useAdminData()
```

#### C) Context Providers — dados globais
```typescript
const { user, userRole, login, logout } = useAuth()
const { notifications, unreadCount, markAsRead } = useNotifications()
```

### 4. Pages / Features

Renderizam UI. Recebem dados dos hooks e delegam escritas para funcoes dos services.

```typescript
// app/eventos/page.tsx
export default function EventosPage() {
  const { data: events, loading, error } = useContent<Event>('events')
  return <ContentPage loading={loading} error={error} isEmpty={!events?.length}>
    {events?.map(event => <ContentCard key={event.id} item={event} />)}
  </ContentPage>
}
```

## Tempo real (onSnapshot)

4 services usam listeners:

| Service | Funcao | Uso |
|---|---|---|
| `notifications` | `listenToUserNotifications` | NotificationsContext |
| `demands` | `listenToUserDemands` | Painel do cidadao |
| `reports` | `listenToUserReports` | Painel do cidadao |
| `businesses` | `listenToOwnedBusinesses` | Meus negocios |

## Cloud Functions

Operacoes que exigem atomicidade ou logica server-side:

| Function | Gatilho | Proposito |
|---|---|---|
| `signPetitionCallable` | `httpsCallable` | Assinar peticao com incremento atomico |
| `votePollCallable` | `httpsCallable` | Votar em enquete com incremento atomico |

## Notificacoes

Toda operacao de escrita que afeta um cidadao dispara `tryCreateNotification()`:

```
Admin aprova comercio → businesses.approveBusiness()
  → tryCreateNotification({ userId, kind: 'business_approved', ... })
    → listener no NotificationsContext atualiza badge
```
