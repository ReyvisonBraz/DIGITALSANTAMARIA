"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPetitionCallable = void 0;
const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
if (!admin.apps.length)
    admin.initializeApp();
exports.signPetitionCallable = functions.https.onCall({ enforceAppCheck: false }, async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Autenticação necessária para assinar petições.');
    }
    const { petitionId, userName: inputUserName } = request.data;
    const userId = request.auth.uid;
    const userName = (inputUserName === null || inputUserName === void 0 ? void 0 : inputUserName.trim()) || request.auth.token.name || 'Cidadão';
    if (!petitionId || typeof petitionId !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'petitionId é obrigatório');
    }
    const sigId = `${petitionId}_${userId}`;
    const petitionRef = admin.firestore().doc(`petitions/${petitionId}`);
    const signatureRef = admin.firestore().doc(`petition_signatures/${sigId}`);
    try {
        await admin.firestore().runTransaction(async (tx) => {
            var _a;
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
            const nextSignaturesCount = ((_a = petition.signaturesCount) !== null && _a !== void 0 ? _a : 0) + 1;
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
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        console.error('[signPetitionCallable] Erro:', error);
        throw new functions.https.HttpsError('internal', 'Erro interno ao registrar assinatura.');
    }
});
//# sourceMappingURL=signPetition.js.map