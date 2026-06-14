import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  in_review: {
    title: 'Solicitação em análise',
    body: 'Sua solicitação foi recebida e está sendo analisada pela equipe municipal.',
  },
  resolved: {
    title: 'Solicitação resolvida',
    body: 'Sua solicitação foi resolvida. Veja a resposta no aplicativo.',
  },
  rejected: {
    title: 'Solicitação indeferida',
    body: 'Sua solicitação não pode ser atendida.',
  },
  analyzing: {
    title: 'Solicitação em análise',
    body: 'Sua solicitação entrou na fila de análise da prefeitura.',
  },
  solved: {
    title: 'Solicitação resolvida',
    body: 'Sua solicitação da ouvidoria foi resolvida.',
  },
};

async function notifyUser(userId: string | null | undefined, status: string): Promise<void> {
  if (!userId) return;

  const message = STATUS_MESSAGES[status];
  if (!message) return;

  const userDoc = await admin.firestore().doc(`users/${userId}`).get();
  const fcmToken = userDoc.data()?.fcmToken;

  if (!fcmToken) {
    console.log(`[onStatusChanged] Usuario ${userId} sem FCM token`);
    return;
  }

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

export const onReportStatusChanged = functions.firestore
  .document('reports/{reportId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after || before.status === after.status) return;
    await notifyUser(after.reporterId, after.status);
  });

export const onDemandStatusChanged = functions.firestore
  .document('demands/{demandId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after || before.status === after.status) return;
    await notifyUser(after.authorId, after.status);
  });
