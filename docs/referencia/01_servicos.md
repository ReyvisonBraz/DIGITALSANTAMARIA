# Services — Referencia Completa

14 services implementados. Todos usam Firebase Firestore Web SDK.

---

## Indice

| # | Service | Colecoes | Operacoes |
|---|---|---|---|
| 1 | `content.service.ts` | Qualquer colecao | Factory generico CRUD |
| 2 | `reports.service.ts` | `reports`, `report_messages` | 10 funcoes |
| 3 | `demands.service.ts` | `demands`, `demand_messages` | 9 funcoes |
| 4 | `petitions.service.ts` | `petitions`, `petition_signatures` | 7 funcoes |
| 5 | `appointments.service.ts` | `appointments`, `health_units` | 7 funcoes |
| 6 | `jobs.service.ts` | `jobs`, `job_applications` | 9 funcoes |
| 7 | `businesses.service.ts` | `businesses` | 6 funcoes |
| 8 | `educacao.service.ts` | `enrollments` | 4 funcoes |
| 9 | `emergency.service.ts` | `emergency_alerts` | 4 funcoes |
| 10 | `polls.service.ts` | — (Cloud Function) | 1 funcao |
| 11 | `notifications.service.ts` | `notifications` | 4 funcoes |
| 12 | `users.service.ts` | `users`, `admins` | 6 funcoes |
| 13 | `storage.service.ts` | — (Firebase Storage) | 4 funcoes |
| 14 | `admin-audit.service.ts` | `admin_audit_logs` | 2 funcoes |

---

## 1. `content.service.ts` — Factory Generico

**Colecao:** qualquer (parametro `collectionName`)

```typescript
createContentService<T>(collectionName: string)
```

| Metodo | Tipo | Descricao |
|---|---|---|
| `list(filters?, max?)` | `getDocs` | Lista publicados (`status == 'published'`, sem `deletedAt`) |
| `listAdmin(max?)` | `getDocs` | Lista todos (qualquer status), para painel admin |
| `getById(id)` | `getDoc` | Busca por ID, ignora soft-deleted |
| `create(data)` | `addDoc` | Cria com `createdAt`, `updatedAt`, `deletedAt: null` |
| `update(id, data)` | `updateDoc` | Atualiza campos + `updatedAt` |
| `setStatus(id, status)` | `updateDoc` | Altera apenas o status |
| `archive(id)` | `updateDoc` | Soft-delete: `status = 'archived'`, `deletedAt = now` |

**Usado por:** `useContent<T>()` hook → 15+ paginas de catalogo

---

## 2. `reports.service.ts`

**Colecoes:** `reports`, `report_messages`

| Funcao | Tipo | Descricao |
|---|---|---|
| `createReport(input)` | `addDoc` | Cria relato, opcionalmente faz upload de foto |
| `getReportById(id)` | `getDoc` | Busca relato por ID |
| `createReportMessage(input)` | `addDoc` | Adiciona mensagem ao relato |
| `getReportMessages(reportId)` | `getDocs` | Lista mensagens de um relato |
| `getReportsByUser(userId)` | `getDocs` | Lista relatos do usuario |
| `listenToUserReports(userId, onChange, onError?)` | `onSnapshot` | Listener em tempo real |
| `getPendingReports()` | `getDocs` | Lista relatos pendentes |
| `getAllReports()` | `getDocs` | Lista todos os relatos |
| `updateReportStatus(id, status, clerkId, clerkName, response?)` | `updateDoc` | Atualiza status + cria mensagem + notificacao |
| `getTopReports(max?)` | `getDocs` | Top relatos por votos |

**Listener em tempo real:** `listenToUserReports` usa `onSnapshot`

---

## 3. `demands.service.ts`

**Colecoes:** `demands`, `demand_messages`

