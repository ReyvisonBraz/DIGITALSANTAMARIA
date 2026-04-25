# 02 — Tipos TypeScript + Schemas Firestore

> Todos os tipos centralizados em `/types/`. Sem `any` no projeto.
> Cada tipo mapeia exatamente uma coleção do Firestore.

---

## Arquivo: `types/common.types.ts`

```typescript
import type { Timestamp } from 'firebase/firestore';

/** Coordenadas geográficas capturadas via navigator.geolocation */
export interface GeoLocation {
  lat: number;
  lng: number;
  address: string; // endereço humanizado via geocoding reverso
}

/** Metadados de arquivo no Firebase Storage */
export interface StorageFile {
  url: string;       // URL de download pública
  path: string;      // caminho no Storage (para deletar)
  name: string;      // nome original do arquivo
  size: number;      // tamanho em bytes
  type: string;      // MIME type
}

/** Resposta paginada do Firestore (para listagens grandes) */
export interface PaginatedResult<T> {
  items: T[];
  lastDoc: unknown | null; // DocumentSnapshot para cursor de paginação
  hasMore: boolean;
}

/** Status genérico de operação assíncrona */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
```

---

## Arquivo: `types/user.types.ts`

```typescript
import type { Timestamp } from 'firebase/firestore';

/** Papéis disponíveis na plataforma */
export type UserRole = 'citizen' | 'admin' | 'clerk';

/** Departamento municipal (para clerks/admins) */
export type Department =
  | 'saude'
  | 'educacao'
  | 'obras'
  | 'transito'
  | 'tributacao'
  | 'social'
  | 'meio_ambiente'
  | 'seguranca'
  | null;

/**
 * Perfil completo do usuário no Firestore
 * Coleção: /users/{uid}
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  department: Department;
  neighborhood: string | null; // bairro da cidade
  phone: string | null;
  cpfVerified: boolean;        // CPF verificado digitalmente
  points: number;              // gamificação
  level: string;               // ex: "Cidadão Elite"
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Dados mínimos do usuário autenticado (Firebase Auth) */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
```

---

## Arquivo: `types/report.types.ts`

```typescript
import type { Timestamp } from 'firebase/firestore';
import type { GeoLocation, StorageFile } from './common.types';

/** Categorias de relato */
export type ReportType = 'infrastructure' | 'environment' | 'security' | 'other';

/** Status do ciclo de vida de um relato */
export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'rejected';

/**
 * Relato de problema urbano
 * Coleção: /reports/{reportId}
 */
export interface Report {
  id: string;
  reporterId: string;          // uid do cidadão
  reporterName: string;        // displayName no momento do envio
  type: ReportType;            // classificado automaticamente pelo Gemini
  title: string;
  description: string;
  status: ReportStatus;
  protocol: string;            // ex: "GC-123456"
  location: GeoLocation | null;
  photo: StorageFile | null;   // foto do problema
  votes: number;               // votos de outros cidadãos
  isPetition: boolean;
  adminResponse: string | null; // resposta do admin/clerk
  clerkId: string | null;       // uid de quem respondeu
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Dados para criar um novo relato */
export type CreateReportInput = Pick<
  Report,
  'type' | 'title' | 'description' | 'location' | 'isPetition'
> & {
  photoFile?: File; // arquivo de imagem (antes do upload)
};
```

---

## Arquivo: `types/demand.types.ts`

```typescript
import type { Timestamp } from 'firebase/firestore';
import type { GeoLocation, StorageFile } from './common.types';

/** Tipos de manifestação na ouvidoria */
export type DemandType = 'reclamacao' | 'sugestao' | 'denuncia' | 'elogio';

/** Status do ciclo de vida de uma demanda */
export type DemandStatus = 'pending' | 'analyzing' | 'solved' | 'rejected';

/** Categorias temáticas */
export type DemandCategory =
  | 'infraestrutura'
  | 'saude'
  | 'educacao'
  | 'seguranca'
  | 'meio_ambiente'
  | 'transporte'
  | 'tributos'
  | 'outros';

/** Ação realizada pelo admin/clerk na demanda */
export interface AdminAction {
  clerkId: string;
  clerkName: string;
  response: string;
  updatedAt: Timestamp;
}

/**
 * Demanda da ouvidoria municipal
 * Coleção: /demands/{demandId}
 */
export interface Demand {
  id: string;
  protocolId: string;          // ex: "OUV-2026-01234"
  authorId: string;            // uid do cidadão (null se anônimo)
  authorName: string | null;   // nome no envio (ou "Anônimo")
  type: DemandType;
  category: DemandCategory;
  subject: string;             // assunto resumido
  status: DemandStatus;
  content: {
    text: string;
    mediaFiles: StorageFile[]; // arquivos anexados
    location: GeoLocation | null;
  };
  adminAction: AdminAction | null;
  isAnonymous: boolean;
  consent: boolean;            // aceite dos termos de uso
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Dados para criar uma nova demanda */
export type CreateDemandInput = {
  type: DemandType;
  category: DemandCategory;
  subject: string;
  text: string;
  location?: GeoLocation;
  mediaFiles?: File[];
  isAnonymous: boolean;
  consent: boolean;
};
```

---

## Arquivo: `types/petition.types.ts`

