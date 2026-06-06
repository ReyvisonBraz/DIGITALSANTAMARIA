"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDemandCreated = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
if (!admin.apps.length)
    admin.initializeApp();
exports.onDemandCreated = functions.firestore
    .document('demands/{demandId}')
    .onCreate(async (_snap, context) => {
    const demandId = context.params.demandId;
    const counterRef = admin.firestore().doc('_counters/demands');
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
            const protocolId = `OUV-${year}-${seq}`;
            tx.set(counterRef, { count: newCount }, { merge: true });
            tx.update(admin.firestore().doc(`demands/${demandId}`), {
                protocolId,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            return protocolId;
        });
        console.log(`[onDemandCreated] Protocolo ${protocol} gerado para ${demandId}`);
    }
    catch (error) {
        console.error('[onDemandCreated] Erro ao gerar protocolo:', error);
    }
});
//# sourceMappingURL=onDemandCreated.js.map