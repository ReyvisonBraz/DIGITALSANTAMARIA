"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.votePollCallable = void 0;
const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
if (!admin.apps.length)
    admin.initializeApp();
exports.votePollCallable = functions.https.onCall({ enforceAppCheck: false }, async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Autenticacao necessaria para votar.');
    }
    const { pollId, optionId } = request.data;
    const userId = request.auth.uid;
    if (!pollId || typeof pollId !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'pollId e obrigatorio');
    }
    if (!optionId || typeof optionId !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'optionId e obrigatorio');
    }
    const db = admin.firestore();
    const pollRef = db.doc(`polls/${pollId}`);
    const voteRef = db.doc(`poll_votes/${pollId}_${userId}`);
    try {
        await db.runTransaction(async (tx) => {
            const [pollSnap, voteSnap] = await Promise.all([
                tx.get(pollRef),
                tx.get(voteRef),
            ]);
            if (voteSnap.exists) {
                throw new functions.https.HttpsError('already-exists', 'Voce ja votou nesta consulta.');
            }
            if (!pollSnap.exists) {
                throw new functions.https.HttpsError('not-found', 'Votacao nao encontrada.');
            }
            const poll = pollSnap.data();
            if (poll.status !== 'published' || poll.deletedAt) {
                throw new functions.https.HttpsError('failed-precondition', 'Esta votacao nao esta disponivel.');
            }
            if (poll.isActive !== true) {
                throw new functions.https.HttpsError('failed-precondition', 'Esta votacao esta encerrada.');
            }
            const options = Array.isArray(poll.options) ? poll.options : [];
            const optionIndex = options.findIndex((option) => (option === null || option === void 0 ? void 0 : option.id) === optionId);
            if (optionIndex < 0) {
                throw new functions.https.HttpsError('not-found', 'Opcao de voto nao encontrada.');
            }
            const nextOptions = options.map((option, index) => (index === optionIndex
                ? Object.assign(Object.assign({}, option), { votes: Number(option.votes || 0) + 1 }) : option));
            tx.set(voteRef, {
                pollId,
                optionId,
                userId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            tx.update(pollRef, {
                options: nextOptions,
                totalVotes: admin.firestore.FieldValue.increment(1),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        });
        return { success: true };
    }
    catch (error) {
        if (error instanceof functions.https.HttpsError)
            throw error;
        console.error('[votePollCallable] Erro:', error);
        throw new functions.https.HttpsError('internal', 'Erro interno ao registrar voto.');
    }
});
//# sourceMappingURL=votePoll.js.map