# 14 — Firebase Cloud Functions: Backend Real

---

## Setup Inicial

```bash
# Na raiz do projeto
npm install -g firebase-tools
firebase login
firebase init functions
# Selecionar: TypeScript, Node 20, instalar dependências

# Instalar dependências das functions
cd functions
npm install firebase-admin@^12 firebase-functions@^5 nodemailer
npm install --save-dev @types/nodemailer
```

---

## Arquivo: `functions/src/index.ts`

```typescript
/**
 * Entry point das Firebase Cloud Functions.
 * Exporta todas as funções disponíveis.
 */

export { onReportCreated } from './onReportCreated';
export { onDemandCreated } from './onDemandCreated';
export { onStatusChanged } from './onStatusChanged';
export { signPetitionCallable } from './signPetition';
```

---

## Arquivo: `functions/src/onDemandCreated.ts`

```typescript
import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

/**
 * Trigger: disparado quando uma demanda (ouvidoria) é criada.
 * Gera um protocolo único definitivo e atualiza o documento.
 *
 * O frontend gera um protocolo temporário (pode haver colisão).
 * Esta function gera o protocolo final garantido único via
 * contagem atômica no Firestore.
 */
export const onDemandCreated = functions.firestore.onDocumentCreated(
  'demands/{demandId}',
  async (event) => {
    const demandId = event.params.demandId;
    const data = event.data?.data();
    if (!data) return;

    // Contador atômico de demandas (documento de sequência)
    const counterRef = admin.firestore().doc('_counters/demands');

    try {
      const protocol = await admin.firestore().runTransaction(async (tx) => {
        const counterDoc = await tx.get(counterRef);
        const currentCount = counterDoc.exists
          ? (counterDoc.data()?.count ?? 0)
          : 0;

        const newCount = currentCount + 1;
        const year = new Date().getFullYear();
        const seq = String(newCount).padStart(5, '0');
        const protocolId = `OUV-${year}-${seq}`;

        // Atualiza contador
        tx.set(counterRef, { count: newCount }, { merge: true });

        // Atualiza protocolo na demanda
        tx.update(admin.firestore().doc(`demands/${demandId}`), {
          protocolId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return protocolId;
      });

      console.log(`[onDemandCreated] Protocolo ${protocol} gerado para ${demandId}`);
    } catch (error) {
      console.error('[onDemandCreated] Erro ao gerar protocolo:', error);
    }
  }
);
```

---

## Arquivo: `functions/src/onStatusChanged.ts`

```typescript
import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

/**
 * Trigger: disparado quando o status de um relato ou demanda é atualizado.
 * Notifica o cidadão via Firebase Cloud Messaging (push notification).
 *
 * Pré-requisito: cidadão deve ter registrado o FCM token no Firestore
 * (campos users/{uid}.fcmToken e fcmTokenUpdatedAt)
 */

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  in_review: {
    title: 'Solicitação em Análise',
    body: 'Sua solicitação foi recebida e está sendo analisada pela equipe municipal.',
  },
  resolved: {
    title: '✅ Solicitação Resolvida',
    body: 'Sua solicitação foi resolvida. Veja a resposta no aplicativo.',
  },
  rejected: {
    title: 'Solicitação Indeferida',
    body: 'Sua solicitação não pôde ser atendida. Confira a justificativa no aplicativo.',
  },
  analyzing: {
    title: 'Solicitação em Análise',
    body: 'Sua solicitação entrou na fila de análise da prefeitura.',
  },
  solved: {
    title: '✅ Solicitação Resolvida',
    body: 'Sua solicitação da ouvidoria foi resolvida.',
  },
};

async function notifyUser(userId: string, status: string): Promise<void> {
  // Busca o FCM token do usuário
  const userDoc = await admin.firestore().doc(`users/${userId}`).get();
  const fcmToken = userDoc.data()?.fcmToken;

  if (!fcmToken) {
    console.log(`[onStatusChanged] Usuário ${userId} sem FCM token`);
    return;
  }

  const message = STATUS_MESSAGES[status];
  if (!message) return;

  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: message.title,
        body: message.body,
      },
      data: {
        type: 'status_update',
        status,
      },
    });
    console.log(`[onStatusChanged] Notificação enviada para ${userId}`);
  } catch (error) {
    console.error('[onStatusChanged] Erro ao enviar notificação:', error);
  }
}

// Trigger para relatos
export const onReportStatusChanged = functions.firestore.onDocumentUpdated(
  'reports/{reportId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;
    if (before.status === after.status) return; // status não mudou

    await notifyUser(after.reporterId, after.status);
  }
);

// Trigger para demandas
export const onDemandStatusChanged = functions.firestore.onDocumentUpdated(
  'demands/{demandId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;
    if (before.status === after.status) return;

    await notifyUser(after.authorId, after.status);
  }
);

// Re-exporta ambas como um único objeto para o index.ts
export const onStatusChanged = {
  report: onReportStatusChanged,
  demand: onDemandStatusChanged,
};
```

