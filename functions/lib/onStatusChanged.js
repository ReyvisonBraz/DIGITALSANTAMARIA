"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onStatusChanged = void 0;
const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");
if (!admin.apps.length)
    admin.initializeApp();
const STATUS_MESSAGES = {
    in_review: {
        title: 'Solicitação em Análise',
        body: 'Sua solicitação foi recebida e está sendo analisada pela equipe municipal.',
    },
    resolved: {
        title: 'Solicitação Resolvida',
        body: 'Sua solicitação foi resolvida. Veja a resposta no aplicativo.',
    },
    rejected: {
        title: 'Solicitação Indeferida',
        body: 'Sua solicitação não pôde ser atendida.',
    },
    analyzing: {
        title: 'Solicitação em Análise',
        body: 'Sua solicitação entrou na fila de análise da prefeitura.',
    },
    solved: {
        title: 'Solicitação Resolvida',
        body: 'Sua solicitação da ouvidoria foi resolvida.',
    },
};
async function notifyUser(userId, status) {
    var _a;
    const userDoc = await admin.firestore().doc(`users/${userId}`).get();
    const fcmToken = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.fcmToken;
    if (!fcmToken) {
        console.log(`[onStatusChanged] Usuário ${userId} sem FCM token`);
        return;
    }
    const message = STATUS_MESSAGES[status];
    if (!message)
        return;
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
const onReportStatusChanged = functions.firestore.onDocumentUpdated('reports/{reportId}', async (event) => {
    var _a, _b;
    const before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    if (!before || !after || before.status === after.status)
        return;
    await notifyUser(after.reporterId, after.status);
});
const onDemandStatusChanged = functions.firestore.onDocumentUpdated('demands/{demandId}', async (event) => {
    var _a, _b;
    const before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    if (!before || !after || before.status === after.status)
        return;
    await notifyUser(after.authorId, after.status);
});
exports.onStatusChanged = {
    report: onReportStatusChanged,
    demand: onDemandStatusChanged,
};
//# sourceMappingURL=onStatusChanged.js.map