```typescript
import type { Timestamp } from 'firebase/firestore';

/** Status do ciclo de vida de uma petição */
export type PetitionStatus = 'active' | 'achieved' | 'official_reply' | 'closed';

/**
 * Petição cidadã
 * Coleção: /petitions/{petitionId}
 */
export interface Petition {
  id: string;
  creatorId: string;           // uid de quem criou
  creatorName: string;
  creatorPhotoURL: string | null;
  title: string;
  description: string;
  category: string;            // tema da petição
  goal: number;                // meta de assinaturas
  signaturesCount: number;     // incremento atômico
  status: PetitionStatus;
  officialReply: string | null; // resposta oficial da prefeitura
  coverImageURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Registro de assinatura (previne duplicatas via doc ID = uid)
 * Coleção: /petition_signatures/{uid_petitionId}
 */
export interface PetitionSignature {
  id: string;                  // formato: "{petitionId}_{userId}"
  petitionId: string;
  userId: string;
  userName: string;
  createdAt: Timestamp;
}

/** Dados para criar uma nova petição */
export type CreatePetitionInput = Pick<
  Petition,
  'title' | 'description' | 'category' | 'goal'
>;
```

---

## Arquivo: `types/appointment.types.ts`

```typescript
import type { Timestamp } from 'firebase/firestore';

/** Tipos de unidade de saúde */
export type HealthUnitType = 'upa' | 'clinica' | 'hospital' | 'farmacia' | 'cras';

/** Status de espera da unidade */
export type WaitTimeLevel = 'low' | 'medium' | 'high' | 'critical';

/** Status do agendamento */
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

/**
 * Unidade de saúde
 * Coleção: /health_units/{unitId}
 */
export interface HealthUnit {
  id: string;
  name: string;
  type: HealthUnitType;
  address: string;
  phone: string;
  waitTime: string;          // ex: "15 min"
  waitLevel: WaitTimeLevel;
  isOpen: boolean;
  openHours: string;         // ex: "07:00 - 19:00"
  specialties: string[];
  updatedAt: Timestamp;
}

/**
 * Agendamento de consulta
 * Coleção: /appointments/{appointmentId}
 */
export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  unitId: string;
  unitName: string;
  specialty: string;
  date: string;              // ISO string "YYYY-MM-DD"
  time: string;              // ex: "09:30"
  status: AppointmentStatus;
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Dados para criar um agendamento */
export type CreateAppointmentInput = Pick<
  Appointment,
  'unitId' | 'unitName' | 'specialty' | 'date' | 'time' | 'notes'
>;
```

---

## Arquivo: `types/job.types.ts`

```typescript
import type { Timestamp } from 'firebase/firestore';

/** Regime de trabalho */
export type JobType = 'clt' | 'pj' | 'temporario' | 'estagio' | 'voluntario';

/** Status da candidatura */
export type ApplicationStatus = 'applied' | 'viewed' | 'interview' | 'hired' | 'rejected';

/**
 * Vaga de emprego
 * Coleção: /jobs/{jobId}
 */
export interface Job {
  id: string;
  employerId: string;        // uid de quem publicou (ou "prefeitura")
  employerName: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary: string | null;     // ex: "R$ 2.500 - R$ 3.000"
  type: JobType;
  location: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;       // destaque na listagem
  applicationCount: number;  // contador atômico
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Candidatura a uma vaga
 * Coleção: /job_applications/{applicationId}
 */
export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;       // uid
  applicantName: string;
  applicantEmail: string;
  coverLetter: string | null; // carta de apresentação
  status: ApplicationStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Dados para se candidatar a uma vaga */
export type CreateApplicationInput = {
  jobId: string;
  jobTitle: string;
  coverLetter?: string;
};
```

---

## Arquivo: `types/index.ts` (re-exports)

```typescript
// Re-exports centralizados — importar tudo de '@/types'
export type * from './common.types';
export type * from './user.types';
export type * from './report.types';
export type * from './demand.types';
export type * from './petition.types';
export type * from './appointment.types';
export type * from './job.types';
```

---

## Atualização do `firebase-blueprint.json`

O arquivo atual define 8 coleções. Adicionar as novas:

```json
{
  "collections": {
    "demands": {
      "description": "Demandas da ouvidoria municipal",
      "path": "/demands/{demandId}",
      "fields": {
        "protocolId": "string",
        "authorId": "string",
        "type": "reclamacao | sugestao | denuncia | elogio",
        "category": "string",
        "subject": "string",
        "status": "pending | analyzing | solved | rejected",
        "content.text": "string",
        "content.mediaFiles": "array",
        "content.location": "map | null",
        "adminAction": "map | null",
        "isAnonymous": "boolean",
        "consent": "boolean",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    },
    "health_units": {
      "description": "Unidades de saúde (UPAs, clínicas, etc.)",
      "path": "/health_units/{unitId}",
      "fields": {
        "name": "string",
        "type": "upa | clinica | hospital | farmacia | cras",
        "address": "string",
        "phone": "string",
        "waitTime": "string",
        "waitLevel": "low | medium | high | critical",
        "isOpen": "boolean",
        "specialties": "array",
        "updatedAt": "timestamp"
      }
    },
    "admins": {
      "description": "UIDs com acesso admin ou clerk",
      "path": "/admins/{uid}",
      "fields": {
        "role": "admin | clerk",
        "department": "string | null",
        "grantedAt": "timestamp",
        "grantedBy": "string"
      }
    }
  }
}
```
