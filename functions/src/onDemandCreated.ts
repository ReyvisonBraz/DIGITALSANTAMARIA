import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

export const onDemandCreated = functions.firestore
  .document('demands/{demandId}')
  .onCreate(async (_snap, context) => {
    const demandId = context.params.demandId;
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
  });
