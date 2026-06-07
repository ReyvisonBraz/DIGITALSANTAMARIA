# Tipos TypeScript — Referencia

13 modulos de tipos. Barrel export em `types/index.ts`.

---

## `common.types.ts`

| Tipo | Descricao |
|---|---|
| `GeoLocation` | `{ lat, lng, address }` |
| `StorageFile` | `{ url, path, name, size, type }` |
| `PaginatedResult<T>` | `{ items: T[], lastDoc, hasMore }` |
| `AsyncStatus` | `'idle' \| 'loading' \| 'success' \| 'error'` |

## `user.types.ts`

| Tipo | Valores / Campos |
|---|---|
| `UserRole` | `'citizen' \| 'admin' \| 'clerk'` |
| `Department` | `'saude' \| 'educacao' \| 'obras' \| 'transito' \| 'meio_ambiente' \| 'social' \| 'seguranca' \| 'tributos' \| 'comercio' \| 'cultura' \| 'geral'` |
| `UserProfile` | `{ uid, email, displayName, photoURL, phone, neighborhood, role, department, points, level, createdAt, updatedAt }` |
| `AuthUser` | Firebase Auth user basico |

## `report.types.ts`

| Tipo | Valores |
|---|---|
| `ReportType` | `'infrastructure' \| 'environment' \| 'security' \| 'other'` |
| `ReportStatus` | `'pending' \| 'in_review' \| 'resolved' \| 'rejected'` |
| `Report` | Documento completo do relato |
| `ReportMessage` | Mensagem com `authorRole` e `authorName` |
| `CreateReportInput` | Input para criacao |

## `demand.types.ts`

| Tipo | Valores |
|---|---|
| `DemandType` | `'reclamacao' \| 'sugestao' \| 'denuncia' \| 'elogio'` |
| `DemandStatus` | `'pending' \| 'analyzing' \| 'solved' \| 'rejected'` |
| `DemandCategory` | `'infraestrutura' \| 'saude' \| 'educacao' \| 'seguranca' \| 'transito' \| 'meio_ambiente' \| 'social' \| 'outros'` |
| `Demand` | Documento completo da demanda |
| `DemandMessage` | Mensagem com `authorRole` |
| `CreateDemandInput` | Input para criacao |

## `petition.types.ts`

| Tipo | Valores |
|---|---|
| `PetitionStatus` | `'active' \| 'achieved' \| 'official_reply' \| 'closed'` |
| `Petition` | `{ id, title, description, category, goal, signaturesCount, coverURL, createdAt, ... }` |
| `PetitionSignature` | `{ petitionId, userId, userName, createdAt }` |
| `CreatePetitionInput` | Input para criacao |

## `job.types.ts`

| Tipo | Valores |
|---|---|
| `JobType` | `'clt' \| 'pj' \| 'temporario' \| 'estagio' \| 'voluntario'` |
| `ApplicationStatus` | `'applied' \| 'viewed' \| 'interview' \| 'hired' \| 'rejected'` |
| `Job` | `{ id, title, description, type, requirements, benefits, salary, employerId, status, featured, createdAt, ... }` |
| `JobApplication` | `{ id, jobId, applicantId, coverLetter, status, createdAt, ... }` |
| `CreateApplicationInput` | Input para candidatura |

## `content.types.ts`

13 tipos de conteudo catalogaveis:

| Tipo | Status | Campos notaveis |
|---|---|---|
| `BaseContent` | — | `id, status, createdAt, updatedAt, deletedAt` |
| `Work` | `published/draft/archived` | `budget, progress, location, updates[]` |
| `Event` | `published/draft/archived` | `date, time, location, price, category` |
| `Notice` | `published/draft/archived` | `type, priority, expiresAt` |
| `CommunityGroup` | `published/draft/archived` | `category, members, location` |
| `Business` | `published/draft/archived/pending_approval` | `category, phone, whatsapp, address, hours` |
| `SafetyZone` | `published/draft/archived` | `riskLevel, location` |
| `EnvironmentData` | `published/draft/archived` | `type, value, unit, location` |
| `SocialProgram` | `published/draft/archived` | `category, requirements, location` |
| `TaxRecord` | `published/draft/archived` | `type, amount, dueDate` |
| `TrafficAlert` | `published/draft/archived` | `type, severity, location, validUntil` |
| `Poll` | `published/draft/archived` | `question, options[]` (cada com `id, text, votes`) |
| `PublicService` | `published/draft/archived` | `category, department, location, hours` |
| `PharmacyItem` | `published/draft/archived` | `name, category, price, pharmacyId` |

## `emergency.types.ts`

| Tipo | Valores |
|---|---|
| `EmergencyAlertType` | `'panic' \| 'violence' \| 'fire' \| 'medical' \| 'flood' \| 'other'` |
| `EmergencyAlertStatus` | `'active' \| 'in_progress' \| 'resolved' \| 'cancelled'` |
| `EmergencyAlert` | `{ id, userId, type, location, description, status, protocol, createdAt, ... }` |
| `CreateEmergencyAlertInput` | Input para criacao |

## `enrollment.types.ts`

| Tipo | Valores |
|---|---|
| `EnrollmentStatus` | `'pending' \| 'approved' \| 'rejected' \| 'waiting_list'` |
| `Enrollment` | `{ id, userId, parentName, parentCpf, studentName, studentBirth, address, cep, schoolPreference, status, protocol, createdAt, ... }` |
| `CreateEnrollmentInput` | Input para criacao |

## `appointment.types.ts`

| Tipo | Valores |
|---|---|
| `HealthUnitType` | `'upa' \| 'clinica' \| 'hospital' \| 'farmacia' \| 'cras'` |
| `WaitTimeLevel` | `'low' \| 'medium' \| 'high' \| 'critical'` |
| `AppointmentStatus` | `'scheduled' \| 'confirmed' \| 'completed' \| 'cancelled'` |
| `HealthUnit` | `{ id, name, type, address, phone, waitTime, waitLevel, specialties[], hours, ... }` |
| `Appointment` | `{ id, userId, unitId, specialty, date, time, status, createdAt, ... }` |
| `CreateAppointmentInput` | Input para criacao |

## `notification.types.ts`

| Tipo | Valores |
|---|---|
| `NotificationKind` | 9 tipos: `'report_updated' \| 'demand_updated' \| 'petition_updated' \| 'appointment_updated' \| 'application_updated' \| 'enrollment_updated' \| 'emergency_updated' \| 'business_approved' \| 'business_rejected'` |
| `NotificationTone` | `'success' \| 'alert' \| 'update'` |
| `Notification` | `{ id, userId, kind, tone, title, message, sourceId, read, createdAt, ... }` |
| `CreateNotificationInput` | Input para criacao |

## `admin-audit.types.ts`

| Tipo | Valores |
|---|---|
| `AdminAuditAction` | `'create' \| 'update' \| 'delete' \| 'approve' \| 'reject' \| 'archive'` |
| `AdminAuditLog` | `{ id, adminId, adminName, collection, documentId, action, details, createdAt }` |
| `CreateAdminAuditLogInput` | Input para criacao |
