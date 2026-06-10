"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onReportCreated = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
if (!admin.apps.length)
    admin.initializeApp();
/**
 * Gera protocolo sequencial para relatos (REP-YYYY-00001).
 * Mesmo padrão do onDemandCreated (OUV-YYYY-00001).
 */
exports.onReportCreated = functions.firestore
    .document('reports/{reportId}')
    .onCreate(async (_snap, context) => {
    const reportId = context.params.reportId;
    const counterRef = admin.firestore().doc('_counters/reports');
    try {
        const protocol = await admin.firestore().runTransaction(async (tx) => {
            var _a, _b;
            const counterDoc = await tx.get(counterRef);
            const currentCount = counterDoc.exists
                ? ((_b = (_a = counterDoc.data()) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0)
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
    }
    catch (error) {
        console.error('[onReportCreated] Erro ao gerar protocolo:', error);
    }
});
//# sourceMappingURL=onReportCreated.js.map