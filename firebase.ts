import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import  { getFirestore  } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
dotenv.config()

const config = {
  credential:cert(JSON.parse(process.env.FIREBASE_CONFIG!)),
  databaseURL:"https://assign-project-e48fc.firebaseio.com"
};

const firebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();

export const firestoreDB = getFirestore(firebaseApp);
