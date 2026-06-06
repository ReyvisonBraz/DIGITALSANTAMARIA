import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  in_review: {
    title: 'Solicitacao em analise',
    body: 'Sua solicitacao foi recebida e esta sendo analisada pela equipe municipal.',
  },
  resolved: {
    title: 'Solicitacao resolvida',
    body: 'Sua solicitacao foi resolvida. Veja a resposta no aplicativo.',
  },
  rejected: {
    title: 'Solicitacao indeferida',
    body: 'Sua solicitacao nao pode ser atendida.',
  },
  analyzing: {
    title: 'Solicitacao em analise',
    body: 'Sua solicitacao entrou na fila de analise da prefeitura.',
  },
  solved: {
    title: 'Solicitacao resolvida',
    body: 'Sua solicitacao da ouvidoria foi resolvida.',
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
    console.log(`[onStatusChanged] Notificacao enviada para ${userId}`);
  } catch (error) {
    console.error('[onStatusChanged] Erro ao enviar notificacao:', error);
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
