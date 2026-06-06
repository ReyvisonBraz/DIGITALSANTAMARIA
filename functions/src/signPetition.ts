import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

export const signPetitionCallable = functions.https.onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Autenticacao necessaria para assinar peticoes.'
      );
    }

    const { petitionId, userName: inputUserName } = request.data as {
      petitionId?: string;
      userName?: string;
    };
    const userId = request.auth.uid;
    const userName = inputUserName?.trim() || request.auth.token.name || 'Cidadao';

    if (!petitionId || typeof petitionId !== 'string') {
      throw new functions.https.HttpsError('invalid-argument', 'petitionId e obrigatorio');
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
            'Voce ja assinou esta peticao.'
          );
        }

        if (!petitionSnap.exists) {
          throw new functions.https.HttpsError('not-found', 'Peticao nao encontrada.');
        }

        const petition = petitionSnap.data()!;
        if (petition.status !== 'active') {
          throw new functions.https.HttpsError(
            'failed-precondition',
            'Esta peticao nao esta mais ativa.'
          );
        }

        const nextSignaturesCount = (petition.signaturesCount ?? 0) + 1;
        const nextStatus = nextSignaturesCount >= petition.goal ? 'achieved' : petition.status;

        tx.set(signatureRef, {
          petitionId,
          userId,
          userName,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        tx.update(petitionRef, {
          signaturesCount: admin.firestore.FieldValue.increment(1),
          status: nextStatus,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      return { success: true };
    } catch (error) {
      if (error instanceof functions.https.HttpsError) throw error;
      console.error('[signPetitionCallable] Erro:', error);
      throw new functions.https.HttpsError('internal', 'Erro interno ao registrar assinatura.');
    }
  }
);
