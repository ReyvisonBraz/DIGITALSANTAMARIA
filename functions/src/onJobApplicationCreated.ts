import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();

export const onJobApplicationCreated = functions.firestore
  .document('job_applications/{applicationId}')
  .onCreate(async (snapshot) => {
    const application = snapshot.data();
    const jobId = application?.jobId;
    if (!jobId || typeof jobId !== 'string') return;

    await admin.firestore().doc(`jobs/${jobId}`).update({
      applicationCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