---

## Arquivo: `functions/src/signPetition.ts`

```typescript
import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

/**
 * Callable Function: assina uma petição com garantia de atomicidade.
 *
 * Uso no frontend (substitui runTransaction client-side):
 *
 * const signPetition = httpsCallable(functions, 'signPetitionCallable');
 * await signPetition({ petitionId, userId, userName });
 *
 * Vantagem sobre client-side: menor latência em writes concorrentes,
 * melhor segurança (não expõe lógica ao cliente).
 */
export const signPetitionCallable = functions.https.onCall(
  { enforceAppCheck: false }, // habilitar AppCheck em produção
  async (request) => {
    // Verifica autenticação
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Autenticação necessária para assinar petições.'
      );
    }

    const { petitionId } = request.data as { petitionId: string };
    const userId = request.auth.uid;
    const userName = request.auth.token.name ?? 'Cidadão';

    if (!petitionId) {
      throw new functions.https.HttpsError('invalid-argument', 'petitionId é obrigatório');
    }

    const sigId = `${petitionId}_${userId}`;
    const petitionRef = admin.firestore().doc(`petitions/${petitionId}`);
    const signatureRef = admin.firestore().doc(`petition_signatures/${sigId}`);

    try {
      await admin.firestore().runTransaction(async (tx) => {
        const [sigSnap, petitionSnap] = await Promise.all([
          tx.get(signatureRef),
          tx.get(petitionRef),
        ]);

        if (sigSnap.exists) {
          throw new functions.https.HttpsError(
            'already-exists',
            'Você já assinou esta petição.'
          );
        }

        if (!petitionSnap.exists) {
          throw new functions.https.HttpsError('not-found', 'Petição não encontrada.');
        }

        const petition = petitionSnap.data()!;
        if (petition.status !== 'active') {
          throw new functions.https.HttpsError(
            'failed-precondition',
            'Esta petição não está mais ativa.'
          );
        }

        // Registra assinatura
        tx.set(signatureRef, {
          petitionId,
          userId,
          userName,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Incremento atômico
        tx.update(petitionRef, {
          signaturesCount: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Se atingiu a meta, atualiza status
        if (petition.signaturesCount + 1 >= petition.goal) {
          tx.update(petitionRef, { status: 'achieved' });
        }
      });

      return { success: true };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) throw error;
      console.error('[signPetitionCallable] Erro:', error);
      throw new functions.https.HttpsError('internal', 'Erro interno ao registrar assinatura.');
    }
  }
);
```

---

## Arquivo: `functions/tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017"
  },
  "compileOnSave": true,
  "include": ["src"]
}
```

---

## Deploy das Functions

```bash
# Build e deploy
cd functions
npm run build
cd ..
firebase deploy --only functions

# Deploy de uma function específica
firebase deploy --only functions:onDemandCreated

# Emular localmente
firebase emulators:start --only functions,firestore
```
