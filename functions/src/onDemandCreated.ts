import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

export const onDemandCreated = functions.firestore.onDocumentCreated(
  'demands/{demandId}',
  async (event) => {
    const demandId = event.params.demandId;
    const data = event.data?.data();
    if (!data) return;

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

        tx.set(counterRef, { count: newCount }, { merge: true });
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
