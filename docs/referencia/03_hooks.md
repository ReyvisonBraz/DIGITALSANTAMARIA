# Hooks — Referencia

---

## Hooks de infraestrutura (`lib/hooks/`)

### `useContent<T>(collectionName, filters?)`
Hook generico para paginas de catalogo. Usado por 15+ paginas.

```typescript
const { data, loading, error, refresh } = useContent<Event>('events')
// data: T[] | null
// loading: boolean
// error: string | null
// refresh: () => void
```

Busca documentos com `status == 'published'` via `createContentService<T>(collectionName).list()`.

### `useHomeMetrics()`
Metricas da pagina inicial.

```typescript
const { eventsCount, noticesCount, loading } = useHomeMetrics()
```

Conta documentos publicados nas colecoes `events` e `notices`.

### `useAuthGuard(role?)`
Protecao de rota. Redireciona para `/` se nao autenticado ou sem a role exigida.

```typescript
useAuthGuard('admin') // so admin acessa
useAuthGuard()        // qualquer usuario logado
```

### `useFirestoreDoc<T>(path, converter?, subscribe?)`
Carrega um documento do Firestore.

```typescript
const { data, status, error, refresh } = useFirestoreDoc<UserProfile>('users/abc123', userConverter)
// status: AsyncStatus ('idle' | 'loading' | 'success' | 'error')
// subscribe: true → onSnapshot (tempo real)
```

### `useMobile()`
Detecta viewport mobile (< 768px).

```typescript
const isMobile = useIsMobile()
// isMobile: boolean
```

### `useClickOutside(ref, handler, enabled?)`
Detecta clique fora de um elemento.

```typescript
const ref = useRef<HTMLDivElement>(null)
useClickOutside(ref, () => close(), isOpen)
```

### `useKeyboardShortcut(key, callback, options?)`
Registra atalho de teclado global.

```typescript
useKeyboardShortcut('k', () => openSearch(), { modifier: 'Ctrl' })
// Suporta: Ctrl, Meta, Shift, Alt
```

---

## Context Hooks (`lib/`)

### `useAuth()`
```typescript
const { user, userRole, loading, authError, login, logout } = useAuth()
// user: AuthUser | null
// userRole: 'citizen' | 'admin' | 'clerk' | null
// login(): Google OAuth via popup
// logout(): signOut
```

### `useToast()`
```typescript
const { toast } = useToast()
toast.success('Mensagem')
toast.error('Erro')
toast.info('Informacao')
// auto-dismiss em 4s
```

### `useAccessibility()`
```typescript
const { fontSize, setFontSize, layoutScale, setLayoutScale, highContrast, toggleHighContrast } = useAccessibility()
// fontSize: 12–32
// layoutScale: 0.8–1.5
// Persistido em localStorage
```

### `useNotifications()`
```typescript
const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
// Listener em tempo real (onSnapshot na colecao notifications)
// unreadCount: number (badge no TopAppBar)
```

---

## Hooks de features

### `useHealthUnits()` — `features/saude/hooks/`
```typescript
const { units, status, error } = useHealthUnits()
// units: HealthUnit[]
// status: AsyncStatus
```

### `useAdminData()` — `features/gestao/hooks/`
```typescript
const { pendingDemands, pendingReports, allDemands, allReports, loading, error, refresh } = useAdminData()
// pendingDemands: Demand[]
// pendingReports: Report[]
```
