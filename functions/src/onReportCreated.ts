import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

/**
 * Gera protocolo sequencial para relatos (REP-YYYY-00001).
 * Mesmo padrão do onDemandCreated (OUV-YYYY-00001).
 */
export const onReportCreated = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (_snap, context) => {
    const reportId = context.params.reportId;
    const counterRef = admin.firestore().doc('_counters/reports');

    try {
      const protocol = await admin.firestore().runTransaction(async (tx) => {
        const counterDoc = await tx.get(counterRef);
        const currentCount = counterDoc.exists
          ? (counterDoc.data()?.count ?? 0)
          : 0;

        const newCount = currentCount + 1;
        const year = new Date().getFullYear();
        const seq = String(newCount).padStart(5, '0');
        const protocolId = `REP-${year}-${seq}`;

        tx.set(counterRef, { count: newCount }, { merge: true });
        tx.update(admin.firestore().doc(`reports/${reportId}`), {
          protocolId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return protocolId;
      });

      console.log(`[onReportCreated] Protocolo ${protocol} gerado para ${reportId}`);
    } catch (error) {
      console.error('[onReportCreated] Erro ao gerar protocolo:', error);
    }
  });