| Funcao | Tipo | Descricao |
|---|---|---|
| `createDemand(input)` | `addDoc` | Cria demanda com protocolo OUV-... |
| `createDemandMessage(input)` | `writeBatch` | Adiciona mensagem e atualiza `demands.conversation` |
| `getDemandMessages(demandId)` | `getDocs` | Lista mensagens da demanda |
| `getDemandByProtocol(protocolId, userId?)` | `getDocs` | Busca por protocolo do usuario logado ou protocolo anonimo |
| `getDemandsByUser(userId)` | `getDocs` | Lista demandas do usuario |
| `listenToUserDemands(userId, onChange, onError?)` | `onSnapshot` | Listener em tempo real |
| `getAllDemands()` | `getDocs` | Lista todas as demandas |
| `markDemandReadByStaff(id)` | `updateDoc` | Limpa `conversation.unreadByStaff` quando o gestor abre o detalhe |
| `updateDemandStatus(id, status, adminAction)` | `updateDoc` | Atualiza status + cria mensagem + notificacao |

**Listener em tempo real:** `listenToUserDemands` usa `onSnapshot`

---

## 4. `petitions.service.ts`

**Colecoes:** `petitions`, `petition_signatures`

| Funcao | Tipo | Descricao |
|---|---|---|
| `createPetition(input)` | `addDoc` | Cria peticao |
| `getActivePetitions()` | `getDocs` | Lista petições ativas |
| `getAllPetitions()` | `getDocs` | Lista todas (admin) |
| `getPetitionById(id)` | `getDoc` | Busca por ID |
| `updatePetitionAdmin(id, input)` | `updateDoc` | Admin: atualiza status/resposta |
| `signPetition(petitionId, userName)` | **Cloud Function** | Assina peticao (atomico) |
| `hasUserSigned(petitionId, userId)` | `getDoc` | Verifica se ja assinou |

---

## 5. `appointments.service.ts`

**Colecoes:** `appointments`, `health_units`

| Funcao | Tipo | Descricao |
|---|---|---|
| `createAppointment(input)` | `addDoc` | Cria agendamento |
| `getAppointmentsByUser(userId)` | `getDocs` | Lista agendamentos do usuario |
| `getAllAppointments()` | `getDocs` | Lista todos (admin) |
| `updateAppointmentStatus(id, status)` | `updateDoc` | Atualiza status + notificacao |
| `getHealthUnits()` | `getDocs` | Lista unidades de saude |
| `createHealthUnit(input)` | `addDoc` | Cria unidade (admin) |
| `updateHealthUnit(id, input)` | `updateDoc` | Atualiza unidade (admin) |

---

## 6. `jobs.service.ts`

**Colecoes:** `jobs`, `job_applications`

| Funcao | Tipo | Colecao |
|---|---|---|
| `getActiveJobs()` | `getDocs` | `jobs` |
| `applyForJob(input)` | `addDoc` | `job_applications` |
| `hasUserApplied(jobId, userId)` | `getDocs` | `job_applications` |
| `getUserApplications(userId)` | `getDocs` | `job_applications` |
| `getAllApplications()` | `getDocs` | `job_applications` |
| `updateApplicationStatus(id, status)` | `updateDoc` | `job_applications` |
| `getAllJobs()` | `getDocs` | `jobs` |
| `createJob(input)` | `addDoc` | `jobs` |
| `updateJob(id, input)` | `updateDoc` | `jobs` |

---

## 7. `businesses.service.ts`

**Colecoes:** `businesses`

| Funcao | Tipo | Descricao |
|---|---|---|
| `registerBusiness(input)` | Factory `create` | Cria com status `pending_approval` |
| `updateOwnedBusiness(id, patch)` | `updateDoc` | Dono edita seu negocio |
| `approveBusiness(id)` | `updateDoc` | Admin aprova → `published` + notificacao |
| `rejectBusiness(id, note?)` | `updateDoc` | Admin reprova → `archived` + notificacao |
| `listPendingBusinesses()` | `getDocs` | Lista pendentes de aprovacao |
| `listenToOwnedBusinesses(ownerId, onChange, onError?)` | `onSnapshot` | Listener em tempo real |

