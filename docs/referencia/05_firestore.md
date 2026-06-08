# Firestore - Schema de Colecoes

Referencia pratica das colecoes usadas pelo app. Os tipos completos ficam em `types/` e os conversores em `lib/firebase/converters.ts`.

## Usuarios e permissoes

### `users`
| Campo | Tipo |
|---|---|
| `uid` | string |
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
| `uid` | string |
| `role` | `admin` ou `clerk` |
| `department` | Department |

## Atendimento

### `demands`
| Campo | Tipo |
|---|---|
| `authorId` | string, vazio quando anonimo |
| `authorName` | string \| null |
| `type` | DemandType |
| `category` | string |
| `status` | DemandStatus |
| `subject` | string |
| `content.text` | string |
| `content.mediaFiles` | string[] |
| `content.location` | GeoLocation \| null |
| `protocolId` | string |
| `adminAction` | AdminAction \| null |
| `isAnonymous` | boolean |
| `consent` | boolean |
| `conversation` | DemandConversationSummary \| undefined |
| `createdAt` | Timestamp |
| `updatedAt` | Timestamp |

### `demand_messages`
| Campo | Tipo |
|---|---|
| `demandId` | string |
| `authorId` | string |
| `authorName` | string |
| `authorRole` | DemandMessageAuthorRole |
| `message` | string |
| `createdAt` | Timestamp |

### `reports`
| Campo | Tipo |
|---|---|
| `reporterId` | string |
| `reporterName` | string |
| `type` | ReportType |
| `title` | string |
| `description` | string |
| `status` | ReportStatus |
| `protocol` | string |
| `location` | GeoLocation \| null |
| `photo` | StorageFile \| null |
| `votes` | number |
| `isPetition` | boolean |
| `adminResponse` | string \| null |
| `clerkId` | string \| null |
| `conversation` | ReportConversationSummary \| undefined |
| `createdAt` | Timestamp |
| `updatedAt` | Timestamp |

### `report_messages`
| Campo | Tipo |
|---|---|
| `reportId` | string |
| `authorId` | string |
| `authorName` | string |
| `authorRole` | ReportMessageAuthorRole |
| `message` | string |
| `createdAt` | Timestamp |

### Resumo de conversa

`demands.conversation` e `reports.conversation` seguem o mesmo formato:

| Campo | Tipo |
|---|---|
| `lastMessageAt` | Timestamp |
| `lastMessageAuthorName` | string |
| `lastMessageAuthorRole` | `citizen`, `staff` ou `system` |
| `unreadByCitizen` | boolean |
| `unreadByStaff` | boolean |

## Participacao

### `petitions`
| Campo | Tipo |
|---|---|
| `creatorId` | string |
| `creatorName` | string |
| `creatorPhotoURL` | string |
| `title` | string |
| `description` | string |
| `category` | string |
| `goal` | number |
| `signaturesCount` | number |
| `status` | PetitionStatus |
| `officialReply` | PetitionOfficialReply \| null |
| `coverImageURL` | string |
| `createdAt` | Timestamp |
| `updatedAt` | Timestamp |

### `petition_signatures`
| Campo | Tipo |
|---|---|
| `petitionId` | string |
| `userId` | string |
| `userName` | string |
| `createdAt` | Timestamp |

O ID do documento usa `petitionId_userId`.

## Servicos operacionais

### `appointments`
| Campo | Tipo |
|---|---|
| `userId` | string |
| `unitId` | string |
| `specialty` | string |
| `date` | string |
| `time` | string |
| `status` | AppointmentStatus |
| `createdAt` | Timestamp |

### `health_units`
| Campo | Tipo |
|---|---|
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
| `employerId` | string |
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
| `jobId` | string |
| `applicantId` | string |
| `coverLetter` | string |
| `status` | ApplicationStatus |
| `createdAt` | Timestamp |

### `enrollments`
| Campo | Tipo |
|---|---|
| `userId` | string |
| `parentName` | string |
| `parentCpf` | string |
| `studentName` | string |
| `studentBirth` | string |
| `address` | string |
| `cep` | string |
| `schoolPreference` | string |
| `status` | EnrollmentStatus |
| `protocol` | string |
| `createdAt` | Timestamp |

### `emergency_alerts`
| Campo | Tipo |
|---|---|
| `userId` | string |
| `type` | EmergencyAlertType |
| `location` | GeoLocation |
| `description` | string |
| `status` | EmergencyAlertStatus |
| `protocol` | string |
| `createdAt` | Timestamp |

### `notifications`
| Campo | Tipo |
|---|---|
| `recipientId` | string |
| `kind` | NotificationKind |
| `tone` | NotificationTone |
| `title` | string |
| `message` | string |
| `href` | string |
| `source` | NotificationSource |
| `read` | boolean |
| `createdAt` | Timestamp |

### `admin_audit_logs`
| Campo | Tipo |
|---|---|
| `adminId` | string |
| `adminName` | string |
| `collection` | string |
| `documentId` | string |
| `action` | AdminAuditAction |
| `details` | string |
| `createdAt` | Timestamp |

## Catalogos publicos

As colecoes abaixo usam o padrao de `content.service.ts`: `status`, `createdAt`, `updatedAt` e `deletedAt`.

| Colecao | Tipo principal |
|---|---|
| `works` | Work |
| `events` | Event |
| `notices` | Notice |
| `businesses` | Business |
| `community_groups` | CommunityGroup |
| `safety_zones` | SafetyZone |
| `environment_data` | EnvironmentData |
| `social_programs` | SocialProgram |
| `tax_records` | TaxRecord |
| `traffic_alerts` | TrafficAlert |
| `polls` | Poll |
| `public_services` | PublicService |
| `pharmacy_items` | PharmacyItem |
| `education_schools` | EducationSchool |
