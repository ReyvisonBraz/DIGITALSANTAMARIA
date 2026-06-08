# Seguranca - Autenticacao e Firestore Rules

## Autenticacao

**Provedor:** Google OAuth via Firebase Auth (`signInWithPopup`)

**Fluxo:**
1. Usuario clica em login e abre o popup do Google OAuth
2. Firebase Auth cria ou autentica o usuario
3. `AuthProvider` (`lib/auth-context.tsx`) sincroniza o perfil em `users/{uid}`
4. `AuthProvider` busca a role em `admins/{uid}`
5. O contexto expoe `{ user, userRole, loading, authError, login, logout }`

**Roles:**

| Role | Acesso |
|---|---|
| `citizen` | Paginas publicas + painel do cidadao |
| `clerk` | Painel de gestao focado nas filas de atendimento |
| `admin` | Painel de gestao completo, catalogos, usuarios e auditoria |

No painel `/gestao`, `clerk` ve apenas as abas de atendimento operacional. Catalogos, usuarios, peticoes administrativas e auditoria ficam visiveis apenas para `admin`.

## Firestore Rules

Arquivo: [`firestore.rules`](../../firestore.rules)

### Principios

- **Deny by default:** leitura e escrita sao negadas por padrao.
- **Owner-based isolation:** usuario comum so le ou altera seus proprios documentos.
- **Role-based access:** `isStaff()` cobre `admin` e `clerk`; `isAdmin()` restringe catalogos e permissoes sensiveis.
- **Validacao de campos:** updates de cidadao sao limitados a campos esperados.
- **Soft delete:** catalogos usam `status`/`deletedAt`; exclusao fisica fica bloqueada na maioria das colecoes.

### Regras por colecao

| Colecao | Leitura | Escrita |
|---|---|---|
| `users` | Dono ou admin | Dono em campos limitados, ou admin |
| `admins` | Clerk/admin | Apenas admin |
| `reports` | Dono ou clerk/admin | Dono cria, clerk/admin atualiza status/conversa |
| `report_messages` | Participante ou clerk/admin | Participante ou clerk/admin cria mensagens |
| `demands` | Dono, anonima ou clerk/admin | Dono cria, clerk/admin atualiza |
| `demand_messages` | Participante, anonima ou clerk/admin | Participante ou clerk/admin cria mensagens |
| `petitions` | Publico | Cidadao cria, assinatura atomica, admin modera |
| `petition_signatures` | Publico | Usuario autenticado assina uma vez |
| `appointments` | Dono ou clerk/admin | Dono cria/cancela, clerk/admin atualiza |
| `health_units` | Publico | Apenas admin |
| `jobs` | Publico | Dono empregador ou admin atualiza; delete apenas admin |
| `job_applications` | Dono ou clerk/admin | Dono cria, clerk/admin atualiza status |
| `enrollments` | Dono ou clerk/admin | Dono cria, clerk/admin atualiza status |
| `emergency_alerts` | Dono ou clerk/admin | Dono cria, clerk/admin atualiza status |
| `notifications` | Dono | Clerk/admin cria, dono marca como lida |
| `admin_audit_logs` | Apenas admin | Clerk/admin cria, ninguem altera |
| Catalogos publicos | Publico | Apenas admin |

### Catalogos

Colecoes gerenciadas por `content.service.ts`:

- `notices`
- `events`
- `works`
- `businesses`
- `traffic_alerts`
- `health_units`
- `jobs`
- `safety_zones`
- `environment_data`
- `social_programs`
- `tax_records`
- `public_services`
- `pharmacy_items`
- `education_schools`
- `community_groups`
- `polls`

Leitura publica acontece nas paginas do site. Escrita administrativa deve ficar limitada a `admin`.

## Storage Rules

- `reports/{userId}/**`: usuario autenticado envia, leitura publica.
- `petitions/{userId}/**`: usuario autenticado envia, leitura publica.
- `avatars/{userId}/**`: dono envia, leitura publica.

## Boas praticas aplicadas

- Admin nao fica hardcoded no codigo; a role vem de `admins/{uid}`.
- Chaves locais e service accounts ficam ignoradas pelo Git.
- Fluxos sensiveis do painel usam confirmacao antes de publicar, reativar ou arquivar.
- Logs administrativos ficam em `admin_audit_logs` e nao podem ser editados.