**Listener em tempo real:** `listenToOwnedBusinesses` usa `onSnapshot`

---

## 8. `educacao.service.ts`

**Colecoes:** `enrollments`

| Funcao | Tipo | Descricao |
|---|---|---|
| `createEnrollment(input)` | `addDoc` | Cria matricula com protocolo MAT-... |
| `getAllEnrollments()` | `getDocs` | Lista todas (admin) |
| `getEnrollmentsByUser(userId)` | `getDocs` | Lista matriculas do usuario |
| `updateEnrollmentStatus(id, status)` | `updateDoc` | Atualiza status + notificacao |

---

## 9. `emergency.service.ts`

**Colecoes:** `emergency_alerts`

| Funcao | Tipo | Descricao |
|---|---|---|
| `createEmergencyAlert(input)` | `addDoc` | Cria alerta com protocolo SEG-... |
| `getAllEmergencyAlerts()` | `getDocs` | Lista todos (admin) |
| `getEmergencyAlertsByUser(userId)` | `getDocs` | Lista alertas do usuario |
| `updateEmergencyAlertStatus(id, status)` | `updateDoc` | Atualiza status + notificacao |

---

## 10. `polls.service.ts`

**Colecoes:** nenhuma (tudo via Cloud Function)

| Funcao | Tipo | Descricao |
|---|---|---|
| `votePoll(pollId, optionId)` | `httpsCallable` | Chama `votePollCallable` |

---

## 11. `notifications.service.ts`

**Colecoes:** `notifications`

| Funcao | Tipo | Descricao |
|---|---|---|
| `createNotification(input)` | `addDoc` | Cria notificacao |
| `tryCreateNotification(input)` | `addDoc` | Cria notificacao (silencia erros) |
| `listenToUserNotifications(userId, onChange, onError?)` | `onSnapshot` | Listener em tempo real (limite 30) |
| `markNotificationAsRead(id)` | `updateDoc` | Marca uma como lida |
| `markAllNotificationsAsRead(userId)` | `writeBatch` | Marca todas como lidas (batch) |

**Listener em tempo real:** `listenToUserNotifications` usa `onSnapshot`

---

## 12. `users.service.ts`

**Colecoes:** `users`, `admins`

| Funcao | Tipo | Colecao |
|---|---|---|
| `getUserProfile(uid)` | `getDoc` | `users` |
| `getAllUsers()` | `getDocs` | `users` |
| `updateUserProfile(uid, data)` | `updateDoc` | `users` |
| `updateUserProfileByAdmin(uid, data)` | `updateDoc` | `users` |
| `createUserProfile(uid, data)` | `setDoc` | `users` |
| `getUserRole(uid)` | `getDoc` | `admins` |

---

## 13. `storage.service.ts`

**Storage:** Firebase Storage (nao Firestore)

| Funcao | Path |
|---|---|
| `uploadReportPhoto(uid, file)` | `reports/{uid}/{filename}` |
| `uploadPetitionCover(uid, file)` | `petitions/{uid}/{filename}` |
| `uploadAvatar(uid, file)` | `avatars/{uid}/{filename}` |
| `deleteFile(path)` | qualquer path |

---

## 14. `admin-audit.service.ts`

**Colecoes:** `admin_audit_logs`

| Funcao | Tipo | Descricao |
|---|---|---|
| `createAdminAuditLog(input)` | `addDoc` | Registra acao administrativa |
| `tryCreateAdminAuditLog(input)` | `addDoc` | Registra acao (silencia erros) |

---

## Padrao de notificacoes

Toda operacao de escrita que afeta um usuario final dispara `tryCreateNotification()`:

```typescript
// Exemplo: ao aprovar matricula
await updateEnrollmentStatus(id, 'approved')
// → internamente chama tryCreateNotification({ userId, kind: 'enrollment_approved', ... })
```
