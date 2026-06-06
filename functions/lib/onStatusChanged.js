"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDemandStatusChanged = exports.onReportStatusChanged = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
if (!admin.apps.length)
    admin.initializeApp();
const STATUS_MESSAGES = {
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
        console.log(`[onStatusChanged] Notificacao enviada para ${userId}`);
    }
    catch (error) {
        console.error('[onStatusChanged] Erro ao enviar notificacao:', error);
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