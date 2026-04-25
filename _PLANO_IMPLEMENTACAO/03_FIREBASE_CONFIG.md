# 03 — Firebase: Config, Storage e Firestore Rules

---

## Arquivo: `lib/firebase/storage.ts` (NOVO)

```typescript
'use client';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { auth } from './firebase';
import type { StorageFile } from '@/types/common.types';

const storage = getStorage();

/**
 * Faz upload de um arquivo para o Firebase Storage com progresso.
 * Caminho padrão: {folder}/{uid}/{timestamp}_{filename}
 *
 * @param file - Arquivo a ser enviado
 * @param folder - Pasta no Storage (ex: 'reports', 'avatars')
 * @param onProgress - Callback opcional com % de progresso (0–100)
 * @returns Metadados do arquivo armazenado
 */
export async function uploadFile(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void
): Promise<StorageFile> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado');

  // Gera nome único para evitar colisões
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
  const path = `${folder}/${uid}/${timestamp}_${safeName}`;

  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calcula e reporta progresso
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(percent);
      },
      (error) => reject(error),
      async () => {
        // Upload concluído — pega URL pública
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          url,
          path,
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }
    );
  });
}

/**
 * Remove um arquivo do Storage pelo caminho.
 * Ignora erro se o arquivo não existir.
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: unknown) {
    // Ignora "object-not-found" — pode ter sido deletado antes
    if ((error as { code?: string }).code !== 'storage/object-not-found') {
      throw error;
    }
  }
}
```

---

## Arquivo: `lib/firebase/converters.ts` (NOVO)

```typescript
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import type { UserProfile } from '@/types/user.types';
import type { Report } from '@/types/report.types';
import type { Demand } from '@/types/demand.types';
import type { Petition } from '@/types/petition.types';

/**
 * Converters tipados para Firestore.
 * Garantem que os dados lidos/escritos correspondem aos nossos tipos.
 * Uso: collection(db, 'users').withConverter(userConverter)
 */

export const userConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore(user: WithFieldValue<UserProfile>) {
    return user;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserProfile {
    const data = snapshot.data(options);
    return {
      uid: snapshot.id,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL ?? null,
      role: data.role ?? 'citizen',
      department: data.department ?? null,
      neighborhood: data.neighborhood ?? null,
      phone: data.phone ?? null,
      cpfVerified: data.cpfVerified ?? false,
      points: data.points ?? 0,
      level: data.level ?? 'Cidadão',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

export const reportConverter: FirestoreDataConverter<Report> = {
  toFirestore(report: WithFieldValue<Report>) {
    return report;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Report {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      reporterId: data.reporterId,
      reporterName: data.reporterName ?? '',
      type: data.type ?? 'other',
      title: data.title ?? '',
      description: data.description ?? '',
      status: data.status ?? 'pending',
      protocol: data.protocol ?? '',
      location: data.location ?? null,
      photo: data.photo ?? null,
      votes: data.votes ?? 0,
      isPetition: data.isPetition ?? false,
      adminResponse: data.adminResponse ?? null,
      clerkId: data.clerkId ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

export const demandConverter: FirestoreDataConverter<Demand> = {
  toFirestore(demand: WithFieldValue<Demand>) {
    return demand;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Demand {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      protocolId: data.protocolId ?? '',
      authorId: data.authorId ?? '',
      authorName: data.authorName ?? null,
      type: data.type ?? 'reclamacao',
      category: data.category ?? 'outros',
      subject: data.subject ?? '',
      status: data.status ?? 'pending',
      content: data.content ?? { text: '', mediaFiles: [], location: null },
      adminAction: data.adminAction ?? null,
      isAnonymous: data.isAnonymous ?? false,
      consent: data.consent ?? false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

export const petitionConverter: FirestoreDataConverter<Petition> = {
  toFirestore(petition: WithFieldValue<Petition>) {
    return petition;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Petition {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      creatorId: data.creatorId,
      creatorName: data.creatorName ?? '',
      creatorPhotoURL: data.creatorPhotoURL ?? null,
      title: data.title ?? '',
      description: data.description ?? '',
      category: data.category ?? '',
      goal: data.goal ?? 100,
      signaturesCount: data.signaturesCount ?? 0,
      status: data.status ?? 'active',
      officialReply: data.officialReply ?? null,
      coverImageURL: data.coverImageURL ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
```

