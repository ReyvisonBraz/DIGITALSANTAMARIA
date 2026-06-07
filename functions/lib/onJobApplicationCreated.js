"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onJobApplicationCreated = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
if (!admin.apps.length)
    admin.initializeApp();
exports.onJobApplicationCreated = functions.firestore
    .document('job_applications/{applicationId}')
    .onCreate(async (snapshot) => {
    const application = snapshot.data();
    const jobId = application === null || application === void 0 ? void 0 : application.jobId;
    if (!jobId || typeof jobId !== 'string')
        return;
    await admin.firestore().doc(`jobs/${jobId}`).update({
        applicationCount: admin.firestore.FieldValue.increment(1),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
});
//# sourceMappingURL=onJobApplicationCreated.js.map