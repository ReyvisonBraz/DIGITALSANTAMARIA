import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

async function notifyById(
  userId: string | null | undefined,
  title: string,
  body: string,
  type: string,
): Promise<void> {
  if (!userId) return;
  try {
    await admin.firestore().collection('notifications').add({
      recipientId: userId,
      title,
      body,
      type,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error(`[notifyById] Erro ao criar notificacao para ${userId}:`, error);
  }
}

export const onAppointmentCreated = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snapshot) => {
    const appointment = snapshot.data();
    const userId = appointment?.userId;
    const unitName = appointment?.unitName || 'unidade de saúde';
    const date = appointment?.date || '';
    const time = appointment?.time || '';

    await notifyById(
      userId,
      'Agendamento confirmado',
      `Sua consulta na ${unitName} foi agendada para ${date} às ${time}.`,
      'appointment_created',
    );
  });

export const onEnrollmentCreated = functions.firestore
  .document('enrollments/{enrollmentId}')
  .onCreate(async (snapshot) => {
    const enrollment = snapshot.data();
    const userId = enrollment?.userId;
    const studentName = enrollment?.studentName || 'aluno';

    await notifyById(
      userId,
      'Matrícula recebida',
      `Solicitação de matrícula para ${studentName} foi recebida. Acompanhe pelo painel do cidadão.`,
      'enrollment_created',
    );
  });

export const onEmergencyAlertCreated = functions.firestore
  .document('emergency_alerts/{alertId}')
  .onCreate(async (snapshot) => {
    const alert = snapshot.data();
    const userId = alert?.userId;
    const alertType = alert?.type || 'emergência';

    await notifyById(
      userId,
      'Alerta de emergência registrado',
      `Seu alerta de ${alertType} foi registrado. A equipe municipal foi notificada.`,
      'emergency_created',
    );
  });

export const onDemandMessageCreated = functions.firestore
  .document('demand_messages/{messageId}')
  .onCreate(async (snapshot) => {
    const message = snapshot.data();
    if (!message) return;

    const demandId = message.demandId;
    if (!demandId) return;

    const demandDoc = await admin.firestore().doc(`demands/${demandId}`).get();
    if (!demandDoc.exists) return;

    const demand = demandDoc.data()!;
    const authorRole = message.authorRole;
    let recipientId: string | null = null;

    if (authorRole === 'citizen') {
      recipientId = demand.isAnonymous ? null : demand.authorId;
      if (recipientId) {
        await notifyById(
          recipientId,
          'Nova mensagem na sua solicitação',
          'A equipe municipal respondeu à sua solicitação na ouvidoria.',
          'demand_message',
        );
      }
    } else if (authorRole === 'staff' || authorRole === 'admin') {
      recipientId = demand.isAnonymous ? null : demand.authorId;
      if (recipientId) {
        await notifyById(
          recipientId,
          'Nova mensagem na sua solicitação',
          'A equipe municipal enviou uma mensagem na sua solicitação.',
          'demand_message',
        );
      }
    }
  });

export const onReportMessageCreated = functions.firestore
  .document('report_messages/{messageId}')
  .onCreate(async (snapshot) => {
    const message = snapshot.data();
    if (!message) return;

    const reportId = message.reportId;
    if (!reportId) return;

    const reportDoc = await admin.firestore().doc(`reports/${reportId}`).get();
    if (!reportDoc.exists) return;

    const report = reportDoc.data()!;
    const authorRole = message.authorRole;
    let recipientId: string | null = null;

    if (authorRole === 'citizen') {
      recipientId = report.reporterId;
      if (recipientId) {
        await notifyById(
          recipientId,
          'Nova mensagem no seu relato',
          'A equipe municipal respondeu ao seu relato.',
          'report_message',
        );
      }
    } else if (authorRole === 'staff' || authorRole === 'admin') {
      recipientId = report.reporterId;
      if (recipientId) {
        await notifyById(
          recipientId,
          'Nova mensagem no seu relato',
          'A equipe municipal enviou uma mensagem no seu relato.',
          'report_message',
        );
      }
    }
  });