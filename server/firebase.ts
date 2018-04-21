import * as fs from 'fs';
import * as firebase from 'firebase';
import * as admin from 'firebase-admin';
import * as config from 'config';

// Load service app key.
const account = JSON.parse(
  fs.readFileSync(config.get('firebaseAdminKey'), { encoding: 'utf8' }),
);
// Initialize firebase admin SDK.
export const firebaseApp = (admin.initializeApp({
  credential: admin.credential.cert(account),
}) as any) as firebase.app.App;
