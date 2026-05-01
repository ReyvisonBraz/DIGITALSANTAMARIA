import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  in_review: {
    title: 'Solicitação em Análise',
    body: 'Sua solicitação foi recebida e está sendo analisada pela equipe municipal.',
  },
  resolved: {
    title: 'Solicitação Resolvida',
    body: 'Sua solicitação foi resolvida. Veja a resposta no aplicativo.',
  },
  rejected: {
    title: 'Solicitação Indeferida',
    body: 'Sua solicitação não pôde ser atendida.',
  },
  analyzing: {
    title: 'Solicitação em Análise',
    body: 'Sua solicitação entrou na fila de análise da prefeitura.',
  },
  solved: {
    title: 'Solicitação Resolvida',
    body: 'Sua solicitação da ouvidoria foi resolvida.',
  },
};

async function notifyUser(userId: string, status: string): Promise<void> {
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
      notification: { title: message.title, body: message.body },
      data: { type: 'status_update', status },
    });
    console.log(`[onStatusChanged] Notificação enviada para ${userId}`);
  } catch (error) {
    console.error('[onStatusChanged] Erro ao enviar notificação:', error);
  }
}

const onReportStatusChanged = functions.firestore.onDocumentUpdated(
  'reports/{reportId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after || before.status === after.status) return;
    await notifyUser(after.reporterId, after.status);
  }
);

const onDemandStatusChanged = functions.firestore.onDocumentUpdated(
  'demands/{demandId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after || before.status === after.status) return;
    await notifyUser(after.authorId, after.status);
  }
);

export const onStatusChanged = {
  report: onReportStatusChanged,
  demand: onDemandStatusChanged,
};
