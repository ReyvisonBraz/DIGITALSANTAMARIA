"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPetitionCallable = void 0;
const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
if (!admin.apps.length)
    admin.initializeApp();
exports.signPetitionCallable = functions.https.onCall({ enforceAppCheck: false }, async (request) => {
    var _a;
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Autenticação necessária para assinar petições.');
    }
    const { petitionId } = request.data;
    const userId = request.auth.uid;
    const userName = (_a = request.auth.token.name) !== null && _a !== void 0 ? _a : 'Cidadão';
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
                throw new functions.https.HttpsError('already-exists', 'Você já assinou esta petição.');
            }
            if (!petitionSnap.exists) {
                throw new functions.https.HttpsError('not-found', 'Petição não encontrada.');
            }
            const petition = petitionSnap.data();
            if (petition.status !== 'active') {
                throw new functions.https.HttpsError('failed-precondition', 'Esta petição não está mais ativa.');
            }
            tx.set(signatureRef, {
                petitionId,
                userId,
                userName,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            tx.update(petitionRef, {
                signaturesCount: admin.firestore.FieldValue.increment(1),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            if (petition.signaturesCount + 1 >= petition.goal) {
                tx.update(petitionRef, { status: 'achieved' });
            }
        });
        return { success: true };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        console.error('[signPetitionCallable] Erro:', error);
        throw new functions.https.HttpsError('internal', 'Erro interno ao registrar assinatura.');
    }
});
//# sourceMappingURL=signPetition.js.map