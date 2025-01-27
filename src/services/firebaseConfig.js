import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  privateKeyId: process.env.REACT_APP_FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.REACT_APP_FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.REACT_APP_FIREBASE_CLIENT_EMAIL,
  clientId: process.env.REACT_APP_FIREBASE_CLIENT_ID,
  authUri: process.env.REACT_APP_FIREBASE_AUTH_URI,
  tokenUri: process.env.REACT_APP_FIREBASE_TOKEN_URI,
  authProviderX509CertUrl: process.env.REACT_APP_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.REACT_APP_FIREBASE_CLIENT_X509_CERT_URL,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };