# Seguranca — Autenticacao e Firestore Rules

## Autenticacao

**Provedor:** Google OAuth via Firebase Auth (`signInWithPopup`)

**Fluxo:**
1. Usuario clica "Login" → popup Google OAuth
2. Firebase Auth cria/autentica usuario
3. `AuthProvider` (`lib/auth-context.tsx`) sincroniza:
   - Cria/atualiza perfil em `users/{uid}` via `createUserProfile`
   - Busca role em `admins/{uid}` via `getUserRole`
4. Context expoe: `{ user, userRole, loading, authError, login, logout }`

**Roles:**
| Role | Acesso |
|---|---|
| `citizen` | Paginas publicas + painel do cidadao |
| `clerk` | Painel de gestao (visao de filas) |
| `admin` | Painel de gestao completo + gestao de usuarios |

**Protecao de rota:** `useAuthGuard(role?)` redireciona para `/` se nao autorizado.

---

## Firestore Rules (`firestore.rules`)

Arquivo: [`firestore.rules`](../../firestore.rules)

### Principios

- **Deny by default** — leitura/escrita negada por padrao
- **Owner-based isolation** — usuario so le/escreve seus proprios documentos
- **Role-based access** — `isAdmin()` verifica existencia em `admins/{uid}`
- **Validacao de campos** — tipos restritos nos reports, campos imutaveis

### Regras por colecao

| Colecao | Leitura | Escrita |
|---|---|---|
| `users` | Dono ou admin | Dono ou admin |
| `admins` | Autenticado (so `get`) | Apenas admin |
| `reports` | Dono ou admin | Dono (criar), admin (update status) |
| `report_messages` | Participante ou admin | Participante ou admin |
| `demands` | Dono ou clerk/admin | Dono (criar), clerk/admin (update) |
| `demand_messages` | Participante ou clerk/admin | Participante ou clerk/admin |
| `petitions` | Publico (leitura), dono/admin (update) | Autenticado (criar), admin (update) |
| `petition_signatures` | Publico | Autenticado |
| `appointments` | Dono ou admin | Dono (criar), admin (update) |
| `health_units` | Publico | Admin |
| `jobs` | Publico | Admin |
| `job_applications` | Dono ou admin | Dono (criar), admin (update) |
| `enrollments` | Dono ou admin | Dono (criar), admin (update) |
| `emergency_alerts` | Dono ou admin | Autenticado (criar), admin (update) |
| `notifications` | Dono | Sistema (criar), dono (marcar lida) |
| `admin_audit_logs` | Admin | Sistema |
| Colecoes de catalogo | Publico (leitura `published`) | Admin (CRUD) |

### Catalogo — regra generica

Colecoes gerenciadas por `content.service.ts`:
- Leitura publica: `status == 'published'` + sem `deletedAt`
- Leitura admin: qualquer status
- Escrita: apenas admin (`isAdmin()`)

---

## Storage Rules (`storage.rules`)

- `reports/{userId}/**` — usuario autenticado (upload), publico (leitura)
- `petitions/{userId}/**` — usuario autenticado (upload), publico (leitura)
- `avatars/{userId}/**` — dono (upload), publico (leitura)

---

## Boas praticas aplicadas

- Nenhum email/ID hardcoded no codigo (admin validado via `admins` collection)
- API keys do Firebase em variaveis de ambiente (`.env.local`), nao versionadas
- `handleFirestoreError()` captura erros de permissao com contexto
- Campos `createdAt` e `role` sao imutaveis apos criacao (validado nas rules)
