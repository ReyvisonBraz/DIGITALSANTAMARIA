"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDemandStatusChanged = exports.onReportStatusChanged = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
if (!admin.apps.length)
    admin.initializeApp();
const STATUS_MESSAGES = {
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
async function notifyUser(userId, status) {
    var _a;
    if (!userId)
        return;
    const message = STATUS_MESSAGES[status];
    if (!message)
        return;
    const userDoc = await admin.firestore().doc(`users/${userId}`).get();
    const fcmToken = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.fcmToken;
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
    }
    catch (error) {
        console.error('[onStatusChanged] Erro ao enviar notificação:', error);
    }
}
exports.onReportStatusChanged = functions.firestore
    .document('reports/{reportId}')
    .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after || before.status === after.status)
        return;
    await notifyUser(after.reporterId, after.status);
});
exports.onDemandStatusChanged = functions.firestore
    .document('demands/{demandId}')
    .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after || before.status === after.status)
        return;
    await notifyUser(after.authorId, after.status);
});
//# sourceMappingURL=onStatusChanged.js.map