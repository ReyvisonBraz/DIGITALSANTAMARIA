# Firestore — Schema de Colecoes

22+ colecoes no Firestore. Schema declarativo em `firebase-blueprint.json`.

---

## Colecoes com service dedicado

### `users`
| Campo | Tipo |
|---|---|
| `uid` | string (PK) |
| `email` | string |
| `displayName` | string |
| `photoURL` | string |
| `phone` | string |
| `neighborhood` | string |
| `points` | number |
| `level` | string |
| `createdAt` | Timestamp |
| `updatedAt` | Timestamp |

### `admins`
| Campo | Tipo |
|---|---|
| `uid` | string (PK, mesmo do `users`) |
| `role` | `'admin' \| 'clerk'` |
| `department` | Department |

### `reports`
| Campo | Tipo |
|---|---|
| `id` | string |
| `reporterId` | string (FK → users) |
| `reporterName` | string |
| `type` | ReportType |
| `status` | ReportStatus |
| `description` | string |
| `location` | GeoLocation |
| `photoURL` | string |
| `votes` | number |
| `protocol` | string |
| `createdAt` | Timestamp |
| `updatedAt` | Timestamp |

### `report_messages`
| Campo | Tipo |
|---|---|
| `reportId` | string (FK) |
| `authorId` | string |
| `authorName` | string |
| `authorRole` | ReportMessageAuthorRole |
| `text` | string |
| `createdAt` | Timestamp |

### `demands`
| Campo | Tipo |
|---|---|
| `id` | string |
| `userId` | string (FK → users) |
| `userName` | string |
| `type` | DemandType |
| `category` | DemandCategory |
| `status` | DemandStatus |
| `title` | string |
| `description` | string |
| `location` | GeoLocation |
| `protocol` | string (OUV-...) |
| `createdAt` | Timestamp |
| `updatedAt` | Timestamp |

### `demand_messages`
| Campo | Tipo |
|---|---|
| `demandId` | string (FK) |
| `authorId` | string |
| `authorName` | string |
| `authorRole` | DemandMessageAuthorRole |
| `text` | string |
| `createdAt` | Timestamp |

### `petitions`
| Campo | Tipo |
|---|---|
| `id` | string |
| `creatorId` | string (FK → users) |
| `creatorName` | string |
| `title` | string |
| `description` | string |
| `category` | string |
| `goal` | number |
| `signaturesCount` | number |
| `status` | PetitionStatus |
| `coverURL` | string |
| `createdAt` | Timestamp |
| `updatedAt` | Timestamp |

### `petition_signatures`
| Campo | Tipo |
|---|---|
| `petitionId` | string (FK) |
| `userId` | string (FK → users) |
| `userName` | string |
| `createdAt` | Timestamp |

> **Composite key:** `petitionId_userId` (usado em `hasUserSigned`)

### `appointments`
| Campo | Tipo |
|---|---|
| `id` | string |
| `userId` | string (FK → users) |
| `unitId` | string (FK → health_units) |
| `specialty` | string |
| `date` | string |
| `time` | string |
| `status` | AppointmentStatus |
| `createdAt` | Timestamp |

### `health_units`
| Campo | Tipo |
|---|---|
| `id` | string |
| `name` | string |
| `type` | HealthUnitType |
| `address` | string |
| `phone` | string |
| `waitTime` | number |
| `waitLevel` | WaitTimeLevel |
| `specialties` | string[] |
| `hours` | string |
| `createdAt` | Timestamp |

### `jobs`
| Campo | Tipo |
|---|---|
| `id` | string |
| `employerId` | string (FK → users) |
| `title` | string |
| `description` | string |
| `type` | JobType |
| `requirements` | string[] |
| `benefits` | string[] |
| `salary` | string |
| `status` | ContentStatus |
| `featured` | boolean |
| `createdAt` | Timestamp |

### `job_applications`
| Campo | Tipo |
|---|---|
| `id` | string |
| `jobId` | string (FK → jobs) |
| `applicantId` | string (FK → users) |
| `coverLetter` | string |
| `status` | ApplicationStatus |
| `createdAt` | Timestamp |

### `enrollments`
| Campo | Tipo |
|---|---|
| `id` | string |
| `userId` | string (FK → users) |
| `parentName` | string |
| `parentCpf` | string |
| `studentName` | string |
| `studentBirth` | string |
| `address` | string |
| `cep` | string |
| `schoolPreference` | string |
| `status` | EnrollmentStatus |
| `protocol` | string (MAT-...) |
| `createdAt` | Timestamp |

### `emergency_alerts`
| Campo | Tipo |
|---|---|
| `id` | string |
| `userId` | string (FK → users) |
| `type` | EmergencyAlertType |
| `location` | GeoLocation |
| `description` | string |
| `status` | EmergencyAlertStatus |
| `protocol` | string (SEG-...) |
| `createdAt` | Timestamp |

### `notifications`
| Campo | Tipo |
|---|---|
| `id` | string |
| `userId` | string (FK → users) |
| `kind` | NotificationKind |
| `tone` | NotificationTone |
| `title` | string |
| `message` | string |
| `sourceId` | string |
| `read` | boolean |
| `createdAt` | Timestamp |

### `admin_audit_logs`
| Campo | Tipo |
|---|---|
| `id` | string |
| `adminId` | string |
| `adminName` | string |
| `collection` | string |
| `documentId` | string |
| `action` | AdminAuditAction |
| `details` | string |
| `createdAt` | Timestamp |

---

## Colecoes de catalogo (`content.service.ts`)

Todas seguem a interface `BaseContent`:

| Colecao | Tipo TypeScript | Campos extras |
|---|---|---|
| `works` | `Work` | `budget, progress, location, updates[]` |
| `events` | `Event` | `date, time, location, price, category` |
| `notices` | `Notice` | `type, priority, expiresAt` |
| `businesses` | `Business` | `category, phone, whatsapp, address, hours` |
| `community_groups` | `CommunityGroup` | `category, members, location` |
| `safety_zones` | `SafetyZone` | `riskLevel, location` |
| `environment_data` | `EnvironmentData` | `type, value, unit, location` |
| `social_programs` | `SocialProgram` | `category, requirements, location` |
| `tax_records` | `TaxRecord` | `type, amount, dueDate` |
| `traffic_alerts` | `TrafficAlert` | `type, severity, location, validUntil` |
| `polls` | `Poll` | `question, options[{ id, text, votes }]` |
| `public_services` | `PublicService` | `category, department, location, hours` |
| `pharmacy_items` | `PharmacyItem` | `name, category, price, pharmacyId` |
| `education_schools` | `EducationSchool` | `name, type, address, phone, grades` |

### Campos base (todas as colecoes de catalogo):

| Campo | Tipo | Descricao |
|---|---|---|
| `id` | string | Auto-generated |
| `status` | ContentStatus | `published \| draft \| archived \| pending_approval` |
| `createdAt` | Timestamp | Auto na criacao |
| `updatedAt` | Timestamp | Auto no update |
| `deletedAt` | Timestamp \| null | Soft-delete (`null` = ativo) |

### Filtro padrao do `content.service`:
- `list()` → `where('status', '==', 'published')` + `orderBy('createdAt', 'desc')`
- `listAdmin()` → sem filtro de status
- Ambos ignoram documentos com `deletedAt != null`