---

## Atualização do `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ═══════════════════════════════════════════
    // FUNÇÕES AUXILIARES
    // ═══════════════════════════════════════════

    // Verifica se o usuário está autenticado
    function isSignedIn() {
      return request.auth != null;
    }

    // Verifica se o usuário é dono do recurso
    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }

    // Dados recebidos na requisição
    function incoming() {
      return request.resource.data;
    }

    // Dados já existentes no documento
    function existing() {
      return resource.data;
    }

    // Verifica se o usuário é admin ou clerk
    // (verifica a coleção /admins/{uid})
    function isAdmin() {
      return isSignedIn() &&
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // Verifica se o admin tem acesso a um departamento específico
    function hasDepAccess(dept) {
      let adminDoc = get(/databases/$(database)/documents/admins/$(request.auth.uid));
      return isAdmin() && (
        adminDoc.data.role == 'admin' ||
        adminDoc.data.department == dept ||
        adminDoc.data.department == null
      );
    }

    // Validação de ID (alfanumérico, hífen, underscore, máx 128)
    function isValidId(id) {
      return id.matches('^[a-zA-Z0-9_-]{1,128}$');
    }

    // ═══════════════════════════════════════════
    // BLOQUEIO PADRÃO
    // ═══════════════════════════════════════════
    match /{document=**} {
      allow read, write: if false;
    }

    // ═══════════════════════════════════════════
    // USUÁRIOS /users/{userId}
    // ═══════════════════════════════════════════
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();

      // Criação automática no primeiro login
      allow create: if isOwner(userId)
        && incoming().role == 'citizen'
        && incoming().email == request.auth.token.email;

      // Cidadão pode atualizar próprios dados (exceto role e uid)
      allow update: if isOwner(userId)
        && incoming().role == existing().role
        && incoming().uid == existing().uid;

      // Admin pode atualizar qualquer campo
      allow update: if isAdmin();
    }

    // ═══════════════════════════════════════════
    // ADMINS /admins/{uid}
    // ═══════════════════════════════════════════
    match /admins/{uid} {
      allow read: if isAdmin();
      // Apenas admin pode criar/atualizar outros admins
      allow write: if isAdmin()
        && get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }

    // ═══════════════════════════════════════════
    // RELATOS /reports/{reportId}
    // ═══════════════════════════════════════════
    match /reports/{reportId} {
      // Cidadão vê seus próprios; admin vê todos
      allow read: if isOwner(resource.data.reporterId) || isAdmin();

      // Listagem pública de relatos (para mapa da cidade)
      allow list: if true;

      // Criar relato exige autenticação; status inicial = pending
      allow create: if isSignedIn()
        && incoming().reporterId == request.auth.uid
        && incoming().status == 'pending'
        && incoming().title.size() >= 5
        && incoming().description.size() >= 10;

      // Admin/clerk pode atualizar status e adicionar resposta
      allow update: if isAdmin()
        && incoming().reporterId == existing().reporterId
        && incoming().createdAt == existing().createdAt;
    }

    // ═══════════════════════════════════════════
    // DEMANDAS (OUVIDORIA) /demands/{demandId}
    // ═══════════════════════════════════════════
    match /demands/{demandId} {
      // Dono ou admin pode ler
      allow read: if isOwner(resource.data.authorId) || isAdmin();

      // Criar demanda exige autenticação e consentimento
      allow create: if isSignedIn()
        && incoming().authorId == request.auth.uid
        && incoming().status == 'pending'
        && incoming().consent == true
        && incoming().subject.size() >= 5;

      // Admin/clerk pode atualizar status e adminAction
      allow update: if isAdmin()
        && incoming().authorId == existing().authorId
        && incoming().createdAt == existing().createdAt;
    }

    // ═══════════════════════════════════════════
    // PETIÇÕES /petitions/{petitionId}
    // ═══════════════════════════════════════════
    match /petitions/{petitionId} {
      // Petições são públicas
      allow read: if true;

      // Criar petição exige autenticação
      allow create: if isSignedIn()
        && incoming().creatorId == request.auth.uid
        && incoming().signaturesCount == 0
        && incoming().status == 'active'
        && incoming().title.size() >= 10
        && incoming().goal > 0;

      // Criador pode editar (não pode alterar contagem)
      allow update: if isOwner(resource.data.creatorId)
        && incoming().signaturesCount == existing().signaturesCount;

      // Admin pode tudo
      allow update: if isAdmin();
    }

    // ═══════════════════════════════════════════
    // ASSINATURAS /petition_signatures/{sigId}
    // ═══════════════════════════════════════════
    match /petition_signatures/{sigId} {
      allow read: if true;

      // Assinar: ID deve ser "{petitionId}_{userId}" para garantir unicidade
      allow create: if isSignedIn()
        && incoming().userId == request.auth.uid
        && sigId == incoming().petitionId + '_' + request.auth.uid
        && incoming().petitionId.size() > 0;

      // Assinatura é imutável
      allow update, delete: if false;
    }

    // ═══════════════════════════════════════════
    // AGENDAMENTOS /appointments/{appointmentId}
    // ═══════════════════════════════════════════
    match /appointments/{appointmentId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();

      allow create: if isSignedIn()
        && incoming().userId == request.auth.uid
        && incoming().status == 'scheduled';

      // Usuário pode cancelar; admin pode atualizar qualquer status
      allow update: if (isOwner(resource.data.userId) && incoming().status == 'cancelled')
        || isAdmin();
    }

    // ═══════════════════════════════════════════
    // UNIDADES DE SAÚDE /health_units/{unitId}
    // ═══════════════════════════════════════════
    match /health_units/{unitId} {
      // Leitura pública (para listagem)
      allow read: if true;

      // Escrita apenas por admin/clerk de saúde
      allow write: if hasDepAccess('saude');
    }

    // ═══════════════════════════════════════════
    // VAGAS /jobs/{jobId}
    // ═══════════════════════════════════════════
    match /jobs/{jobId} {
      allow read: if true;

      allow create: if isSignedIn()
        && incoming().employerId == request.auth.uid
        && incoming().title.size() >= 5;

      allow update: if isOwner(resource.data.employerId) || isAdmin();
    }

    // ═══════════════════════════════════════════
    // CANDIDATURAS /job_applications/{appId}
    // ═══════════════════════════════════════════
    match /job_applications/{appId} {
      allow read: if isOwner(resource.data.applicantId) || isAdmin();

      allow create: if isSignedIn()
        && incoming().applicantId == request.auth.uid
        && incoming().status == 'applied'
        && exists(/databases/$(database)/documents/jobs/$(incoming().jobId));

      allow update: if isAdmin();
    }

    // ═══════════════════════════════════════════
    // ALERTAS DE EMERGÊNCIA /emergency_alerts/{alertId}
    // ═══════════════════════════════════════════
    match /emergency_alerts/{alertId} {
      // Leitura: apenas admin (SOS tem dados de localização sensíveis)
      allow read: if isAdmin();

      // Criar alerta exige autenticação
      allow create: if isSignedIn()
        && incoming().userId == request.auth.uid
        && incoming().status == 'active';

      allow update: if isAdmin();
    }
  }
}
```

---

## Arquivo: `.env.example` Atualizado

```env
# URL do aplicativo
APP_URL=http://localhost:3000

# Google Gemini AI
# Obtenha em: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=sua_chave_aqui

# Google Maps (para mapa de relatos e localização de unidades)
# Obtenha em: https://console.cloud.google.com → Maps JavaScript API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_maps_aqui

# Firebase Emulator (opcional — apenas para desenvolvimento local)
# NEXT_PUBLIC_USE_EMULATOR=true

# Usado pelo AI Studio para desabilitar HMR
# DISABLE_HMR=true
```
