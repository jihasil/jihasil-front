import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from './secrets.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
} else {
  admin.app();
}

export const db = admin.firestore()