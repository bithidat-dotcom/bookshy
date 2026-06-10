/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

let isFirebaseConfigured = false;
let app: any = null;
let db: any = null;
let auth: any = null;

// Clean up placeholders check
const hasRealKeys = firebaseConfig && 
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes('placeholder') &&
  firebaseConfig.projectId && 
  !firebaseConfig.projectId.includes('placeholder');

if (hasRealKeys) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    isFirebaseConfigured = true;
    
    // Verify connection as specified in guidelines
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("Firebase connection established successfully.");
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration or connection. Operating offline.");
        }
      }
    };
    testConnection();
  } catch (err) {
    console.warn("Failed to initialize Firebase with real keys. Falling back to local storage.", err);
    isFirebaseConfigured = false;
  }
} else {
  console.log("Using local-first storage mode (Firebase not fully provisioned yet).");
}

export { isFirebaseConfigured, db, auth };
